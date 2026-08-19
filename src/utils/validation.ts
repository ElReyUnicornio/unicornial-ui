export interface ValidationResult {
  valid: boolean;
  message: string;
}

export type Validator = (value: unknown) => ValidationResult;

const isNumericString = (v: unknown): v is string =>
  typeof v === "string" && v.trim() !== "" && !isNaN(Number(v));

const toNumber = (v: unknown): number | null => {
  if (typeof v === "number") return isNaN(v) ? null : v;
  if (isNumericString(v)) return Number(v);
  return null;
};

export const validators: Record<string, (...args: any[]) => Validator> = {
  email: () => (value: unknown): ValidationResult => {
    const str = String(value ?? "");
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(str)
      ? { valid: true, message: "" }
      : { valid: false, message: "El valor no es un correo válido" };
  },

  onlyNumbers: () => (value: unknown): ValidationResult => {
    const str = String(value ?? "");
    return /^\d+$/.test(str)
      ? { valid: true, message: "" }
      : { valid: false, message: "El valor debe contener solo números" };
  },

  min: (n: number) => (value: unknown): ValidationResult => {
    const num = toNumber(value);
    if (num !== null) {
      return num >= n
        ? { valid: true, message: "" }
        : { valid: false, message: `El valor debe ser mayor o igual a ${n}` };
    }
    const len = String(value ?? "").length;
    return len >= n
      ? { valid: true, message: "" }
      : { valid: false, message: `La longitud debe ser al menos ${n}` };
  },

  max: (n: number) => (value: unknown): ValidationResult => {
    const num = toNumber(value);
    if (num !== null) {
      return num <= n
        ? { valid: true, message: "" }
        : { valid: false, message: `El valor debe ser menor o igual a ${n}` };
    }
    const len = String(value ?? "").length;
    return len <= n
      ? { valid: true, message: "" }
      : { valid: false, message: `La longitud debe ser como máximo ${n}` };
  },
};

export class Validate {
  private checks: Validator[] = [];

  private add(fn: Validator): this {
    this.checks.push(fn);
    return this;
  }

  static email(): Validate {
    return new Validate().email();
  }

  static onlyNumbers(): Validate {
    return new Validate().onlyNumbers();
  }

  static min(n: number): Validate {
    return new Validate().min(n);
  }

  static max(n: number): Validate {
    return new Validate().max(n);
  }

  email(): this {
    return this.add(validators.email());
  }

  onlyNumbers(): this {
    return this.add(validators.onlyNumbers());
  }

  min(n: number): this {
    return this.add(validators.min(n));
  }

  max(n: number): this {
    return this.add(validators.max(n));
  }

  validate(value: unknown): ValidationResult {
    for (const check of this.checks) {
      const result = check(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true, message: "" };
  }
}

export default Validate;
