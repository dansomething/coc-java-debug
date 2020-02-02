# coc-java-debug

An experimental [extension for coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions) to enable the
[Java Debug](https://github.com/Microsoft/java-debug) server extension for the [jdt.ls](https://github.com/eclipse/eclipse.jdt.ls) language server as loaded by [coc-java](https://github.com/neoclide/coc-java).

#### Disclaimer

*This being experimental, I can not make any guarantees about this plugin or example config working for your setup.*

### Prerequisites

Be sure to have the [coc-java](https://github.com/neoclide/coc-java#quick-start) extension installed.

### Install

    :CocInstall https://github.com/dansomething/coc-java-debug

### Uninstall

    :CocUninstall coc-java-debug

## Example usage with [vimspector](https://github.com/puremourning/vimspector)

This example will use vimspector as the user interface for interacting with the debug server from within vim.

It will demonstrate attaching to a Java process with remote debugging enabled.

#### Setup vimspector

Install the [vimspector](https://github.com/puremourning/vimspector#installation) plugin for vim.

Add a `.vimspector.json` file in the root directory of your Java project with the following contents.

    {
      "adapters": {
        "java-debug-server": {
          "name": "vscode-java",
          "port": "${AdapterPort}"
        }
      },
      "configurations": {
        "Java Attach": {
          "adapter": "java-debug-server",
          "configuration": {
            "request": "attach",
            "host": "127.0.0.1",
            "port": "5005"
          },
          "breakpoints": {
            "exception": {
              "caught": "N",
              "uncaught": "N"
            }
          }
        }
      }
    }

*Review the [vimspector config](https://puremourning.github.io/vimspector/configuration.html) docs for what's possible with this file.*

#### Configure vim

Add the following config to your `~/.vimrc` file or wherever appropriate for your vim setup.

    function! JavaStartDebugCallback(err, port)
      execute "cexpr! 'Java debug started on port: " . a:port . "'"
      call vimspector#LaunchWithSettings({ "configuration": "Java Attach", "AdapterPort": a:port })
    endfunction

    function JavaStartDebug()
      call CocActionAsync('runCommand', 'vscode.java.startDebugSession', function('JavaStartDebugCallback'))
    endfunction

    nmap <F1> :call JavaStartDebug()<CR>

This will provide a way to start the Java debug server through coc.vim and then tell vimspector which port to use to connect to the debug
server. It maps the `F1` key to kick things off, but you can change this to whatever you want.

#### Start the debug session

First, run a Java process with debug enabled. Make sure its configured to pause and wait for a remote debugger on port
`5005`.

For example:

    mvn test -Dmaven.surefire.debug

Next, open the file you want to debug in vim and set a [breakpoint with vimspector](https://github.com/puremourning/vimspector#mappings).

Finally, start the debug session in vim by hitting the `F1` key or other key combo if you have altered the above vim
config.

*Note, if you use a Java debug port different than `5005` you'll need to change that in your `.vimspector.json` file. Its also
possible to configure this port dynamically in vimspector in the same manner as the debug adapter port.*
