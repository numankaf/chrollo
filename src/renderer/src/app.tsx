import CollectionView from '@/features/collections/view/collection/collection-view';
import FolderView from '@/features/collections/view/folder/folder-view';
import RequestView from '@/features/collections/view/request/request-view';
import StompConnectionView from '@/features/connections/view/stomp/stomp-connection-view';
import EnvironmentView from '@/features/environment/view/environment-view';
import HistoryView from '@/features/history/view/history-view';
import HomeView from '@/features/home/view/home-view';
import InterceptionScriptView from '@/features/interception-script/view/interception-script-view';
import CreateWorkspaceView from '@/features/workspaces/create/view/create-workspace-view';
import EmptyView from '@/features/workspaces/empty/view/empty-view';
import WorkspaceView from '@/features/workspaces/workspace/view/workspace-view';
import AppConsoleLayout from '@/layout/app-console-layout';
import AppLayout from '@/layout/app-layout';
import AppMainLayout from '@/layout/app-main-layout';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';

import './app.css';

function App() {
  const router = createHashRouter([
    {
      element: <AppLayout />,
      children: [
        {
          element: <AppMainLayout />,
          path: '/main',
          children: [
            {
              element: <AppConsoleLayout />,
              children: [
                {
                  path: '/main/connection/stomp/:id',
                  element: <StompConnectionView />,
                },
                {
                  path: '/main/collection/folder/request/:id',
                  element: <RequestView />,
                },
              ],
            },
            {
              path: '/main/empty',
              element: <EmptyView />,
            },
            {
              path: '/main/workspace/:id',
              element: <WorkspaceView />,
            },
            {
              path: '/main/collection/:id',
              element: <CollectionView />,
            },
            {
              path: '/main/collection/folder/:id',
              element: <FolderView />,
            },
            {
              path: '/main/environment/:id',
              element: <EnvironmentView />,
            },
            {
              path: '/main/interception-script/:id',
              element: <InterceptionScriptView />,
            },
            {
              path: '/main/history',
              element: <HistoryView />,
            },
          ],
        },
        {
          path: '/home',
          element: <HomeView />,
        },
        {
          path: '/workspace/create',
          element: <CreateWorkspaceView />,
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/home" replace={true} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
