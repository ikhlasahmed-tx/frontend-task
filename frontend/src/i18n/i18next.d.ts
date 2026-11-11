import "i18next";
import type en from "./dictionaries/en.json";

// Makes t("...") only accept keys that exist in en.json, so a typo is a compile error.
declare module "i18next" {
  interface CustomTypeOptions {
    resources: { translation: typeof en };
  }
}
