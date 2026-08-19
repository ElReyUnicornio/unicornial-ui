import {
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  useEffect,
  useState,
  forwardRef,
} from "react";

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

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header(
  { behaviour = "default", className = "", children, ...props },
  ref,
) {
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

  return (
    <header
      ref={ref}
      className={[
        "w-full px-6 py-4 flex items-center justify-between",
        behaviourContainerClasses[behaviour],
        blurClasses,
        className,
      ].join(" ")}
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
>(function HeaderNavButton({ className = "", children, ...props }, ref) {
  return (
    <a
      ref={ref}
      className={[
        "inline-flex items-center justify-center",
        "px-3 py-2 text-sm font-medium",
        "text-text-h hover:text-accent",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 rounded-md",
        "select-none",
        className,
      ].join(" ")}
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
