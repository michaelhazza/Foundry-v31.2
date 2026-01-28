import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toaster';

export default function OrganizationSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const orgId = user?.organizationId;

  const { data } = useQuery({
    queryKey: ['organization', orgId],
    queryFn: () => api.get<any>(`/organizations/${orgId}`),
    enabled: !!orgId,
  });

  const [name, setName] = useState('');

  useEffect(() => {
    if (data?.data?.name) setName(data.data.name);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () => api.patch(`/organizations/${orgId}`, { name }),
    onSuccess: () => {
      toast('Organization updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
    onError: (err: any) => toast(err.message, 'error'),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold mb-4">Organization Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {data?.data?.slug && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <p className="text-sm text-gray-500">{data.data.slug}</p>
            </div>
          )}
          <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
