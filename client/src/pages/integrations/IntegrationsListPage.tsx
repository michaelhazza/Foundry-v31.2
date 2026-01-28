import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster';
import { Plus, Link as LinkIcon } from 'lucide-react';

export default function IntegrationsListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'teamwork', apiKey: '', domain: '' });

  const orgId = user?.organizationId;

  const { data, isLoading } = useQuery({
    queryKey: ['integrations', orgId],
    queryFn: () => api.get<any>(`/organizations/${orgId}/integrations`),
    enabled: !!orgId,
  });

  const createMutation = useMutation({
    mutationFn: () => api.post(`/organizations/${orgId}/integrations`, {
      name: form.name,
      type: form.type,
      credentials: { apiKey: form.apiKey, domain: form.domain },
    }),
    onSuccess: () => {
      toast('Integration created', 'success');
      setShowForm(false);
      setForm({ name: '', type: 'teamwork', apiKey: '', domain: '' });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  const integrations = data?.data?.integrations || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">New Integration</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Integration name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
              <option value="teamwork">Teamwork Desk</option>
            </select>
            <input type="text" placeholder="API Key" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            <input type="text" placeholder="Domain (e.g., company.teamwork.com)" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            <div className="flex gap-2">
              <button onClick={() => createMutation.mutate()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Create</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : integrations.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <LinkIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No integrations configured</p>
          <p className="text-sm text-gray-400 mt-1">Connect to external data sources like Teamwork Desk</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {integrations.map((i: any) => (
            <Link key={i.id} to={`/integrations/${i.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div>
                <p className="font-medium text-sm">{i.name}</p>
                <p className="text-xs text-gray-400">{i.type} - {i.status}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${i.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.status}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
