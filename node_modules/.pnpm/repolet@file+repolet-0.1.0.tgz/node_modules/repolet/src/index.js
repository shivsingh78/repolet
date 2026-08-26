#!/usr/bin/env node
import fs from "fs/promises";

import { parseGitHubUrl } from "./parser.js";
import { getAllFiles } from "./github.js";
import { downloadFile } from "./downloader.js";

const VERSION = "0.1.0";

const args = process.argv.slice(2);
const cleanArgs = args.filter((arg) => arg !== "--");

const showHelp = cleanArgs.includes("--help") || cleanArgs.includes("-h");

const showVersion = cleanArgs.includes("--version") || cleanArgs.includes("-v");

if (showHelp) {
  console.log(`
Repolet v${VERSION}

Copy a specific folder from a GitHub repository.

Usage:
  repolet <github-folder-url> [destination]

Examples:
  repolet https://github.com/user/repo/tree/main/src
  repolet https://github.com/user/repo/tree/main/src my-src

Options:
  -h, --help       Show help
  -v, --version    Show version
`);

  process.exit(0);
}

if (showVersion) {
  console.log(`repolet v${VERSION}`);
  process.exit(0);
}

const githubUrl = cleanArgs[0];
const customDestination = cleanArgs[1];

if (!githubUrl) {
  console.log("Usage: repolet <github-folder-url> [destination]");

  console.log("Run 'repolet --help' for more information.");

  process.exit(1);
}

try {
  // --------------------------------
  // 1. Parse GitHub URL
  // --------------------------------
  const folder = parseGitHubUrl(githubUrl);

  console.log("\nRepository information:");
  console.log(`  Owner : ${folder.owner}`);
  console.log(`  Repo  : ${folder.repo}`);
  console.log(`  Type  : ${folder.type}`);
  console.log(`  Branch: ${folder.branch || "default"}`);
  console.log(`  Path  : ${folder.path || "/"}`);

  // --------------------------------
  // 2. Determine destination
  // --------------------------------
  const destinationRoot =
    customDestination ||
    (folder.type === "folder" ? folder.path.split("/").pop() : folder.repo);

  // --------------------------------
  // 3. Check destination
  // --------------------------------
  try {
    await fs.access(destinationRoot);

    console.error(`\n❌ Destination already exists: ./${destinationRoot}`);

    console.error("Choose another destination or remove the existing folder.");

    process.exit(1);
  } catch {
    // Destination doesn't exist.
  }

  // --------------------------------
  // 4. Find files
  // --------------------------------
  console.log("\nScanning folder recursively...");

  const files = await getAllFiles(folder);

  console.log(`Found ${files.length} files.`);

  if (files.length === 0) {
    console.log("\n⚠️ Folder is empty.");
    process.exit(0);
  }

  // --------------------------------
  // 5. Download
  // --------------------------------
  console.log(`\nDownloading to: ./${destinationRoot}\n`);

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const progress = `[${i + 1}/${files.length}]`;

    try {
      const outputPath = await downloadFile(file, destinationRoot, folder.path);

      successful++;

      console.log(`✓ ${progress} ${outputPath}`);
    } catch (error) {
      failed++;

      console.error(`✗ ${progress} ${file.path}`);

      console.error(`  ${error.message}`);
    }
  }

  // --------------------------------
  // 6. Summary
  // --------------------------------
  console.log("\n--------------------------------");
  console.log("Download finished");
  console.log("--------------------------------");

  console.log(`Successful: ${successful}`);
  console.log(`Failed    : ${failed}`);
  console.log(`Location  : ./${destinationRoot}`);

  if (failed > 0) {
    console.log("\n⚠️ Some files could not be downloaded.");

    process.exitCode = 1;
  } else {
    console.log("\n✅ Download complete!");
  }
} catch (error) {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
}
