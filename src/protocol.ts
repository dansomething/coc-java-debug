import { Range } from 'coc.nvim';

export interface IMainClassOption {
  readonly mainClass: string;
  readonly projectName?: string;
  readonly filePath?: string;
}

export interface IMainMethod extends IMainClassOption {
  readonly range: Range;
}

export type MainMethodResult = Array<IMainClassOption>;

// See https://github.com/microsoft/vscode-java-debug#options
export interface ISubstitutionVar {
  readonly adapterPort: string;
  readonly classPaths: string;
  readonly mainClass: string;
  readonly modulePaths: string;
  readonly projectName: string;
}

export interface IClassPath {
  readonly modulePaths: string[];
  readonly classPaths: string[];
}
