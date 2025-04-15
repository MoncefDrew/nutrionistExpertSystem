import { AuthMiddleware } from '../../components/auth-middleware';
import { AuthHeader } from '../../components/auth-header';
import { DashboardHeader } from '../../components/DashboardHeader';

export default function AdminLayout({ children }) {
  return (
    <AuthMiddleware>
      <div className="min-h-screen  bg-black">
        <DashboardHeader />
        {children}
      </div>
    </AuthMiddleware>
  );
}
