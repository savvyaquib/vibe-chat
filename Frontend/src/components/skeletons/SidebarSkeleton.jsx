const SidebarSkeleton = () => {
  const rows = Array.from({ length: 6 }, (_, idx) => idx);

  return (
    <div className="space-y-3 p-4">
      <div className="h-12 rounded-2xl bg-base-200" />
      {rows.map((row) => (
        <div key={row} className="flex items-center gap-3 rounded-3xl bg-base-200 p-3">
          <div className="h-12 w-12 rounded-full bg-base-300" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-base-300" />
            <div className="h-3 w-1/2 rounded-full bg-base-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
