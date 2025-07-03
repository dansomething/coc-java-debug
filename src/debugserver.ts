import { TextDocument, Uri, window, workspace } from 'coc.nvim';
import * as Commands from './commands';
import { IClassPath, IMainClassOption, MainMethodResult } from './protocol';

export async function resolveMainMethodCurrentFile(): Promise<IMainClassOption | undefined> {
  const mainMethods = await resolveMainMethodsCurrentFile();
  if (mainMethods.length === 1) {
    return mainMethods[0];
  } else if (mainMethods.length > 1) {
    return await pickMainMethod(mainMethods);
  }
  return undefined;
}

export async function resolveMainMethodsCurrentFile(): Promise<MainMethodResult> {
  const { document } = await workspace.getCurrentState();
  return resolveMainMethod(document);
}

async function resolveMainMethod(document: TextDocument): Promise<MainMethodResult> {
  const resourcePath = getJavaResourcePath(document);
  return Commands.executeCommand(Commands.JAVA_RESOLVE_MAINMETHOD, resourcePath);
}

export async function resolveClassPathCurrentFile(): Promise<IClassPath> {
  const mainMethod = await resolveMainMethodCurrentFile();
  if (mainMethod) {
    return resolveClassPathMainMethod(mainMethod);
  }
  return { modulePaths: [], classPaths: [] };
}

export async function resolveClassPathMainMethod(mainMethod: IMainClassOption): Promise<IClassPath> {
  const classPath = await resolveClasspath(mainMethod.mainClass, mainMethod.projectName || '');
  const [modulePaths, classPaths]: [string[], string[]] = classPath;
  return { modulePaths, classPaths };
}

async function resolveClasspath(mainClass: string, projectName: string, scope?: string): Promise<[string[], string[]]> {
  return Commands.executeCommand(Commands.JAVA_RESOLVE_CLASSPATH, mainClass, projectName, scope);
}

function getJavaResourcePath(document: TextDocument): string | undefined {
  const resource = Uri.parse(document.uri);
  if (resource.scheme === 'file' && resource.fsPath.endsWith('.java')) {
    return resource.toString();
  }
  return undefined;
}

export async function pickMainMethod(mainMethods: MainMethodResult): Promise<IMainClassOption> {
  const items = mainMethods.map((method) => {
    return method.mainClass;
  });
  const selected = await window.showQuickpick(items, 'Choose a main method.');
  // Choose the first one if none is selected.
  return mainMethods[selected >= 0 ? selected : 0];
}
