import { BookOpen, FilePen } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="p-16 text-center">
      <Link href="/">
        <h1 className="text-6xl font-black">StoryTellerAI</h1>
        <div className="flex justify-center space-x-5 text-3xl lg:text-5xl">
          <h2>Le ponemos vida a tus</h2>
          <div className="relative">
            <div className="absolute bg-orange-300 -left-2 -top-1 -bottom-1 -right-2 -rotate-1" />
            <p className="relative text-white">Historias!</p>
          </div>
        </div>
      </Link>
      <div className="flex space-x-2 fixed top-4 right-4">
        <Link href="/">
          <FilePen className="w-8 h-8 mx-auto lg:w-10 lg:h-10 text-purple-500 border border-purple-500 p-2 rounded-md cursor-pointer hover:bg-slate-100" />
        </Link>
        <Link href="/stories">
          <BookOpen className="w-8 h-8 mx-auto lg:w-10 lg:h-10 text-purple-500 border border-purple-500 p-2 rounded-md cursor-pointer hover:bg-slate-100" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
