import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] hover:scale-105",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)] hover:shadow-[0_0_25px_hsla(280,40%,92%,0.4)] hover:scale-105",
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-accent)] hover:shadow-[0_0_30px_hsla(30,100%,80%,0.35)] hover:scale-105",
        outline:
          "border-2 border-primary bg-background text-foreground hover:bg-primary/10 hover:border-primary-glow",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        care:
          "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] hover:scale-110 font-semibold",
        calm:
          "bg-gradient-to-br from-secondary to-secondary-glow text-secondary-foreground shadow-lg hover:shadow-[0_0_30px_hsla(280,40%,92%,0.5)] hover:scale-110 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[calc(var(--radius)-2px)] px-3",
        lg: "h-11 rounded-[var(--radius)] px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
