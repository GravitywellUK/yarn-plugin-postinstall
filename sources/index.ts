import {
  Plugin,
  Configuration,
  Project,
  Hooks,
  StreamReport,
  MessageName,
  Cache,
} from "@yarnpkg/core";
import { BaseCommand } from "@yarnpkg/cli";
import { Command, Usage } from "clipanion";
import { configuration } from "./configurations";
import { executePostInstallCommand } from "./commands/postinstall";

class PostInstallCommand extends BaseCommand {
  static paths = [["postinstall"]];

  static usage: Usage = Command.Usage({
    description: 'Manually trigger the "postinstall" command',
  });

  async execute() {
    const configuration = await Configuration.find(
      this.context.cwd,
      this.context.plugins
    );
    const { project } = await Project.find(configuration, this.context.cwd);
    const report = await StreamReport.start(
      { configuration, stdout: this.context.stdout },
      async (report) => {
        await executePostInstallCommand(project, {
          cache: null,
          report,
        });
      }
    );
    return report.exitCode();
  }
}

const plugin: Plugin<Hooks> = {
  configuration,
  commands: [PostInstallCommand],
  hooks: {
    afterAllInstalled: executePostInstallCommand,
  },
};

export default plugin;
