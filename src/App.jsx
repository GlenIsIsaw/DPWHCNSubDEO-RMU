import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/Main';
import RecordTable from './components/records/RecordTable';
import ActivityLogTable from './components/records/ActivityLogTable'; // <-- import it
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Records Table - Default / Home */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RecordTable />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Activity Logs */}
        <Route
          path="/activity-logs"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ActivityLogTable />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
