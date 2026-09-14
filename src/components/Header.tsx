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
import { hexToRgba } from "../utils/utils";

//types -----------------------------------------------------------------------------
type Behaviour = "default" | "sticky" | "hide";
type Variant = "default" | "blur";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  behaviour?: Behaviour;
  variant?: Variant;
}

export interface HeaderLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  darkSrc?: string;
}

export interface HeaderNavButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {}

//Header container -----------------------------------------------------------------------------

const behaviourContainerClasses: Record<Behaviour, string> = {
  default: "",
  sticky: "sticky top-0 z-50",
  hide: "transition-transform duration-300 absolute top-0 left-0",
};

const headerVariantClasses: Record<Variant, string> = {
  default: "",
  blur: "bg-white/10 backdrop-blur-sm",
};

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { behaviour = "default", className = "", style, children, variant = "default", ...props },
  ref,
) {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const translateY = behaviour === "hide" && scrolled ? "-100%" : "0";
  //scroll event
  useEffect(() => {
    if (behaviour !== "hide") return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [behaviour]);

  //get theme
  const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!theme.enabled) return undefined;
    const bg = theme.darkMode ? theme.darkColors.header.background : theme.colors.header.background;
    const border = theme.darkMode ? theme.darkColors.header.border : theme.colors.header.border;

    return {
      backgroundColor: bg,
      borderBottom: `1px solid ${border}`,
      color: theme.darkMode ? theme.darkColors.text : theme.colors.text,
    };
  }, [theme]);

  return (
    <header
      ref={ref}
      className={[
        "w-full h-16 px-12 py-2 flex items-center justify-between shadow-sm shadow-black/50",
        behaviourContainerClasses[behaviour],
        headerVariantClasses[variant],
        className,
      ].join(" ")}
      style={{ ...themeStyle, ...style, transform: `translateY(${translateY})` }}
      {...props}
    >
      {children}
    </header>
  );
});

export const HeaderLogo = forwardRef<HTMLImageElement, HeaderLogoProps>(
  function HeaderLogo({ className = "", style, alt = "", darkSrc, ...props }, ref) {
    const theme = useTheme();

    const src = theme.darkMode && darkSrc ? darkSrc : props.src;

    return (
      <div className="h-full flex items-center justify-center shrink-0">
        <img
          ref={ref}
          alt={alt}
          className="h-full max-h-12 w-auto object-contain"
          style={{ aspectRatio: "auto", ...style }}
          {...props}
          src={src}
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
