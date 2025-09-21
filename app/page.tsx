import { Categories } from "@/components/sections/categories";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Usability } from "@/components/sections/usability";

export default function Home() {
  return (
    <>
     <div>
      <Header />
      <Hero />
      <Features />
      <Usability />
      <Categories />
      <Footer />
     </div>
    </>
  );
}
