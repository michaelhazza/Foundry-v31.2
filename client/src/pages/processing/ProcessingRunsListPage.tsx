import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/ui/Toaster';
import { ArrowLeft, Play } from 'lucide-react';
import { useState } from 'react';

export default function ProcessingRunsListPage() {
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['processing-runs', projectId, page],
    queryFn: () => api.get<any>(`/projects/${projectId}/processing-runs?page=${page}&limit=20`),
  });

  const { data: sourcesData } = useQuery({
    queryKey: ['sources', projectId],
    queryFn: () => api.get<any>(`/projects/${projectId}/sources?limit=100`),
  });

  const createRunMutation = useMutation({
    mutationFn: (sourceId: number) => api.post(`/projects/${projectId}/processing-runs`, { sourceId, config: {} }),
    onSuccess: () => {
      toast('Processing run started', 'success');
      queryClient.invalidateQueries({ queryKey: ['processing-runs', projectId] });
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  const runs = data?.data?.runs || [];
  const sources = sourcesData?.data?.sources || [];
  const pagination = data?.data?.pagination;

  const statusColors: Record<string, string> = {
    queued: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <Link to={`/projects/${projectId}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to project
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Processing Runs</h1>
      </div>

      {sources.length > 0 && (
        <div className="bg-white rounded-xl border p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Start new run from source:</h3>
          <div className="flex flex-wrap gap-2">
            {sources.filter((s: any) => s.status === 'ready').map((s: any) => (
              <button key={s.id} onClick={() => createRunMutation.mutate(s.id)} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                <Play className="w-3 h-3" /> {s.filename}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : runs.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          <p className="font-medium">No processing runs yet</p>
          <p className="text-sm mt-1">Upload a source and start processing</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {runs.map((run: any) => (
            <Link key={run.id} to={`/processing/${run.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">Run #{run.id}</p>
                <p className="text-xs text-gray-400">Source #{run.sourceId} - {new Date(run.createdAt).toLocaleString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[run.status] || 'bg-gray-100'}`}>{run.status}</span>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
          <span className="px-3 py-1 text-sm text-gray-600">Page {page} of {pagination.totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={!pagination.hasMore} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
