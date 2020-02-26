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
  const vimspectorSettings = `{ "configuration": "${profile}", "${adapterPort}": ${debugPort} }`

  workspace.showMessage(`Launching Vimspector with settings: ${vimspectorSettings}`)
  return workspace.nvim.eval(`vimspector#LaunchWithSettings(${vimspectorSettings})`)
}
