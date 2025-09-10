// src/lib/nft.ts
import type { Address } from "viem";
import { monadClient } from "./monadClient";
import { ERC721_ENUMERABLE_ABI } from "../abi/erc721";

export type NFTItem = {
  contract: Address;
  tokenId: string;
  name: string;
  image: string;
  collectionName: string;
};

export type CollectionCfg = {
  address: Address;
  label?: string;
};

function ipfsToHttp(u: string): string {
  if (!u) return u;
  if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.slice(7)}`;
  return u;
}

export async function fetchNftsForCollection(
  owner: Address,
  collection: CollectionCfg,
  perCollectionCap = 200
): Promise<NFTItem[]> {
  const contract = collection.address;
  try {
    const [rawBal, name] = await Promise.all([
      monadClient.readContract({
        address: contract,
        abi: ERC721_ENUMERABLE_ABI,
        functionName: "balanceOf",
        args: [owner],
      }) as Promise<bigint>,
      monadClient
        .readContract({
          address: contract,
          abi: ERC721_ENUMERABLE_ABI,
          functionName: "name",
        })
        .catch(() => collection.label || "Collection"),
    ]);

    const balance = Number(rawBal);
    if (!balance) return [];

    const count = Math.min(balance, perCollectionCap);
    const items: NFTItem[] = [];

    for (let i = 0; i < count; i++) {
      const tokenId = await monadClient
        .readContract({
          address: contract,
          abi: ERC721_ENUMERABLE_ABI,
          functionName: "tokenOfOwnerByIndex",
          args: [owner, BigInt(i)],
        })
        .catch(() => null as any);

      if (tokenId == null) break;

      const rawUri = (await monadClient
        .readContract({
          address: contract,
          abi: ERC721_ENUMERABLE_ABI,
          functionName: "tokenURI",
          args: [tokenId as bigint],
        })
        .catch(() => "")) as string;

      let img = "";
      let displayName = `#${(tokenId as bigint).toString()}`;

      if (rawUri) {
        const uri = ipfsToHttp(rawUri);
        try {
          const res = await fetch(uri);
          if (res.ok) {
            const meta = await res.json();
            img = ipfsToHttp(meta.image || meta.image_url || "");
            displayName = meta.name || displayName;
          }
        } catch {
          // ignore metadata fetch errors
        }
      }

      items.push({
        contract,
        tokenId: (tokenId as bigint).toString(),
        name: displayName,
        image: img,
        collectionName: (collection.label || (name as string) || "Collection") as string,
      });
    }

    return items;
  } catch {
    return [];
  }
}

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
