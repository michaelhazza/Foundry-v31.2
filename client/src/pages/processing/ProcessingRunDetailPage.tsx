import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { ArrowLeft } from 'lucide-react';

export default function ProcessingRunDetailPage() {
  const { runId } = useParams();

  // Note: needs projectId context - for MVP basic info shown
  return (
    <div>
      <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-6">Processing Run #{runId}</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Run ID: {runId}</p>
        <p className="text-sm text-gray-400 mt-2">View processing runs from the project processing page.</p>
      </div>
    </div>
  );
}
