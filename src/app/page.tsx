import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white z-10">
      <h1 className="text-4xl font-bold mb-4">Coding Time Attack</h1>
      <Link
        href="/game"
        className="px-6 py-3 bg-cyan-500 text-black rounded hover:bg-cyan-400 z-10"
      >
        Start Game
      </Link>
      {/* Background effects */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 bottom-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-70"></div>
        <div className="absolute top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-green-900/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8cGF0aCBvcGFjaXR5PSIwLjUiIGQ9Ik01IDAgTDYwIDAgTDYwIDYwIEw1NSA2MCBMIDU1IDUgTDUgNSBaIiBmaWxsPSIjMmJkNGJkIj48L3BhdGg+Cjwvc3ZnPg==')] bg-repeat"></div>
        </div>
      </div>
    </main>
  );
}
