---
name: unicornial-ui
description: Use when building or editing a React UI with the unicornial-ui component library (imports from "unicornial-ui"): setting up ThemeProvider and unicornialConfig, using its components (Button, Input, Select, Form, Modal, Drawer, Tabs, Sidebar...), forms with Validate, the imperative helpers showModal/showAlert/showToast, themeVariant looks like glass, dark mode, or the get/post HTTP wrappers. Also use when the user asks how to use, theme or extend unicornial-ui.
---

# Using unicornial-ui

A React + Tailwind CSS component library. Peer deps: React 18 or 19. No runtime dependencies. Everything public is exported from the package root (`import { Button } from "unicornial-ui"`); never deep-import from `src/`. When unsure about a prop, read the typed export (`*Props`) in `src/index.ts` and the component file instead of guessing.

## Setup

```tsx
import { ThemeProvider } from "unicornial-ui";

<ThemeProvider config={{ theme: { colors: { primary: "#0ea5e9" } }, env: { apiUrl: "https://api.example.com" } }}>
  <App />
</ThemeProvider>
```

- Importing the package already loads its CSS (the Tailwind build is bundled; the consumer does not need Tailwind). `unicornial-ui/style.css` is also exported.
- `ThemeProvider` is required for the floating helpers (`showModal`, `showToast`, `instantiate`...), because it mounts the portal `#unicornial-portal`, sets the `--theme-*` CSS variables and toggles the `dark` class on `<html>`. Components render without it using defaults, but nothing floats.
- `config` is a partial of `unicornialConfig`, which has two parts: `theme` (colors, dark, text, notifications, variants) and `env` (`apiUrl`). Both merge deeply with the defaults.

## Core rules

1. **Look comes from the theme, not from per-component styles.** Prefer `config.theme` and the `themeVariant` prop over ad-hoc `className`/`style`. Precedence: base styles < variant < your `className`/`style`; inline `style` beats Tailwind classes.
2. **`themeVariant="glass"`** (the only built-in extra look; it adapts to light and dark) is a prop on nearly every component, and the last argument of `showModal`/`showAlert`/`showToast`. Pass the same name to a whole screen for a coherent look. Define your own looks in `config.theme.variants`.
3. **Controlled or not.** Inputs accept `value` + `onChange` (controlled) or `defaultValue` (uncontrolled). Handlers receive the *value*, not the event: `Select`, `Switch`, `Slider`, `Spinner`, `RadioGroup`, `ColorPicker`, `DatePicker`, `FileInput`, `ImageInput` use `onChange(value)`. Plain `Input`, `TextArea`, `Password` use the normal DOM event.
4. **`name` adds a hidden input** so native forms submit the value.
5. **Don't rebuild what exists.** Use `Surface` for cards, `Dropdown` for any anchored panel, `showModal` for dialogs, `Field`/`useFieldStyles` for custom form fields.
6. Do not use the native `<dialog>` or add focus-trap/portal code for overlays; the library's overlays already handle focus, Escape and click-outside.

## Forms

Two layers. Plain components (`Input`, `Select`, ...) are controlled by you. The `Unicornial*` versions live inside `<Form>`: they keep their value in the form under `name`, register a `validator` and show its error message.

```tsx
import { Form, UnicornialInput, UnicornialSelect, UnicornialSwitch, Button, Validate, showToast } from "unicornial-ui";

<Form
  initialValues={{}}
  onSubmit={(values, hasErrors) => hasErrors ? showToast("Fix the fields", "error") : save(values)}
>
  <UnicornialInput name="email" label="Email" validator={Validate.email()} />
  <UnicornialSelect name="country" label="Country" options={[{ value: "mx", label: "Mexico" }]} validator={Validate.required()} />
  <UnicornialSwitch name="news" label="Newsletter" defaultChecked />
  <Button type="submit">Send</Button>
</Form>
```

- `name` is required on every `Unicornial*` field. Stored values: text/select/radio/date -> `string`, switch -> `boolean`, spinner/slider -> `number`, color -> `#rrggbb`, file -> `File[]`, image -> `File | null`.
- Submitting validates every field at once so each shows its own error; `onSubmit(values, hasErrors)` is always called, so check `hasErrors`.
- `Validate` chains: `Validate.required().minLength(6)`; also `email`, `maxLength`, `min`, `max`, `positive`, `integer`, `onlyNumbers`, `regex(pattern, message)`, `minDate`, `maxDate`, and transforms (`trim`, `lowercase`, `uppercase`, `round`, `toFixed`). Default error messages are in Spanish; use `regex(pattern, "your message")` for a custom one.
- `UnicornialTextArea` and `UnicornialInput` validate with a debounce (`debounce`, 300 ms by default). `useForm()` gives `values`, `setValues`, `reset`, `submitCount`.
- Build your own connected field with `useFormField(name, validator, fallback)`.

## Imperative helpers (work anywhere, also outside React)

```tsx
showModal("Title", <p>Content</p>, onClose?, themeVariant?);        // also showModal(title, onClose, child)
showDrawer("Title", <p>Content</p>, onClose?, themeVariant?, "left"); // left | right | top | bottom
showAlert("warning", "Sure?").onConfirm(remove).onReject(keep);      // thenable: resolves true/false
showToast("Saved", "success", onClick?, 4000, themeVariant?);        // duration 0 keeps it open
const box = instantiate(({ close, update }) => <MyDialog onDone={close} />); // custom content, returns { id, close, update }
```

- Alert types and toast colors: `info | success | warning | error`.
- `showModal` and `showDrawer` already close themselves on the close button, Escape and a click on the backdrop.
- Toast position comes from `config.theme.notifications.position` (`top-right` by default).

## Theming

- Colors: `theme.colors` and `theme.dark.colors` (`primary`, `secondary`, `text`, `background`, `border`, `header.{background,border}`). Toggle dark with `useTheme().setDarkMode(true)` or `config.theme.dark.enabled`.
- `useTheme()` returns the `theme` values, `env`, `currentColors` (active mode) and setters: `setColors`, `setDark`, `setDarkMode`, `setText`, `setNotifications`, `setVariant`, `setTheme`, `setEnv`.
- Text classes: `useTheme().text.{title,subtitle,paragraph}` are Tailwind class strings you can reuse for consistent headings.
- Variants: `variants[name][component][part] = { className?, style? }`. Component and part names are typed (`ComponentParts`), so a typo is a TypeScript error. See [references/components.md](references/components.md) for the part list.

```tsx
<ThemeProvider config={{ theme: { variants: { flat: { input: { field: { style: { borderRadius: 0 } } } } } } }}>
  <Input themeVariant="flat" label="User" />
</ThemeProvider>
```

- CSS variables you can use inside variant styles: `--theme-primary`, `--theme-secondary`, `--theme-text`, `--theme-background`, `--theme-border`, `--theme-primary-gradient`, `--theme-soft`, and `--alert-color`/`--alert-bg`/`--alert-border` inside `alert` and `toast`. Tailwind utilities `bg-accent`, `text-text`, `border-border`, `bg-hover` also follow the active theme.
- Tailwind classes put in the config only work if the library CSS or your own Tailwind build contains them; prefer `style` for values that must always apply.

## HTTP wrappers

`get`, `post`, `put`, `patch`, `del` `(route, data?, requireAuth?)`. They prefix `env.apiUrl`, send JSON, put `data` in the query string for GET/DELETE, add `Authorization: Bearer <localStorage.token>` when `requireAuth` is true, and throw `HttpError` (`status`, `body`) on non-2xx.

## Gotchas

- `Tooltip` and `Dropdown` are anchored: pass `anchorRef` (a ref to the trigger) and control `open` yourself. `Tooltip` is not shown on hover automatically; wire `onMouseEnter/Leave` and `onFocus/Blur`.
- `Tabs` renders only the tab strip: keep the selected index with `onChange(index)` and render the panel yourself.
- `Header` is positioned (`absolute`/`sticky`, 4rem tall): give the content below it top padding (`pt-16`). `Sidebar` needs a parent with a height (`h-full`/`h-screen`).
- `Select` is a custom listbox, not a native `<select>`; options are `{ value, label, disabled? }`.
- `MobileOnly`/`DesktopOnly` switch on orientation (portrait vs landscape), not on a width breakpoint. Use `useMediaQuery(query)` for width queries.
- A `ThemeProvider` per app is enough; nest one only to scope a different config.

For the component catalog (props per component and the variant parts), read [references/components.md](references/components.md).
