const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden items-center justify-center bg-base-200 p-12 lg:flex">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl border border-[#9D00FF]/25 bg-[#9D00FF]/20 shadow-[0_0_24px_rgba(157,0,255,0.16)] ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <div className="mb-4 text-2xl font-bold">{title}</div>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
