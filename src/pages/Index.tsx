import DataGrid from '@/components/DataGrid/DataGrid';
import { GridRow } from '@/types/grid';

const Index = () => {
  // Sample data - replace with your actual data source
  const sampleData: GridRow[] = [
    {
      prNumber: 1234,
      mergeCommitTimestamp: new Date('2024-03-20T10:30:00'),
      repoName: 'main-app',
      deploymentStatus: 'success'
    },
    {
      prNumber: 1235,
      mergeCommitTimestamp: new Date('2024-03-20T11:45:00'),
      repoName: 'api-service',
      deploymentStatus: 'pending'
    },
    {
      prNumber: 1236,
      mergeCommitTimestamp: new Date('2024-03-20T12:15:00'),
      repoName: 'frontend-app',
      deploymentStatus: 'failed'
    }
  ];

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
          <DataGrid data={sampleData} />
        </div>
      </div>
    </div>
  );
};

export default Index;