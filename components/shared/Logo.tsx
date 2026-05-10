import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "white";
  className?: string;
}

export function Logo({ 
  size = "md", 
  showText = true, 
  variant = "default",
  className = "" 
}: LogoProps) {
  const sizes = {
    sm: { icon: "size-6", text: "text-lg" },
    md: { icon: "size-8", text: "text-xl" },
    lg: { icon: "size-10", text: "text-2xl" },
  };

  const s = sizes[size];

  const colors = {
    default: {
      primary: "fill-primary",
      secondary: "fill-primary/60",
      accent: "fill-primary/30",
      text: "text-foreground group-hover:text-primary"
    },
    white: {
      primary: "fill-white",
      secondary: "fill-white/60",
      accent: "fill-white/30",
      text: "text-white"
    }
  };

  const c = colors[variant];

  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Logo Mark — Abstract upward growth symbol */}
      <div className={`${s.icon} relative`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          {/* Main upward chevron */}
          <path
            d="M16 4L28 16L24 16L16 8L8 16L4 16L16 4Z"
            className={c.primary}
          />
          {/* Secondary element */}
          <path
            d="M16 14L24 22L20 22L16 18L12 22L8 22L16 14Z"
            className={c.secondary}
          />
          {/* Base accent */}
          <rect
            x="10"
            y="24"
            width="12"
            height="2.5"
            rx="1.25"
            className={c.accent}
          />
        </svg>
      </div>

      {showText && (
        <span
          className={`${s.text} font-heading font-bold tracking-tight ${c.text} transition-colors duration-200`}
        >
          Vitae
        </span>
      )}
    </Link>
  );
}
