type PriviaLogoProps = {
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export function PriviaLogo({
  compact = false,
  light = false,
  className = "",
}: PriviaLogoProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d6bd8a]/50 bg-[#b08d57] shadow-[0_8px_24px_rgba(20,33,61,0.18)]">
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="h-7 w-7"
          fill="none"
        >
          <path
            d="M24 5 39 11v11c0 9.7-5.9 17.6-15 21-9.1-3.4-15-11.3-15-21V11L24 5Z"
            fill="#14213d"
          />

          <path
            d="M17 15h9.2c5.3 0 8.5 2.8 8.5 7.5 0 4.8-3.3 7.7-8.8 7.7h-2.8v5.3H17V15Z"
            fill="#f7f5f0"
          />

          <path
            d="M23.1 20v5.2h2.6c2 0 3-0.9 3-2.6 0-1.7-1-2.6-3-2.6h-2.6Z"
            fill="#14213d"
          />
        </svg>
      </div>

      {!compact && (
        <div>
          <p
            className={`text-xl font-semibold tracking-[-0.03em] ${
              light
                ? "text-white"
                : "text-[#14213d]"
            }`}
          >
            Privia
          </p>

          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
              light
                ? "text-[#d6bd8a]"
                : "text-[#8c6d3d]"
            }`}
          >
            Legal Privacy
          </p>
        </div>
      )}
    </div>
  );
}