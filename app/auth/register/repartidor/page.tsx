import RepartidorRegister from "@/components/auth/register/repartidor";


export const metadata = { title: 'Registro emprendedor — Chorotega E-Market' };

export default function RepartidorPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-emerald-50 px-4 py-10">
      <RepartidorRegister />
    </main>
  );
}