<!-- 
```html

```
-->


## Beispiel 1: x-data, x-text, x-html

```html
<div x-data="{name: 'Zura', message: 'Hello <b>World</b>' }"> <!-- 1 -->
  <p x-text="name"></p> <!-- 2 -->
  <p x-html="message"></p> <!-- 3 -->
</div>
<div
  x-data
  x-text="await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).text()" <!-- 4 -->
></div>
```

#### Annotations:

1. `x-data` macht das `<div>` zu einem _Alpine_-Component. Die Daten können
   jetzt innerhalb des Components verwendet.
0. `x-text` greift auf das Element `name` in `x-data` zu – und zwar so, dass
   HTML-spezifische Zeichen _umgeschrieben_ werden.
0. `x-html` greift auf das Element `message` in `x-data` zu – und zwar so, dass
   HTML-spezifische Zeichen _ihre volle Wirksamkeit behalten!_
0. Hier wird das JSON einer Webseite als `x-text` ausgegeben.
    - als erstes werden die Daten von der Seite geholt. Mit `fetch()`.
      `fetch()` gibt ein _Promise_ zurück. Deshalb brauchen wir `await`.
    - Die _Payload_ des Promises ist das JSON-Objekt. Wenn wir `.text()` darauf
      ansetzen, gibt es seinerseits ein _Promise_ zurück, mit seinem Inhalt in
      Textform als _Payload_. Deshalb brauchen wir das äußere `await`.
    - Das äußere `await` beschert uns nun die „nackte“ Textversion des
      JSON-Objekts, das wir heruntergeladen haben. Die können wir jetzt mit
      `x-text` anzeigen lassen.


## Beispiel 2: Methoden in x-data 


```html
<div
  x-data="{
    message: 'Click me to change', 
    change() { 
      this.message = 'Changed message' 
    } 
  }"
>
  <span x-html="message" @click="change()"></span>
</div>
```

#### Anmerkungen:

1. Methoden funktionieren in _Alpine_ nur, wenn sie __nicht__ als
   arrow-functions definiert werden. Wenn wir es so wie hier im Beispiel
   machen, sind wir auf der sicheren Seite.
2. `x-html` dient der Ausgabe, _ohne_ html-spezifische Zeichen umzuwandeln.
3. `@click` ist eine Kurzform für `x-on:click` und bedeutet: „Bei Klick auf
   dieses Element...“ wird die Methode `change()` ausgeführt.


## „Einer für alle“ – wiederverwertbare x-data


```javascript
// file: app.js
document.addEventListener("alpine:init", () => {  // -1-
  Alpine.data("dropdown", () => ({                // -2-
    open: false,
    message: "Something",
    other_message: "Something else";

    toggle() {
      this.open = !this.open;
    },
}));
```
```html
<!-- file: index.html -->
<header>
  <script
    defer
    src="https://unpkg.com/alpinejs@3.10.2/dist/cdn.min.js"
  ></script>
  <script src="app.js"></script> <!--                -3- -->
</header>

<!-- Re-usable Data -->
<div x-data="dropdown"> <!--                         -4- -->
  <button @click="toggle">Open/Close</button>
  <div x-show="open" x-text="message"></div>
</div>

<div x-data="dropdown"> <!--                         -4- -->
  <button @click="toggle">Open/Close</button>
  <div x-show="open" x-text="other_message"></div>
</div>
```

### Anmerkungen

In diesem Beispiel geht es darum, `x-data` einheitlich für _mehrere_ 
AlpineJS-Components verfügbar zu machen.

1. `alpine:init` sorgt dafür, dass die Arrow-Function ausgeführt wird,
   _nachdem_ AlpineJS geladen wurde, aber __bevor__ es seine eigene
   Init-Routine aufruft. _Sinn und Zweck:_ Was hier geladen wird, wird
   integraler Bestandteil der aktuellen AlpineJS-Instanz!
2. Einziger Zweck der Arrow-Funktion ist es, ein Objekt zurückzugeben, damit
   dieses Objekt mit `dropdown` verknüpft werden kann. Eine direkte Zuweisung,
   _ohne_ den Umweg über die Arrow-Funktion würde nicht zu einer völlig neuen
   Instanz des Objekts führen. (Die alte Vue-Geschichte mit `data: () => {
   return ... }` spielt hier mit rein.)
3. Wichtig ist, dass `app.js` erst __nach__ AlpineJS geladen wird. Vorher kann
   `alpine:init` nicht greifen!
4. Die beiden Instanzen greifen beide auf denselben `dropdown` zu, der in
   `app.js` definiert wurde. Genau das war Sinn und Zweck dieser ganzen Übung!

## x-data ohne Daten 

```html
<!-- Data-Less components -->
<div x-data @click="console.log('Oh Yeah!')"></div>
```

Ein sehr einfaches Beispiel. Hier erscheint einfach `x-data` im Element, _ohne_
ein Datenobjekt. Dafür aber mit einem Event-Handler: `@click`. __Sinn und
Zweck__ ist hier, den Alpine-Event-Handler möglich zu machen. Ohne `x-data`
funktioniert das nicht.

## Daten aus dem Store

Das folgende Beispiel nutzt Daten, die im _Alpine Store_ abgelegt wurden. Der
_Store_ ist in _AlpineJS_ immer vorhanden; er bleibt nur in den meisten Fällen
leer. Sein Sinn und Zweck ist, Daten _komponenten-übergreifend_ verfügbar zu machen.

```javascript
// file: app.js
document.addEventListener("alpine:init", () => { // -1-
  Alpine.store("currentUser", { // -2-
    username: 'The Alpinista',
    posts: ['Post_01', 'Post_02'],
  });
});
```

```html
<!-- file: index.html -->
<div x-data x-text="$store.currentUser.username"></div>  <!-- 3 -->
```

### Anmerkungen

1. Auch der _Store_ muss im `alpine:init`-Hook initialisiert werden, damit wir
   ihn nutzen können. _Sinn und Zweck:_ Was hier geladen wird, wird integraler
   Bestandteil der aktuellen AlpineJS-Instanz!
0. Hier wird im _Store_ das Datenobjekt dem Eintrag `currentUser` zugeordnet.
   Wir können so wie hier Dutzende Einträge mehr vornehmen; sie müssten nur
   eine andere _Store ID_ (wie hier `currentUser`) haben.
0. Mit Hilfe von `$store.currentUser` stehen uns die Daten dann in unserem
   _AlpineJS_-Component zur Verfügung.


## x-init vs x-data

`x-init` initialisiert ein _AlpineJS_-Component, ohne allerdings
Component-Daten zur Verfügung zu stellen. Das hat gegenüber `x-data` manchmal
Vorteile.

```html
<div x-init="console.log('Initializing this component!')"></div>
```

In diesem Beispiel beginnt _AlpineJS_ gleich nach dem Rendern des Components
mit einem Eintrag auf der Konsole!

```html
<div
  x-data="{
    init(){
        console.log('I am initialized')
    }
}"
></div>
```

In diesem Beispiel wird gleich nach dem Rendern des Components die `init()`
Methode ausgeführt. Das können wir dafür ausnutzen, Daten mit `fetch()` aus dem
Netz zu holen und dann in dieses Component einzubauen (vgl. nächstes Beispiel).

```html
<div
  x-data="{todo: {}}"
  x-init="todo = await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json()"
>
  <span x-text="`Todo ID: `+todo.id"></span>
</div>
```

Hier passiert genau das, was wir vorher beschrieben haben: Direkt nach dem
Rendern dieses Components wird mit Hilfe von `fetch()` etwas aus dem Netz
geholt und dann in `x-data` eingebaut. Mit dem Code aus dem vorigen Beispiel
würden wir das gleiche so erreichen:

```html
<div
  x-data="{
    // todo: needn't be initialized!
    async init(){
        rawData = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        this.todo = await rawData.json()
    }
}"
></div>
```

