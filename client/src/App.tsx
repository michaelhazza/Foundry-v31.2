import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsListPage from './pages/projects/ProjectsListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProjectCreatePage from './pages/projects/ProjectCreatePage';
import SourceUploadPage from './pages/sources/SourceUploadPage';
import SourceDetailPage from './pages/sources/SourceDetailPage';
import ProcessingRunsListPage from './pages/processing/ProcessingRunsListPage';
import ProcessingRunDetailPage from './pages/processing/ProcessingRunDetailPage';
import DatasetsListPage from './pages/datasets/DatasetsListPage';
import DatasetDetailPage from './pages/datasets/DatasetDetailPage';
import IntegrationsListPage from './pages/integrations/IntegrationsListPage';
import IntegrationDetailPage from './pages/integrations/IntegrationDetailPage';
import ProfileSettingsPage from './pages/settings/ProfileSettingsPage';
import OrganizationSettingsPage from './pages/settings/OrganizationSettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

      {/* Protected app routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/new" element={<ProjectCreatePage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="projects/:projectId/sources/upload" element={<SourceUploadPage />} />
        <Route path="sources/:sourceId" element={<SourceDetailPage />} />
        <Route path="projects/:projectId/processing" element={<ProcessingRunsListPage />} />
        <Route path="processing/:runId" element={<ProcessingRunDetailPage />} />
        <Route path="datasets" element={<DatasetsListPage />} />
        <Route path="datasets/:datasetId" element={<DatasetDetailPage />} />
        <Route path="integrations" element={<IntegrationsListPage />} />
        <Route path="integrations/:integrationId" element={<IntegrationDetailPage />} />
        <Route path="settings/profile" element={<ProfileSettingsPage />} />
        <Route path="settings/organization" element={<OrganizationSettingsPage />} />
      </Route>
    </Routes>
  );
}
