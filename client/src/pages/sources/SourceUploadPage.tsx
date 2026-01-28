import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/ui/Toaster';
import { Upload, File, ArrowLeft } from 'lucide-react';

export default function SourceUploadPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/projects/${projectId}/sources`, formData);
      toast('File uploaded successfully', 'success');
      navigate(`/projects/${projectId}`);
    } catch (err: any) {
      toast(err.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(`/projects/${projectId}`)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to project
      </button>
      <h1 className="text-2xl font-bold mb-6">Upload Data Source</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <File className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">Click to select a file</p>
                <p className="text-sm text-gray-400 mt-1">CSV, Excel, JSON, PNG, JPEG (max 100MB)</p>
              </>
            )}
            <input ref={fileInputRef} type="file" onChange={handleFileChange} accept=".csv,.xlsx,.xls,.json,.png,.jpg,.jpeg" className="hidden" />
          </div>
          <button type="submit" disabled={!file || loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  );
}
