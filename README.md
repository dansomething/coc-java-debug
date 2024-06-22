# coc-java-debug

An [extension for coc.nvim][0] to enable the [Java Debug Server][1] extension for the [jdt.ls][2] language server that
is loaded by [coc-java][3].

## Disclaimer

This project is intended to provide the simplest possible integration between [Vimspector][5] and [jdt.ls][2].
A minimal amount of manual configuration is required on first setup.

*Note, this began as an experiment, but generally "works for me". Your mileage may vary.*

## Prerequisites

Be sure to have the [coc-java][4] extension installed.

    :CocInstall coc-java

You will also need to [install the Vimspector][5] plugin for Vim.

## Install

    :CocInstall coc-java-debug

## Uninstall

    :CocUninstall coc-java-debug

## Features

- Integration with [Vimspector][6]
- Provide a simple command to launch Vimspector and connect the Java debugger.

## Available commands

The following CocCommand options are provided:

- `java.debug.vimspector.start`: Launch Vimspector and connect it to the [Java Debug Server][1].
- `java.debug.settings.update`: Sync local debug settings to [Java Debug Server][1]. Done automatically when Vimspector is started with `java.debug.vimspector.start` command.

### Command Arguments

Optionally, `java.debug.vimspector.start` will accept a JSON string of settings which will be passed to Vimspector via ["LaunchWithSettings"][8].

You may use this feature to override values in your `.vimspector.json` file at runtime.

For example, here's how you could call it from within Vim with custom settings:

    :CocCommand java.debug.vimspector.start {"configuration":"Run Test","Test":"Name of the test"}

These settings will take precedence when launching Vimspector.

## Supported settings

The following settings are supported in [CocConfig][9]:

- `java.debug.vimspector.profile` : **(Deprecated)** Set to `null` and use `"default":true` in Vimspector.json instead. Specifies the Vimspector [profile][10] to activate when launching. Set to `null` to be prompted if multiple configurations are found and no default is set. Defaults to `Java Attach`
- `java.debug.vimspector.substitution.adapterPort` : Specifies the Vimspector [adapter port][11] substitution name in `.vimspector.json`. The actual port number will replace this value in the Vimspector config when the debug server is started. Defaults to `AdapterPort`
- `java.debug.logLevel`: minimum level of debugger logs that are sent to language server, defaults to `warn`.
- `java.debug.settings.showHex`: show numbers in hex format in "Variables" viewlet, defaults to `false`.
- `java.debug.settings.showStaticVariables`: show static variables in "Variables" viewlet, defaults to `false`.
- `java.debug.settings.showQualifiedNames`: show fully qualified class names in "Variables" viewlet, defaults to `false`.
- `java.debug.settings.showLogicalStructure`: show the logical structure for the Collection and Map classes in "Variables" viewlet, defaults to `true`.
- `java.debug.settings.showToString`: show 'toString()' value for all classes that override 'toString' method in "Variables" viewlet, defaults to `true`.
- `java.debug.settings.maxStringLength`: the maximum length of string displayed in "Variables" viewlet, the string longer than this length will be trimmed, defaults to `0` which means no trim is performed.
- `java.debug.settings.numericPrecision`: the precision when formatting doubles in "Variables" viewlet.
- `java.debug.settings.hotCodeReplace`: Reload the changed Java classes during debugging, defaults to `manual`.
- `java.debug.settings.exceptionBreakpoint.exceptionTypes`: Specifies a set of exception types you want to break on, e.g. `java.lang.NullPointerException`. A specific exception type and its subclasses can be selected for caught exceptions, uncaught exceptions, or both can be selected.
- `java.debug.settings.exceptionBreakpoint.allowClasses`: Specifies the allowed locations where the exception breakpoint can break on. Wildcard is supported, e.g. `java.*`, `*.Foo`.
- `java.debug.settings.exceptionBreakpoint.skipClasses`: Skip the specified classes when breaking on exception.
  - `$JDK` - Skip the JDK classes from the default system bootstrap classpath, such as rt.jar, jrt-fs.jar.
  - `$Libraries` - Skip the classes from application libraries, such as Maven, Gradle dependencies.
  - `java.*` - Skip the specified classes. Wildcard is supported.
  - `java.lang.ClassLoader` - Skip the classloaders.
- `java.debug.settings.stepping.skipClasses`: Skip the specified classes when stepping.
  - `$JDK` - Skip the JDK classes from the default system bootstrap classpath, such as rt.jar, jrt-fs.jar.
  - `$Libraries` - Skip the classes from application libraries, such as Maven, Gradle dependencies.
  - `java.*` - Skip the specified classes. Wildcard is supported.
  - `java.lang.ClassLoader` - Skip the classloaders.
- `java.debug.settings.stepping.skipSynthetics`: Skip synthetic methods when stepping.
- `java.debug.settings.stepping.skipStaticInitializers`: Skip static initializer methods when stepping.
- `java.debug.settings.stepping.skipConstructors`: Skip constructor methods when stepping.
- `java.debug.settings.jdwp.limitOfVariablesPerJdwpRequest`: The maximum number of variables or fields that can be requested in one JDWP request. The higher the value, the less frequently debuggee will be requested when expanding the variable view. Also a large number can cause JDWP request timeout. Defaults to 100.
- `java.debug.settings.jdwp.requestTimeout`: The timeout (ms) of JDWP request when the debugger communicates with the target JVM. Defaults to 3000.
- `java.debug.settings.jdwp.async`: Experimental: Controls whether the debugger is allowed to send JDWP commands asynchronously. Async mode can improve remote debugging response speed on high-latency networks. Defaults to `auto`, and automatically switch to async mode when the latency of a single jdwp request exceeds 15ms during attach debugging.
  - `auto` (Default)
  - `on`
  - `off`
- `java.debug.settings.debugSupportOnDecompiledSource`: [Experimental]: Enable debugging support on the decompiled source code. Be aware that this feature may affect the loading speed of Call Stack Viewlet. You also need [Language Support for Java by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.java)@1.20.0 or higher to use this feature.

## Usage and Setup

This example will use [Vimspector][6] as the user interface for interacting with the [Java Debug Server][1] from within Vim.

It will demonstrate attaching to a Java program that is running with remote debugging enabled.

### Setup Vimspector

Install the [Vimspector][5] plugin for Vim.

Add a `.vimspector.json` file in the root directory of your Java project with the following contents. Note,
don't change `"${AdapterPort}"`. See [issue #3][7] for an explanation of how this port value works.

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

*Review the [Vimspector config][12] docs for what's possible within this file.*

#### Configure Vim

This extension provides `:CocCommand java.debug.vimspector.start` to simplify launching Vimspector.

*Note, it does not start your Java process in debug mode. An example of this is covered below.*

Add the following config to your `~/.vimrc` file or wherever appropriate for your Vim setup to further simplify
launching Vimspector.

    " Press F1 key to lanuch Vimspector
    nmap <F1> :CocCommand java.debug.vimspector.start<CR>

##### Alternative Configuration (Optional)

If you'd prefer to launch the Vimspector plugin directly with your own configuration then add something similar the
following config to your `~/.vimrc` file or wherever appropriate for your Vim setup.

*Note, this will bypass using the `:CocCommand` documented above to start the debug session.*

    function! JavaStartDebugCallback(err, port)
      execute "cexpr! 'Java debug started on port: " . a:port . "'"
      call vimspector#LaunchWithSettings({ "configuration": "Java Attach", "AdapterPort": a:port })
    endfunction

    function JavaStartDebug()
      call CocActionAsync('runCommand', 'vscode.java.startDebugSession', function('JavaStartDebugCallback'))
    endfunction

    nmap <F1> :call JavaStartDebug()<CR>

This example provides a way to start the Java debug server through coc.vim and then tell Vimspector which port to use to
connect to the debug server. It maps the `F1` key to kick things off, but you can change this key mapping to whatever
you want.

#### Start the debug session

First, run a Java program with [remote debugging enabled][13].
Be sure it is configured to pause and wait for a remote connection on port `5005` for this example work.

For a simple Java program. Create a `Hello.java` file with these contents.

    public class Hello {
      public static void main(String[] args) {
        System.out.println("Hello World!");
      }
    }

Next, run these commands from a shell to compile the program and then start it with remote debugging enabled.

    javac -g Hello.java
    java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=y Hello

Alternatively, you may use Maven for this step [remote debugging Maven tests][14].

    mvn test -Dmaven.surefire.debug

If everything works correctly you will see this message.

> Listening for transport dt_socket at address: 5005

Now, open the file you want to debug in Vim and set a [breakpoint with Vimspector][15].

Finally, start the debug session in Vim by pressing your `F1` key or use your custom key mapping if you have altered the
config from this example. This should result in Vimspector opening in a new tab in Vim with your Java program paused at
the breakpoint you set.

That's it! You may now [step debug][15] your way through a Java program from within Vim.

*Note, if you use a Java debug port different than `5005` you will need to change that value in your `.vimspector.json`
file. It is also possible to configure this port dynamically in Vimspector in the same manner as the debug adapter
port.*

## License

EPL 2.0, See [LICENSE](LICENSE) for more information.

[0]: https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions
[1]: https://github.com/Microsoft/java-debug
[2]: https://github.com/eclipse/eclipse.jdt.ls
[3]: https://github.com/neoclide/coc-java
[4]: https://github.com/neoclide/coc-java#quick-start
[5]: https://github.com/puremourning/vimspector#installation
[6]: https://puremourning.github.io/vimspector-web/
[7]: https://github.com/dansomething/coc-java-debug/issues/3#issuecomment-622075010
[8]: https://github.com/puremourning/vimspector#launch-with-options
[9]: https://github.com/neoclide/coc.nvim/wiki/Using-the-configuration-file#configuration-file-resolve
[10]: https://puremourning.github.io/vimspector/configuration.html#debug-profile-configuration
[11]: https://puremourning.github.io/vimspector/configuration.html#adapter-configurations
[12]: https://puremourning.github.io/vimspector/configuration.html
[13]: https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/conninv.html#Invocation
[14]: https://maven.apache.org/surefire/maven-surefire-plugin/examples/debugging.html
[15]: https://github.com/puremourning/vimspector#mappings
