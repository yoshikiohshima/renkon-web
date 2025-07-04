import { basicSetup } from "codemirror";
import {EditorView, keymap} from "@codemirror/view";
import {indentWithTab} from "@codemirror/commands";
//import { html, htmlLanguage } from "https://esm.sh/@codemirror/lang-html@v6.4.9"
import {ProgramState, transpileJSX, translateTS} from "renkon-core";
import {getContentFromHTML, loadFile, makeHTMLFromContent, saveFile} from "./load";

let myResizeHandler: (() => void) | null = null;

const css = `html, body, #renkon {
    height: 100%;
}
body {
    margin: 0px;
}

.dock {
    position: fixed;
    top: 300px;
    left: 0px;
    display: flex;
    box-shadow: 10px 10px 5px #4d4d4d, -10px -10px 5px #dddddd;
    transition: left 0.5s;
    background-color: white;
}

.dock .editor {
    flex-grow: 1;
    margin: 0px 20px 0px 20px;
    background-color: #ffffff;
    border: 1px solid black;
}

.dock #buttonRow {
    display: flex;
}

.dock #drawerButton {
    align-self: center;
    padding: 40px 8px 40px 8px;
    cursor: pointer;
}

.dock #updateButton {
    margin-left: 40px;
}

.dock #fileName {
    border: 1px black solid;
    min-width: 160px;
    margin: 10px 10px 10px 10px;
}

.dock .button {
    margin: 10px 0px 10px 0px;
}
`;

function resizeHandler() {
    const dock:HTMLElement = document.querySelector("#dock")!;
    if (!dock) {return;}
    const toOpen = dock.classList.contains("opened");
    const width = dock.getBoundingClientRect().width;
    dock.classList.toggle("opened", toOpen);
    if (toOpen) {
        dock.style.left = `${window.innerWidth - width}px`;
    } else {
        dock.style.left = `${window.innerWidth - 80}px`;
    }
}

export function view(opt?:any) {
    const app = opt?.app;
    const noTicking = opt?.noTicking;
    const url = new URL(window.location.toString());
    const hideEditor = opt?.hideEditor || url.searchParams.get("hideEditor");
    let maybeDoc = url.searchParams.get("doc");
    let semi;
    if (maybeDoc) {
        semi = maybeDoc.indexOf(";");
        if (semi >= 0) {
            maybeDoc = maybeDoc.slice(0, semi);
        }
    }

    const renkon:HTMLElement = document.body.querySelector("#renkon")!;
    const programState = new ProgramState(Date.now(), app, noTicking);
    (window as any).programState = programState;
    let {dock, editorView} = createEditorDock(renkon, programState);
    if (hideEditor) {
        (dock as HTMLElement).style.display = "none";
    }
    document.body.appendChild(dock);

    if (myResizeHandler) {
        window.removeEventListener("resize", myResizeHandler);
    }
    myResizeHandler = resizeHandler;
    window.addEventListener("resize", myResizeHandler);

    if (maybeDoc) {
        document.querySelector("#fileName")!.textContent = maybeDoc;
        load(renkon, editorView, programState);
        return;       
    }

    update(renkon, editorView, programState);
}

function createEditorDock(renkon:HTMLElement, programState:ProgramState) {
    const div = document.createElement("div");
    div.innerHTML = `
<div id="dock" class="dock">
   <div id="drawerButton">◀️</div>
   <div id="drawerBody">
     <div id="buttonRow">
       <button id="updateButton" class="updateButton button">Update</button>
       <div contentEditable id="fileName"></div>
       <button id="loadButton" class="loadButton button">Load</button>
       <button id="saveButton" class="saveButton button">Save</button>
     </div>
     <div id="editor" class="editor"></div>
  </div>
</div>
`;

    if (!document.head.querySelector("#renkon-css")) {
        const style = document.createElement("style");
        style.textContent = css;
        style.id = "renkon-css";
        document.head.appendChild(style);
    };

    const dock = div.querySelector("#dock")!;
    const editor = dock!.querySelector("#editor")!;

    editor.classList.add("editor");
    const editorView = new EditorView({
        doc: renkon.innerHTML.trim(),
        extensions: [basicSetup, EditorView.lineWrapping, keymap.of([indentWithTab])],
        parent: editor,
    });
    editorView.dom.style.height = "500px";
    editorView.dom.style.width = "60vw";

    const updateButton = dock.querySelector("#updateButton")! as HTMLButtonElement;
    updateButton.textContent = "Update";
    updateButton.onclick = () => update(renkon, editorView, programState);

    const loadButton = dock.querySelector("#loadButton")! as HTMLButtonElement;
    loadButton.textContent = "Load";
    loadButton.onclick = () => load(renkon, editorView, programState);

    const saveButton = dock.querySelector("#saveButton")! as HTMLButtonElement;
    saveButton.textContent = "Save";
    saveButton.onclick = () => save(renkon, editorView, programState);

    const drawerButton = dock.querySelector("#drawerButton")! as HTMLButtonElement;
    drawerButton.onclick = () => toggleDock(dock as HTMLElement);
    toggleDock(dock as HTMLElement, false);
    return {dock, editorView, updateButton};
}   

async function update(renkon:HTMLElement, editorView:EditorView, programState: ProgramState) {
    renkon.innerHTML = editorView.state.doc.toString();
    let scripts = [...renkon.querySelectorAll("script[type='reactive'],script[type='reactive-ts']")] as HTMLScriptElement[];
    let text = scripts.map((s, i) => {
        if (s.getAttribute("type") === "reactive-ts" && s.textContent) {
            return translateTS(s.textContent, s.id || `${i}.ts`);
        }
        return s.textContent;
    }).filter((s) => s);
    let jsxElements = [...renkon.querySelectorAll("script[type='renkon-jsx']")] as HTMLScriptElement[];
    type JSXS = {element: HTMLScriptElement, code: string};
    let jsxs:Array<JSXS> = jsxElements.map((s) => ({element: s, code: s.textContent!})).filter((s) => s.code);

    const programs = [...text];
    if (jsxs.length > 0) {

        const translated = jsxs.map((jsx, index) => {
            const str = transpileJSX(jsx.code);
            const div = document.createElement("div");
            div.id = `jsx-${index}`;
            if (jsx.element.style.cssText !== "") {
            div.setAttribute("style", jsx.element.style.cssText);
            }
            renkon.insertBefore(div, jsx.element.nextSibling);
            const renderString = `render(${str}, document.querySelector("#${div.id}"))`;
            return renderString;
        
        });
        programs.push(...translated);
    }

    programState.setupProgram(programs as string[]);
    programState.evaluator(Date.now());
}

function toggleDock(dock:HTMLElement, force?:boolean) {
    const toOpen = force !== undefined ? force : !dock.classList.contains("opened");
    const width = dock.getBoundingClientRect().width;
    dock.classList.toggle("opened", toOpen);
    if (toOpen) {
        dock.style.left = `${window.innerWidth - width}px`;
    } else {
        dock.style.left = `${window.innerWidth - 80}px`;
    }
}

function save(_renkon:HTMLElement, editorView:EditorView, _programState:ProgramState) {
    const fileName = document.querySelector("#fileName")!.textContent;
    if (!fileName) {return;}
    const content = editorView.state.doc.toString();
    const html = makeHTMLFromContent(content);
    saveFile(fileName, html);
}

async function load(renkon:HTMLElement, editorView:EditorView, programState:ProgramState) {
    const fileName = document.querySelector("#fileName")!.textContent;
    if (!fileName) {return;}
    const html = await loadFile(fileName);
    const content = getContentFromHTML(html);
    editorView.dispatch({changes: {from: 0, to: editorView.state.doc.length, insert: content}});
    update(renkon, editorView, programState);
}
