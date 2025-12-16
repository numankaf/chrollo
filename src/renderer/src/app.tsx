import CollectionView from '@/features/collections/view/collection/collection-view';
import FolderView from '@/features/collections/view/folder/folder-view';
import RequestView from '@/features/collections/view/request/request-view';
import StompConnectionView from '@/features/connections/view/stomp/stomp-connection-view';
import EnvironmentView from '@/features/environments/view/environment-view';
import HistoryView from '@/features/history/view/history-view';
import HomeView from '@/features/home/view/home-view';
import EmptyView from '@/features/workspaces/empty/view/empty-view';
import WorkspaceView from '@/features/workspaces/workspace/view/workspace-view';
import AppLayout from '@/layout/app-layout';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';

import './app.css';

function App() {
  const router = createHashRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <HomeView />,
        },
        {
          path: '/empty',
          element: <EmptyView />,
        },
        {
          path: '/workspace/:id',
          element: <WorkspaceView />,
        },
        {
          path: '/connection/stomp/:id',
          element: <StompConnectionView />,
        },
        {
          path: '/collection/:id',
          element: <CollectionView />,
        },
        {
          path: '/collection/folder/:id',
          element: <FolderView />,
        },
        {
          path: '/collection/folder/request/:id',
          element: <RequestView />,
        },
        {
          path: '/environment/:id',
          element: <EnvironmentView />,
        },
        {
          path: '/history',
          element: <HistoryView />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/empty" replace={true} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
