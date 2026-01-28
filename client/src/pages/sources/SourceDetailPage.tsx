import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft, Download } from 'lucide-react';

export default function SourceDetailPage() {
  const { sourceId } = useParams();

  // Note: source detail needs projectId context - for MVP we show basic info
  const { data, isLoading } = useQuery({
    queryKey: ['source', sourceId],
    queryFn: async () => {
      // Try to get source from the first project that has it
      // In a full app, the route would include projectId
      return null; // Placeholder - redirect from project detail
    },
    enabled: false,
  });

  return (
    <div>
      <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-6">Source Details</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Source ID: {sourceId}</p>
        <p className="text-sm text-gray-400 mt-2">View this source from the project detail page for full information.</p>
      </div>
    </div>
  );
}
