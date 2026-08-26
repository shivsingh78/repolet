import fs from "fs/promises";
import path from "path";

export async function downloadFile(
  file,
  destinationRoot,
  sourceRoot
) {
  let relativePath;

  if (sourceRoot) {
    relativePath = path.relative(
      sourceRoot,
      file.path
    );
  } else {
    relativePath = file.path;
  }

  const outputPath = path.join(
    destinationRoot,
    relativePath
  );

  const directory = path.dirname(outputPath);

  await fs.mkdir(directory, {
    recursive: true
  });

  const response = await fetch(
    file.download_url
  );

  if (!response.ok) {
    throw new Error(
      `Failed to download ${file.path}: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  await fs.writeFile(
    outputPath,
    buffer
  );

  return outputPath;
}