type P = { className?: string; size?: number };

const svg = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 20 20",
  fill: "none",
  "aria-hidden": true as const,
  className,
});

export const Bag = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M4.5 7h11l-.9 10H5.4L4.5 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M7.5 7V5.5a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const Search = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <circle cx="8.8" cy="8.8" r="5.3" stroke="currentColor" strokeWidth="1.4" />
    <path d="m12.7 12.7 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const Close = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const Plus = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Minus = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Arrow = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M3 10h13m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowUpRight = ({ className, size = 14 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M6 14 14 6M7.5 6H14v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Check = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Chevron = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Truck = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M2.5 5.5h9v8h-9zM11.5 8.5h3l2.5 2.5v2.5h-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="6" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="14" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const Return = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M7 5 3.5 8.5 7 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 8.5h8a4.5 4.5 0 0 1 0 9H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const Shield = ({ className, size = 20 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M10 2.5 16 5v4.5c0 4-2.6 6.8-6 8-3.4-1.2-6-4-6-8V5l6-2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="m7.3 10 2 2 3.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Rotate = ({ className, size = 16 }: P) => (
  <svg {...svg(size, className)}>
    <path d="M15.5 8A6 6 0 1 0 16 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M16 4v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Star = ({ className, size = 14, filled = true }: P & { filled?: boolean }) => (
  <svg {...svg(size, className)}>
    <path
      d="m10 2.8 2.2 4.6 5 .6-3.7 3.4 1 5-4.5-2.5-4.5 2.5 1-5L2.8 8l5-.6L10 2.8Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/** The NØVA mark: an O with the slash of the Ø as a sound wave. */
export const Logo = ({ className }: { className?: string }) => (
  <span className={className} aria-hidden="true">
    NØVA
  </span>
);
