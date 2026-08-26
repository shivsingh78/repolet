export async function getAllFiles({
  owner,
  repo,
  branch,
  path
}) {
  const url =
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}` +
    "?recursive=1";

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "repolet"
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Try again later or authenticate with a GitHub token."
      );
    }

    if (response.status === 404) {
      throw new Error(
        "Repository or branch not found."
      );
    }

    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.truncated) {
    throw new Error(
      "GitHub returned a truncated repository tree. This repository is too large for the recursive tree request."
    );
  }

  const prefix = path.endsWith("/")
    ? path
    : `${path}/`;

  return data.tree
    .filter((item) => {
      return (
        item.type === "blob" &&
        (item.path === path || item.path.startsWith(prefix))
      );
    })
    .map((item) => ({
      type: "file",
      path: item.path,
      download_url:
        `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${item.path}`
    }));
}