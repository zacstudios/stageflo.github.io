import { readFile } from "node:fs/promises";
import path from "node:path";

export const CURRENT_VERSION = "1.5.0";
export const RELEASE_BASE_URL = "https://github.com/zacstudios/Stageflo.app/releases/download/v1.0.0-desktop";
export const MAC_DOWNLOAD_URL = `https://github.com/zacstudios/stageflo.github.io/releases/download/v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}.dmg`;
export const WINDOWS_DOWNLOAD_URL = `https://github.com/zacstudios/stageflo.github.io/releases/download/updates-v${CURRENT_VERSION}/stageflo-${CURRENT_VERSION}-setup.exe`;
export const SONGS_XML_ML_URL = `${RELEASE_BASE_URL}/songs-openlyrics-primary-ml.xml`;
export const SONGS_XML_TA_URL = `${RELEASE_BASE_URL}/songs-openlyrics-primary-ta.xml`;
export const SONGS_XML_HI_URL = `${RELEASE_BASE_URL}/songs-openlyrics-primary-hi.xml`;
export const SONGS_XML_ALL_URL = `${RELEASE_BASE_URL}/songs-openlyrics-All.Songs.xml`;
export const BIBLE_XML_RESOURCES_URL = "https://biblelist.netlify.app";
export const MALAYALAM_BIBLE_XML_URL = "https://raw.githubusercontent.com/Beblia/Holy-Bible-XML-Format/master/MalayalamBible.xml";
export const ENGLISH_KJV_BIBLE_XML_URL = "https://sourceforge.net/projects/zefania-sharp/files/Bibles/ENG/King%20James/King%20James%20Version/SF_2009-01-23_ENG_KJV_%28KING%20JAMES%20VERSION%29.zip/download";
export const ENGLISH_NIV_BIBLE_XML_URL = "https://raw.githubusercontent.com/Beblia/Holy-Bible-XML-Format/master/EnglishNIVBible.xml";
export const ENGLISH_ESV_BIBLE_XML_URL = "https://raw.githubusercontent.com/Beblia/Holy-Bible-XML-Format/master/EnglishESVBible.xml";

export const resourceDownloadCards = [
  {
    title: "XML Bible Format Compatibility",
    body: "Find compatible Bible XML resources and datasets you can import into StageFlo for scripture workflows.",
    href: BIBLE_XML_RESOURCES_URL,
    label: "Browse Bible XML Resources",
  },
  {
    title: "Songs XML (Malayalam)",
    body: "OpenLyrics XML package for Malayalam songs with translation lines retained where available.",
    href: SONGS_XML_ML_URL,
    label: "Download Malayalam XML",
  },
  {
    title: "Songs XML (Tamil)",
    body: "OpenLyrics XML package for Tamil songs with translation lines retained where available.",
    href: SONGS_XML_TA_URL,
    label: "Download Tamil XML",
  },
  {
    title: "Songs XML (Hindi)",
    body: "OpenLyrics XML package for Hindi songs with translation lines retained where available.",
    href: SONGS_XML_HI_URL,
    label: "Download Hindi XML",
  },
  {
    title: "Songs XML (All Songs)",
    body: "Combined OpenLyrics XML package containing all songs in one file.",
    href: SONGS_XML_ALL_URL,
    label: "Download All Songs XML",
  },
  {
    title: "Malayalam Bible XML",
    body: "Direct Malayalam Bible XML source file compatible with StageFlo import workflows.",
    href: MALAYALAM_BIBLE_XML_URL,
    label: "Download Malayalam Bible XML",
  },
  {
    title: "English KJV Bible (Zefania XML)",
    body: "King James Version in Zefania XML package format for Bible import workflows.",
    href: ENGLISH_KJV_BIBLE_XML_URL,
    label: "Download English KJV Bible",
  },
  {
    title: "English NIV Bible XML",
    body: "New International Version XML file compatible with StageFlo Bible import workflows.",
    href: ENGLISH_NIV_BIBLE_XML_URL,
    label: "Download English NIV Bible XML",
  },
  {
    title: "English ESV Bible XML",
    body: "English Standard Version XML file compatible with StageFlo Bible import workflows.",
    href: ENGLISH_ESV_BIBLE_XML_URL,
    label: "Download English ESV Bible XML",
  },
] as const;

export type LatestReleaseInfo = {
  version: string;
  url: string;
};

export const parseManifest = (manifestText: string): LatestReleaseInfo | null => {
  const version = manifestText.match(/^version:\s*(.+)$/m)?.[1]?.trim();
  const url = manifestText.match(/^\s*- url:\s*(.+)$/m)?.[1]?.trim();

  if (!version || !url) return null;
  return { version, url };
};

export const toMacDmgUrl = (url: string, version: string): string => {
  if (url.toLowerCase().endsWith(".dmg")) return url;
  return `https://github.com/zacstudios/stageflo.github.io/releases/download/v${version}/stageflo-${version}.dmg`;
};

export const readLatestReleaseManifest = async (fileName: string): Promise<LatestReleaseInfo | null> => {
  try {
    const manifestPath = path.join(process.cwd(), "public", "updates", fileName);
    const manifestText = await readFile(manifestPath, "utf8");
    return parseManifest(manifestText);
  } catch {
    return null;
  }
};