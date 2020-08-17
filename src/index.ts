import { commands, ExtensionContext, workspace } from 'coc.nvim'
import { Commands } from './commands'

export async function activate(context: ExtensionContext): Promise<void> {
  registerCommands(context)
  return Promise.resolve()
}

function registerCommands(context: ExtensionContext): void {
  context.subscriptions.push(commands.registerCommand(Commands.JAVA_DEBUG_VIMSPECTOR_START, startVimspector))
}

async function startVimspector(): Promise<any> {
  workspace.showMessage('Starting Java debug server...')

  const debugPort: string = await commands.executeCommand(
    Commands.EXECUTE_WORKSPACE_COMMAND,
    Commands.JAVA_START_DEBUG_SESSION)

  workspace.showMessage(`Java debug server started on port: ${debugPort}`)

  const config = workspace.getConfiguration('java.debug')
  const profile = config.get<string>('vimspector.profile')
  const adapterPort = config.get<string>('vimspector.substitution.adapterPort')
  const overrides = getOverrides(arguments)
  const settings = {
    configuration: profile,
    [adapterPort]: debugPort,
    ...overrides
  }
  const vimspectorSettings = JSON.stringify(settings)

  // See https://github.com/puremourning/vimspector#launch-with-options
  workspace.showMessage(`Launching Vimspector with settings: ${vimspectorSettings}`)
  return workspace.nvim.eval(`vimspector#LaunchWithSettings(${vimspectorSettings})`)
}

/**
 * Converts the input command arguments to an object to be applied as
 * Vimspector settings overides.
 *
 * This also handles the possibily of the command args being split by spaces
 * before being passed to the callback.
 */
function getOverrides(rawArguments: IArguments): object {
  let args = ''
  if (rawArguments.length == 0) {
    args = rawArguments[0]
  } else if (rawArguments.length >= 1) {
    const a = []
    for (const v of rawArguments) {
      a.push(v)
    }
    args = a.join(' ')
  }
  return parseOverrides(args)
}

function parseOverrides(args: string): object {
  let overrides = {}
  if (args) {
    try {
      overrides = JSON.parse(args)
    } catch (e) {
      workspace.showMessage(`Expected valid JSON for Vimspector settings, but got: ${args}`, 'error')
    }
  }
  return overrides
}
