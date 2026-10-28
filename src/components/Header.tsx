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
import { cx, useVariant } from "../theme/variants";
import { hexToRgba } from "../utils/utils";

//types -----------------------------------------------------------------------------
type Behaviour = "default" | "sticky" | "hide";
type Variant = "default" | "blur";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  behaviour?: Behaviour;
  variant?: Variant;
  /** Name of a variant defined in the theme config (variants[name].header.root). */
  themeVariant?: string;
}

export interface HeaderLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  darkSrc?: string;
  alt?: string;
  title?: string;
}

export interface HeaderNavButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Name of a variant defined in the theme config (variants[name].header.navButton). */
  themeVariant?: string;
}

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
  { behaviour = "default", className = "", style, children, variant = "default", themeVariant, ...props },
  ref,
) {
  const theme = useTheme();
  const themed = useVariant("header", themeVariant)("root");
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
    const { header, text } = theme.currentColors;

    return {
      backgroundColor: header.background,
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: header.border,
      color: text,
    };
  }, [theme]);

  return (
    <header
      ref={ref}
      className={cx(
        "w-full h-16 px-12 flex items-center gap-4 shadow-md shadow-gray-500/25 absolute top-0 left-0",
        behaviourContainerClasses[behaviour],
        headerVariantClasses[variant],
        themed.className,
        className,
      )}
      style={{ ...themeStyle, ...themed.style, ...style, transform: `translateY(${translateY})` }}
      {...props}
    >
      {children}
    </header>
  );
});

const HeaderLogo = forwardRef<HTMLImageElement, HeaderLogoProps>(function HeaderLogo(
  { className = "", style, alt = "", title = "", darkSrc, ...props },
  ref,
) {
  const theme = useTheme();

  const src = theme.dark.enabled && darkSrc ? darkSrc : props.src;

  return (
    <div className="h-full flex items-center justify-center shrink-0">
      {src && <img
        ref={ref}
        alt={alt}
        className="h-full max-h-12 w-auto object-contain"
        style={{ aspectRatio: "auto", ...style }}
        {...props}
        src={src}
      />}
      <h1 className="ml-2 text-lg font-bold" title={title}>
        {title}
      </h1>
    </div>
  );
});

const HeaderNavButton = forwardRef<HTMLAnchorElement, HeaderNavButtonProps>(
  function HeaderNavButton({ className = "", style, children, themeVariant, ...props }, ref) {
    const theme = useTheme();
    const themed = useVariant("header", themeVariant)("navButton");

    const themeStyle = useMemo<React.CSSProperties | undefined>(() => {
      if (!theme.enabled) return undefined;
      const { primary, text } = theme.currentColors;
      return {
        color: text,
        ["--tw-ring-color" as any]: hexToRgba(primary, 0.5),
        ["--hover-color" as any]: primary,
      };
    }, [theme]);

    const themeHoverClass = theme.enabled ? "hover:text-[var(--hover-color)]" : "";

    const originalClass = theme.enabled ? "" : "text-text-h hover:text-accent";
    const originalRing = theme.enabled ? "" : "focus-visible:ring-accent/50";

    return (
      <a
        ref={ref}
        className={cx(
          "inline-flex items-center justify-center",
          "px-3 py-2 text-sm font-medium",
          originalClass,
          themeHoverClass,
          "transition-colors duration-200 ease-in-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md",
          originalRing,
          "select-none",
          themed.className,
          className,
        )}
        style={{ ...themeStyle, ...themed.style, ...style }}
        {...props}
      >
        {children}
      </a>
    );
  },
);

const HeaderNamespace = Object.assign(Header, {
  Logo: HeaderLogo,
  NavButton: HeaderNavButton,
});

export default HeaderNamespace;
