import * as Commands from './commands';
import { getLogger } from './logger';

export async function substituteFilterVariables(skipClasses: string[]): Promise<string[]> {
  if (!skipClasses) {
    return [];
  }

  try {
    // Preprocess skipClasses configurations.
    if (Array.isArray(skipClasses)) {
      const hasReservedName = skipClasses.some((filter) => filter === '$JDK' || filter === '$Libraries');
      return hasReservedName
        ? await Commands.executeCommand(Commands.JAVA_RESOLVE_CLASSFILTERS, skipClasses)
        : skipClasses;
    } else {
      getLogger().error('Invalid type for skipClasses config:' + skipClasses);
    }
  } catch (e) {
    getLogger().error(e);
  }

  return [];
}
