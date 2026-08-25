import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LoginPage, UsersPage } from "./pages/AuthPages";
import { ProtectedRoute, RoleProtectedRoute } from "./components/AuthRoutes";
import { TicketProvider } from "./hooks/useTickets";
import { Dashboard } from "./pages/Dashboard";
import {
  CategoriesPage,
  CreateTicketPage,
  SettingsPage,
  TicketsPage,
} from "./pages/CRM";

export default function App() {
  return (
    <BrowserRouter><AuthProvider><TicketProvider><Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/my-tickets" element={<TicketsPage mine />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route element={<RoleProtectedRoute role="Admin" />}><Route path="/users" element={<UsersPage />} /></Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes></TicketProvider></AuthProvider></BrowserRouter>
  );
}
