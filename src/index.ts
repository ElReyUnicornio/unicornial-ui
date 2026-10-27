import "./index.css";

// components
export { default as Header } from "./components/Header";
export { default as Background } from "./components/Background";
export { default as Separator } from "./components/Separator";
export { ThemeProvider, useTheme, themeConfig } from "./theme/ThemeProvider";

//Layout
export { Surface } from "./components/Surface";
export { default as Tabs } from "./components/Tab";

export { Alert } from "./components/Alert";
export { Modal } from "./components/Modal";
export { AlertDialog } from "./components/AlertDialog";

//forms
export { Form, useForm } from "./components/Form";
export { Input } from "./components/Input";
export { UnicornialInput } from "./components/UnicornialInput";
export { Button } from "./components/Button";

//utils
export { MobileOnly } from "./components/Mobile";
export { DesktopOnly } from "./components/Desktop";
export { instantiate } from "./utils/portal";
export { showModal, showAlert } from "./utils/dialogs";
export type { AlertHandle } from "./utils/dialogs";
export type { Instance, InstanceApi, InstanceContent } from "./utils/portal";
export { Validate } from "./utils/validation";
export { validators } from "./utils/validators";
export { useDebounce } from "./hooks/useDebounce";
