import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

export default function DatasetDetailPage() {
  const { datasetId } = useParams();

  return (
    <div>
      <Link to="/datasets" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to datasets
      </Link>
      <h1 className="text-2xl font-bold mb-6">Dataset Details</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Dataset ID: {datasetId}</p>
        <p className="text-sm text-gray-400 mt-2">Dataset details and preview available from the project view.</p>
      </div>
    </div>
  );
}
