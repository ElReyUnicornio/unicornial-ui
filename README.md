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

### Feedback
- `Alert` — tarjeta con icono y texto | variantes: info, success, warning, error
- `Modal` — ventana modal con cabecera (título y botón de cierre) | props: `title`, `onClose`
- `AlertDialog` — pop-up de alerta con icono centrado y botones según la variante | variantes: info, success (Accept), warning (Cancel/Continue), error (Close/Retry)
- `Toast` — notificación flotante con icono, mensaje y botón de cierre | colores: info, success, warning, error
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
- `showModal(title, child, onClose?)` — muestra un `Modal` (también acepta `showModal(title, onClose, child)`)
- `showAlert(type, message)` — muestra un `AlertDialog` y devuelve una promesa (`true` al confirmar, `false` al rechazar o cerrar) con `.onConfirm(cb)` y `.onReject(cb)` encadenables
- `showToast(message, color, onClick?, duration?)` — muestra un `Toast` (se cierra a los 4 s; `duration = 0` lo mantiene abierto)

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

### Utilidades
- `ThemeProvider` / `useTheme` / `themeConfig` — configuración del tema
- `MobileOnly` / `DesktopOnly` — renderizado condicional por tamaño de pantalla
- `Validate` / `validators` — constructor de validaciones encadenables
- `useDebounce` — hook de debounce
