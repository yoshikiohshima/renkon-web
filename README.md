# Renkon-Web: A Web UI framework based on FRP

## Introduction

Renkon Web is a UI framework built upon FRP (Functional Reactive Programming). Refer to [Renkon-Core](https://github.com/yoshikiohshima/renkon) for the core language references.

To start a Renkon-web application, make a .html file that looks like:

```HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"> 
  </head>
  <body>
    <div id="renkon">
      <script type="reactive">
         const a = Events.timer(100);
	 console.log(a);
      </script>
    </div>
    <script type="module">
      import {view} from "https://cdn.jsdelivr.net/npm/renkon-web/dist/renkon-web.js";
      view();
    </script>
  </body>
</html>
```

or copy renkon-web.js file to your project directory and load it as

```JavaScript
import {view} from "./renkon-web.js";
```

The `view()` function scans an element whose `id` is `renkon`. When it finds a script element with `type="reactive"` it treats the content of the script element as Renkon program.

The element with `id="renkon` may have any other elements, as this is just a regular HTML. A common structure is to have your base DOM structure in the `id="renkon"` `div` element, and the program manipulates those elements.

One can use the HTM library (Hyperscript Tagged Markup) from the
Preact community. HTM is like JSX used by React and other frameworks,
but it instead uses JavaScript's built-in "tagged templates" feature
to construct virtual DOM elements. It can "render" virtual DOM
elements as actual DOM elements. HTM is a great match with a reactive
framework, as the virtual DOM elements themselves can be used as
values within the framework. In other words, instead of writing code
that "does" something on a DOM element to make it so, you write code
to produce a value that says the DOM should "be" like this. If you
have the `collection` in the example above, you can make a list of
`span`s for each element and "render" them:

```JavaScript
const preactModule = import('https://unpkg.com/htm/preact/standalone.module.js');
const html = preactModule.html;
const render = preactModule.render;

const dom = html`<div class="foo">${collection.map((word) => html`<span>${word}</span>`)}</div>`;
render(dom, document.querySelector("#output"));

```
