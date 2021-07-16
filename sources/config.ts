import {
  ConfigurationDefinitionMap,
  SettingsType,
} from "@yarnpkg/core";

// extend .yarnrc.yml to allow "postinstall" key
declare module "@yarnpkg/core" {
  interface ConfigurationValueMap {
    postinstall: string;
  }
}

// define postinstall config as string
export const configuration: Partial<ConfigurationDefinitionMap> = {
  postinstall: {
    description: "Postinstall hook that will always run in Yarn v2",
    type: SettingsType.STRING,
    default: ""
  }
};