import { StrictMode, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Surface } from "./components/Surface";
import { UnicornialInput } from "./components/UnicornialInput";
import Validate from "./utils/validation";
import { Form } from "./components/Form";
import Tabs from "./components/Tab";
import Header from "./components/Header";
import { Alert } from "./components/Alert";
import { Button } from "./components/Button";
import { Tooltip } from "./components/Tooltip";
import { showAlert, showModal } from "./utils/dialogs";
import { showToast } from "./utils/toasts";
import Logo from "./assets/logo.png";
import {
  UnicornialColorPicker,
  UnicornialDatePicker,
  UnicornialFileInput,
  UnicornialImageInput,
  UnicornialPassword,
  UnicornialRadioGroup,
  UnicornialSelect,
  UnicornialSlider,
  UnicornialSpinner,
  UnicornialSwitch,
  UnicornialTextArea,
} from "./components/UnicornialFields";
import { ProgressBar } from "./components/ProgressBar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{ dark: { enabled: false } }}>
      <Main />
    </ThemeProvider>
  </StrictMode>,
);

const TabsEnum = {
  Login: 0,
  Register: 1,
  Fields: 2,
};

function FieldsDemo({ look }: { look?: string }) {
  const [progress, setProgress] = useState(40);

  return (
    <>
      <h1>Fields</h1>
      <UnicornialPassword
        themeVariant={look}
        name="fieldPassword"
        label="Password"
        placeholder="Your password"
        validator={Validate.minLength(6)}
      />
      <UnicornialTextArea
        themeVariant={look}
        name="message"
        label="Message"
        placeholder="Write something..."
        validator={Validate.required()}
      />
      <UnicornialSelect
        themeVariant={look}
        name="country"
        label="Country"
        validator={Validate.required()}
        options={[
          { value: "mx", label: "Mexico" },
          { value: "es", label: "Spain" },
          { value: "ar", label: "Argentina" },
          { value: "co", label: "Colombia", disabled: true },
        ]}
      />
      <UnicornialSpinner themeVariant={look} name="quantity" label="Quantity" min={0} max={10} defaultValue={1} />
      <UnicornialSwitch themeVariant={look} name="notifications" label="Notifications" defaultChecked />
      <UnicornialRadioGroup
        themeVariant={look}
        name="plan"
        label="Plan"
        defaultValue="free"
        options={[
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
        ]}
        orientation="horizontal"
      />
      <UnicornialSlider themeVariant={look} name="volume" label="Volume" showValue defaultValue={30} />
      <ProgressBar themeVariant={look} label="Progress" showValue value={progress} />
      <div className="flex gap-2 mb-4">
        <Button type="button" variant="outline" size="sm" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
          -10
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
          +10
        </Button>
      </div>
      <ProgressBar themeVariant={look} label="Loading" indeterminate />
      <UnicornialColorPicker themeVariant={look} name="color" label="Color" format="oklch" />
      <UnicornialDatePicker
        themeVariant={look}
        name="date"
        label="Date"
        format="DD MMM YYYY"
        validator={Validate.required()}
      />
      <UnicornialFileInput themeVariant={look} name="document" label="Document" />
      <UnicornialImageInput themeVariant={look} name="avatar" label="Avatar" />
      <Button type="submit" themeVariant={look}>
        Submit
      </Button>
    </>
  );
}

function Main() {
  const [selectedTab, setSelectedTab] = useState(TabsEnum.Login);
  const tooltipAnchor = useRef<HTMLButtonElement>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [look, setLook] = useState<string | undefined>(undefined);

  return (
    <Background
      variant="grid"
      size={50}
      color="#00000022"
      className="h-screen flex flex-col items-center justify-center-safe pt-20 pb-8"
      mask="fade-in"
    >
      <Header themeVariant={look}>
        <Header.Logo src={Logo} alt="Logo" title="Unicornial-UI" />
        <Tabs
          variant="underline"
          themeVariant={look}
          className="h-full items-center"
          onChange={(i) => setSelectedTab(i)}
        >
          <Tabs.Item>Login</Tabs.Item>
          <Tabs.Item>Register</Tabs.Item>
          <Tabs.Item>Fields</Tabs.Item>
        </Tabs>
      </Header>
      <div className="flex gap-2 mb-4">
        {[undefined, "glass", "neumorph", "clay"].map((name) => (
          <Button
            key={name ?? "default"}
            type="button"
            variant={look === name ? "primary" : "outline"}
            onClick={() => setLook(name)}
          >
            {name ?? "default"}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Alert variant="info" themeVariant={look}>This is an informational message.</Alert>
        <Alert variant="warning" themeVariant={look}>This is a warning message.</Alert>
        <Alert variant="error" themeVariant={look}>This is an error message.</Alert>
      </div>
      <Button
        type="button"
        themeVariant={look}
        className="mb-4"
        onClick={() =>
          showModal(
            "Hello from the portal",
            <p>This modal was created with showModal().</p>,
            undefined,
            look,
          )
        }
      >
        Open modal
      </Button>
      <div className="flex gap-2 mb-4">
        {(["info", "warning", "error"] as const).map((type) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            themeVariant={look}
            onClick={() =>
              showAlert(type, `This is a ${type} alert.`, look)
                .onConfirm(() => console.log(`${type} confirmed`))
                .onReject(() => console.log(`${type} rejected`))
            }
          >
            {type} alert
          </Button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {(["info", "success", "warning", "error"] as const).map((color) => (
          <Button
            key={color}
            type="button"
            variant="ghost"
            themeVariant={look}
            onClick={() =>
              showToast(
                `This is a ${color} toast.`,
                color,
                () => console.log(`${color} toast clicked`),
                undefined,
                look,
              )
            }
          >
            {color} toast
          </Button>
        ))}
      </div>
      <Button
        ref={tooltipAnchor}
        type="button"
        variant="secondary"
        themeVariant={look}
        className="mb-4"
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        Hover me
      </Button>
      <Tooltip anchorRef={tooltipAnchor} position="top" arrow open={tooltipOpen} themeVariant={look}>
        This is a tooltip
      </Tooltip>
      <Form
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, hasErrors) => {
          if (hasErrors) {
            console.log("Form has errors. Please fix them before submitting.");
          } else {
            console.log("Form submitted successfully with values:", values);
          }
        }}
      >
        <Surface
          themeVariant={look}
          className={selectedTab === TabsEnum.Fields ? "w-96 max-h-[60vh] overflow-auto p-4" : ""}
        >
          {selectedTab === TabsEnum.Login && (
            <>
              <h1>Login</h1>
              <UnicornialInput themeVariant={look} label="Username" name="username" validator={Validate.email()} />
              <UnicornialInput
                themeVariant={look}
                label="Password"
                name="password"
                validator={Validate.minLength(6).onlyNumbers()}
              />
            </>
          )}
          {selectedTab === TabsEnum.Fields && <FieldsDemo look={look} />}
          {selectedTab === TabsEnum.Register && (
            <>
              <h1>Register</h1>
              <UnicornialInput themeVariant={look} label="Username" name="username" validator={Validate.email()} />
              <UnicornialInput
                themeVariant={look}
                label="Password"
                name="password"
                validator={Validate.minLength(6).onlyNumbers()}
              />
              <UnicornialInput
                themeVariant={look}
                label="Confirm Password"
                name="confirmPassword"
                validator={Validate.minLength(6).onlyNumbers()}
              />
            </>
          )}
        </Surface>
      </Form>
    </Background>
  );
}
