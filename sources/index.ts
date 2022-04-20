import { CommandContext, Plugin, Configuration } from "@yarnpkg/core";
import { Command } from "clipanion";
import { configuration } from "./config";
import { executePostInstallCommand } from "./postinstall";



class PostInstallCommand extends Command<CommandContext> {
  @Command.Path("postinstall")
  async execute() {
    const configuration = await Configuration.find(
      this.context.cwd,
      this.context.plugins
    );
    const postinstall = configuration.get("postinstall");
    
    await executePostInstallCommand(postinstall);
  }
}

const plugin: Plugin = {
  configuration,
  commands: [ PostInstallCommand ],
  hooks: {
    afterAllInstalled: async project => {
      const postinstall = project.configuration.get("postinstall");

      await executePostInstallCommand(postinstall);
    }
  }
};

export default plugin;
