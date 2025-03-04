import {version} from "renkon-core";
export {ProgramState, parseJSX, transpileJSX, translateTS, version} from "renkon-core";
export {view} from "./system";
export {newInspector} from "./inspector";
export * as CodeMirror from "codemirror";

console.log("Renkon version:" + version);
