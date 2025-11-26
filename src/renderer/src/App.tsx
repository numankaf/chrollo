import { useEffect } from 'react';
import CollectionView from '@/features/collections/view/collection/collection-view';
import FolderView from '@/features/collections/view/folder/folder-view';
import RequestView from '@/features/collections/view/request/request-view';
import StompConnectionView from '@/features/connections/view/stomp/stomp-connection-view';
import EnvironmentView from '@/features/environments/view/environment-view';
import HistoryView from '@/features/history/view/history-view';
import HomeView from '@/features/home/view/home-view';
import WorkspaceView from '@/features/workspaces/view/workspace-view';
import AppLayout from '@/layout/app-layout';
import useTabsStore from '@/store/tab-store';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';

import './App.css';

import useWorkspaceStore from '@/store/workspace-store';

function App() {
  useEffect(() => {
    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (e.key === 'F5') {
    //     e.preventDefault();
    //     window.api?.view?.reload();
    //   }
    // };

    const handleSyncSave = () => {
      const tabs = useTabsStore.getState().tabs;
      window.api.tab.save({ tabs });

      const { workspaces, activeWorkspaceId, workspaceSelection } = useWorkspaceStore.getState();
      window.api.workspace.save({
        workspaces: workspaces,
        activeWorkspaceId: activeWorkspaceId,
        workspaceSelection: workspaceSelection,
      });
    };

    window.electron.ipcRenderer.on('app:shutdown', handleSyncSave);

    window.addEventListener('beforeunload', handleSyncSave);

    //window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.electron.ipcRenderer.removeListener('app:shutdown', handleSyncSave);
      window.removeEventListener('beforeunload', handleSyncSave);
      //window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const router = createHashRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <HomeView />,
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
      element: <Navigate to="/connections" replace={true} />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
