import { useId, useRef, useState } from "react";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { FileIcon } from "./icons";
import { cx } from "../theme/variants";

export interface FileInputProps {
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  buttonText?: string;
  placeholder?: string;
  variant?: FieldVariant;
  /** Name of a variant defined in the theme config (variants[name].input.*). */
  themeVariant?: string;
  className?: string;
}

export function FileInput({
  onChange,
  accept,
  multiple,
  label,
  name,
  id,
  disabled,
  buttonText = "Choose file",
  placeholder = "No file chosen",
  variant = "default",
  themeVariant,
  className = "",
}: FileInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const styles = useFieldStyles(themeVariant, variant);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const text =
    files.length === 0
      ? placeholder
      : files.length === 1
        ? files[0].name
        : `${files.length} files selected`;

  return (
    <Field label={label} htmlFor={inputId} themeVariant={themeVariant} className={className}>
      <div className="mb-4 last:mb-0">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            setFiles(selected);
            onChange?.(selected);
          }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cx(
            "flex w-full items-center gap-2 text-left sm:text-sm cursor-pointer",
            "disabled:opacity-50 disabled:pointer-events-none",
            styles.fieldClass,
            FOCUS_RING,
          )}
          style={styles.fieldStyle}
        >
          <span
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium shrink-0"
            style={{ backgroundColor: "color-mix(in srgb, var(--theme-primary) 14%, transparent)" }}
          >
            <FileIcon size={16} />
            {buttonText}
          </span>
          <span className={cx("truncate", files.length === 0 && "opacity-50")}>{text}</span>
        </button>
      </div>
    </Field>
  );
}

export default FileInput;
