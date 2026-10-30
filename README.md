# unicornial-ui

Librería de componentes React + Tailwind CSS

## Instalación

```bash
npm install unicornial-ui
# o
pnpm add unicornial-ui
```

## Uso

```tsx
import { Button } from "unicornial-ui";

function App() {
  return <Button variant="primary">Hola mundo</Button>;
}
```

## Componentes

### Layout
- `Surface` — contenedor con borde, sombra y colores del tema
- `Header` — barra superior con `Header.Logo` | comportamiento: default, sticky, hide | variantes: default, blur
- `Background` — fondo decorativo | variantes: dots-grid, dots-isometric, grid, diamond, grid-45, lines | máscara: none, fade-in, fade-out
- `Separator` — divisor | variantes: line, point | orientación: horizontal, vertical
- `Tabs` — pestañas con `Tabs.Item` y callback `onChange` | variantes: underline, pills | orientación: horizontal, vertical

### Formularios
- `Form` / `useForm` — contexto de formulario con validación
- `Input` — variantes: default, filled, underline
- `UnicornialInput` — input con validación integrada (`validator`) y `debounce` | variantes: default, filled, underline
- `Button` — variantes: primary, secondary, outline, ghost | tamaños: sm, md, lg
- `Password` — input de contraseña con botón para mostrar u ocultar el texto (`UnicornialInput type="password"` lo usa automáticamente)
- `TextArea` — área de texto con etiqueta
- `Select` — select personalizado (sin `<select>` nativo) que usa `Dropdown` | props: `options` (`{ value, label, disabled? }`), `value`/`defaultValue`, `onChange(value)`, `placeholder`; navegación con teclado
- `Switch` — interruptor | props: `checked`/`defaultChecked`, `onChange(checked)`, `label`
- `Spinner` — input numérico con botones − y + | props: `value`/`defaultValue`, `min`, `max`, `step`, `onChange(number)`
- `Slider` — control deslizante | props: `min`, `max`, `step`, `showValue`, `onChange(number)`
- `Radio` / `RadioGroup` — botones de radio | `RadioGroup` props: `options`, `value`/`defaultValue`, `onChange(value)`, `orientation`
- `ColorPicker` — botón con el color y su código; abre un `Dropdown` con pestañas RGB, HSL y OKLCH | props: `value`/`defaultValue`, `format` (hex, rgb, hsl, oklch: solo cambia lo que se muestra), `onChange(hex)` (siempre `#rrggbb`)
- `DatePicker` — botón con la fecha; abre un calendario | props: `value`/`defaultValue`, `format` (por defecto `YYYY-MM-DD`; tokens YYYY, YY, MMMM, MMM, MM, M, DD, D), `locale`, `weekStartsOn`, `min`, `max`, `onChange(date)` (siempre `YYYY-MM-DD`)
- `FileInput` — selector de archivos | props: `accept`, `multiple`, `onChange(files)`
- `ImageInput` — selector de imagen con zona para arrastrar y soltar y vista previa | props: `accept`, `maxSize` (bytes), `onChange(file | null)`
- `ProgressBar` — barra de progreso | props: `value`, `max`, `label`, `showValue`, `indeterminate`

Todos aceptan `label` y `themeVariant`, admiten uso controlado (`value` + `onChange`) o no controlado (`defaultValue`) y, si reciben `name`, incluyen un `<input>` oculto para formularios nativos. Los campos (`Input`, `Select`, `TextArea`, `Spinner`, `ColorPicker`, `DatePicker`, `FileInput`) comparten las partes `input.{root,label,field}` de las variantes del tema.

#### Versiones conectadas a `Form`
Igual que `UnicornialInput`, cada campo tiene una versión que guarda su valor en el `Form` bajo `name`, registra un `validator` y muestra el mensaje de error. Deben usarse dentro de un `<Form>`:

| Componente | Valor guardado en el formulario |
|---|---|
| `UnicornialPassword` | `string` (usa `UnicornialInput` con `type="password"`) |
| `UnicornialTextArea` | `string` (valida con `debounce`, 300 ms por defecto) |
| `UnicornialSelect` | `string` |
| `UnicornialSwitch` | `boolean` |
| `UnicornialSpinner` | `number` |
| `UnicornialSlider` | `number` |
| `UnicornialRadioGroup` | `string` |
| `UnicornialColorPicker` | `string` (`#rrggbb`) |
| `UnicornialDatePicker` | `string` (`YYYY-MM-DD`) |
| `UnicornialFileInput` | `File[]` |
| `UnicornialImageInput` | `File \| null` |

```tsx
<Form initialValues={{}} onSubmit={(values, hasErrors) => console.log(values, hasErrors)}>
  <UnicornialSelect name="country" label="País" options={countries} validator={Validate.required()} />
  <UnicornialDatePicker name="birthday" label="Nacimiento" format="DD/MM/YYYY" />
  <UnicornialSwitch name="newsletter" label="Newsletter" defaultChecked />
  <Button type="submit">Enviar</Button>
</Form>
```

Aceptan las mismas props que el componente base (`defaultValue`, `onChange`, `themeVariant`...) más `name` y `validator`; el valor inicial se añade a los valores del formulario al montarse. Si no se pasa `defaultValue`, se usa uno neutro (`""`, `false`, `0`/`min`...).

### Feedback
- `Alert` — tarjeta con icono y texto | variantes: info, success, warning, error
- `Modal` — ventana modal con cabecera (título y botón de cierre) | props: `title`, `onClose`
- `Drawer` — panel lateral con cabecera y botón de cierre | props: `title`, `side` (left, right, top, bottom), `onClose`
- `AlertDialog` — pop-up de alerta con icono centrado y botones según la variante | variantes: info, success (Accept), warning (Cancel/Continue), error (Close/Retry)
- `Toast` — notificación flotante con icono, mensaje y botón de cierre | colores: info, success, warning, error
- `Dropdown` — panel flotante anclado a un elemento (`anchorRef`) con contenido libre | props: `open`, `onClose` (clic fuera o Escape), `position`, `align` (start, center, end), `matchWidth`
- `Tooltip` — globo flotante anclado a un elemento (`anchorRef`) | props: `position` (top, bottom, left, right), `arrow`, `open` | se reposiciona solo (voltea al lado opuesto y se ajusta al borde de la pantalla)

```tsx
const ref = useRef<HTMLButtonElement>(null);
const [open, setOpen] = useState(false);

<Button ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
  Hover
</Button>
<Tooltip anchorRef={ref} position="top" arrow open={open}>
  Texto de ayuda
</Tooltip>
```

### Portal y funciones flotantes
`ThemeProvider` crea un portal en el `body` donde se renderizan todos los componentes flotantes (modales, alertas y toasts).

- `instantiate(content)` — renderiza cualquier componente en el portal; devuelve `{ id, close, update }`
- `showModal(title, child, onClose?, themeVariant?)` — muestra un `Modal` (también acepta `showModal(title, onClose, child)`)
- `showDrawer(title, child, onClose?, themeVariant?, side?)` — muestra un `Drawer`
- `showAlert(type, message, themeVariant?)` — muestra un `AlertDialog` y devuelve una promesa (`true` al confirmar, `false` al rechazar o cerrar) con `.onConfirm(cb)` y `.onReject(cb)` encadenables
- `showToast(message, color, onClick?, duration?, themeVariant?)` — muestra un `Toast` (se cierra a los 4 s; `duration = 0` lo mantiene abierto)

```tsx
import { showModal, showAlert, showToast } from "unicornial-ui";

showModal("Título", <p>Contenido</p>);

showAlert("warning", "¿Seguro?")
  .onConfirm(() => console.log("confirmado"))
  .onReject(() => console.log("rechazado"));

showToast("Guardado", "success", () => console.log("click"));
```

La posición de los toasts se configura en el tema (`notifications.position`): top-left, top, top-right, bottom-left, bottom, bottom-right. Por defecto: top-right.

```tsx
<ThemeProvider config={{ notifications: { position: "bottom" } }}>
```

### Tema
`ThemeProvider` acepta un `config` parcial que se mezcla con `themeConfig` (ver `src/theme/theme.config.json`):

```tsx
<ThemeProvider config={{ colors: { primary: "#0ea5e9" }, dark: { enabled: true } }}>
```

| Clave | Contenido |
|---|---|
| `colors` | `primary`, `secondary`, `text`, `background`, `border`, `header.{background,border}` |
| `dark` | `enabled` y `colors` (misma forma que `colors`) para el modo oscuro |
| `text` | clases Tailwind para `title`, `subtitle`, `paragraph` |
| `notifications` | `position` de los toasts |
| `variants` | estilos personalizados por componente (ver abajo) |
| `env` | reservado para variables de `.env` (vacío por ahora) |

`useTheme()` devuelve la configuración, `currentColors` (colores del modo activo) y los setters `setColors`, `setDark`, `setDarkMode`, `setText`, `setNotifications`, `setVariant` y `setTheme`.

#### Variantes
`variants[nombre][componente][parte]` es `{ className?, style? }` (clases Tailwind y/o CSS). Vienen `glass`, `neumorph` y `clay`; puedes añadir las tuyas o sobrescribir partes de las existentes:

```tsx
<ThemeProvider
  config={{
    variants: {
      flat: { input: { label: { className: "uppercase" }, field: { style: { borderRadius: 0 } } } },
    },
  }}
>
  <UnicornialInput themeVariant="flat" label="Usuario" name="user" />
  <Button themeVariant="glass">Cristal</Button>
</ThemeProvider>
```

- Se activan con la prop `themeVariant` (también como último argumento de `showModal`, `showAlert` y `showToast`). Orden de prioridad: estilos base < variante < props `className`/`style`.
- Componentes y partes: `surface.root`, `button.root`, `input.{root,label,field}`, `header.{root,navButton}`, `modal.{backdrop,container,header,title,body}`, `alertDialog.{backdrop,container,icon,message}`, `alert.root`, `toast.root`, `tooltip.{root,arrow}`, `tab.{root,selected}`, `separator.root`, `dropdown.root`, `select.{option,optionActive}`, `switch.{track,thumb}`, `spinner.button`, `slider.{track,fill,thumb}`, `radio.{control,dot}`, `progressBar.{track,bar}`, `imageInput.area`, `datePicker.{day,daySelected}`, `colorPicker.swatch`.
- Los estilos pueden usar las variables CSS del tema: `--theme-primary`, `--theme-secondary`, `--theme-text`, `--theme-background`, `--theme-border`, `--theme-soft`, `--theme-shadow-light`, `--theme-shadow-dark`; y `--alert-color`, `--alert-bg`, `--alert-border` en `alert` y `toast`.
- Si usas clases Tailwind en la configuración, los estilos en línea (`style`) ganan sobre las clases; para sobrescribir una clase base usa `style` o el modificador `!`.

### Utilidades
- `ThemeProvider` / `useTheme` / `themeConfig` — configuración del tema
- `MobileOnly` / `DesktopOnly` — renderizado condicional por tamaño de pantalla
- `Validate` / `validators` — constructor de validaciones encadenables
- `useDebounce` — hook de debounce

## Nuevos componentes y utilidades

- `Accordion` / `Accordion.Item` — secciones desplegables | props: `type` (single, multiple), `value`, `defaultValue`, `onValueChange`; en el item: `value`, `title`, `disabled`
- `Sidebar` / `Sidebar.Header` / `Sidebar.Button` — barra lateral colapsable | props: `collapsed`, `defaultCollapsed`, `onCollapsedChange`; botón: `icon`, `active`
- `Gestures` — detecta gestos dentro de su área | props: `onTap`, `onDoubleTap`, `onSwipeLeft/Right/Up/Down`, `swipeThreshold`, `doubleTapDelay`, `tapMaxMove`
- `get`, `post`, `put`, `patch`, `del` — wrappers de `fetch` `(route, data?, requireAuth?)`. Usan `env.apiUrl` del theme config; con `requireAuth` envían `Authorization: Bearer <localStorage.token>`; lanzan `HttpError` si la respuesta no es 2xx
