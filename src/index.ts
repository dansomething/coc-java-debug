import { ExtensionContext, VimValue, commands, window, workspace } from 'coc.nvim';
import * as Commands from './commands';
import {
  resolveClassPathCurrentFile,
  resolveClassPathMainMethod,
  resolveMainMethodCurrentFile,
  resolveMainMethodsCurrentFile,
} from './debugserver';
import { ISubstitutionVar } from './protocol';
import { onConfigurationChange, updateDebugSettings } from './settings';
import fs from 'fs';
import vimspectorJson from './resources/vimspector.json';
import * as path from 'path';
import { getLogger } from './logger';

const VIMSPECTOR_CONFIG_FILE = '.vimspector.json';

export async function activate(context: ExtensionContext): Promise<void> {
  registerCommands(context);
  context.subscriptions.push(onConfigurationChange());
}

function registerCommands(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand(Commands.JAVA_DEBUG_VIMSPECTOR_START, startVimspector));
  context.subscriptions.push(commands.registerCommand(Commands.JAVA_DEBUG_SETTINGS_UPDATE, updateDebugSettings));
  context.subscriptions.push(
    commands.registerCommand(Commands.JAVA_DEBUG_RESOLVE_MAINMETHOD, showCommandResult(resolveMainMethodsCurrentFile)),
  );
  context.subscriptions.push(
    commands.registerCommand(Commands.JAVA_DEBUG_RESOLVE_CLASSPATH, showCommandResult(resolveClassPathCurrentFile)),
  );
}

async function startVimspector(...args: unknown[]): Promise<VimValue> {
  const debugPort: string = await Commands.executeCommand(Commands.JAVA_START_DEBUGSESSION);
  const msg = `Java debug server started on port: ${debugPort}`;
  getLogger().info(msg);
  window.showInformationMessage(msg);

  updateDebugSettings();
  initVimspectorConfig();

  const mainMethod = await resolveMainMethodCurrentFile();
  const mainClass = mainMethod?.mainClass;
  const projectName = mainMethod?.projectName;
  let modulePaths: string | undefined = undefined;
  let classPaths: string | undefined = undefined;
  if (mainMethod) {
    const classPathMainMethod = await resolveClassPathMainMethod(mainMethod);
    // Join path parts together to support using them with the Vimspector splat operator.
    // See https://puremourning.github.io/vimspector/configuration.html#the-splat-operator
    modulePaths = classPathMainMethod?.modulePaths.join(' ');
    classPaths = classPathMainMethod?.classPaths.join(' ');
  }

  const debugConfig = workspace.getConfiguration('java.debug');
  // See package.json#configuration.properties
  const vars = debugConfig.get<ISubstitutionVar>('vimspector.substitution');
  const overrides = getOverrides(args);

  const settings = {
    [vars?.adapterPort as string]: debugPort,
    [vars?.classPaths as string]: classPaths,
    [vars?.mainClass as string]: mainClass,
    [vars?.modulePaths as string]: modulePaths,
    [vars?.projectName as string]: projectName,
    ...overrides,
  };

  const vimspectorSettings = JSON.stringify(settings);
  // See https://github.com/puremourning/vimspector#launch-with-options
  // View logs with :CocOpenLog
  getLogger().info(`Launching Vimspector with settings: ${vimspectorSettings}`);
  return workspace.nvim.eval(`vimspector#LaunchWithSettings(${vimspectorSettings})`);
}

/**
 * Converts the input command arguments to an object to be applied as
 * Vimspector settings overides.
 *
 * This also handles the possibily of the command args being split by spaces
 * before being passed to the callback.
 */
function getOverrides(rawArguments: unknown[]): Record<string, unknown> {
  let args = '';
  if (rawArguments.length === 0) {
    args = (rawArguments[0] as string) ?? '';
  } else if (rawArguments.length >= 1) {
    const a: string[] = [];
    for (const v of rawArguments) {
      a.push(String(v));
    }
    args = a.join(' ');
  }
  return parseOverrides(args);
}

function parseOverrides(args: string): Record<string, unknown> {
  let overrides: Record<string, unknown> = {};
  if (args) {
    try {
      overrides = JSON.parse(args);
    } catch {
      window.showErrorMessage(`Expected valid JSON for Vimspector settings, but got: ${args}`, 'error');
    }
  }
  return overrides;
}

function showCommandResult(func: () => Promise<unknown>): (...args: unknown[]) => Promise<string | undefined> {
  return async () => {
    const result = await func();
    const json = JSON.stringify(result, null, 2);
    return window.showInformationMessage(json);
  };
}

function initVimspectorConfig(): void {
  const config = workspace.getConfiguration('java.debug.vimspector.config');
  const shouldCreate = config.get<boolean>('createIfNotExists');
  if (!shouldCreate) {
    getLogger().debug(`Vimspector default config creation is not enabled. Skipping creation.`);
    return;
  }

  const configPath = path.resolve(workspace.root, VIMSPECTOR_CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    getLogger().debug(`${VIMSPECTOR_CONFIG_FILE} already exists. Skipping creation.`);
    return;
  }

  try {
    fs.writeFileSync(configPath, JSON.stringify(vimspectorJson, null, 2));
  } catch (e) {
    getLogger().error(`Failed to write ${VIMSPECTOR_CONFIG_FILE}`, e);
  }
}
