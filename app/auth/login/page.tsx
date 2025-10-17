import LoginForm from '@/components/auth/loginForm';
import { Footer } from '@/components/sections/footer';
import { HeaderLittle } from '@/components/sections/headerLittle';

export const metadata = { title: 'Login — Chorotega E-Market' };

export default function LoginPage() {
  return (
    <>
    <br />
    <br /><br /><br />
  
      <LoginForm />
      <Footer />
    </>
  );
}