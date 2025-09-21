import { Header } from "@/components/sections/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
     <div>
  
      <Header />
      
     </div>
     <Link className="text-gray-400 underline flex" href="/auth/login">Únete</Link>
    </>
  );
}
