import {version} from "renkon-core";
export {ProgramState, parseJSX, transpileJSX, translateTS, version} from "renkon-core";
export {view} from "./system";
export {newInspector} from "./inspector";
import * as C from "codemirror";
import {keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";

export const CodeMirror = {...C, keymap, indentWithTab};

console.log("Renkon version:" + version);
