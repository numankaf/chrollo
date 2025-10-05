import { useEffect } from 'react';
import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import './App.css';
import CollectionView from './features/collections/view/collection-view';
import FolderView from './features/collections/view/folder-view';
import RequestView from './features/collections/view/request-view';
import ConnectionView from './features/connections/view/connection-view';
import EnviromentView from './features/enviroments/view/enviroment-view';
import HistoryView from './features/history/view/history-view';
import HomeView from './features/home/view/home-view';
import AppLayout from './layout/app-layout';
import './styles/main.css';

function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        window.electron?.ipcRenderer?.send('window:reload');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          path: '/connection/:id',
          element: <ConnectionView />,
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
          path: '/enviroment/:id',
          element: <EnviromentView />,
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
