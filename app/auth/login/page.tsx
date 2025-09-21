import LoginForm from '@/components/auth/loginForm';

export const metadata = { title: 'Login — Chorotega E-Market' };

export default function LoginPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <LoginForm />
    </main>
  );
}