import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-24 text-center">
      <p className="text-sm font-medium tracking-[0.2em] text-rose-600 uppercase">
        Error 404
      </p>
      <h1 className="mt-4 text-3xl font-light text-neutral-900 md:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-500">
        The page you are looking for does not exist, or it may have been moved.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="rounded-full bg-rose-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          Back to home
        </Link>
        <Link
          href="/albums"
          className="rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
        >
          View albums
        </Link>
      </div>
    </div>
  );
}