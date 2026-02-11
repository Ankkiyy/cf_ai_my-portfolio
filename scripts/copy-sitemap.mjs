import { copyFileSync, existsSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const source = join(distDir, "Sitemap.xml");
const destination = join(distDir, "sitemap.xml");

if (!existsSync(distDir)) {
  console.warn("No dist directory found. Skipping sitemap copy.");
  process.exit(0);
}

if (!existsSync(source)) {
  console.warn("Sitemap.xml not found in dist. Skipping sitemap copy.");
  process.exit(0);
}

const isCaseSensitiveFilesystem = () => {
  const probeName = ".sitemap-case-check";
  const probePath = join(distDir, probeName);
  try {
    writeFileSync(probePath, "probe");
    const caseInsensitiveDuplicateExists = existsSync(probePath.toUpperCase());
    unlinkSync(probePath);
    return !caseInsensitiveDuplicateExists;
  } catch {
    return false;
  }
};

try {
  copyFileSync(source, destination);
  if (isCaseSensitiveFilesystem()) {
    console.info("Copied Sitemap.xml to sitemap.xml for case-sensitive hosts.");
  } else {
    console.info(
      "Case-insensitive filesystem detected. sitemap.xml will reference the same file as Sitemap.xml."
    );
  }
} catch (error) {
  console.error("Failed to duplicate sitemap:", error);
  process.exit(1);
}
