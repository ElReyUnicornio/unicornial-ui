import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Field } from "./Field";
import { alertColors } from "./Alert";
import { CloseIcon, UploadIcon } from "./icons";
import { cx, useVariant } from "../theme/variants";

export interface ImageInputProps {
  onChange?: (file: File | null) => void;
  accept?: string;
  /** Maximum size in bytes. */
  maxSize?: number;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  /** Name of a variant defined in the theme config (variants[name].imageInput.area). */
  themeVariant?: string;
  className?: string;
}

/** File input with a drag & drop area and a preview of the chosen image. */
export function ImageInput({
  onChange,
  accept = "image/*",
  maxSize,
  label,
  name,
  id,
  disabled,
  themeVariant,
  className = "",
}: ImageInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { currentColors } = useTheme();
  const area = useVariant("imageInput", themeVariant)("area");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  // Release the object URL when the preview changes or the component unmounts.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);

  const choose = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("The file must be an image.");
    if (maxSize && file.size > maxSize) {
      return setError(`The image must be smaller than ${(maxSize / 1024 / 1024).toFixed(1)} MB.`);
    }
    setError("");
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    onChange?.(file);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setError("");
    onChange?.(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files[0];
    if (file && inputRef.current) {
      // Keep the native input in sync so the file is submitted with the form.
      const transfer = new DataTransfer();
      transfer.items.add(file);
      inputRef.current.files = transfer.files;
    }
    choose(file);
  };

  return (
    <Field label={label} htmlFor={inputId} themeVariant={themeVariant} className={className}>
      <div className="mb-4 last:mb-0">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => choose(event.target.files?.[0])}
        />
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={label ?? "Upload an image"}
          aria-disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cx(
            "relative flex min-h-36 flex-col items-center justify-center gap-2 overflow-hidden",
            "rounded-md border-2 border-dashed p-4 text-center text-sm transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
            area.className,
          )}
          style={{
            color: currentColors.text,
            borderColor: dragging || preview ? currentColors.primary : currentColors.border,
            backgroundColor: dragging
              ? "color-mix(in srgb, var(--theme-primary) 10%, transparent)"
              : "transparent",
            ...area.style,
          }}
        >
          {preview ? (
            <>
              <img
                src={preview.url}
                alt={`Preview of ${preview.name}`}
                className="max-h-48 max-w-full rounded-md object-contain"
              />
              <span className="max-w-full truncate opacity-70">{preview.name}</span>
              <button
                type="button"
                aria-label="Remove image"
                onClick={(event) => {
                  event.stopPropagation();
                  clear();
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white cursor-pointer hover:bg-black/80"
              >
                <CloseIcon size={14} />
              </button>
            </>
          ) : (
            <>
              <UploadIcon size={28} className="opacity-60" />
              <span>
                <strong style={{ color: currentColors.primary }}>Click to upload</strong> or drag and
                drop an image
              </span>
            </>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-1 text-sm" style={{ color: alertColors.error.color }}>
            {error}
          </p>
        )}
      </div>
    </Field>
  );
}

export default ImageInput;
