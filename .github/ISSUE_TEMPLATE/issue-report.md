---
name: Issue report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''
---

**Describe the issue**
A clear and concise description of the problem.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Open this file '....'
3. Run this command '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Versions of relevant software**

- vim:
- coc.nvim:
- coc-java:
- vimspector:
- java:
- maven:

**Relevant logs and error messages**

- View the trace logging output for the Java language server:
  - Set `{ "java.trace.server": "verbose" }` in `:CocSettings`.
  - Run the command `:CocCommand workspace.showOutput java`.
  - Are there any errors?
- View the Vimspector log `:VimspectorShowOutput Vimspector`.
  - Are the any errors?
- After running the command `:CocCommand java.debug.vimspector.start` Do you see a message like `[coc.nvim] Java debug server started on port` in the output of `:messages`?

**Additional context**
Add any other context about the problem here.

**Screenshots**
If applicable, add screenshots to help explain your problem.
