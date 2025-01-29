export interface GridRow {
    prNumber: number;
    mergeCommitTimestamp: Date;
    repoName: string;
    deploymentStatus: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
    key: keyof GridRow;
    direction: SortDirection;
}

export interface FilterConfig {
    [key: string]: string;
}