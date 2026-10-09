export interface ValidationResult {
  valid: boolean;
  message: string;
}

export type Validator = (value: unknown) => ValidationResult;

export const validators: Record<string, (...args: any[]) => Validator> = {
  required:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return str.trim() !== ""
        ? { valid: true, message: "" }
        : { valid: false, message: message || "Este campo es obligatorio" };
    },
  // Numbers ---------------------------------------------------------------------------------------------------------
  onlyNumbers:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return /^\d+$/.test(str)
        ? { valid: true, message: "" }
        : { valid: false, message: message || "Debe contener solo números" };
    },
  min:
    (n: number, message: string) =>
    (value: unknown): ValidationResult => {
      if (isNaN(n)) {
        throw new Error("El valor debe ser un número");
      }

      const num = Number(value);
      return num >= n
        ? { valid: true, message: "" }
        : { valid: false, message: message || `El valor debe ser mayor o igual a ${n}` };
    },
  max:
    (n: number, message: string) =>
    (value: unknown): ValidationResult => {
      if (isNaN(n)) {
        throw new Error("El valor debe ser un número");
      }
      const num = Number(value);
      return num <= n
        ? { valid: true, message: "" }
        : { valid: false, message: message || `El valor debe ser menor o igual a ${n}` };
    },
  positive:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const num = Number(value);
      return num > 0
        ? { valid: true, message: "" }
        : { valid: false, message: message || "El valor debe ser positivo" };
    },
  negative:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const num = Number(value);
      return num < 0
        ? { valid: true, message: "" }
        : { valid: false, message: message || "El valor debe ser negativo" };
    },
  integer:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const num = Number(value);
      return Number.isInteger(num)
        ? { valid: true, message: "" }
        : { valid: false, message: message || "El valor debe ser un número entero" };
    },
  round:
    () =>
    (value: unknown): ValidationResult => {
      const num = Number(value);
      return { valid: true, message: Math.round(num).toString() };
    },
  truncate:
    () =>
    (value: unknown): ValidationResult => {
      const num = Number(value);
      return { valid: true, message: Math.trunc(num).toString() };
    },
  toFixed:
    (n: number) =>
    (value: unknown): ValidationResult => {
      if (isNaN(n)) {
        throw new Error("El valor debe ser un número");
      }
      const num = Number(value);
      return { valid: true, message: num.toFixed(n) };
    },
  // Strings ---------------------------------------------------------------------------------------------------------
  email:
    (message: string) =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return re.test(str)
        ? { valid: true, message: "" }
        : { valid: false, message: message || "Correo invalido" };
    },
  minLength:
    (n: number, message: string) =>
    (value: unknown): ValidationResult => {
      if (isNaN(n)) {
        throw new Error("El valor debe ser un número");
      }
      const str = String(value ?? "");
      return str.length >= n
        ? { valid: true, message: "" }
        : { valid: false, message: message || `El valor debe tener al menos ${n} caracteres` };
    },
  maxLength:
    (n: number, message: string) =>
    (value: unknown): ValidationResult => {
      if (isNaN(n)) {
        throw new Error("El valor debe ser un número");
      }
      const str = String(value ?? "");
      return str.length <= n
        ? { valid: true, message: "" }
        : { valid: false, message: message || `El valor debe tener como máximo ${n} caracteres` };
    },
  lowercase:
    () =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return { valid: true, message: str.toLowerCase() };
    },
  uppercase:
    () =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return { valid: true, message: str.toUpperCase() };
    },
  regex:
    (pattern: RegExp, message: string) =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return pattern.test(str)
        ? { valid: true, message: "" }
        : { valid: false, message: message || "El valor no coincide con el patrón" };
    },
  trim:
    () =>
    (value: unknown): ValidationResult => {
      const str = String(value ?? "");
      return { valid: true, message: str.trim() };
    },
  // dates ---------------------------------------------------------------------------------------------------------
  minDate:
    (date: Date, message: string) =>
    (value: unknown): ValidationResult => {
      const inputDate = new Date(String(value ?? ""));
      return inputDate >= date
        ? { valid: true, message: "" }
        : {
            valid: false,
            message: message || `La fecha debe ser posterior a ${date.toLocaleDateString()}`,
          };
    },
  maxDate:
    (date: Date, message: string) =>
    (value: unknown): ValidationResult => {
      const inputDate = new Date(String(value ?? ""));
      return inputDate <= date
        ? { valid: true, message: "" }
        : {
            valid: false,
            message: message || `La fecha debe ser anterior a ${date.toLocaleDateString()}`,
          };
    },
};
