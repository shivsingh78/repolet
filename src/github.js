async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "repolet"
  };

  const token = process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "GitHub authentication failed. Check your GITHUB_TOKEN."
      );
    }

    if (response.status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Set GITHUB_TOKEN to increase the API limit."
      );
    }

    if (response.status === 404) {
      throw new Error(
        "GitHub repository or branch not found, or you do not have permission to access it."
      );
    }

    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
async function getDefaultBranch(owner, repo) {
  const url =
    `https://api.github.com/repos/${owner}/${repo}`;

  const data = await githubRequest(url);

  return data.default_branch;
}

export async function getAllFiles({
  owner,
  repo,
  branch,
  path,
  type
}) {
  // --------------------------------
  // 1. Determine branch
  // --------------------------------

  if (!branch) {
    branch = await getDefaultBranch(
      owner,
      repo
    );
  }

  // --------------------------------
  // 2. Fetch complete repository tree
  // --------------------------------

  const url =
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}` +
    "?recursive=1";

  const data = await githubRequest(url);

  if (data.truncated) {
    throw new Error(
      "GitHub returned a truncated repository tree. This repository is too large for the recursive tree request."
    );
  }

  // --------------------------------
  // 3. Determine selected path
  // --------------------------------

  const prefix = path
    ? path.endsWith("/")
      ? path
      : `${path}/`
    : "";

  // --------------------------------
  // 4. Select files
  // --------------------------------

  const files = data.tree.filter((item) => {
    if (item.type !== "blob") {
      return false;
    }

    // Whole repository
    if (type === "repository") {
      return true;
    }

    // Selected folder
    return item.path.startsWith(prefix);
  });

  // --------------------------------
  // 5. Build download URLs
  // --------------------------------

  return files.map((item) => ({
    type: "file",
    path: item.path,
    download_url:
      `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${item.path}`
  }));
}