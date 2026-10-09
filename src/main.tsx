import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import { Surface } from "./components/Surface";
import { UnicornialInput } from "./components/UnicornialInput";
import Validate from "./utils/validation";
import { Form } from "./components/Form";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider config={{ ...themeConfig, darkMode: false }}>
      <Background
        variant="grid"
        size={50}
        color="#00000022"
        className="h-screen flex flex-col items-center justify-center"
        mask="fade-in"
      >
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
          <Surface className="w-96">
            <UnicornialInput label="Username" name="username" validator={Validate.email()} />
            <UnicornialInput
              label="Password"
              name="password"
              validator={Validate.minLength(6).onlyNumbers()}
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </Surface>
        </Form>
      </Background>
    </ThemeProvider>
  </StrictMode>,
);
