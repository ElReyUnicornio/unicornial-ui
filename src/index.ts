import "./index.css";

// components
export { default as Header } from "./components/Header";
export { default as Background } from "./components/Background";
export { default as Separator } from "./components/Separator";
export { ThemeProvider, useTheme, themeConfig, unicornialConfig } from "./theme/ThemeProvider";
export { useVariant } from "./theme/variants";
export type {
  UnicornialConfig,
  EnvConfig,
  ThemeConfig,
  ThemeColors,
  ComponentParts,
  ThemeVariant,
  ComponentName,
  StyleDef,
  NotificationPosition,
} from "./theme/types";

//Layout
export { Surface } from "./components/Surface";
export { default as Tabs } from "./components/Tab";
export { default as Accordion } from "./components/Accordion";
export { default as Sidebar } from "./components/Sidebar";
export { Gestures } from "./components/Gestures";

//feedback
export { Alert } from "./components/Alert";
export type { AlertVariant } from "./components/Alert";
export { Modal } from "./components/Modal";
export { Drawer } from "./components/Drawer";
export type { DrawerSide } from "./components/Drawer";
export { AlertDialog } from "./components/AlertDialog";
export { Toast } from "./components/Toast";
export type { ToastColor } from "./components/Toast";
export { Tooltip } from "./components/Tooltip";
export { Dropdown } from "./components/Dropdown";
export type { TooltipPosition } from "./components/Tooltip";

//forms
export { Form, useForm } from "./components/Form";
export { Input } from "./components/Input";
export { UnicornialInput } from "./components/UnicornialInput";
export { Button } from "./components/Button";
export { Password } from "./components/Password";
export { TextArea } from "./components/TextArea";
export { Select } from "./components/Select";
export type { SelectOption } from "./components/Select";
export { Switch } from "./components/Switch";
export { Spinner } from "./components/Spinner";
export { Slider } from "./components/Slider";
export { Radio, RadioGroup } from "./components/Radio";
export type { RadioOption } from "./components/Radio";
export { ColorPicker } from "./components/ColorPicker";
export { DatePicker } from "./components/DatePicker";
export { FileInput } from "./components/FileInput";
export { ImageInput } from "./components/ImageInput";
export { ProgressBar } from "./components/ProgressBar";
export {
  UnicornialPassword,
  UnicornialTextArea,
  UnicornialSelect,
  UnicornialSwitch,
  UnicornialSpinner,
  UnicornialSlider,
  UnicornialRadioGroup,
  UnicornialColorPicker,
  UnicornialDatePicker,
  UnicornialFileInput,
  UnicornialImageInput,
} from "./components/UnicornialFields";

//utils
export { get, post, put, patch, del, HttpError, setApiUrl } from "./utils/http";
export { MobileOnly } from "./components/Mobile";
export { DesktopOnly } from "./components/Desktop";
export { instantiate } from "./utils/portal";
export { showModal, showAlert, showDrawer } from "./utils/dialogs";
export { showToast } from "./utils/toasts";
export type { ToastHandle } from "./utils/toasts";
export type { AlertHandle } from "./utils/dialogs";
export type { Instance, InstanceApi, InstanceContent } from "./utils/portal";
export { Validate } from "./utils/validation";
export { validators } from "./utils/validators";
export { useDebounce } from "./hooks/useDebounce";
