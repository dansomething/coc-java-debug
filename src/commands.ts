import { commands } from 'coc.nvim';

export namespace Commands {
  export const JAVA_START_DEBUGSESSION = 'vscode.java.startDebugSession';

  export const JAVA_RESOLVE_CLASSPATH = 'vscode.java.resolveClasspath';

  export const JAVA_RESOLVE_MAINMETHOD = 'vscode.java.resolveMainMethod';

  export const JAVA_RESOLVE_CLASSFILTERS = 'vscode.java.resolveClassFilters';

  export const JAVA_UPDATE_DEBUG_SETTINGS = "vscode.java.updateDebugSettings";

  export const JAVA_DEBUG_VIMSPECTOR_START = 'java.debug.vimspector.start';

  export const JAVA_DEBUG_SETTINGS_UPDATE = 'java.debug.settings.update';

  export const JAVA_DEBUG_RESOLVE_MAINMETHOD = 'java.debug.resolveMainMethod';

  export const JAVA_DEBUG_RESOLVE_CLASSPATH = 'java.debug.resolveClasspath';

  export const EXECUTE_WORKSPACE_COMMAND = 'java.execute.workspaceCommand';
}

export async function executeCommand(...rest: any[]) {
  return commands.executeCommand(Commands.EXECUTE_WORKSPACE_COMMAND, ...rest);
}
