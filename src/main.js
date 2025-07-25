import {version, globals} from "renkon-core";
export {ProgramState, parseJSX, transpileJSX, translateTS, globals, version} from "renkon-core";
export {view} from "./system";
export {newInspector} from "./inspector";
import * as C from "codemirror";
import * as V from "@codemirror/view";
import * as Com from "@codemirror/commands";
import * as Lang_J from "@codemirror/lang-javascript";
import * as Lint from "@codemirror/lint";
import * as Search from "@codemirror/search";

import * as eslint from "eslint-linter-browserify";

export const CodeMirror = {
    ...C,
    view: V,
    commands: Com,
    "lang-javascript": Lang_J,
    lint: Lint,
    search: Search,
    "eslint-linter-browserify": eslint,
    globals
};

console.log("Renkon version:" + version);
