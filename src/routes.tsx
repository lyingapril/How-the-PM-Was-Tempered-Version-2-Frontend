import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from './pages/Layout.tsx';
import DemandPage from './pages/Demand.tsx';
import RoadmapPage from './pages/Roadmap.tsx';
import DocumentPage from './pages/Document.tsx';
import DashboardPage from './pages/Dashboard.tsx';
import NotFoundPage from './pages/NotFound.tsx';

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      { path: '/demands', element: <DemandPage /> },
      { path: '/roadmap', element: <RoadmapPage /> },
      { path: '/documents', element: <DocumentPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { index: true, element: <Navigate to="/demands" replace /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;