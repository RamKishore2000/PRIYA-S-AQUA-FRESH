export function AdminToast({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] max-w-sm rounded-md border border-teal-200 bg-white px-4 py-3 text-sm font-semibold text-teal-700 shadow-xl" role="status">
      {message}
    </div>
  );
}
