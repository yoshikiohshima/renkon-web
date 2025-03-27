import {version, globals} from "renkon-core";
export {ProgramState, parseJSX, transpileJSX, translateTS, globals, version} from "renkon-core";
export {view} from "./system";
export {newInspector} from "./inspector";
import * as C from "codemirror";
import {keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";
import {javascript, esLint} from "@codemirror/lang-javascript";
import {linter, lintGutter} from "@codemirror/lint";

import * as eslint from "eslint-linter-browserify";

export const CodeMirror = {...C, keymap, indentWithTab, javascript, linter, lintGutter, esLint, eslint, globals};

console.log("Renkon version:" + version);
