import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const gridRowFactory = (prNumber: number, mergeCommitTimestamp: Date, repoName: string, deploymentStatus: string) => {
    return {
        prNumber,
        mergeCommitTimestamp,
        repoName,
        deploymentStatus,
    }
};
