import { Inspector } from '@observablehq/inspector';

// verbatim copy of "https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css"
const inspectorCSS = `
:root{--syntax_normal:#1b1e23;--syntax_comment:#a9b0bc;--syntax_number:#20a5ba;--syntax_keyword:#c30771;--syntax_atom:#10a778;--syntax_string:#008ec4;--syntax_error:#ffbedc;--syntax_unknown_variable:#838383;--syntax_known_variable:#005f87;--syntax_matchbracket:#20bbfc;--syntax_key:#6636b4;--mono_fonts:82%/1.5 Menlo,Consolas,monospace}
.observablehq--collapsed,.observablehq--expanded,.observablehq--function,.observablehq--gray,.observablehq--import,.observablehq--string:after,.observablehq--string:before{color:var(--syntax_normal)}
.observablehq--collapsed,.observablehq--inspect a{cursor:pointer}
.observablehq--field{text-indent:-1em;margin-left:1em}.observablehq--empty{color:var(--syntax_comment)}
.observablehq--blue,.observablehq--keyword{color:#3182bd}.observablehq--forbidden,.observablehq--pink{color:#e377c2}
.observablehq--orange{color:#e6550d}.observablehq--boolean,.observablehq--null,.observablehq--undefined{color:var(--syntax_atom)}
.observablehq--bigint,.observablehq--date,.observablehq--green,.observablehq--number,.observablehq--regexp,.observablehq--symbol{color:var(--syntax_number)}
.observablehq--index,.observablehq--key{color:var(--syntax_key)}.observablehq--prototype-key{color:#aaa}
.observablehq--empty{font-style:oblique}.observablehq--purple,.observablehq--string{color:var(--syntax_string)}
.observablehq--error,.observablehq--red{color:#e7040f}
.observablehq--inspect{font:var(--mono_fonts);overflow-x:auto;display:block;white-space:pre}
.observablehq--error .observablehq--inspect{word-break:break-all;white-space:pre-wrap}`;

let inspector;

export function showInspector(programState /*:ProgramStateType*/, show /*:boolean*/, dom/*:HTMLElement*/) {
    if (!document.head.querySelector("#inspector-css")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.textContent = inspectorCSS;
        link.id = "inspector-css"
        document.head.appendChild(link);
    }

    if (!dom) {
        dom = document.createElement("div");
        const renkon = document.body.querySelector("#renkon");
        if (renkon && renkon.parentNode) {
            renkon.parentNode.insertBefore(dom, renkon.nextSibling);
        } else {
            document.body.appendChild(dom);
        }
    }

    if (!show) {
        if (inspector) {
            inspector.fulfilled(null);
            inspector = null;
        }
    } else {
        inspector = new Inspector(dom);
        inspector.fulfilled(programState.resolved);
    }
}