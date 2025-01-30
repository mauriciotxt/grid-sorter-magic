export interface GithubCommit {
    "time": Date,
    "repo": string,
    "pr_number": number,
    "head_sha": string,
    "status": string,
    "approvers": Array<string>,
    "commits": Array<{
        authorName: string;
        message: string;
    }>
}