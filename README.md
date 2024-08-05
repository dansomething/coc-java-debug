# coc-java-debug

An [extension][0] for [coc.nvim][17] to enable the [Java Debug Server][1] for the Java language server ([jdt.ls][2]) in
Vim/Neovim.

It also provides an easy way to launch [Vimspector][19] and connect it to the Java debug server.

## Features

- Integration with [Vimspector][6].
- Launch Vimspector and connect to the Java debugger with a single command.
- Provide Vimspector config substitutions for the following Java project values:
  - class paths
  - main class
  - module paths
  - project name
- Configure Java debug settings.

## Requirements

- Install the [coc.nvim][17] plugin.
- Install the [Vimspector][5] plugin.
- Install the [coc-java][4] extension.

## Quick Start

Install the coc-java-debug extension.

```sh
:CocInstall coc-java-debug
```

Open a Java file with a main method in Vim.

Set a [breakpoint][15] in your main method.

Execute this Vim command.

```sh
:CocCommand java.debug.vimspector.start
```

## Goals

- Provide a simple integration between [Vimspector][19] and the [Java Debug Server][1].
- Provide Java-specific replacements for Vimspector's [native config][10].
  - See `java.debug.vimspector.substitution.*` settings.
- Support Vim and Neovim.

## Non-Goals

- This project is not intended to be a clone of [vscode-java-debug][16].

## Available commands

The following `:CocCommand` options are provided:

- `java.debug.vimspector.start`: Launch Vimspector and connect it to the [Java Debug Server][1].
- `java.debug.settings.update`: Sync local debug settings to [Java Debug Server][1]. Done automatically when Vimspector is started with `java.debug.vimspector.start` command.

### Command Arguments

`java.debug.vimspector.start`

- Optionally accepts a JSON string of settings to be passed to Vimspector using ["LaunchWithSettings"][8] internally.
- This feature may be used to override values in the Vimspector config at runtime.
- For example, it can be used to specify which configuration to load and a [replacement][10] value.

```viml
:CocCommand java.debug.vimspector.start {"configuration":"Run Test","Test":"Name of the test"}
```

## Supported settings

The following settings are supported in [CocConfig][9]:

### java.debug.vimspector

- `java.debug.vimspector.config.createIfNotExists` : If `true` then a `.vimspector.json` config will be created in the workspace if one doesn't already exist, defaults to `true`.
- `java.debug.vimspector.substitution.adapterPort` : Specifies the [adapter port][11] substitution name for use in `.vimspector.json`. The actual port number will replace this value in the config when the debug server is started, defaults to `AdapterPort`.
- `java.debug.vimspector.substitution.classPaths` : Specifies the 'class paths' substitution name for use in `.vimspector.json`. The actual class paths will replace this value in the Vimspector config, defaults to `ClassPaths`.
- `java.debug.vimspector.substitution.mainClass` : Specifies the 'main class' substitution name for use in `.vimspector.json`. The actual main class will replace this value in the Vimspector config, defaults to `MainClass`.
- `java.debug.vimspector.substitution.modulePaths` : Specifies the 'module paths' substitution name for use in `.vimspector.json`. The actual module paths will replace this value in the Vimspector config, defaults to `ModulePaths`.
- `java.debug.vimspector.substitution.projectName` : Specifies the 'project name' substitution name for use in `.vimspector.json`. The actual project name will replace this value in the Vimspector config, defaults to `ProjectName`.

### java.debug.settings

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

### Debug a Main Method

This example will demonstrate how to load a Java program with a main method and debug it using Vimspector.

If you don't have a `.vimspector.json` file in the root directory of your Java project then `coc-java-debug` will create
one for you unless `java.debug.vimspector.config.createIfNotExists` is disabled.

If you already have a `.vimspector.json` file then add the config below.

```json
{
  "adapters": {
    "coc-java-debug": {
      "port": "${AdapterPort}"
    }
  },
  "configurations": {
    "javaLaunch": {
      "default": true,
      "adapter": "coc-java-debug",
      "configuration": {
        "args": "${args}",
        "request": "launch",
        "projectName": "${ProjectName}",
        "mainClass": "${MainClass}",
        "classPaths": ["*${ClassPaths}"]
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
```

Next, open a Java file with a main method in Vim and set a [breakpoint][15] in your main method.

Execute the command to start debugging.

```viml
:CocCommand java.debug.vimspector.start
```

You will be prompted with

> Enter value for args:

If you don't have any program arguments just press your enter key.
Otherwise, type in your args just as you would from a terminal and then press your enter key.

At this point Vimspector should open and pause your Java program on the breakpoint you set.

That's it! You may now [step debug][20] your way through your Java program from within Vim.

### Remote Debugging

This example will demonstrate attaching to a Java program that is running with remote debugging enabled. This is useful
for debugging tests or running services.

#### Vimspector Attach Config

Add the following contents to the `.vimspector.json` file in the root directory of your Java project. Note, don't change
`"${AdapterPort}"`. See [issue #3][7] for an explanation of how this port value works.

```json
{
  "adapters": {
    "coc-java-debug": {
      "port": "${AdapterPort}"
    }
  },
  "configurations": {
    "javaAttach": {
      "default": true,
      "adapter": "coc-java-debug",
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
```

*Review the [Vimspector config][12] docs for what's possible within this file.*

##### Configure Vim

This extension provides `:CocCommand java.debug.vimspector.start` to simplify launching Vimspector.

*Note, it does not start your Java process in remote debug mode. An example of how to do that is covered below.*

To further simplify, launching Vimspector, add the following config to your `~/.vimrc` file or wherever appropriate for
your Vim setup.

```viml
" Press F1 key to launch Vimspector
nmap <F1> :CocCommand java.debug.vimspector.start<CR>
```

##### Start the Remote Debug Session

First, run a Java program with [remote debugging enabled][13].
Be sure it is configured to pause and wait for a remote connection on port `5005` for this example work.

For a simple Java program. Create a `Hello.java` file with these contents.

```java
public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}
```

Next, run these commands from a shell to compile the program and then start it with remote debugging enabled.

```sh
javac -g Hello.java
java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=y Hello
```

If everything works correctly you will see this message.

> Listening for transport dt_socket at address: 5005

Now, open the file you want to debug in Vim and set a [breakpoint with Vimspector][15].

Finally, start the debug session in Vim by pressing your `F1` key or use your custom key mapping if you have altered the
config from this example. This should result in Vimspector opening in a new tab in Vim with your Java program paused at
the breakpoint you set.

That's it! You may now [step debug][20] your way through a Java program from within Vim.

*Note, if you use a Java debug port different than `5005` you will need to change that value in your `.vimspector.json`
file. It is also possible to configure this port dynamically in Vimspector in the same manner as the debug adapter
port.*

*Also note, if you use Maven for builds you may start [remote debugging][14] for tests and then run Vimspector.*

```sh
mvn test -Dmaven.surefire.debug
```

##### Alternative Configuration (Optional)

If you'd prefer to launch the Vimspector plugin directly with your own configuration then add something similar the
following config to your `~/.vimrc` file or wherever appropriate for your Vim setup.

*Note, this will bypass using the `:CocCommand` documented above to start the debug session.*

```viml
function! JavaStartDebugCallback(err, port)
  execute "cexpr! 'Java debug started on port: " . a:port . "'"
  call vimspector#LaunchWithSettings({ "configuration": "Java Attach", "AdapterPort": a:port })
endfunction

function JavaStartDebug()
  call CocActionAsync('runCommand', 'vscode.java.startDebugSession', function('JavaStartDebugCallback'))
endfunction

nmap <F1> :call JavaStartDebug()<CR>
```

This example provides a way to start the Java debug server through coc.vim and then tell Vimspector which port to use to
connect to the debug server. It maps the `F1` key to kick things off, but you can change this key mapping to whatever
you want.

## License

EPL 2.0, See [LICENSE](LICENSE) for more information.

[0]: https://github.com/neoclide/coc.nvim/wiki/Using-coc-extensions
[1]: https://github.com/Microsoft/java-debug
[2]: https://github.com/eclipse/eclipse.jdt.ls
[4]: https://github.com/neoclide/coc-java#quick-start
[5]: https://github.com/puremourning/vimspector#installation
[6]: https://puremourning.github.io/vimspector-web/
[7]: https://github.com/dansomething/coc-java-debug/issues/3#issuecomment-622075010
[8]: https://github.com/puremourning/vimspector#launch-with-options
[9]: https://github.com/neoclide/coc.nvim/wiki/Using-the-configuration-file#configuration-file-resolve
[10]: https://puremourning.github.io/vimspector/configuration.html#replacements-and-variables
[11]: https://puremourning.github.io/vimspector/configuration.html#adapter-configurations
[12]: https://puremourning.github.io/vimspector/configuration.html
[13]: https://docs.oracle.com/javase/8/docs/technotes/guides/jpda/conninv.html#Invocation
[14]: https://maven.apache.org/surefire/maven-surefire-plugin/examples/debugging.html
[15]: https://github.com/puremourning/vimspector?tab=readme-ov-file#breakpoints
[16]: https://github.com/microsoft/vscode-java-debug
[17]: https://github.com/neoclide/coc.nvim
[19]: https://github.com/puremourning/vimspector?tab=readme-ov-file#other-lsp-clients
[20]: https://github.com/puremourning/vimspector?tab=readme-ov-file#stepping
