import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster';
import { ArrowLeft, Trash2, Zap } from 'lucide-react';

export default function IntegrationDetailPage() {
  const { integrationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const orgId = user?.organizationId;

  const { data, isLoading } = useQuery({
    queryKey: ['integration', integrationId],
    queryFn: () => api.get<any>(`/organizations/${orgId}/integrations/${integrationId}`),
    enabled: !!orgId,
  });

  const testMutation = useMutation({
    mutationFn: () => api.get<any>(`/organizations/${orgId}/integrations/${integrationId}/test`),
    onSuccess: (res: any) => {
      toast(res.data?.message || 'Test complete', res.data?.status === 'success' ? 'success' : 'error');
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/organizations/${orgId}/integrations/${integrationId}`),
    onSuccess: () => {
      toast('Integration deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      navigate('/integrations');
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  const integration = data?.data;

  if (isLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!integration) return <div className="text-center py-12 text-gray-500">Integration not found</div>;

  return (
    <div className="max-w-2xl">
      <Link to="/integrations" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to integrations
      </Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{integration.name}</h1>
          <p className="text-gray-500 mt-1">Type: {integration.type}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => testMutation.mutate()} className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700">
            <Zap className="w-4 h-4" /> Test
          </button>
          <button onClick={() => { if (confirm('Delete this integration?')) deleteMutation.mutate(); }} className="text-red-600 hover:text-red-700 p-2">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-6 space-y-3">
        <div><span className="text-sm text-gray-500">Status:</span> <span className={`text-sm font-medium ${integration.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{integration.status}</span></div>
        <div><span className="text-sm text-gray-500">Created:</span> <span className="text-sm">{new Date(integration.createdAt).toLocaleString()}</span></div>
        {integration.lastSyncAt && <div><span className="text-sm text-gray-500">Last Sync:</span> <span className="text-sm">{new Date(integration.lastSyncAt).toLocaleString()}</span></div>}
      </div>
    </div>
  );
}
