/**
 * Assets placed directly in /public (not /public/images).
 * Filenames are URL-encoded for use in next/image and links.
 */

export function publicAsset(filename: string): string {
  return `/${encodeURIComponent(filename)}`;
}

/** Site-wide public-root images — keep in sync with files in /public */
export const PUBLIC_ASSETS = {
  luxuryTravelCard:
    "Firefly_Gemini Flash_Ultra-realistic luxury travel ca 988823 oEg.png",
  realisticGroup: "Firefly_Gemini Flash_ make realistic  467996.png",
  smallGroup: "Firefly_Gemini Flash_Approximately 14-16 Black lesbia 444620 mr5.png",
  catamaran: "Firefly_Gemini Flash_Approximately 20 Black lesbian and queer women enjoying a private luxury catamaran ex 897857.png",
  catamaranAlt:
    "Firefly_Gemini Flash_Approximately 20 Black lesbian and queer women enjoying a private luxury catamaran ex 897857 (1).png",
  privateGathering:
    "Firefly_Gemini Flash_Approximately 20 Black lesbian and queer women gathered for an extraordinary private  897857.png",
  internationalAdventure:
    "Firefly_Gemini Flash_Approximately 20 Black lesbian and queer women on an adventurous international group  444620 (1).png",
  culturalExperience:
    "Firefly_Gemini Flash_Approximately 20 Black lesbian and queer women participating together in a respectful 824561.png",
  largeTravelGroup:
    "Firefly_Gemini Flash_Large organized travel group of approximately 20 Black lesbian and queer women explor 897857.png",
  diningTable: "Firefly_GeminiFlash_make more women at the table mak 582697 IIp.png",
  diverseGroup: "Firefly_Gemini Flash_make some of the women more masc 394386 Kqj.png",
  groupCelebration: "Firefly_GeminiFlash_Approximately 20 Black lesbian a 897857 QAc.png",
} as const;

export function publicSrc(key: keyof typeof PUBLIC_ASSETS): string {
  return publicAsset(PUBLIC_ASSETS[key]);
}
