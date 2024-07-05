import Image from "next/image";
import logo from "@/images/logo4.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex-1 flex">
      <section className="flex-1 grid grid-col-1 lg:grid-cols-2">
        <div className="flex flex-col space-y-5 bg-orange-400 items-center justify-center order-1 lg:-order-1 pb-10">
          <Image src={logo} height={250} alt="Logo" />
          <Button asChild className="px-20 bg-orange-700 p-10 text-xl">
            <Link href="/stories">Explorá la librería</Link>
          </Button>
        </div>
        <StoryWriter />
      </section>
    </main>
  );
}
