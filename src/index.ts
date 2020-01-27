import { ExtensionContext, commands, workspace } from 'coc.nvim'
import { Commands } from './commands'

export async function activate(context: ExtensionContext): Promise<void> {

  context.subscriptions.push(commands.registerCommand(Commands.JAVA_DEBUG_START, async () => {
    workspace.showMessage('Starting Java debugger...')
    const debugPort: string = await commands.executeCommand(
      Commands.EXECUTE_WORKSPACE_COMMAND,
      Commands.JAVA_START_DEBUGSESSION)

    workspace.showMessage('Java debugger started on port: ' + debugPort)

    return workspace.nvim.eval(`vimspector#LaunchWithSettings( { "AdapterPort": ${debugPort} } )`)
  }))

  return Promise.resolve()
}
