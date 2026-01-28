import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Database } from 'lucide-react';

export default function DatasetsListPage() {
  const [page, setPage] = useState(1);

  // For MVP, show datasets across all projects (latest)
  const { data, isLoading } = useQuery({
    queryKey: ['all-datasets', page],
    queryFn: async () => {
      // Get projects first, then datasets for the first few projects
      const projectsRes = await api.get<any>('/projects?limit=10');
      const projects = projectsRes.data?.projects || [];
      const allDatasets: any[] = [];
      for (const p of projects.slice(0, 5)) {
        try {
          const dsRes = await api.get<any>(`/projects/${p.id}/datasets?limit=10`);
          const datasets = dsRes.data?.datasets || [];
          allDatasets.push(...datasets.map((d: any) => ({ ...d, projectName: p.name })));
        } catch {}
      }
      return allDatasets;
    },
  });

  const datasets = data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Datasets</h1>
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : datasets.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No datasets yet</p>
          <p className="text-sm text-gray-400 mt-1">Process data sources to generate datasets</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {datasets.map((d: any) => (
            <Link key={d.id} to={`/datasets/${d.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">{d.name}</p>
                <p className="text-xs text-gray-400">{d.projectName} - {d.format} - {d.rowCount} rows</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
