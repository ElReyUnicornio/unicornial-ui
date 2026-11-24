import {
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  useEffect,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";
import { hexToRgba } from "../utils/color";

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
  /** Element that wraps the title. Pass "h1" only if it is the page's main heading. */
  titleAs?: ElementType;
}

export interface HeaderNavButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element or component to render instead of `<a>`, such as a router `Link`. */
  as?: ElementType;
  /** Passed through to the component given in `as`. */
  to?: string;
  /** Name of a variant defined in the theme config (variants[name].header.navButton). */
  themeVariant?: string;
}

//Header container -----------------------------------------------------------------------------

const behaviourContainerClasses: Record<Behaviour, string> = {
  default: "shadow-sm",
  sticky: "sticky top-0 z-50",
  hide: "transition-transform duration-300 absolute top-0 left-0",
};

const headerVariantClasses: Record<Variant, string> = {
  default: "",
  blur: "bg-white/10 backdrop-blur-sm",
};

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    behaviour = "default",
    className = "",
    style,
    children,
    variant = "default",
    themeVariant,
    ...props
  },
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
        "w-full h-16 px-6 sm:px-12 flex items-center gap-4 absolute top-0 left-0",
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
  { className = "", style, alt = "", title = "", titleAs: Title = "span", darkSrc, ...props },
  ref,
) {
  const theme = useTheme();

  const src = theme.dark.enabled && darkSrc ? darkSrc : props.src;

  return (
    <div className="h-full flex items-center justify-center shrink-0">
      {src && (
        <img
          ref={ref}
          alt={alt}
          className={cx("h-full max-h-12 w-auto object-contain", className)}
          style={{ aspectRatio: "auto", ...style }}
          {...props}
          src={src}
        />
      )}
      {title && (
        <Title className="ml-2 text-lg font-bold" title={title}>
          {title}
        </Title>
      )}
    </div>
  );
});

const HeaderNavButton = forwardRef<HTMLAnchorElement, HeaderNavButtonProps>(
  function HeaderNavButton({ as, className = "", style, children, themeVariant, ...props }, ref) {
    const Component: ElementType = as ?? "a";
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
      <Component
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
      </Component>
    );
  },
);

const HeaderNamespace = Object.assign(Header, {
  Logo: HeaderLogo,
  NavButton: HeaderNavButton,
});

export default HeaderNamespace;
