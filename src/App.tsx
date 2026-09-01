import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LoginPage, UsersPage } from "./pages/AuthPages";
import {
  AnnouncementDetailPage,
  AnnouncementsPage,
  NewAnnouncementPage,
} from "./pages/Announcements";
import { ProtectedRoute, RoleProtectedRoute } from "./components/AuthRoutes";
import { TicketProvider } from "./hooks/useTickets";
import { AnnouncementProvider } from "./hooks/useAnnouncements";
import { Dashboard } from "./pages/Dashboard";
import {
  CategoriesPage,
  CreateTicketPage,
  SettingsPage,
  TicketsPage,
} from "./pages/CRM";
import { SchoolsPage } from "./pages/Schools";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <AnnouncementProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/new" element={<CreateTicketPage />} />
                <Route path="/my-tickets" element={<TicketsPage mine />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/schools" element={<SchoolsPage />} />
                <Route path="/schools/:id" element={<SchoolsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route
                  path="/announcements/new"
                  element={<RoleProtectedRoute role="Admin" />}
                >
                  <Route index element={<NewAnnouncementPage />} />
                </Route>
                <Route
                  path="/announcements/:id"
                  element={<AnnouncementDetailPage />}
                />
                <Route element={<RoleProtectedRoute role="Admin" />}>
                  <Route path="/users" element={<UsersPage />} />
                </Route>
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Route>
            </Routes>
          </AnnouncementProvider>
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
