import { DashboardHeader } from '../../components/DashboardHeader';

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <DashboardHeader />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
} 