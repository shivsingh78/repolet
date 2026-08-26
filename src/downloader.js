import fs from "fs/promises";
import path from "path";

export async function downloadFile(
  file,
  destinationRoot,
  sourceRoot
) {
  // Remove the selected GitHub folder from the file path.
  //
  // Example:
  // sourceRoot = "src"
  // file.path  = "src/components/Nav/Nav.jsx"
  //
  // result:
  // "components/Nav/Nav.jsx"

  const relativePath = path.relative(
    sourceRoot,
    file.path
  );

  const outputPath = path.join(
    destinationRoot,
    relativePath
  );

  const directory = path.dirname(outputPath);

  await fs.mkdir(directory, {
    recursive: true
  });

  const response = await fetch(file.download_url);

  if (!response.ok) {
    throw new Error(
      `Failed to download ${file.path}: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  await fs.writeFile(outputPath, buffer);

  return outputPath;
}