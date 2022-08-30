import { execute } from "@yarnpkg/shell";
import { Project, InstallMode } from "@yarnpkg/core";
import { InstallOptions } from "@yarnpkg/core/lib/Project";

export const executePostInstallCommand = async (
  project: Project,
  options?: InstallOptions
): Promise<void> => {
  // Respect the variable `YARN_ENABLE_SCRIPTS`.
  // https://github.com/renovatebot/renovate/discussions/17442#discussioncomment-3498940
  if (process.env.YARN_ENABLE_SCRIPTS === "0") {
    console.log(`Skipping postinstall because of "YARN_ENABLE_SCRIPTS=0"`);
    return;
  }

  switch (options?.mode) {
    // Avoid running postinstall scripts when Yarn `--mode` is used.
    // This is important to allow tools like Renovate to correctly update the dependencies.
    // See related discussion: https://github.com/renovatebot/renovate/discussions/17442
    case InstallMode.SkipBuild:
    case InstallMode.UpdateLockfile: {
      console.log(`Skipping postinstall because of "--mode=${options?.mode}"`);
      return;
    }
    default:
      // ...continue
      break;
  }

  const command = project.configuration.get("postinstall");

  console.log(
    `Running postinstall command "${command}" from the workspace root...`
  );
  const exitCode = await execute(command, [], {
    // Ensures the command is always executed from the workspace root.
    cwd: project.cwd,
  });

  if (exitCode !== 0) {
    throw new Error(
      `The postinstall command failed with exit code ${exitCode}`
    );
  }
};
