export default function ProfileLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded bg-gray-200" />
        <div>
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-48 rounded bg-gray-100" />
        </div>
      </div>

      {/* Card skeleton */}
      <div className="rounded-lg border bg-white p-6">
        <div className="space-y-4">
          <div>
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="mt-2 h-6 w-40 rounded bg-gray-100" />
          </div>
          <div>
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="mt-2 h-6 w-40 rounded bg-gray-100" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="mt-2 h-6 w-32 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
