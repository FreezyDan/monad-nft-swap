// src/lib/nft.ts
import type { Address } from "viem";
import { monadClient } from "./monadClient";
import { ERC721_ENUMERABLE_ABI } from "../abi/erc721";

/**
 * NOT a contract address.
 * This is keccak256("Transfer(address,address,uint256)") — used to filter logs.
 */
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export type NFTItem = {
  contract: Address;       // collection contract
  tokenId: string;         // decimal string
  name: string;            // display name from metadata (or "#<id>")
  image: string;           // resolved image URL
  collectionName: string;  // label or on-chain name()
};

export type CollectionCfg = {
  address: Address;        // collection contract address
  label?: string;          // pretty label override
};

function ipfsToHttp(u: string): string {
  if (!u) return u;
  if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.slice(7)}`;
  return u;
}

/** Convert 20-byte address to 32-byte left-padded topic form (for log filters). */
function topicAddress(addr: string): `0x${string}` {
  const a = addr.toLowerCase().replace(/^0x/, "");
  return `0x${"0".repeat(24)}${a}` as `0x${string}`;
}

/** Fallback enumeration via Transfer logs. */
async function fetchOwnedTokenIdsByLogs(
  owner: Address,
  contract: Address,
  fromBlock?: bigint | `0x${string}`
): Promise<bigint[]> {
  const toTopic = topicAddress(owner);
  const fromTopic = topicAddress(owner);

  const startBlock: `0x${string}` =
    (typeof fromBlock === "bigint" ? ("0x" + fromBlock.toString(16)) : (fromBlock as `0x${string}`)) || ("0x0" as const);

  // to = owner
  const toLogs = await monadClient.getLogs({
    address: contract,
    fromBlock: startBlock,
    toBlock: "latest",
    topics: [TRANSFER_TOPIC, null, toTopic],
  });

  // from = owner
  const fromLogs = await monadClient.getLogs({
    address: contract,
    fromBlock: startBlock,
    toBlock: "latest",
    topics: [TRANSFER_TOPIC, fromTopic, null],
  });

  const counts = new Map<string, number>();
  const add = (tid?: `0x${string}`, delta = 1) => {
    if (!tid) return;
    const key = BigInt(tid).toString();
    counts.set(key, (counts.get(key) || 0) + delta);
  };

  for (const l of toLogs) add(l.topics?.[3] as `0x${string}`, +1);
  for (const l of fromLogs) add(l.topics?.[3] as `0x${string}`, -1);

  const owned: bigint[] = [];
  for (const [k, v] of counts) if (v > 0) owned.push(BigInt(k));
  return owned;
}

/** Try enumerable first; otherwise fall back to logs. */
export async function fetchNftsForCollection(
  owner: Address,
  collection: CollectionCfg,
  perCollectionCap = 200
): Promise<NFTItem[]> {
  const contract = collection.address;

  const collNamePromise = monadClient
    .readContract({
      address: contract,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "name",
    })
    .catch(() => collection.label || "Collection");

  // Fast path — ERC721Enumerable
  let enumerableWorked = false;
  let tokenIdsEnumerable: bigint[] = [];
  try {
    const rawBal = (await monadClient.readContract({
      address: contract,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "balanceOf",
      args: [owner],
    })) as bigint;

    const balance = Number(rawBal);
    if (balance > 0) {
      const count = Math.min(balance, perCollectionCap);
      const tmp: bigint[] = [];
      for (let i = 0; i < count; i++) {
        const tid = await monadClient
          .readContract({
            address: contract,
            abi: ERC721_ENUMERABLE_ABI,
            functionName: "tokenOfOwnerByIndex",
            args: [owner, BigInt(i)],
          })
          .catch(() => null as any);
        if (tid == null) { tmp.length = 0; break; }
        tmp.push(tid as bigint);
      }
      if (tmp.length > 0) {
        enumerableWorked = true;
        tokenIdsEnumerable = tmp;
      }
    }
  } catch { /* ignore */ }

  // Fallback — logs
  let tokenIds: bigint[] = tokenIdsEnumerable;
  if (!enumerableWorked) {
    try {
      const fromEnv = import.meta.env.VITE_MONAD_LOGS_FROM_BLOCK;
      const fromBlock =
        typeof fromEnv === "string" && fromEnv.startsWith("0x")
          ? (fromEnv as `0x${string}`)
          : undefined;
      tokenIds = await fetchOwnedTokenIdsByLogs(owner, contract, fromBlock);
      if (tokenIds.length > perCollectionCap) tokenIds = tokenIds.slice(0, perCollectionCap);
    } catch {
      tokenIds = [];
    }
  }

  if (tokenIds.length === 0) return [];

  const collName = (await collNamePromise) as string;
  const items: NFTItem[] = [];

  for (const tokenId of tokenIds) {
    let rawUri = "";
    try {
      rawUri = (await monadClient.readContract({
        address: contract,
        abi: ERC721_ENUMERABLE_ABI,
        functionName: "tokenURI",
        args: [tokenId],
      })) as string;
    } catch { /* some contracts skip metadata */ }

    let img = "";
    let displayName = `#${tokenId.toString()}`;

    if (rawUri) {
      const uri = ipfsToHttp(rawUri);
      try {
        const res = await fetch(uri);
        if (res.ok) {
          const meta = await res.json();
          img = ipfsToHttp(meta.image || meta.image_url || "");
          displayName = meta.name || displayName;
        }
      } catch { /* ignore metadata fetch errors */ }
    }

    items.push({
      contract,
      tokenId: tokenId.toString(),
      name: displayName,
      image: img,
      collectionName: (collection.label || collName || "Collection") as string,
    });
  }

  return items;
}

/** Aggregate across verified collections. */
export async function fetchNftsForAddress(
  owner: Address,
  collections: CollectionCfg[],
): Promise<NFTItem[]> {
  const chunks: NFTItem[][] = [];
  for (const c of collections) {
    // eslint-disable-next-line no-await-in-loop
    const items = await fetchNftsForCollection(owner, c);
    chunks.push(items);
  }
  return chunks.flat();
}

/** Direct ownership check for a specific token (ownerOf). */
export async function ownsToken(
  owner: Address,
  contract: Address,
  tokenId: bigint | string
): Promise<boolean> {
  try {
    const onChainOwner = (await monadClient.readContract({
      address: contract,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "ownerOf",
      args: [typeof tokenId === "string" ? BigInt(tokenId) : tokenId],
    })) as Address;

    return onChainOwner.toLowerCase() === owner.toLowerCase();
  } catch {
    // ownerOf can revert if token doesn't exist, etc.
    return false;
  }
}
