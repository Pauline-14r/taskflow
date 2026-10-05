import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage.tsx'
import ProjectsPage from './pages/ProjectsPage/ProjectsPage.tsx'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.tsx'
import Layout from "./layouts/Layout.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import ProjectPage from "./pages/ProjectPage/ProjectPage.tsx";
import TaskDetailsPage from "./pages/TaskDetailsPage/TaskDetailsPage.tsx";
import {ProtectedRoute} from "./routes/ProtectedRoute.tsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:projectId" element={<ProjectPage />} />
                    <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetailsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App