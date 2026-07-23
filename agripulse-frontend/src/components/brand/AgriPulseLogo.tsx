import Link from "next/link";

type LogoProps = {
  href?: string;
  wordmark?: string | false;
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { box: "h-8 w-8", icon: 16, text: "text-lg" },
  md: { box: "h-9 w-9", icon: 18, text: "text-xl" },
  lg: { box: "h-11 w-11", icon: 22, text: "text-2xl" },
};

function Mark({ size, onDark }: { size: number; onDark?: boolean }) {
  const vein = onDark ? "rgba(255,255,255,0.35)" : "#154d32";
  const pulseUnder = onDark ? "rgba(255,255,255,0.25)" : "rgba(21,77,50,0.55)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 5c6.5 2.2 10 7.2 10 13.2 0 5.2-3.4 8.8-8.2 9.6-1.1.2-2.2.2-3.2 0C9.8 27 6 23.4 6 18.2 6 12.2 9.5 7.2 16 5Z"
        fill="currentColor"
        fillOpacity="0.95"
      />
      <path
        d="M16 8.5v15.5"
        stroke={vein}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity={onDark ? 1 : 0.35}
      />
      <path
        d="M8.5 16.5h3.2l1.6-3.2 2.4 6.2 1.8-3h6"
        stroke={pulseUnder}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 16.5h3.2l1.6-3.2 2.4 6.2 1.8-3h6"
        stroke="white"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AgriPulseLogo({
  href = "/",
  wordmark = "AgriPulse",
  size = "md",
  onDark = false,
  className = "",
}: LogoProps) {
  const dims = sizeMap[size];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className={[
          "relative flex shrink-0 items-center justify-center rounded-xl shadow-sm",
          dims.box,
          onDark
            ? "bg-white/15 text-white ring-1 ring-white/20"
            : "bg-gradient-to-br from-ap-green to-ap-green-deep text-white",
        ].join(" ")}
      >
        <Mark size={dims.icon} onDark={onDark} />
        {!onDark ? (
          <span
            className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ap-orange ring-2 ring-white"
            aria-hidden
          />
        ) : null}
      </span>
      {wordmark ? (
        <span
          className={[
            "font-bold tracking-tight",
            dims.text,
            onDark ? "text-white" : "text-ap-green-deep",
          ].join(" ")}
        >
          {wordmark}
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
