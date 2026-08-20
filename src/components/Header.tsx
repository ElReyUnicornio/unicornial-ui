import {
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  useEffect,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { useTheme } from "../theme/ThemeProvider";

type Behaviour = "default" | "sticky" | "blur";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  behaviour?: Behaviour;
}

export interface HeaderLogoProps extends ImgHTMLAttributes<HTMLImageElement> {}

export interface HeaderNavButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const behaviourContainerClasses: Record<Behaviour, string> = {
  default: "",
  sticky: "sticky top-0 z-50",
  blur: "sticky top-0 z-50 transition-all duration-300",
};

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { behaviour = "default", className = "", style, children, ...props },
  ref,
) {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (behaviour !== "blur") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [behaviour]);

  const blurClasses =
    behaviour === "blur" && scrolled
      ? "backdrop-blur-md bg-bg/70 border-b border-border shadow"
      : behaviour === "blur"
        ? "bg-bg"
        : behaviour === "sticky"
          ? "bg-bg border-b border-border"
          : "bg-bg border-b border-border";

  const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const bg = theme.darkMode ? "#0b0912" : "#ffffff";
    const border = theme.darkMode ? "#2a2535" : "#e5e4e7";
    const blurBg = hexToRgba(theme.darkMode ? "#0b0912" : "#ffffff", 0.7);
    const shadow = scrolled
      ? "rgba(0, 0, 0, 0.1) 0 4px 12px -2px"
      : undefined;

    if (behaviour === "blur" && scrolled) {
      return {
        backgroundColor: blurBg,
        borderBottom: `1px solid ${border}`,
        boxShadow: shadow,
        color: theme.darkMode ? "#e8e4f0" : "#08060d",
      };
    }
    return {
      backgroundColor: bg,
      borderBottom:
        behaviour !== "default" ? `1px solid ${border}` : undefined,
      color: theme.darkMode ? "#e8e4f0" : "#08060d",
    };
  }, [theme, behaviour, scrolled]);

  return (
    <header
      ref={ref}
      className={[
        "w-full px-6 py-4 flex items-center justify-between",
        behaviourContainerClasses[behaviour],
        blurClasses,
        className,
      ].join(" ")}
      style={{ ...themeStyle, ...style }}
      {...props}
    >
      {children}
    </header>
  );
});

export const HeaderLogo = forwardRef<HTMLImageElement, HeaderLogoProps>(
  function HeaderLogo({ className = "", style, alt = "", ...props }, ref) {
    return (
      <div className="h-full flex items-center justify-center shrink-0">
        <img
          ref={ref}
          alt={alt}
          className="h-full max-h-[48px] w-auto object-contain"
          style={{ aspectRatio: "auto", ...style }}
          {...props}
        />
      </div>
    );
  },
);

export const HeaderNavButton = forwardRef<
  HTMLAnchorElement,
  HeaderNavButtonProps
>(function HeaderNavButton(
  { className = "", style, children, ...props },
  ref,
) {
  const theme = useTheme();

  const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const ringColor = hexToRgba(theme.colors.primary, 0.5);
    return {
      color: theme.darkMode ? "#e8e4f0" : "#08060d",
      ["--tw-ring-color" as any]: ringColor,
      ["--hover-color" as any]: theme.colors.primary,
    };
  }, [theme]);

  const themeHoverClass = theme.enabled ? "hover:text-[var(--hover-color)]" : "";

  const originalClass = theme.enabled ? "" : "text-text-h hover:text-accent";
  const originalRing = theme.enabled
    ? ""
    : "focus-visible:ring-accent/50";

  return (
    <a
      ref={ref}
      className={[
        "inline-flex items-center justify-center",
        "px-3 py-2 text-sm font-medium",
        originalClass,
        themeHoverClass,
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md",
        originalRing,
        "select-none",
        className,
      ].join(" ")}
      style={{ ...themeStyle, ...style }}
      {...props}
    >
      {children}
    </a>
  );
});

export const HeaderNamespace = Object.assign(Header, {
  Logo: HeaderLogo,
  NavButton: HeaderNavButton,
});

export default HeaderNamespace;
