import { CommandContext, Plugin, Configuration } from "@yarnpkg/core";
import * as Shell from "@yarnpkg/shell";
import { Command } from "clipanion";
import { configuration } from "./config";

class PostInstallCommand extends Command<CommandContext> {
  @Command.Path("postinstall")
  async execute() {
    const configuration = await Configuration.find(
      this.context.cwd,
      this.context.plugins
    );
    const postinstall = configuration.get("postinstall");
    if (postinstall) {
      Shell.execute(postinstall);
    }
  }
}

const plugin: Plugin = {
  configuration,
  commands: [
    PostInstallCommand
  ],
  hooks: {
    afterAllInstalled: project => {
      const postinstall = project.configuration.get("postinstall");
      if (postinstall) {
        console.log("Running postinstall script...");
        Shell.execute(postinstall);
      }
    }
  }
};

export default plugin;
