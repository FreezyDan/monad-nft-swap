import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// ✅ Inline ERC-721 ABI
const ERC721ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];

// ✅ Replace with your whitelisted NFT contract(s)
const WHITELISTED_NFTS = [
  "0xFD6a239deC8463A527081B85b198Ed1D74460c7d", // example ERC721 contract
];

interface NFT {
  tokenId: string;
  image: string;
}

const WhitelistedNfts: React.FC<{ userAddress: string }> = ({ userAddress }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    const loadNFTs = async () => {
      if (!userAddress || !window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      let fetchedNFTs: NFT[] = [];

      for (const contractAddr of WHITELISTED_NFTS) {
        const nftContract = new ethers.Contract(contractAddr, ERC721ABI, provider);

        try {
          const balance = await nftContract.balanceOf(userAddress);

          for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
            const tokenUri = await nftContract.tokenURI(tokenId);

            let imageUrl = "";
            try {
              if (tokenUri.startsWith("ipfs://")) {
                const ipfsHash = tokenUri.replace("ipfs://", "");
                const metadataUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
                const metadata = await fetch(metadataUrl).then((res) => res.json());
                imageUrl = metadata.image?.startsWith("ipfs://")
                  ? `https://ipfs.io/ipfs/${metadata.image.replace("ipfs://", "")}`
                  : metadata.image;
              } else {
                const metadata = await fetch(tokenUri).then((res) => res.json());
                imageUrl = metadata.image;
              }
            } catch (err) {
              console.error("Failed to fetch metadata:", err);
            }

            fetchedNFTs.push({
              tokenId: tokenId.toString(),
              image: imageUrl,
            });
          }
        } catch (err) {
          console.error(`Failed to load NFTs from contract ${contractAddr}:`, err);
        }
      }

      setNfts(fetchedNFTs);
    };

    loadNFTs();
  }, [userAddress]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {nfts.length > 0 ? (
        nfts.map((nft) => (
          <div
            key={nft.tokenId}
            className="rounded-2xl shadow-md p-2 bg-white dark:bg-gray-800"
          >
            <img
              src={nft.image}
              alt={`NFT ${nft.tokenId}`}
              className="rounded-xl w-full h-48 object-cover"
            />
            <p className="text-center text-sm mt-2">Token #{nft.tokenId}</p>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No NFTs found in whitelisted collections.
        </p>
      )}
    </div>
  );
};

export default WhitelistedNfts;
