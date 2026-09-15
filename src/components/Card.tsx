// import {
//   type HTMLAttributes,
//   forwardRef,
//   useMemo,
//   type ReactNode,
// } from "react";
// import { useTheme } from "../theme/ThemeProvider";

// type Variant = "elevated" | "outlined" | "filled";
// type Size = "sm" | "md" | "lg";

// export interface CardProps extends HTMLAttributes<HTMLDivElement> {
//   variant?: Variant;
//   size?: Size;
//   hoverable?: boolean;
// }

// export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
//   title?: ReactNode;
//   subtitle?: ReactNode;
//   action?: ReactNode;
// }

// export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

// export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

// const sizePaddingClasses: Record<Size, string> = {
//   sm: "p-4 gap-3",
//   md: "p-6 gap-4",
//   lg: "p-8 gap-5",
// };

// const sizeHeaderClasses: Record<Size, string> = {
//   sm: "pb-3 mb-3",
//   md: "pb-4 mb-4",
//   lg: "pb-5 mb-5",
// };

// const sizeFooterClasses: Record<Size, string> = {
//   sm: "pt-3 mt-3",
//   md: "pt-4 mt-4",
//   lg: "pt-5 mt-5",
// };

// function hexToRgba(hex: string, alpha: number): string {
//   const cleaned = hex.replace("#", "");
//   const full =
//     cleaned.length === 3
//       ? cleaned
//           .split("")
//           .map((c) => c + c)
//           .join("")
//       : cleaned;
//   const num = parseInt(full, 16);
//   const r = (num >> 16) & 0xff;
//   const g = (num >> 8) & 0xff;
//   const b = num & 0xff;
//   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
// }

// export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
//   {
//     variant = "elevated",
//     size = "md",
//     hoverable = false,
//     className = "",
//     style,
//     children,
//     ...props
//   },
//   ref,
// ) {
//   const theme = useTheme();

//   const variantClasses = useMemo(() => {
//     if (theme.enabled) return "";
//     switch (variant) {
//       case "outlined":
//         return "bg-bg border border-border";
//       case "filled":
//         return "bg-code-bg";
//       case "elevated":
//       default:
//         return "bg-bg shadow-lg shadow-black/10";
//     }
//   }, [theme, variant]);

//   const variantStyle = useMemo<React.CSSProperties | undefined>(() => {
//     if (!theme.enabled) return undefined;
//     const bg = theme.darkMode ? "#0b0912" : "#ffffff";
//     const filledBg = theme.darkMode ? "#14111f" : "#f5f5f7";
//     const border = theme.darkMode ? "#2a2535" : "#e5e4e7";

//     switch (variant) {
//       case "outlined":
//         return {
//           backgroundColor: bg,
//           border: `1px solid ${border}`,
//         };
//       case "filled":
//         return {
//           backgroundColor: filledBg,
//         };
//       case "elevated":
//       default:
//         return {
//           backgroundColor: bg,
//           boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
//         };
//     }
//   }, [theme, variant]);

//   const hoverClass = hoverable
//     ? theme.enabled
//       ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
//       : "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
//     : "";

//   const themeHoverStyle = useMemo<React.CSSProperties | undefined>(() => {
//     if (!theme.enabled || !hoverable) return undefined;
//     const primary = theme.colors.primary;
//     return {
//       ["--hover-ring" as any]: hexToRgba(primary, 0.2),
//     };
//   }, [theme, hoverable]);

//   return (
//     <div
//       ref={ref}
//       className={[
//         "relative w-full h-full rounded-xl overflow-hidden flex flex-col",
//         variantClasses,
//         sizePaddingClasses[size],
//         hoverClass,
//         className,
//       ].join(" ")}
//       style={{ ...variantStyle, ...themeHoverStyle, ...style }}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// });

// export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
//   function CardHeader(
//     {
//       title,
//       subtitle,
//       action,
//       className = "",
//       style,
//       children,
//       ...props
//     },
//     ref,
//   ) {
//     const theme = useTheme();
//     const size: Size = "md";

//     const textStyle = useMemo<React.CSSProperties | undefined>(() => {
//       if (!theme.enabled) return undefined;
//       return {
//         ["--title-color" as any]: theme.darkMode ? "#e8e4f0" : "#08060d",
//         ["--subtitle-color" as any]: theme.darkMode ? "#908a9e" : "#706a7c",
//       };
//     }, [theme]);

//     const titleClass = theme.enabled
//       ? "text-[color:var(--title-color)]"
//       : "text-text-h";
//     const subtitleClass = theme.enabled
//       ? "text-[color:var(--subtitle-color)]"
//       : "text-text-muted";

//     return (
//       <div
//         ref={ref}
//         className={[
//           "w-full flex items-start justify-between border-b border-border",
//           sizeHeaderClasses[size],
//           className,
//         ].join(" ")}
//         style={{ ...textStyle, ...style }}
//         {...props}
//       >
//         {(title || subtitle || children) && (
//           <div className="flex flex-col gap-1 min-w-0">
//             {title && (
//               <h3
//                 className={[
//                   "text-xl font-semibold leading-tight",
//                   titleClass,
//                 ].join(" ")}
//               >
//                 {title}
//               </h3>
//             )}
//             {subtitle && (
//               <p
//                 className={[
//                   "text-sm font-normal",
//                   subtitleClass,
//                 ].join(" ")}
//               >
//                 {subtitle}
//               </p>
//             )}
//             {children}
//           </div>
//         )}
//         {action && <div className="shrink-0 ml-4">{action}</div>}
//       </div>
//     );
//   },
// );

// export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
//   function CardBody({ className = "", style, children, ...props }, ref) {
//     const theme = useTheme();

//     const textStyle = useMemo<React.CSSProperties | undefined>(() => {
//       if (!theme.enabled) return undefined;
//       return {
//         color: theme.darkMode ? "#e8e4f0" : "#08060d",
//       };
//     }, [theme]);

//     const textClass = theme.enabled ? "" : "text-text";

//     return (
//       <div
//         ref={ref}
//         className={["w-full flex-1 flex flex-col", textClass, className].join(
//           " ",
//         )}
//         style={{ ...textStyle, ...style }}
//         {...props}
//       >
//         {children}
//       </div>
//     );
//   },
// );

// export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
//   function CardFooter({ className = "", style, children, ...props }, ref) {
//     return (
//       <div
//         ref={ref}
//         className={[
//           "w-full flex items-center justify-between border-t border-border",
//           sizeFooterClasses["md"],
//           className,
//         ].join(" ")}
//         style={style}
//         {...props}
//       >
//         {children}
//       </div>
//     );
//   },
// );

// export const CardNamespace = Object.assign(Card, {
//   Header: CardHeader,
//   Body: CardBody,
//   Footer: CardFooter,
// });

// export default CardNamespace;
