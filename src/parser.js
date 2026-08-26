export function parseGitHubUrl(url) {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }

  if (parsedUrl.hostname !== "github.com") {
    throw new Error("Only github.com URLs are supported.");
  }

  const parts = parsedUrl.pathname.split("/").filter(Boolean);

  if (parts.length < 5) {
    throw new Error(
      "Invalid GitHub folder URL. Expected /owner/repo/tree/branch/folder"
    );
  }

  const [owner, repo, type, branch, ...pathParts] = parts;

  if (type !== "tree") {
    throw new Error(
      "Only GitHub folder URLs are supported. Use /tree/<branch>/<folder>."
    );
  }

  if (!branch) {
    throw new Error("GitHub branch is missing.");
  }

  if (pathParts.length === 0) {
    throw new Error("GitHub folder path is missing.");
  }

  return {
    owner,
    repo,
    branch,
    path: pathParts.join("/")
  };
}