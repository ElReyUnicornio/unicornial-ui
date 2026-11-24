import { forwardRef, type AnchorHTMLAttributes, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { cx, useVariant } from "../theme/variants";

//types -----------------------------------------------------------------------------
export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Name of a variant defined in the theme config (variants[name].footer.root). */
  themeVariant?: string;
}

export interface FooterBrandProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Image url of the logo. */
  logo?: string;
  title?: ReactNode;
  /** Short text under the title. */
  children?: ReactNode;
}

export interface FooterColumnProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  /** Name of a variant defined in the theme config (variants[name].footer.{column,title}). */
  themeVariant?: string;
}

export interface FooterLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element or component to render instead of `<a>`, such as a router `Link`. */
  as?: ElementType;
  /** Passed through to the component given in `as`. */
  to?: string;
  /** Name of a variant defined in the theme config (variants[name].footer.link). */
  themeVariant?: string;
}

//Footer container -----------------------------------------------------------------------------
const FooterRoot = forwardRef<HTMLElement, FooterProps>(function Footer(
  { className = "", style, themeVariant, children, ...props },
  ref,
) {
  const { currentColors } = useTheme();
  const themed = useVariant("footer", themeVariant)("root");

  return (
    <footer
      ref={ref}
      {...props}
      className={cx(
        "w-full px-6 sm:px-12 py-8 flex flex-wrap justify-between gap-10 border-t",
        themed.className,
        className,
      )}
      style={{
        backgroundColor: currentColors.background,
        borderColor: currentColors.border,
        color: currentColors.text,
        ...themed.style,
        ...style,
      }}
    >
      {children}
    </footer>
  );
});

function FooterBrand({ logo, title, className = "", children, ...props }: FooterBrandProps) {
  return (
    <div {...props} className={cx("flex flex-col gap-2 max-w-xs", className)}>
      {(logo || title) && (
        <div className="flex items-center gap-2">
          {/* decorative when the title already names the brand */}
          {logo && <img src={logo} alt={title ? "" : "Logo"} className="h-8 w-auto object-contain" />}
          {title && <span className="text-lg font-bold">{title}</span>}
        </div>
      )}
      {children && <div className="text-sm opacity-70">{children}</div>}
    </div>
  );
}

function FooterColumn({ title, className = "", style, themeVariant, children, ...props }: FooterColumnProps) {
  const themed = useVariant("footer", themeVariant);
  const column = themed("column");
  const heading = themed("title");

  return (
    <nav
      aria-label={typeof title === "string" ? title : undefined}
      {...props}
      className={cx("flex flex-col items-start text-sm", column.className, className)}
      style={{ ...column.style, ...style }}
    >
      {title && (
        <span className={cx("font-semibold pb-1", heading.className)} style={heading.style}>
          {title}
        </span>
      )}
      {children}
    </nav>
  );
}

function FooterLink({ as, className = "", style, themeVariant, children, ...props }: FooterLinkProps) {
  const themed = useVariant("footer", themeVariant)("link");
  const Component: ElementType = as ?? "a";

  return (
    <Component
      {...props}
      className={cx(
        "py-1.5 rounded-sm opacity-75 hover:opacity-100 hover:underline underline-offset-4",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 transition-opacity",
        themed.className,
        className,
      )}
      style={{ ...themed.style, ...style }}
    >
      {children}
    </Component>
  );
}

export const Footer = Object.assign(FooterRoot, {
  Brand: FooterBrand,
  Column: FooterColumn,
  Link: FooterLink,
});

export default Footer;
