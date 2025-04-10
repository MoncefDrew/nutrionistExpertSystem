import { AuthMiddleware } from '../../components/auth-middleware';
import { AuthHeader } from '../../components/auth-header';

export default function ClientLayout({ children }) {
  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-black">
        <AuthHeader />
        {children}
      </div>
    </AuthMiddleware>
  );
}
