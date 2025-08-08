import { isAdminAuthenticated } from '@/lib/auth/session';
import { AdminLoginForm } from './ui/admin-login-form';
import { AdminDashboard } from './ui/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = isAdminAuthenticated();
  if (!authed) {
    return (
      <section className="mx-auto mt-12 max-w-md">
        <h1 className="mb-4 text-center text-2xl font-medium">Admin Login</h1>
        <AdminLoginForm />
      </section>
    );
  }
  return <AdminDashboard />;
}


