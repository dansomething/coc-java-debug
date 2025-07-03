import { commands, workspace } from 'coc.nvim';
import { substituteFilterVariables } from './classFilter';
import * as Commands from './commands';
import { getLogger } from './logger';

export function onConfigurationChange() {
  return workspace.onDidChangeConfiguration((params) => {
    if (!params.affectsConfiguration('java.debug.settings') && !params.affectsConfiguration('java.debug.logLevel')) {
      return;
    }
    updateDebugSettings();
  });
}

export async function updateDebugSettings() {
  const debugSettingsRoot = workspace.getConfiguration('java.debug');

  if (!debugSettingsRoot) {
    return;
  }
  const logLevel = convertLogLevel(debugSettingsRoot.logLevel || '');
  if (debugSettingsRoot.settings && Object.keys(debugSettingsRoot.settings).length) {
    try {
      const extraSettings = {};
      if (debugSettingsRoot.settings.stepping && Object.keys(debugSettingsRoot.settings.stepping).length) {
        const stepFilters = {};
        if (debugSettingsRoot.settings.stepping.skipClasses) {
          stepFilters['skipClasses'] = await substituteFilterVariables(debugSettingsRoot.settings.stepping.skipClasses);
        }
        if (debugSettingsRoot.settings.stepping.skipSynthetics) {
          stepFilters['skipSynthetics'] = debugSettingsRoot.settings.stepping.skipSynthetics;
        }
        if (debugSettingsRoot.settings.stepping.skipStaticInitializers) {
          stepFilters['skipStaticInitializers'] = debugSettingsRoot.settings.stepping.skipStaticInitializers;
        }
        if (debugSettingsRoot.settings.stepping.skipConstructors) {
          stepFilters['skipConstructors'] = debugSettingsRoot.settings.stepping.skipConstructors;
        }
        extraSettings['stepFilters'] = stepFilters;
      }
      if (
        debugSettingsRoot.settings.exceptionBreakpoint &&
        Object.keys(debugSettingsRoot.settings.exceptionBreakpoint).length
      ) {
        const exceptionFilters = {};
        if (debugSettingsRoot.settings.exceptionBreakpoint.exceptionTypes) {
          exceptionFilters['exceptionTypes'] = debugSettingsRoot.settings.exceptionBreakpoint.exceptionTypes;
        }
        if (debugSettingsRoot.settings.exceptionBreakpoint.allowClasses) {
          exceptionFilters['allowClasses'] = debugSettingsRoot.settings.exceptionBreakpoint.allowClasses;
        }
        if (debugSettingsRoot.settings.exceptionBreakpoint.skipClasses) {
          exceptionFilters['skipClasses'] = await substituteFilterVariables(
            debugSettingsRoot.settings.exceptionBreakpoint.skipClasses,
          );
        }
        extraSettings['exceptionFilters'] = exceptionFilters;
        extraSettings['exceptionFiltersUpdated'] = true;
      }

      if (debugSettingsRoot.settings.jdwp) {
        if (debugSettingsRoot.settings.jdwp.async) {
          extraSettings['asyncJDWP'] = debugSettingsRoot.settings.jdwp.async;
        }
        if (debugSettingsRoot.settings.jdwp.limitOfVariablesPerJdwpRequest) {
          extraSettings['limitOfVariablesPerJdwpRequest'] = Math.max(
            debugSettingsRoot.settings.jdwp.limitOfVariablesPerJdwpRequest,
            1,
          );
        }
        if (debugSettingsRoot.settings.jdwp.requestTimeout) {
          extraSettings['requestTimeout'] = Math.max(debugSettingsRoot.settings.jdwp.requestTimeout, 100);
        }
      }
      const settings = await commands.executeCommand(
        Commands.JAVA_UPDATE_DEBUG_SETTINGS,
        JSON.stringify({
          ...debugSettingsRoot.settings,
          ...extraSettings,
          logLevel,
        }),
      );
      getLogger().debug('settings:', settings);
    } catch (err) {
      // log a warning message and continue, since update settings failure should not block debug session
      getLogger().error('Cannot update debug settings.', err);
    }
  }
}

function convertLogLevel(commonLogLevel: string) {
  // convert common log level to java log level
  switch (commonLogLevel.toLowerCase()) {
    case 'verbose':
      return 'FINE';
    case 'warn':
      return 'WARNING';
    case 'error':
      return 'SEVERE';
    case 'info':
      return 'INFO';
    default:
      return 'FINE';
  }
}
