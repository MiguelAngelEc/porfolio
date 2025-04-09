import Image from "next/image";
import Nav from "./components/Nav";
import Main from "./components/Main";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen p-8 pt-24 pb-20 gap-16 sm:p-20 sm:pt-32 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start z-10">
          <Main />
        </main>
        <footer className="row-start-2 flex gap-[24px] flex-wrap items-center justify-center z-10">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white/80 hover:text-white transition-colors duration-300"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white/80 hover:text-white transition-colors duration-300"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-white/80 hover:text-white transition-colors duration-300"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
