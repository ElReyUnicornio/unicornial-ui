import { useId, useRef, useState } from "react";
import { Dropdown } from "./Dropdown";
import { Field, FOCUS_RING, useFieldStyles, type FieldVariant } from "./Field";
import { Slider } from "./Slider";
import Tabs from "./Tab";
import { useControllable } from "../hooks/useControllable";
import { cx, useVariant } from "../theme/variants";
import {
  channelsOf,
  channelsToCss,
  channelsToHex,
  formatColor,
  hexToChannels,
  normalizeHex,
  type ColorFormat,
  type ColorSpace,
} from "../utils/color";
import { clamp } from "../utils/number";

export interface ColorPickerProps {
  /** Color as #rrggbb. */
  value?: string;
  defaultValue?: string;
  /** Always receives the color as #rrggbb, whatever `format` is. */
  onChange?: (hex: string) => void;
  /** How the code is displayed in the button. */
  format?: ColorFormat;
  label?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  variant?: FieldVariant;
  /** Name of a variant defined in the theme config (variants[name].colorPicker.* and input.*). */
  themeVariant?: string;
  className?: string;
}

const SPACES: ColorSpace[] = ["rgb", "hsl", "oklch"];
const STEPS = 12;

type Triple = [number, number, number];

export function ColorPicker({
  value,
  defaultValue = "#aa3bff",
  onChange,
  format = "hex",
  label,
  name,
  id,
  disabled,
  variant = "default",
  themeVariant,
  className = "",
}: ColorPickerProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const styles = useFieldStyles(themeVariant, variant);
  const swatch = useVariant("colorPicker", themeVariant)("swatch");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [color, setColor] = useControllable(value, normalizeHex(defaultValue) ?? "#000000", onChange);
  const [open, setOpen] = useState(false);
  const [spaceIndex, setSpaceIndex] = useState(0);
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  // Exact channels last edited, so e.g. the hue is not lost when saturation is 0.
  const [local, setLocal] = useState<{ space: ColorSpace; channels: Triple; hex: string } | null>(null);

  const hex = normalizeHex(color) ?? "#000000";
  const space = SPACES[spaceIndex];
  const channels: Triple =
    local && local.space === space && local.hex === hex ? local.channels : hexToChannels(hex, space);

  const update = (index: number, next: number) => {
    const updated = channels.map((c, i) => (i === index ? next : c)) as Triple;
    const nextHex = channelsToHex(space, updated);
    setLocal({ space, channels: updated, hex: nextHex });
    setHexDraft(null);
    setColor(nextHex);
  };

  const gradient = (index: number) => {
    const { min, max } = channelsOf[space][index];
    const stops = Array.from({ length: STEPS + 1 }, (_, i) => {
      const sample = channels.map((c, j) => (j === index ? min + ((max - min) * i) / STEPS : c)) as Triple;
      return channelsToCss(space, sample);
    });
    return `linear-gradient(to right, ${stops.join(", ")})`;
  };

  return (
    <Field label={label} htmlFor={triggerId} themeVariant={themeVariant} className={className}>
      <div className="mb-4 last:mb-0">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cx(
            "flex w-full items-center gap-2 text-left sm:text-sm cursor-pointer",
            "disabled:opacity-50 disabled:pointer-events-none",
            styles.fieldClass,
            FOCUS_RING,
          )}
          style={styles.fieldStyle}
        >
          <span
            aria-hidden="true"
            className={cx("w-5 h-5 rounded-md border shrink-0", swatch.className)}
            style={{ backgroundColor: hex, borderColor: "rgba(0, 0, 0, 0.2)", ...swatch.style }}
          />
          <span className="font-mono">{formatColor(hex, format)}</span>
        </button>
        {name && <input type="hidden" name={name} value={hex} />}
        <Dropdown
          anchorRef={triggerRef}
          open={open}
          onClose={() => setOpen(false)}
          role="dialog"
          themeVariant={themeVariant}
          className="w-72 p-3"
          style={{ width: "18rem" }}
        >
          <div
            className="h-10 rounded-md border mb-2"
            style={{ backgroundColor: hex, borderColor: "rgba(0, 0, 0, 0.2)" }}
          />
          <Tabs variant="underline" themeVariant={themeVariant} onChange={setSpaceIndex}>
            {SPACES.map((s) => (
              <Tabs.Item key={s}>{s.toUpperCase()}</Tabs.Item>
            ))}
          </Tabs>
          <div className="mt-2">
            {channelsOf[space].map((channel, index) => (
              <div key={channel.label} className="flex items-center gap-2">
                <span className="w-4 text-xs font-bold">{channel.label}</span>
                <Slider
                  className="flex-1"
                  min={channel.min}
                  max={channel.max}
                  step={channel.step}
                  value={clamp(channels[index], channel.min, channel.max)}
                  onChange={(next) => update(index, next)}
                  trackBackground={gradient(index)}
                  themeVariant={themeVariant}
                  label={undefined}
                />
                <span className="w-12 text-right font-mono text-xs">
                  {Number(channels[index].toFixed(channel.step < 1 ? (channel.step < 0.01 ? 3 : 1) : 0))}
                </span>
              </div>
            ))}
          </div>
          <input
            aria-label="Hex code"
            spellCheck={false}
            value={hexDraft ?? hex}
            onChange={(event) => {
              setHexDraft(event.target.value);
              const parsed = normalizeHex(event.target.value);
              if (parsed) {
                setLocal(null);
                setColor(parsed);
              }
            }}
            onBlur={() => setHexDraft(null)}
            className={cx("mt-1 w-full font-mono sm:text-sm", styles.fieldClass, FOCUS_RING)}
            style={styles.fieldStyle}
          />
        </Dropdown>
      </div>
    </Field>
  );
}

export default ColorPicker;
