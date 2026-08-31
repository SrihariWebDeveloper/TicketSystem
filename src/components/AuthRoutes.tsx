import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../layouts/AppLayout";
import { Card, EmptyState } from "./ui";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
export function RoleProtectedRoute({ role }: { role: string }) {
  const { currentUser } = useAuth();
  if (currentUser?.role !== role)
    return (
      <Card>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view this page."
        />
      </Card>
    );
  return <Outlet />;
}
