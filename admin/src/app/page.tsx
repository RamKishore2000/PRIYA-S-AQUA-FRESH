export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
      <meta httpEquiv="refresh" content="0; url=/admin/login/" />
      <div>
        <h1 className="text-xl font-bold text-slate-950">Opening admin login...</h1>
        <p className="mt-2 text-sm text-slate-600">
          If you are not redirected, open <a className="font-semibold text-teal-700 underline" href="/admin/login/">Admin Login</a>.
        </p>
      </div>
    </main>
  );
}