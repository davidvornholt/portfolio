/**
 * Loads a subsetted TTF from the Google Fonts CSS API for Open Graph image
 * generation. Satori cannot use the woff2 files next/font serves, so the
 * OG pipeline fetches its own truetype subsets at build time — the same
 * build-time network dependency next/font/google already establishes.
 */
const truetypeSourcePattern =
  /src: url\((?<url>.+?)\) format\('(?:opentype|truetype)'\)/u;

export const loadGoogleFont = async ({
  family,
  weight,
  text,
  italic = false,
}: Readonly<{
  family: string;
  weight: number;
  text: string;
  italic?: boolean;
}>): Promise<ArrayBuffer> => {
  const axes = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:${axes}&text=${encodeURIComponent(text)}`;

  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(truetypeSourcePattern)?.groups?.url;

  if (fontUrl === undefined) {
    throw new Error(
      `Open Graph font loading failed: no truetype source for ${family} in the Google Fonts response.`,
    );
  }

  return await (await fetch(fontUrl)).arrayBuffer();
};
