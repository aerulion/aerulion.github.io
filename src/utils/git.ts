const DEV = 'dev';

export const repoUrl = 'https://github.com/aerulion/aerulion.github.io';
export const commitHash = import.meta.env.PUBLIC_COMMIT_HASH || DEV;
export const shortCommitHash = commitHash.slice(0, 7);
export const commitUrl = commitHash === DEV ? repoUrl : `${repoUrl}/commit/${commitHash}`;
