import { Commands, executeCommand } from './commands';

export async function substituteFilterVariables(skipClasses: string[]): Promise<any> {
  if (!skipClasses) {
    return [];
  }

  try {
    // Preprocess skipClasses configurations.
    if (Array.isArray(skipClasses)) {
      const hasReservedName = skipClasses.some((filter) => filter === '$JDK' || filter === '$Libraries');
      return hasReservedName ? await executeCommand(Commands.JAVA_RESOLVE_CLASSFILTERS, skipClasses) : skipClasses;
    } else {
      console.error('Invalid type for skipClasses config:' + skipClasses);
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}
