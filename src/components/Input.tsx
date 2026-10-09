import { type InputHTMLAttributes, forwardRef } from "react";
//import { useTheme } from "../theme/ThemeProvider";

type Variant = "default" | "filled" | "underline";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  label?: string;
}

const variantStyles: Record<Variant, string> = {
  default: "border border-gray-300 rounded-md p-2",
  filled: "bg-gray-100 border border-gray-300 rounded-md p-2",
  underline: "border-b border-gray-300 p-2",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "default", label, ...props },
  ref,
) {
  //const theme = useTheme();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-bold mb-1 mt-2 text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`mb-4 last:mb-0 block w-full ${variantStyles[variant]} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
      />
    </div>
  );
});
