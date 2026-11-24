import "./index.css";

// components
export { default as Header } from "./components/Header";
export type { HeaderProps, HeaderLogoProps, HeaderNavButtonProps } from "./components/Header";
export { default as Background } from "./components/Background";
export type { BackgroundProps } from "./components/Background";
export { default as Separator } from "./components/Separator";
export type { SeparatorProps } from "./components/Separator";
export { ThemeProvider, useTheme, themeConfig, unicornialConfig } from "./theme/ThemeProvider";
export { useVariant, cx } from "./theme/variants";
export type {
  UnicornialConfig,
  EnvConfig,
  ThemeConfig,
  ThemeColors,
  ThemeDark,
  ThemeText,
  ThemeNotifications,
  ThemeContextValue,
  ThemeProviderProps,
  ComponentParts,
  ComponentVariant,
  ThemeVariant,
  ComponentName,
  StyleDef,
  NotificationPosition,
} from "./theme/types";
export type { DeepPartial } from "./utils/typeUtils";

//Layout
export { Footer } from "./components/Footer";
export type {
  FooterProps,
  FooterBrandProps,
  FooterColumnProps,
  FooterLinkProps,
} from "./components/Footer";
export { Wireframe } from "./components/Wireframe";
export type {
  WireframeProps,
  WireframeBlockProps,
  WireframeShape,
  WireframeTone,
} from "./components/Wireframe";
export { Surface } from "./components/Surface";
export type { SurfaceProps } from "./components/Surface";
export { default as Tabs } from "./components/Tab";
export type { TabsContainerProps as TabsProps } from "./components/Tab";
export { default as Accordion } from "./components/Accordion";
export type { AccordionProps, AccordionItemProps } from "./components/Accordion";
export { default as Sidebar } from "./components/Sidebar";
export type {
  SidebarProps,
  SidebarHeaderProps,
  SidebarButtonProps,
} from "./components/Sidebar";
export { Gestures } from "./components/Gestures";
export type { GesturesProps } from "./components/Gestures";

//feedback
export { Alert } from "./components/Alert";
export type { AlertProps, AlertVariant } from "./components/Alert";
export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { Drawer } from "./components/Drawer";
export type { DrawerProps, DrawerSide } from "./components/Drawer";
export { AlertDialog } from "./components/AlertDialog";
export type { AlertDialogProps } from "./components/AlertDialog";
export { Toast } from "./components/Toast";
export type { ToastProps, ToastColor } from "./components/Toast";
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps, TooltipPosition } from "./components/Tooltip";
export { Dropdown } from "./components/Dropdown";
export type { DropdownProps } from "./components/Dropdown";
export type { Side, Align } from "./utils/placement";
// building blocks for custom dialogs rendered with `instantiate`
export { CloseButton, useEscape, useFocusTrap } from "./components/Overlay";

//forms
export { Form, useForm } from "./components/Form";
export type { FormProviderProps as FormProps, ValidatorList } from "./components/Form";
export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { UnicornialInput } from "./components/UnicornialInput";
export type { InputProps as UnicornialInputProps } from "./components/UnicornialInput";
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
export { Password } from "./components/Password";
export type { PasswordProps } from "./components/Password";
export { TextArea } from "./components/TextArea";
export type { TextAreaProps } from "./components/TextArea";
export { Select } from "./components/Select";
export type { SelectOption, SelectProps } from "./components/Select";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";
export { Slider } from "./components/Slider";
export type { SliderProps } from "./components/Slider";
export { Radio, RadioGroup } from "./components/Radio";
export type { RadioOption, RadioProps, RadioGroupProps } from "./components/Radio";
export { ColorPicker } from "./components/ColorPicker";
export type { ColorPickerProps } from "./components/ColorPicker";
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps } from "./components/DatePicker";
export { FileInput } from "./components/FileInput";
export type { FileInputProps } from "./components/FileInput";
export { ImageInput } from "./components/ImageInput";
export type { ImageInputProps } from "./components/ImageInput";
export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar";
// building blocks for custom form fields
export { Field, FieldError, LabelWithValue, useFieldStyles, FOCUS_RING } from "./components/Field";
export type { FieldProps, FieldVariant } from "./components/Field";
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
export type {
  UnicornialPasswordProps,
  UnicornialTextAreaProps,
  UnicornialSelectProps,
  UnicornialSwitchProps,
  UnicornialSpinnerProps,
  UnicornialSliderProps,
  UnicornialRadioGroupProps,
  UnicornialColorPickerProps,
  UnicornialDatePickerProps,
  UnicornialFileInputProps,
  UnicornialImageInputProps,
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
export type { ValidationResult, Validator } from "./utils/validators";
export { useDebounce } from "./hooks/useDebounce";
export { useMediaQuery } from "./hooks/useMediaQuery";
export { useControllable } from "./hooks/useControllable";
export { useFormField } from "./hooks/useFormField";

// color and date helpers
export {
  normalizeHex,
  hexToRgb,
  hexToRgba,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  formatColor,
  contrastRatio,
  getLighterGradientColor,
  getDarkerGradientColor,
} from "./utils/color";
export type { ColorSpace, ColorFormat } from "./utils/color";
export { toIso, parseIso, todayIso, daysInMonth, formatDate } from "./utils/date";
