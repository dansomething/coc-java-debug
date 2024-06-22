import {ExtensionContext, commands, workspace} from "coc.nvim";
import {substituteFilterVariables} from "./classFilter";
import {Commands} from "./commands";

export function onConfigurationChange() {
    return workspace.onDidChangeConfiguration(params => {
        if (!params.affectsConfiguration('java.debug.settings')) {
            return
        }
        updateDebugSettings();
    });
}

export async function updateDebugSettings() {
    const debugSettingsRoot = workspace.getConfiguration('java.debug.settings');

    if (!debugSettingsRoot) {
        return;
    }
    const logLevel = convertLogLevel(debugSettingsRoot.logLevel || "");
    if (debugSettingsRoot && Object.keys(debugSettingsRoot).length) {
        try {
            let extraSettings = {};
            if (debugSettingsRoot.stepping && Object.keys(debugSettingsRoot.stepping).length) {
                let stepFilters = {};
                if (debugSettingsRoot.stepping.skipClasses) {
                    stepFilters["skipClasses"] = await substituteFilterVariables(debugSettingsRoot.stepping.skipClasses);
                }
                if (debugSettingsRoot.stepping.skipSynthetics) {
                    stepFilters["skipSynthetics"] = debugSettingsRoot.stepping.skipSynthetics;
                }
                if (debugSettingsRoot.stepping.skipStaticInitializers) {
                    stepFilters["skipStaticInitializers"] = debugSettingsRoot.stepping.skipStaticInitializers;
                }
                if (debugSettingsRoot.stepping.skipConstructors) {
                    stepFilters["skipConstructors"] = debugSettingsRoot.stepping.skipConstructors;
                }
                extraSettings["stepFilters"] = stepFilters;
            }
            if (debugSettingsRoot.exceptionBreakpoint && Object.keys(debugSettingsRoot.exceptionBreakpoint).length) {
                let exceptionFilters = {};
                if (debugSettingsRoot.exceptionBreakpoint.exceptionTypes) {
                    exceptionFilters["exceptionTypes"] = debugSettingsRoot.exceptionBreakpoint.exceptionTypes;
                }
                if (debugSettingsRoot.exceptionBreakpoint.allowClasses) {
                    exceptionFilters["allowClasses"] = debugSettingsRoot.exceptionBreakpoint.allowClasses;
                }
                if (debugSettingsRoot.exceptionBreakpoint.skipClasses) {
                    exceptionFilters["skipClasses"] = await substituteFilterVariables(debugSettingsRoot.exceptionBreakpoint.skipClasses);
                }
                extraSettings["exceptionFilters"] = exceptionFilters;
                extraSettings["exceptionFiltersUpdated"] = true;
            }

            if (debugSettingsRoot.jdwp) {
                if (debugSettingsRoot.jdwp.async) {
                    extraSettings["asyncJDWP"] = debugSettingsRoot.jdwp.async;
                }
                if (debugSettingsRoot.jdwp.limitOfVariablesPerJdwpRequest) {
                    extraSettings["limitOfVariablesPerJdwpRequest"] = Math.max(debugSettingsRoot.jdwp.limitOfVariablesPerJdwpRequest, 1);
                }
                if (debugSettingsRoot.jdwp.requestTimeout) {
                    extraSettings["jdwpRequestTimeout"] = Math.max(debugSettingsRoot.jdwp.requestTimeout, 100);
                }
            }
            const settings = await commands.executeCommand(Commands.JAVA_UPDATE_DEBUG_SETTINGS, JSON.stringify(
                {
                    ...debugSettingsRoot,
                    ...extraSettings,
                    logLevel,
                }));
            if (logLevel === "FINE") {
                // tslint:disable-next-line:no-console
                console.debug("settings:", settings);
            }
        } catch (err) {
            // log a warning message and continue, since update settings failure should not block debug session
            // tslint:disable-next-line:no-console
            console.error("Cannot update debug settings.", err);
        }
    }
}

function convertLogLevel(commonLogLevel: string) {
    // convert common log level to java log level
    switch (commonLogLevel.toLowerCase()) {
        case "verbose":
            return "FINE";
        case "warn":
            return "WARNING";
        case "error":
            return "SEVERE";
        case "info":
            return "INFO";
        default:
            return "FINE";
    }
}
