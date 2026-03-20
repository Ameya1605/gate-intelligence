import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { StudyPage } from '@/features/study/pages/StudyPage';
import { MocksPage } from '@/features/mocks/pages/MocksPage';
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage';
import { isFeatureEnabled } from './featureRegistry';

function FeatureRoute({
  feature,
  element,
}: {
  feature: Parameters<typeof isFeatureEnabled>[0];
  element: JSX.Element;
}) {
  return isFeatureEnabled(feature) ? element : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'study',
        element: <FeatureRoute feature="STUDY" element={<StudyPage />} />,
      },
      {
        path: 'mocks',
        element: <FeatureRoute feature="MOCKS" element={<MocksPage />} />,
      },
      {
        path: 'analytics',
        element: <FeatureRoute feature="ANALYTICS" element={<AnalyticsPage />} />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
