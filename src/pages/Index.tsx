import DataGrid from '@/components/DataGrid/DataGrid';
import { fetchAllRepositories } from '@/lib/github';
import { gridRowFactory } from '@/lib/utils';
import { GridRow } from '@/types/grid';
import { useEffect, useState } from 'react';

const Index = () => {
  // Sample data with 20 rows
  const sampleData: GridRow[] = [
    {
      prNumber: 1234,
      mergeCommitTimestamp: new Date('2024-03-20T10:30:00'),
      repoName: 'policy-api',
      deploymentStatus: 'success'
    },
    {
      prNumber: 1235,
      mergeCommitTimestamp: new Date('2024-03-20T11:45:00'),
      repoName: 'policy-frontend',
      deploymentStatus: 'pending'
    },
    {
      prNumber: 1236,
      mergeCommitTimestamp: new Date('2024-03-20T12:15:00'),
      repoName: 'policy-bff',
      deploymentStatus: 'failed'
    },
    {
      prNumber: 3237,
      mergeCommitTimestamp: new Date('2024-03-19T09:30:00'),
      repoName: 'claims-fe',
      deploymentStatus: 'success'
    },
    {
      prNumber: 2238,
      mergeCommitTimestamp: new Date('2024-03-19T14:20:00'),
      repoName: 'claims-api',
      deploymentStatus: 'success'
    },
    {
      prNumber: 5239,
      mergeCommitTimestamp: new Date('2024-03-19T16:45:00'),
      repoName: 'policy-frontend',
      deploymentStatus: 'failed'
    },
    {
      prNumber: 1241,
      mergeCommitTimestamp: new Date('2024-03-18T13:15:00'),
      repoName: 'policy-bff',
      deploymentStatus: 'pending'
    },
    {
      prNumber: 1242,
      mergeCommitTimestamp: new Date('2024-03-18T15:45:00'),
      repoName: 'claims-fe',
      deploymentStatus: 'success'
    },
    {
      prNumber: 1244,
      mergeCommitTimestamp: new Date('2024-03-17T12:30:00'),
      repoName: 'policy-api',
      deploymentStatus: 'failed'
    },
    {
      prNumber: 4245,
      mergeCommitTimestamp: new Date('2024-03-17T14:45:00'),
      repoName: 'claims-api',
      deploymentStatus: 'pending'
    },
    {
      prNumber: 2247,
      mergeCommitTimestamp: new Date('2024-03-16T11:30:00'),
      repoName: 'policy-frontend',
      deploymentStatus: 'success'
    },
    {
      prNumber: 3249,
      mergeCommitTimestamp: new Date('2024-03-15T10:20:00'),
      repoName: 'claims-fe',
      deploymentStatus: 'success'
    },
    {
      prNumber: 3250,
      mergeCommitTimestamp: new Date('2024-03-15T12:35:00'),
      repoName: 'policy-bff',
      deploymentStatus: 'success'
    },
    {
      prNumber: 1251,
      mergeCommitTimestamp: new Date('2024-03-15T14:50:00'),
      repoName: 'claims-api',
      deploymentStatus: 'pending'
    },
    {
      prNumber: 1253,
      mergeCommitTimestamp: new Date('2024-03-14T13:40:00'),
      repoName: 'policy-api',
      deploymentStatus: 'success'
    }
  ];

  const [gridData, setGridData] = useState<GridRow[]>(sampleData);

  useEffect(() => {
        (async () => {
            try {
                const repoData = await fetchAllRepositories();

                // console.log(repoData)

                if(!repoData || repoData.length === 0) {
                    throw new Error("Repo data doesn't exist or is empty");
                }

                const gridRows: GridRow[] = [];

                for (const commit of repoData) {
                    gridRows.push(gridRowFactory(commit.pr_number, commit.time, commit.repo, commit.status))
                }

                // console.log({gridRows});

                setGridData(gridRows);
            } catch (error) {
                console.error("fetchAllRepositories error", error)
            }
        })();
    }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Deployment Dashboard</h1>
            <p className="mt-2 text-sm text-gray-500">
              Track and manage your pull requests and deployments
            </p>
          </div>
          <DataGrid data={gridData} />
        </div>
      </div>
    </div>
  );
};

export default Index;