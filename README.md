# coc-java-debug

An [extension for coc.nvim](https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions) to enable the
[Java Debug Server](https://github.com/Microsoft/java-debug) extension for the [jdt.ls](https://github.com/eclipse/eclipse.jdt.ls) language server that is loaded by [coc-java](https://github.com/neoclide/coc-java).

#### Disclaimer

*This began as an experiment, but generally "works for me". Your mileage may vary.*

*Also, Java is [partially supported](https://github.com/puremourning/vimspector#java---partially-supported) in Vimspector.*

### Prerequisites

Be sure to have the [coc-java](https://github.com/neoclide/coc-java#quick-start) extension installed.

    :CocInstall coc-java

You will also need to [install the Vimspector](https://github.com/puremourning/vimspector#installation) plugin for Vim.

### Install

    :CocInstall coc-java-debug

### Uninstall

    :CocUninstall coc-java-debug

## Features

- Integration with [Vimspector](https://puremourning.github.io/vimspector-web/)

## Available commands

The following commands are available:

- `java.debug.vimspector.start`: Launch Vimspector and connect it to the [Java Debug Server](https://github.com/Microsoft/java-debug).


### Command Arguments

Optionally, `java.debug.vimspector.start` will accept a JSON string of settings which will be passed to Vimspector via ["LaunchWithSettings"](https://github.com/puremourning/vimspector#launch-with-options).

Here's how you would call it from Vim:

    :CocCommand java.debug.vimspector.start {"configuration":"Run Test","Test":"Name of the test"}

These settings will take precedence when launching Vimspector.

## Supported settings

The following settings are supported in [CocConfig](https://github.com/neoclide/coc.nvim/wiki/Using-the-configuration-file#configuration-file-resolve):

- `java.debug.vimspector.profile` : (Deprecated) Use `"default":true` in Vimspector.json instead. Specifies the Vimspector [profile](https://puremourning.github.io/vimspector/configuration.html#debug-profile-configuration) to activate when launching. Set to `null` to be prompted if multiple configurations are found and no default is set. Defaults to `Java Attach`
- `java.debug.vimspector.substitution.adapterPort` : Specifies the Vimspector [adapter port](https://puremourning.github.io/vimspector/configuration.html#adapter-configurations) substitution name in `.vimspector.json`. The actual port number will replace this value in the Vimspector config when the debug server is started. Defaults to `AdapterPort`

## Usage with [Vimspector](https://puremourning.github.io/vimspector-web/)

This example will use Vimspector as the user interface for interacting with the [Java Debug Server](https://github.com/Microsoft/java-debug) from within Vim.

It will demonstrate attaching to a Java program that is running with remote debugging enabled.

#### Setup Vimspector

Install the [Vimspector](https://github.com/puremourning/vimspector#installation) plugin for Vim.

Add a `.vimspector.json` file in the root directory of your Java project with the following contents. Note,
don't change `"${AdapterPort}"`. See [issue #3](https://github.com/dansomething/coc-java-debug/issues/3#issuecomment-622075010) for an explanation of how this port value works.

    {
      "adapters": {
        "java-debug-server": {
          "name": "vscode-java",
          "port": "${AdapterPort}"
        }
      },
      "configurations": {
        "Java Attach": {
          "default": true,
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

*Review the [Vimspector config](https://puremourning.github.io/vimspector/configuration.html) docs for what's possible within this file.*

#### Configure Vim

This extension now provides `:CocCommand java.debug.vimspector.start` to simplify setup.
Add the following config to your `~/.vimrc` file or wherever appropriate for your Vim setup for convenience.

    nmap <F1> :CocCommand java.debug.vimspector.start<CR>

##### Alternative Configuration

If you'd prefer to launch Vimspector from yourself then
add the following config to your `~/.vimrc` file or wherever appropriate for your Vim setup.

*Note, this will bypass using the `:CocCommand` documented above to start the debug session.*

    function! JavaStartDebugCallback(err, port)
      execute "cexpr! 'Java debug started on port: " . a:port . "'"
      call vimspector#LaunchWithSettings({ "configuration": "Java Attach", "AdapterPort": a:port })
    endfunction

    function JavaStartDebug()
      call CocActionAsync('runCommand', 'vscode.java.startDebugSession', function('JavaStartDebugCallback'))
    endfunction

    nmap <F1> :call JavaStartDebug()<CR>

This will provide a way to start the Java debug server through coc.vim and then tell Vimspector which port to use to connect to the debug
server. It maps the `F1` key to kick things off, but you can change this key mapping to whatever you want.


#### Start the debug session

First, run a Java program with [remote debugging enabled](https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/conninv.html#Invocation).
Be sure it is configured to pause and wait for a remote connection on port `5005` for this example work.

For a simple Java program. Create a `Hello.java` file with these contents.

    public class Hello {
      public static void main(String[] args) {
        System.out.println("Hello World!");
      }
    }

Next, run these commands from a shell to compile the program and then start it with remote debugging enabled.

    javac Hello.java
    java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=y Hello


Or for another example [remote debugging Maven tests](https://maven.apache.org/surefire/maven-surefire-plugin/examples/debugging.html).

    mvn test -Dmaven.surefire.debug

If everything works correctly you will see this message.

> Listening for transport dt_socket at address: 5005

Now, open the file you want to debug in Vim and set a [breakpoint with Vimspector](https://github.com/puremourning/vimspector#mappings).

Finally, start the debug session in Vim by hitting the `F1` key or use your custom key combination if you have altered the
config from this example. This should result in Vimspector opening in a new tab with your Java program paused at the breakpoint you set.

That's it! You may now [step debug](https://github.com/puremourning/vimspector#mappings) your way through a Java program from within Vim.

*Note, if you use a Java debug port different than `5005` you will need to change that value in your `.vimspector.json` file. It is also
possible to configure this port dynamically in Vimspector in the same manner as the debug adapter port.*

## License

EPL 2.0, See [LICENSE](LICENSE) for more information.
