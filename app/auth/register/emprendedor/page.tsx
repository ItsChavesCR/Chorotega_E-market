import EmprendedorRegister from '@/components/auth/register/emprendedor';

export const metadata = { title: 'Registro emprendedor — Chorotega E-Market' };

export default function EmprendedorPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <EmprendedorRegister />
    </main>
  );
}