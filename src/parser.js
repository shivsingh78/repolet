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

  const parts = parsedUrl.pathname
    .split("/")
    .filter(Boolean);

  if (parts.length < 2) {
    throw new Error(
      "Invalid GitHub URL. Expected /owner/repository"
    );
  }

  const owner = parts[0];

  // Remove .git if the user supplied:
  // https://github.com/user/repo.git
  const repo = parts[1].replace(/\.git$/, "");

  // Whole repository:
  //
  // github.com/user/repo
  //
  if (parts.length === 2) {
    return {
      owner,
      repo,
      branch: null,
      path: "",
      type: "repository"
    };
  }

  // Folder:
  //
  // github.com/user/repo/tree/main/src
  //
  if (parts[2] !== "tree") {
    throw new Error(
      "Only GitHub repository or folder URLs are supported."
    );
  }

  if (parts.length < 5) {
    throw new Error(
      "Invalid GitHub folder URL. Expected /owner/repo/tree/branch/folder"
    );
  }

  const branch = parts[3];
  const pathParts = parts.slice(4);

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
    path: pathParts.join("/"),
    type: "folder"
  };
}