import { execute } from "@yarnpkg/shell";
import { Project, InstallMode, MessageName, formatUtils } from "@yarnpkg/core";
import { InstallOptions } from "@yarnpkg/core/lib/Project";

export const executePostInstallCommand = async (
  project: Project,
  options: InstallOptions
): Promise<void> => {
  await options.report.startTimerPromise("Postinstall step", async () => {
    // Respect the variable `YARN_ENABLE_SCRIPTS`.
    // https://github.com/renovatebot/renovate/discussions/17442#discussioncomment-3498940
    if (process.env.YARN_ENABLE_SCRIPTS === "0") {
      const prettyYarnOption = formatUtils.pretty(
        project.configuration,
        "YARN_ENABLE_SCRIPTS=0",
        formatUtils.Type.CODE
      );
      options.report.reportWarning(
        MessageName.UNNAMED,
        `Skipping postinstall because of ${prettyYarnOption}`
      );
      return;
    }

    switch (options.mode) {
      // Avoid running postinstall scripts when Yarn `--mode` is used.
      // This is important to allow tools like Renovate to correctly update the dependencies.
      // See related discussion: https://github.com/renovatebot/renovate/discussions/17442
      case InstallMode.SkipBuild:
      case InstallMode.UpdateLockfile: {
        const prettyYarnOption = formatUtils.pretty(
          project.configuration,
          `--mode=${options?.mode}`,
          formatUtils.Type.CODE
        );
        options.report.reportWarning(
          MessageName.UNNAMED,
          `Skipping postinstall because of ${prettyYarnOption}`
        );
        return;
      }
      default:
        // ...continue
        break;
    }

    const command = project.configuration.get("postinstall");

    const prettyCommand = formatUtils.pretty(
      project.configuration,
      command,
      formatUtils.Type.CODE
    );
    const prettyWorkspaceRoot = formatUtils.pretty(
      project.configuration,
      "workspace root",
      formatUtils.Type.PATH
    );
    options.report.reportInfo(
      MessageName.UNNAMED,
      `Running command ${prettyCommand} from the ${prettyWorkspaceRoot}...`
    );
    options.report.reportSeparator();

    const exitCode = await execute(command, [], {
      // Ensures the command is always executed from the workspace root.
      cwd: project.cwd,
      stdout: options.report.createStreamReporter(),
    });

    options.report.reportSeparator();

    if (exitCode !== 0) {
      throw new Error(
        `The postinstall command failed with exit code ${exitCode}`
      );
    }
  });
};
