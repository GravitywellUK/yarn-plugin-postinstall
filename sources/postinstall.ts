import * as Shell from "@yarnpkg/shell";

export const executePostInstallCommand = async (command: string): Promise<void> => {
  if (command) {
    console.log("Running postinstall command...");
    const exitCode = await Shell.execute(command);

    if (exitCode !== 0) {
      throw new Error(`postinstall command failed with exit code ${exitCode}`);
    }
  }
}