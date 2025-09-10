// src/config/collections.ts
import type { CollectionCfg } from "../lib/nft";

/**
 * Verified Monad ERC-721 (Enumerable) collections.
 * NOTE: Collections that don't implement ERC721Enumerable won't enumerate
 *       via tokenOfOwnerByIndex; the fetch will skip those gracefully.
 */
export const VERIFIED_COLLECTIONS: CollectionCfg[] = [
  // Newly added (no label = use on-chain name()):
  { address: "0xc0033008569DA98Dd289A54c8617133fAB842034" as `0x${string}` },

  { address: "0xE6B5427b174344fd5CB1e3d5550306B0055473C6" as `0x${string}`, label: "Chogs Mystery Chest" },
  { address: "0xD20EF03E432208af083C0fb4e401049F4F29949F" as `0x${string}`, label: "Lil Chogstars Superstarlist Pass" },
  { address: "0xE8F0635591190Fb626F9D13C49b60626561Ed145" as `0x${string}`, label: "Skrumpets" },
  { address: "0xEd52E0D80F4E7b295dF5e622B55EFf22D262f6ed" as `0x${string}`, label: "R3tards" },
  { address: "0x151cf400af08bca390b16582ed6c4f096e4f17eb" as `0x${string}`, label: "DN" },
  { address: "0x87E1F1824C9356733A25d6beD6b9c87A3b31E107" as `0x${string}`, label: "Spikes" },
  { address: "0xd6421E9C72199e971E5a3cDe09214054e1216cd2" as `0x${string}`, label: "Mondana Baddies Eyechain" },
  { address: "0x26C86F2835c114571Df2b6ce9ba52296CC0Fa6BB" as `0x${string}`, label: "Chogstars" },
  { address: "0x8af130613bd8a7c714a43def3454a0f5ddf2344e" as `0x${string}`, label: "Meco Nads" },
  { address: "0x9436689d617dd6696f94cd3d8bbdd234f30d2a52" as `0x${string}`, label: "ROARRR" },
  { address: "0x6341c537a6fc563029d8e8caa87da37f227358f4" as `0x${string}`, label: "Molandak Mint Pass" },
  { address: "0x46c66c40711a2953d1768926e53134c7ab272cd5" as `0x${string}`, label: "Blench Pass" },
  { address: "0x2ace467d5c55d75cf04ae7b9c7672bc499d8e246" as `0x${string}`, label: "Monad verse Genesis Hatch" },
  { address: "0xc5c9425d733b9f769593bd2814b6301916f91271" as `0x${string}`, label: "Purple Frens" },
  { address: "0xf981561d4d9acbb7259682a0e8b9b3a3d6975116" as `0x${string}`, label: "Gmonad" },
];
