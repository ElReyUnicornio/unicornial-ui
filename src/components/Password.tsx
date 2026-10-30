import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";
import { Eye, EyeOff } from "./icons";

export type PasswordProps = Omit<InputProps, "type" | "endAdornment">;

/** Password input with a button to show or hide the text. */
export const Password = forwardRef<HTMLInputElement, PasswordProps>(function Password(
  props,
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible((v) => !v)}
          className="p-1 rounded-md cursor-pointer opacity-60 hover:opacity-100 hover:bg-hover disabled:pointer-events-none"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      }
    />
  );
});

export default Password;
