# unicornial-ui component catalog

Every prop type is exported as `<Name>Props` from the package root. `themeVariant` (string) is accepted by almost every component. Variant parts are typed by `ComponentParts`.

## Layout

| Component | Key props | Variant parts |
|---|---|---|
| `Surface` | div props | `surface.root` |
| `Header` (+ `Header.Logo`, `Header.NavButton`) | `behaviour`: default \| sticky \| hide, `variant`: default \| blur; Logo: `src`, `darkSrc`, `alt`, `title` | `header.{root,navButton}` |
| `Background` | `variant`: dots-grid \| dots-isometric \| grid \| diamond \| grid-45 \| lines, `mask`: none \| fade-in \| fade-out, `color`, `size` | none |
| `Separator` | `variant`: line \| point, `orientation`, `color`, `thickness`, `spacing` | `separator.root` |
| `Tabs` (+ `Tabs.Item`) | `variant`: underline \| pills, `orientation`, `onChange(index)` | `tab.{root,selected}` |
| `Accordion` (+ `Accordion.Item`) | `type`: single \| multiple, `value`/`defaultValue` (string[]), `onValueChange`; item: `value`, `title`, `disabled` | `accordion.{root,item,header,body}` |
| `Sidebar` (+ `.Header`, `.Button`) | `collapsed`/`defaultCollapsed`, `onCollapsedChange`; Header: `title`, `collapsible`; Button: `icon`, `active` | `sidebar.{root,header,button}` |
| `Footer` (+ `.Brand`, `.Column`, `.Link`) | Brand: `logo`, `title`; Column: `title`; Link: `href`, or `as` + `to` for a router link | `footer.{root,column,title,link}` |
| `Wireframe` (+ `.Row`, `.Block`) | Block: `shape`: text \| box \| pill, `tone`: outline \| fill, `width`, `height`; hidden from screen readers by default | `wireframe.{root,block}` |
| `Gestures` | `onTap`, `onDoubleTap`, `onSwipeLeft/Right/Up/Down`, `swipeThreshold`, `doubleTapDelay`, `tapMaxMove` | none |

## Forms (plain, controlled by you)

| Component | Key props | Variant parts |
|---|---|---|
| `Button` | `variant`: primary \| secondary \| outline \| ghost, `size`: sm \| md \| lg | `button.{root,primary,secondary,outline,ghost}` |
| `Input`, `Password`, `TextArea` | native props, `label`, `variant`: default \| filled \| underline; Input: `endAdornment` | `input.{root,label,field}` |
| `Select` | `options`, `value`/`defaultValue`, `onChange(value)`, `placeholder`, `aria-label` | `select.{option,optionActive}` + `input.*` |
| `Switch` | `checked`/`defaultChecked`, `onChange(checked)`, `label` | `switch.{track,thumb}` |
| `Spinner` | `value`, `min`, `max`, `step`, `onChange(number)` | `spinner.button` + `input.*` |
| `Slider` | `value`, `min`, `max`, `step`, `showValue`, `formatValue`, `trackBackground`, `onChange(number)` | `slider.{track,fill,thumb}` |
| `Radio`, `RadioGroup` | Group: `options`, `value`, `onChange(value)`, `orientation` | `radio.{control,dot}` |
| `ColorPicker` | `value` (#rrggbb), `format`: hex \| rgb \| hsl \| oklch (display only), `onChange(hex)` | `colorPicker.swatch` + `input.*` |
| `DatePicker` | `value` (YYYY-MM-DD), `format` (tokens YYYY, YY, MMMM, MMM, MM, M, DD, D), `locale`, `weekStartsOn`, `min`, `max`, `onChange(date)` | `datePicker.{day,daySelected}` + `input.*` |
| `FileInput` | `accept`, `multiple`, `onChange(files)` | `input.*` |
| `ImageInput` | `accept`, `maxSize` (bytes), `onChange(file \| null)` (drag & drop + preview) | `imageInput.area` |
| `ProgressBar` | `value`, `max`, `label`, `showValue`, `indeterminate` | `progressBar.{track,bar}` |

Connected versions (inside `<Form>`, need `name`): `UnicornialInput`, `UnicornialPassword`, `UnicornialTextArea`, `UnicornialSelect`, `UnicornialSwitch`, `UnicornialSpinner`, `UnicornialSlider`, `UnicornialRadioGroup`, `UnicornialColorPicker`, `UnicornialDatePicker`, `UnicornialFileInput`, `UnicornialImageInput`. They take the base props plus `name` and `validator`.

Custom fields: `Field` (label wrapper), `useFieldStyles(themeVariant, variant)`, `FOCUS_RING`, `FieldError`, `LabelWithValue`, `useControllable`, `useFormField`.

## Feedback and overlays

| Component | Key props | Variant parts |
|---|---|---|
| `Alert` | `variant`: info \| success \| warning \| error | `alert.root` |
| `Modal` | `title`, `onClose` | `modal.{backdrop,container,header,title,body}` |
| `Drawer` | `title`, `side`, `onClose` | `drawer.{backdrop,container,header,title,body}` |
| `AlertDialog` | `variant`, `message`, `onConfirm`, `onReject` | `alertDialog.{backdrop,container,icon,message}` |
| `Toast` | `color`, `message`, `onClose` | `toast.root` |
| `Tooltip` | `anchorRef`, `position`: top \| bottom \| left \| right, `arrow`, `open` | `tooltip.{root,arrow}` |
| `Dropdown` | `anchorRef`, `open`, `onClose`, `position`, `align`: start \| center \| end, `matchWidth` | `dropdown.root` |

`Modal`, `Drawer`, `AlertDialog` and `Toast` are normally opened with the imperative helpers instead of rendering them by hand. Use the components directly only inside `instantiate`.

## Hooks and utilities

- Hooks: `useTheme`, `useVariant`, `useForm`, `useFormField`, `useControllable`, `useDebounce`, `useMediaQuery`, `useEscape`, `useFocusTrap`.
- Validation: `Validate` (chainable), `validators`, types `ValidationResult`, `Validator`.
- HTTP: `get`, `post`, `put`, `patch`, `del`, `HttpError`, `setApiUrl`.
- Color helpers: `hexToRgb`, `hexToRgba`, `rgbToHex`, `rgbToHsl`, `hslToRgb`, `rgbToOklch`, `oklchToRgb`, `formatColor`, `contrastRatio`, `normalizeHex`.
- Date helpers (YYYY-MM-DD strings): `toIso`, `parseIso`, `todayIso`, `daysInMonth`, `formatDate`.
- Misc: `cx(...classes)`, `MobileOnly`, `DesktopOnly`, `instantiate`.
