import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Background from "./components/Background";
import { ThemeProvider } from "./theme/ThemeProvider";
import themeConfig from "./theme/theme.config.json";
import { Surface } from "./components/Surface";
import { UnicornialInput } from "./components/UnicornialInput";
import Validate from "./utils/validation";
import { Form } from "./components/Form";
import Tabs from "./components/Tab";
import Header from "./components/Header";
import Logo from "./assets/logo.png";

createRoot(document.getElementById("root")!).render(
  
  <StrictMode>
    <ThemeProvider config={{ ...themeConfig, darkMode: false }}>
      <Main />
    </ThemeProvider>
  </StrictMode>,
);

  const TabsEnum = {
  Login: 0,
  Register: 1,
}

function Main() {
  const [selectedTab, setSelectedTab] = useState(TabsEnum.Login);

  return <Background
        variant="grid"
        size={50}
        color="#00000022"
        className="h-screen flex flex-col items-center justify-center"
        mask="fade-in"
      >
        <Header>
          <Header.Logo src={Logo} alt="Logo" title="Unicornial-UI" />
          <Tabs variant="underline" className="h-full items-center" onChange={(i) => setSelectedTab(i)}>
            <Tabs.Item>Login</Tabs.Item>
            <Tabs.Item>Register</Tabs.Item>
          </Tabs>
        </Header>
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
          <Surface>
            {selectedTab === TabsEnum.Login && (
            <>
            <h1>Login</h1>
              <UnicornialInput label="Username" name="username" validator={Validate.email()} />
              <UnicornialInput
                label="Password"
                name="password"
                validator={Validate.minLength(6).onlyNumbers()}
              />
            </>
          )}
          {selectedTab === TabsEnum.Register && (
            <>
            <h1>Register</h1>
              <UnicornialInput label="Username" name="username" validator={Validate.email()} />
              <UnicornialInput
                label="Password"
                name="password"
                validator={Validate.minLength(6).onlyNumbers()}
              />
              <UnicornialInput
                label="Confirm Password"
                name="confirmPassword"
                validator={Validate.minLength(6).onlyNumbers()}
              />
            </>
          )}
          </Surface>
        </Form>
      </Background>
}