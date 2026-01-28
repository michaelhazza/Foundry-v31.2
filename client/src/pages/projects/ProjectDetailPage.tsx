import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/ui/Toaster';
import { Upload, Play, Download, Trash2, ArrowLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.get<any>(`/projects/${projectId}`),
  });

  const { data: statsData } = useQuery({
    queryKey: ['project-stats', projectId],
    queryFn: () => api.get<any>(`/projects/${projectId}/stats`),
  });

  const { data: sourcesData } = useQuery({
    queryKey: ['sources', projectId],
    queryFn: () => api.get<any>(`/projects/${projectId}/sources?limit=50`),
  });

  const { data: datasetsData } = useQuery({
    queryKey: ['datasets', projectId],
    queryFn: () => api.get<any>(`/projects/${projectId}/datasets?limit=50`),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/projects/${projectId}`),
    onSuccess: () => {
      toast('Project deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/projects');
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  const project = projectData?.data;
  const stats = statsData?.data;
  const sources = sourcesData?.data?.sources || [];
  const datasets = datasetsData?.data?.datasets || [];

  if (isLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!project) return <div className="text-center py-12 text-gray-500">Project not found</div>;

  return (
    <div>
      <Link to="/projects" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-500 mt-1">{project.description || 'No description'}</p>
        </div>
        <button onClick={() => { if (confirm('Delete this project?')) deleteMutation.mutate(); }} className="text-red-600 hover:text-red-700 p-2">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">{stats?.sources || 0}</p>
          <p className="text-sm text-gray-500">Sources</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">{stats?.processingRuns || 0}</p>
          <p className="text-sm text-gray-500">Processing Runs</p>
        </div>
        <div className="bg-white rounded-lg border p-4 text-center">
          <p className="text-2xl font-bold">{stats?.datasets || 0}</p>
          <p className="text-sm text-gray-500">Datasets</p>
        </div>
      </div>

      {/* Sources */}
      <div className="bg-white rounded-xl border mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Sources</h2>
          <Link to={`/projects/${projectId}/sources/upload`} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">
            <Upload className="w-4 h-4" /> Upload
          </Link>
        </div>
        {sources.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No sources uploaded yet</div>
        ) : (
          <div className="divide-y">
            {sources.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 px-4">
                <div>
                  <p className="font-medium text-sm">{s.filename}</p>
                  <p className="text-xs text-gray-400">{s.type} - {(s.size / 1024).toFixed(1)} KB</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Datasets */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Datasets</h2>
          <Link to={`/projects/${projectId}/processing`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <Play className="w-4 h-4" /> Processing Runs
          </Link>
        </div>
        {datasets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No datasets generated yet</div>
        ) : (
          <div className="divide-y">
            {datasets.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between p-3 px-4">
                <div>
                  <Link to={`/datasets/${d.id}`} className="font-medium text-sm text-blue-600 hover:underline">{d.name}</Link>
                  <p className="text-xs text-gray-400">{d.format} - {d.rowCount} rows</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
