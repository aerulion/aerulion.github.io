export const commitHash = import.meta.env.PUBLIC_COMMIT_HASH || 'dev';
export const shortCommitHash = commitHash.substring(0, 7);
export const repoUrl = 'https://github.com/aerulion/aerulion.github.io';
export const commitUrl = `${repoUrl}/commit/${commitHash}`;