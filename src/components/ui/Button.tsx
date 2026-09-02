import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

const variants = {
  primary: "bg-rich-berry text-soft-ivory hover:bg-deep-aubergine shadow-lg shadow-rich-berry/20",
  secondary: "bg-burnt-orange text-soft-ivory hover:bg-marigold hover:text-luxury-ink",
  outline: "border-2 border-muted-gold text-deep-aubergine hover:bg-warm-sand",
  ghost: "text-deep-aubergine hover:bg-warm-sand/50",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({ variant = "primary", size = "md", className, href, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rich-berry disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
