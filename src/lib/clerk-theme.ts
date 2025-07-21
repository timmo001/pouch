import { type Appearance } from "@clerk/types";
import { latte, mocha } from "~/lib/catppuccin";

const buildTheme = (
  theme: typeof mocha | typeof latte,
): Partial<Appearance> => ({
  baseTheme: theme.baseTheme,
  variables: {
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    colorPrimary: theme.mauve,
    colorText: theme.text,
    colorBackground: theme.base,
    colorInputBackground: theme.surface0,
    colorInputText: theme.text,
    colorTextSecondary: theme.subtext0,
    colorDanger: theme.red,
    colorSuccess: theme.green,
    colorWarning: theme.yellow,
    colorNeutral: theme.surface1,
  },
  elements: {
    card: {
      backgroundColor: theme.mantle,
      borderColor: theme.surface0,
      borderWidth: 2,
    },
    socialButtonsBlockButton: {
      backgroundColor: theme.surface0,
      borderColor: theme.surface1,
      color: theme.text,
      "&:hover": {
        backgroundColor: theme.surface1,
      },
    },
    dividerLine: {
      backgroundColor: theme.surface1,
    },
    formFieldInput: {
      borderColor: theme.surface1,
      "&:focus": {
        borderColor: theme.mauve,
      },
    },
    formButtonPrimary: {
      "&:hover": {
        backgroundColor: theme.lavender,
      },
      "&:active": {
        backgroundColor: theme.mauve,
      },
    },
    userButtonPopoverActionButton: {
      color: theme.text,
      "&:hover": {
        backgroundColor: theme.surface0,
        color: theme.text,
      },
    },
    badge: {
      backgroundColor: theme.mauve,
      color: theme.base,
    },
    navbarButton: {
      color: theme.subtext0,
      "&:hover": {
        backgroundColor: theme.surface0,
        color: theme.text,
      },
    },
  },
});

export const lightTheme: Partial<Appearance> = buildTheme(latte);
export const darkTheme: Partial<Appearance> = buildTheme(mocha);
