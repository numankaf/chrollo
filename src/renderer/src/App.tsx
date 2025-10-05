import { createHashRouter, Navigate, RouterProvider } from 'react-router';
import './App.css';
import CollectionView from './features/collections/view/collection-view';
import ConnectionView from './features/connections/view/connection-view';
import EnviromentView from './features/enviroments/view/enviroment-view';
import HistoryView from './features/history/view/history-view';
import AppLayout from './layout/app-layout';
import './styles/main.css';

function App() {
  const router = createHashRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/connections',
          element: <ConnectionView />,
        },
        {
          path: '/collections',
          element: <CollectionView />,
        },
        {
          path: '/enviroments',
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
