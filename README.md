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
- `Alert` — tarjeta con icono y texto | variantes: info, warning, error

### Utilidades
- `ThemeProvider` / `useTheme` / `themeConfig` — configuración del tema
- `MobileOnly` / `DesktopOnly` — renderizado condicional por tamaño de pantalla
- `Validate` / `validators` — constructor de validaciones encadenables
- `useDebounce` — hook de debounce
