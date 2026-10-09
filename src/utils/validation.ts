import { validators, type ValidationResult, type Validator } from "./validators";

export class Validate {
  private checks: Validator[] = [];

  private add(fn: Validator): this {
    this.checks.push(fn);
    return this;
  }

  static required(): Validate {
    return new Validate().add(validators.required());
  }

  // Numbers ---------------------------------------------------------------------------------------------------------
  static onlyNumbers(): Validate {
    return new Validate().onlyNumbers();
  }

  static min(n: number): Validate {
    return new Validate().min(n);
  }

  static max(n: number): Validate {
    return new Validate().max(n);
  }

  static positive(): Validate {
    return new Validate().add(validators.positive());
  }

  static negative(): Validate {
    return new Validate().add(validators.negative());
  }

  static integer(): Validate {
    return new Validate().add(validators.integer());
  }

  static round(): Validate {
    return new Validate().add(validators.round());
  }

  static truncate(): Validate {
    return new Validate().add(validators.truncate());
  }

  static toFixed(n: number): Validate {
    return new Validate().add(validators.toFixed(n));
  }

  // Strings ---------------------------------------------------------------------------------------------------------
  static email(): Validate {
    return new Validate().email();
  }

  static minLength(n: number): Validate {
    return new Validate().minLength(n);
  }

  static maxLength(n: number): Validate {
    return new Validate().maxLength(n);
  }

  static lowercase(): Validate {
    return new Validate().add(validators.lowercase());
  }

  static uppercase(): Validate {
    return new Validate().add(validators.uppercase());
  }

  static trim(): Validate {
    return new Validate().add(validators.trim());
  }

  static regex(pattern: RegExp, message?: string): Validate {
    return new Validate().add(validators.regex(pattern, message || "Valor inválido"));
  }

  // dates ---------------------------------------------------------------------------------------------------------
  static minDate(date: Date): Validate {
    return new Validate().add(validators.minDate(date));
  }

  static maxDate(date: Date): Validate {
    return new Validate().add(validators.maxDate(date));
  }

  // Instance methods -----------------------------------------------------------------------------------------------
  required(): this {
    return this.add(validators.required());
  }

  // Numbers ---------------------------------------------------------------------------------------------------------
  onlyNumbers(): this {
    return this.add(validators.onlyNumbers());
  }

  min(n: number): this {
    return this.add(validators.min(n));
  }

  max(n: number): this {
    return this.add(validators.max(n));
  }

  positive(): this {
    return this.add(validators.positive());
  }

  negative(): this {
    return this.add(validators.negative());
  }

  integer(): this {
    return this.add(validators.integer());
  }

  round(): this {
    return this.add(validators.round());
  }

  truncate(): this {
    return this.add(validators.truncate());
  }

  toFixed(n: number): this {
    return this.add(validators.toFixed(n));
  }

  // Strings ---------------------------------------------------------------------------------------------------------
  email(): this {
    return this.add(validators.email());
  }

  minLength(n: number): this {
    return this.add(validators.minLength(n));
  }

  maxLength(n: number): this {
    return this.add(validators.maxLength(n));
  }

  lowercase(): this {
    return this.add(validators.lowercase());
  }

  uppercase(): this {
    return this.add(validators.uppercase());
  }

  trim(): this {
    return this.add(validators.trim());
  }

  regex(pattern: RegExp, message?: string): this {
    return this.add(validators.regex(pattern, message || "Valor inválido"));
  }

  // dates ---------------------------------------------------------------------------------------------------------
  minDate(date: Date): this {
    return this.add(validators.minDate(date));
  }

  maxDate(date: Date): this {
    return this.add(validators.maxDate(date));
  }

  // checks validations
  validate(value: unknown, onTransform?: (v: unknown) => unknown): ValidationResult {
    let tmpValue = value;
    for (const check of this.checks) {
      const result = check(tmpValue);
      if (!result.valid) {
        return result;
      }
      if (result.message) {
        tmpValue = result.message;
        if (onTransform) {
          tmpValue = onTransform(tmpValue);
        }
      }
    }
    return { valid: true, message: "" };
  }
}

export default Validate;
