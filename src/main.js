export {ProgramState, parseJSX, transpileJSX, translateTS, loader, globals, version} from "renkon-core";
export {view} from "./system";
export {CodeMirror} from "renkon-codemirror";
export {newInspector} from "renkon-inspector";

import packageJson from "../package.json";
const version = packageJson.version;
console.log("Renkon Web version:" + version);
