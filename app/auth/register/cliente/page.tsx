import ClienteRegister from '@/components/auth/register/cliente';

export const metadata = { title: 'Registro cliente — Chorotega E-Market' };

export default function ClientePage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-emerald-50 px-4 py-10">
      <ClienteRegister />
    </main>
  );
}