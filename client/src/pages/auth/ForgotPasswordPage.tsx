import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from '../../components/ui/Toaster';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast('Reset link sent if email exists', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Reset password</h1>
          <p className="text-gray-500 text-center mb-6">Enter your email to receive a reset link</p>
          {sent ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm text-center">
              If an account exists with that email, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">Back to sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
