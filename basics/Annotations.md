<!-- 
```html
```
-->

## TODO

- [ ] Lässt sich in der `x-for`-Zählschleife auch ein Offset und ein Limit angeben? 



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
<head>
  <script src="app.js"></script> <!--                -3- -->
  <script
    defer
    src="https://unpkg.com/alpinejs@3.10.2/dist/cdn.min.js"
  ></script>
</head>

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

## Scoping

```html
<div
  x-data="{
    name: 'John', 
    gender: 'male',
    age: 30
}"
>
  <div x-data="{name: 'Mary', age: 25}">
    <div x-data="{name: 'Zura'}">
      <span x-text="name"></span>
      <span x-text="age"></span>
      <span x-text="gender"></span>
    </div>
  </div>
</div>
```

Preisfrage: Welche Werte haben die `<span>`-Elemente? Richtige Antwort: 

```yaml
name: Zura
age: 25
gender: male
```

Die Regel: _Ein_ `x-data`, _das weiter innen steht, hat höhere Spezifizität,
und höhere Spezifizität setzt sich immer durch!_

## Getter und Setter

In _AlpinJS_ verwenden wir _Getter,_ um Werte in `x-data` oder im _Store_
direkt abzugreifen, oder um _abgeleitete Werte_ zu erstellen und verfügbar zu
machen.

```html
<div
  x-data="{
    open: false,
    get isOpen() {
        return this.open;
    },
    set isOpen(open) {
        this.open = open
    },
    toggle() {
        this.isOpen = !this.isOpen;
    }
}"
>
  <button @click="toggle">Open/Close</button>
  <div x-show="open">Content</div>
</div>
```

Wie man sieht, können wir mit Hilfe der reservierten Wörter `get` und `set`
Getter und Setter definieren. Eine Sonderrolle spielt `toggle()` – kein Getter
und kein Setter, sondern eine besondere Methode, die `open` ein- und wieder
abschaltet.

Im folgenden wird es physikalisch: `x-data` enthält eine Temperatur, die in
_Celsius_ gespeichert ist. Wir definieren außer dem einfachen Getter (Temperatur
in Celsius) auch noch Getter für Kelvin und Farenheit. Das wäre ein Beispiel
dafür, wie man Getter für  _abgeleitete Werte_ definiert.

```html
<div x-data="{
    temperature: 28,
    get celsius() { return this.temperature },
    get farenheit() { return this.temperature * 9 / 5 + 32 }
    get kelvin() { return this.temperature + 271 },
}">
```

## x-if vs x-show

`x-if` macht in 95% aller Fälle alles, was auch `x-show` macht. Allerdings
funktioniert `x-if` nur in einem `<template>`-Element!

```html
<div x-data="{ open: false }">
  <button x-on:click="open = ! open">Open/Close</button>

  <template x-if="open">
    <div>Content</div>
  </template>
</div>
```

In diesem Beispiel wird mit dem Button die _Alpine_-Variable `open` ein- und
ausgeschaltet. Das `<template>` reagiert mit `x-if` auf diesen Zustand und wird
angezeigt oder versteckt.

_Technisch betrachtet_ geht `x-if` auch ganz anders mit seinem Element um als
`x-show`:

1. Bei `x-if` werden alle „children“ innerhalb des `<template>`-Elements aus
   dem DOM gelöscht, bei `x-show` bleiben sie im DOM erhalten; sie werden nur
   nicht mehr angezeigt.
0. Bei `x-if` bleiben die _Styles_ (CSS) so wie sie sind, bei `x-show` bekommt
   das Element ein `style='display:none'` angehängt, so dass der Browser es
   nicht mehr anzeigt.

Das ist auch der Grund, warum _transitions_ und _Animationen_ bei `x-if`
nicht funktionieren: Beide sind abhängig von CSS – aber wie soll CSS greifen,
wenn die Elemente gar nicht mehr im DOM vorhanden sind?

## x-for als Listenschleife

Schleifen mit x-for gehören zum Elementarsten, das _AlpineJS_ zu bieten hat.
Mit Hilfe dieses Konstrukts kann man nämlich Datenlisten in HTML umformen.

```html
<div
  x-data="{
    posts: [
      { id: 1, title: 'title 1' }, 
      { id: 2, title: 'title 2' },
    ]
  }"
>
  <template x-for="(post, index) in posts" :key="post.id">
    <h2 x-text="post.id + '. ' + post.title"></h2>
  </template>
</div>
```

Dieses Beispiel enthält alle Elemente, die für die Arbeit mit `x-for` wichtig sind: 

1. `<template>`: Auch `x-for` funktioniert nur innerhalb einer
   `<template>`-Umgebung. Alles innerhalb dieser Umgebung wird schleifenweise
   wiederholt.
0. `x-for="(post, index)"`: Bei _AlpineJS_ gehört die Index-Nummer immer zum
   Service dazu. Das aktuelle Listenelement landet in diesem Beispiel in der
   Variablen `post`, die aktuelle Indexnummer in der Variablen `index`. Für
   _AlpineJS_ ist es einerlei, welche Variablennamen wir hier wählen. Auch
   `x-for="(zing, boff)"` würde funktionieren – solange wir innerhalb des
   `<template>`-Elements mit den gewählten Variablennamen arbeiten (und die
   Indexnummer kann auch fehlen).
0. `:key="post.id"`. Das bedeutet übersetzt so viel wie `"ORDER BY post.id"`.
   Ohne diese Angabe ist die Reihenfolge der Listen-Elemente nicht
   vorhersagbar, weil sie technisch auf ein `"ORDER BY memory_address"`
   hinausläuft. Das hängt einfach damit zusammen, wie JavaScript die Daten im
   Speicher organisiert. (Hier als _Linked List_ mit Pointern zu den einzelnen
   Element-Objekten. Sobald sich bei diesem Gebilde irgendwas ändert, ändern
   sich auch einige Speicheradressen, und dann ändert sich die Reihenfolge der
   angezeigten Elemente.)

## x-for als Zählschleife

Mit `x-for` lässt sich in _AlpineJS_ auch eine Zählschleife implementieren. Das
folgende Beispiel zeigt, wie es geht.

```html
<div x-data>
  <template x-for="n in 10">
    <p x-text="n"></p>
  </template>
</div>
```

Auch hier muss `x-for` für ein `<template>`-Element implementiert werden. Die
Syntax ist Python nachempfunden. Die Ausgabe ist eine Kette von Absätzen, die
von 1 bis 10 durchnumeriert sind.

## CSS-Klassen ändern mit x-bind

```html
<style>
  .red {
    background-color: red;
  }
  .green {
    background-color: green;
  }
</style>
<div x-data="{clicked: false}"> <!-- 1 -->
  <button
    class="red"                 
    x-bind:class="clicked ? 'clicked' : ''"
    @click="clicked = !clicked"
  >                             <!-- 2,3 -->
    Click me
  </button>
</div>
```

#### Anmerkungen:

1. Ganz einfache Initialisierung von `clicked`
0. `x-bind:class="..."` ist zu übersetzen mit: _„Wenn_ `clicked===true`,
   füge die CSS-Klasse_ `green` _den CSS-Klassen dieses Elements hinzu,
   andernfalls füge den Leerstring hinzu._ Das ist ein ganz schnöder _ternary
   operator_ in Aktion.
0. Da in CSS das Spätere das Frührere abrogiert, abrogiert `green` die Klasse
   `red` und der Button wird grün.
0. `@click="clicked=!clicked"` macht den Button zu einem Toggle.

Beachte, dass alle Aktionen auf dieses Component reduziert sind.

### CSS-Klassen mit „Schaltobjekten“ manipulieren

```html
<style>
  .red {
    background-color: red;
  }
  .green {
    background-color: green;
  }
</style>
<div x-data="{clicked: false}">
  <button 
    class="yellow" 
    :class="{'green': clicked}" 
    @click="clicked = !clicked"
  >
    Click me
  </button>
</div>
```

Dieses Beispiel arbeitet genau so wie das Vorangehende, nur dass wir hier ein
„Schaltobjekt“ in Aktion sehen.

#### Anmerkungen

1. `:class` ist eine Kurzform für `x-bind:class`
0. `{'green': clicked}` bedeutet übersetzt: _Füge die CSS-Klasse_ `green`
   _hinzu, FALLS_ `clicked===true` _ist._
0. `@click="clicked=!clicked"` macht den Button zu einem Toggle.

Das ist das besondere am Umgang mit Klassen bei _AlpineJS_. Anders als in der
Dokumentation ausdrücklich angegeben, werden CSS-Klassen im Bedarfsfall an die
Klassenliste angefügt oder wieder entfernt.

> [!warning]
> Die AlpineJS-Dokumentation ist an einer entscheidenden Stelle __irreführend:__
> “When using object-syntax, Alpine will NOT [sic!] preserve original classes
> applied to an element's class attribute.”
> ([Quelle](https://alpinejs.dev/directives/bind#class-object-syntax))
> [Weiter unten](https://alpinejs.dev/directives/bind#special-behavior)
> korrigieren sie diese Aussage dann selbst – mit stolz geschwellter Brust.
>
> Wahrscheinlich meinen sie: “When using object-syntax, Alpine will NOT
> replace [!!!] original classes applied to an element's class attribute.”
    
## Dynamische Inline-Styles mit x-bind:style

Im folgenden Beispiel geschieht die Um-Formatierung mit Hilfe eines neuen
Inline-Styles:

```html
<div x-data="{clicked: false}">
  <button
    style="color:navy"
    :style="clicked && {'backgroundColor': 'red'}"
    @click="clicked = !clicked"
  >
    Click me
  </button>
</div>
```

1. `:style` ist nur eine Kurzform für `x-bind:style`.
2. `clicked && {'backgroundColor': 'red'}`
    - `&&` macht das folgende abhängig vom `clicked`-Wert.
    - `backgroundColor` ist eine JavaScript-Umschreibung für das in CSS übliche
      `background-color`, denn in _Object Keys_ dürfen außer dem Unterstrich
      keine Striche vorkommen!
    - wenn `clicked===false` ist, wird der Style zu `style="false"`. (Ganz
      logisch, eigentlich ...)

Das bedeutet, dass die Einstellung `color:navy` __im Browser nur dann ankommt,
wenn__ `clicked===true` __ist!__

Das folgende Beispiel zeigt, wie man `color:navy` allerdings tasächlich
anzeigen kann:

```html
<div x-data="{clicked: false}">
  <button
    :style="{backgroundColor: clicked ? 'red' : ''}"
    @click="clicked = !clicked"
    style="color:navy"
  >
    Click me
  </button>
</div>
```
Aha! Der _ternary operator_ bewahrt die bestehenden `style`-Einstellungen
und fügt die neuen hinzu! Warum? Weil hier die neuen Einstellungen _nicht_
abhängig sind vom bestehenden `clicked`-Wert, der im oberen Beispiel als
einziger übrig bleibt, wenn er `false` ist – und durch die neue
Hintergrundfarbe vollständig ersetzt wird, im anderen Fall.

Und nun zum guten Schluss die Auflösung dafür, wie man das erste Beispiel
umschreiben muss, damit es auch mit `&&` funktioniert:

```html
<div x-data="{clicked: false}">
  <button
    style="color:navy"
    :style="clicked && {'backgroundColor': 'red'}" || {'backgroundColor': ''}
    @click="clicked = !clicked"
  >
    Click me
  </button>
</div>
```

Was hat sich hier geändert? `clicked` ist hier nur noch Schalter, nicht auch
noch `style`-Wert: bei `true` wird der Hintergrund rot, bei `false` kommt nur
der Leerstring zu den bestehenden `style`-Einstellungen hinzu. Der Wert `false`
wird hier nie als `style`-Wert in Erscheinung treten!

## Automatische Updates mit x-bind

`x-bind` kann dafür genutzt werden, in einem Component automatisch Werte auf
den neuesten Stand zu bringen.

```html
<div x-data="{id: 0}">                                <!-- 1 -->
<button
  x-bind:id="id"
  @click="id = Math.round(Math.random() * 10000)"     <!-- 2 -->
>
  Get ID
</button>
  <p>The ID is now ''<span x-text="id"></span>''</p>  <!-- 3 -->
</div>
```

Dieses Muster kommt in der Praxis extrem häufig vor:

1. Der Wert wird initialisiert
2. Der Wert wird auf ein Ereignis hin erneuert (hier als vierstellige Zufallszahl)
3. Der Wert wird angezeigt.

## Übung: Fahnenspiel

```html
<div x-data="{colors: ['black', 'white', 'red']}">
  <!-- Iterate over colors and display 40x40 px boxes with given colors -->
  <template x-for="color in colors">
    <div
      style="width: 40px; height: 40px; display: inline-block;"
      :style="{backgroundColor: color}"
    ></div>
  </template>
</div>
```

## Ereignisse (wichtige Beispiele)

Die folgenden Beispiele zeigen exemplarisch einige sehr wichtige
Ereignis-Funktionen, die _AlpineJS_ zur Verfügung stellt:

```html
<div x-data @yoohoo="console.log('yoohoo Clicked')">       <!-- 3.2 -->
  <button @click="console.log('Button 1')">Button 1</button>      <!-- 1 -->
  <input type="text" @keyup.enter="console.log('Submitted!')" />  <!-- 2 -->
  <button @click="$dispatch('yoohoo')">yoohoo</button>                <!-- 3.1 -->

  <div x-data="{modal: false}">                         <!-- 4.2 -->
    <button @click="modal = true">Show Modal</button>             <!-- 4.1 -->
    <div x-show="modal" @click.outside="modal = false">           <!-- 5 -->
      Modal Content...
    </div>
  </div>

  <input type="text" @keyup.once="console.log('Typed')" />         <!-- 6 -->
  <input type="text" @keyup.debounce.1000="console.log('With Debounce')" /> <!-- 7 -->
</div>
```

#### Anmerkungen:

1. Beim Hoisting speichert der Browser den angegebenen Code in einem neu
   erstellten Funktions-Objekt, den er dann als _Callback_ ausführt. Deshalb
   können wir auch Javascript-Code hier mit hineinnehmen, und der würde dann
   ausgeführt werden.
2. `@keyup.enter` bedeutet: "Sobald die ENTER-Taste sich wieder hebt ...". Das
   ist extrem hilfreich bei einem Eingabefeld wie hier!
3. `@dispatch`
    3.1. `@click=$dispatch('yoohoo')`. Hier wird ein [Custom
         Event](https://alpinejs.dev/magics/dispatch) mit dem Namen `yoohoo`
         abgelassen.
    3.2. `@yoohoo`. Hier wird das abgelassene `yoohoo`-Signal „eingefangen“ und
         ausgewertet.
4. „Modal“ ist alles, was erscheint und wieder verschwindet, wenn man es
   wegklickt. Deshalb gilt:
    4.1. Der Button sorgt dafür, dass das Modal erscheint
    4.2. `modal` ist ein _switch_ in `x-data`
5. `@click.outside` bedeutet: _Wenn ein Klick außerhalb des Modals erfolgt..._
    Ja, sowas geiles gibt es in _AlpineJS!_
6. `@keyup.once` bedeutet: Nur beim ersten Mal reagiert dieses Element auf
   `@keyup`. Sonst nicht!
7. `@keyup.debounce.1000` bedeutet: _Erst wenn 1000 Millisekunden nicht mehr
   getippt wird, wird das `keyup`-Ereignis ausgewertet._ Das ist z.B. nützlich
   für automatische Suchfelder oder auch für `@scroll`-Ereignisse (Erst wenn
   1000ms nicht mehr gescrollt wird, ...). Ohne ausdrückliche Zeitangabe geht
   _AlpineJS_ von 250ms aus.

## Double Binding mit x-model

_Double Binding_ ist eine extrem wichtige Technologie, wenn es um moderne
Interaktionen im Netz geht.

Was geschieht hier doppelt? Antwort: Erstens _Einlesen_ und zweitens
_Auswerten._ Das folgende Beispiel macht das Prinzip klar:

```html
<div x-data="{keyword: null}">         <!-- 1 -->
  <input                               <!-- 2 -->
    type="text"
    placeholder="Search for items"
    x-model.debounce.500ms="keyword"
  />
  <p x-text="keyword"></p>             <!-- 3 -->
</div>
```

#### Anmerkungen

1. `keyword` ist die gespeicherte Information
2. `x-model.debounce.500ms="keyword"`: Hier findet das _Double Binding_ statt:
   Jede Änderung wird __unmittelbar__ (standardmäßig) dem gesamten
   _AlpineJS_-Component zur Verfügung gestellt und sorgt ebenso unmittelbar für
   ein Re-Rendering desselben. Nicht in diesem Fall allerdings: wegen
   `.debounce.500ms` wird das Update erst nach einer halben Sekunde nach dem
   letzten Ändern vollzogen. Ein wirklich unmittelbares Update würde für zu
   viel Unruhe sorgen – im Browser und für den Benutzer.
3. Hier landet der neue Eintrag in der Ausgabe.

## Aufgabe: x-model in Aktion:

```html
<!-- 
Challenge: Create a button and 3 inputs. 
1st input for text. Whatever you write inside 
    the input that should become the text of the button.
2nd input for background color. Whatever you type color 
    inside the input and that will become the background color
    for the button.
3rd input for button id. Whatever you type inside will become 
    thebutton id
-->
<div x-data="{text: null, bg: null, id: null}">
    <button 
      :id="id" 
      :style="{backgroundColor: bg}" 
      x-text="text">
    </button>
    <br>
    <input type="text" x-model="text" placeholder="Text">
    <input type="text" x-model="bg" placeholder="bg color">
    <input type="text" x-model="id" placeholder="ID">
</div>
```

Der entscheidende Trick ist: _Alle Daten nach_ `x-data`! Dann geht mit
`x-model` im Grunde alles von selbst.

## Abhängige Werte mit x-effect

Es gibt Werte, die sind abhängig von anderen Werten. Mit `x-effect` können wir
sie erstellen und kontrollieren.

```html
<div x-data="{name: 'Zura', message: null}">  
  <p x-effect="message = 'Hello ' + name"></p>       <!-- 1 -->
  <p x-text="message"></p>
  <button @click="name= 'John'">Change Name</button> <!-- 2 -->
</div>
```

#### Anmerkungen

1. Der einzige Daseinszweck dieses `<p>`-Elements ist `x-effect`, d.h.
   `message` „automatisch“ einen neuen Wert zu geben. (So ist das, wenn
   Javascript mitten im HTML passieren muss ...)
2. Sobald der Button geklickt wird, ändert sich `name` zu `John`. Dank
   `x-effect` ändert sich dadurch `message` als abhängiger Wert zu '`Hello
   John`'.

## Abhängiger Code mit x-effect

`x-effect` lässt sich auch dafür einsetzen, um „automatisch“ Code auszuführen,
sobald eine Variable sich ändert. Man spricht hier von _abhängigem Code._

Das folgende Beispiel zeigt, worum es geht:

```html
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
  <button @click="label += ' World!'">Change Message</button>
</div>
```

Wenn dieses Component geladen wird, wird auch der `x-effect`-Teil ausgeführt
und “Hello” erscheint auf der Konsole.

Wenn dann `label` durch den Button aktualisiert wird, wird als „Nebeneffekt“
auch noch einmal `x-effect` ausgeführt, und dieses Mal erscheint dann “Hello
World!” auf der Konsole.

## x-data ignorieren mit x-ignore

Manchmal gibt es Bereiche, wo die magischen Daten in `x-data` einfach
unerwünscht sind – z.B. wenn über HTMX Markup hereinkommt, das __nicht__ sofort
von _AlpineJS_ erfasst und verarbeitet werden soll. In einem solchen Fall lohnt
sich `x-ignore`. Wie es funktioniert, zeigt das folgende Beispiel:

```html
<div x-data="{name: 'Zura'}">
  <div x-ignore>
    <p x-text="name">No 'name' here!</p>
  </div>
</div>
```

Hier wird `x-text` im `<p>` ausdrücklich ignoriert – wegen `x-ignore` im
Parent-Element.

## DOM-Elemente herauspicken mit x-ref

Wenn wir auf Kommando DOM-Elemente mit _AlpineJS_ manipulieren wollen, lohnt
sich `x-ref`, um sie anzusteuern:

```html
<div x-data>
  <input x-ref="inputEmail" type="text" placeholder="Email" /> <!-- 1 -->
  <button @click="$refs.inputEmail.style.borderColor='red'">   <!-- 2 -->
    Check
  </button>
</div>
```

#### Anmerkungen

1. `x-ref` sorgt dafür, dass genau dieses Element mit Hilfe von `inputEmail`
   als „ID“ angesteuert werden kann.
2. `$refs.inputEmail` steuert jetzt genau das gekennzeichnete DOM-Element an
   und verändert dessen `style` – wieder mit _camelCase_-Notation, wie man das
   in Javascript halt so macht.

## Unerwünschte Effekte mit x-cloak ausschalten

Wir alle haben schon mal erlebt, dass verborgene DOM-Elemente beim Aufbau einer
Webseite kurz „aufblitzen“, bevor sie gleich darauf wieder verschwinden.

Woran liegt das? Es liegt daran, dass der Browser die Seite vollständig
darstellt, bevor _AlpineJS_ initialisiert ist und diese Elemente wieder
verbergen kann.

`x-cloak` hilft in diesen Fällen.

```html
<div x-data="{open: false}">
  <button @click="open = !open">Open/Close</button>  <!-- 3 -->
  <div x-show="open" x-cloak>Modal Content...</div>  <!-- 2 -->
</div>
<style>                                              /*-- 1 --*/
  [x-cloak] {
    display: none !important;
  }
</style>
```

#### Anmerkungen

1. `x-cloak` kann nur greifen, wenn das zu verbergende Element entsprechend
   vorbereitet wurde – so wie hier im `<style>`-Abschnitt geschehen, d.h. mit
   einem `[x-cloak]`-Selector im CSS und `display: none`. Damit sorgt der
   _Browser_ von vornherein dafür, dass dieses Element nicht angezeigt wird!
2. `x-cloak` wendet den Style auf genau dieses Element an und wartet auf das
   `open`-Signal.
3. Beim Klick ändert sich `open`, `x-show` reagiert auf den neuen Wert von
   `open` und schaltet das `[x-cloak]`-CSS ab.

_Tadaaa!_

## DOM-Elemente verschieben mit x-teleport

Manchmal wollen wir, dass DOM-Elemente nicht dort im Browser erscheinen, wo wir
sie im Markup hinschreiben. Dass wir sie überhaupt dorthin schreiben, ist nötig, 
damit sie Teil des _Alpine_-Components werden, über das wir sie steuern wollen.
Dann aber muss _AlpineJS_ sie _teleportieren._

```html
<div x-data>
  <p>Some Content</p>

  <div x-data="{open: false}">
    <button @click="open=!open">Open Modal</button>
    <template x-teleport="body">
      <div x-show="open">Modal Content</div>
    </template>
  </div>

  <p>More Content</p>
</div>
```

#### Anmerkungen

1. `x-teleport` funktioniert nur in einem `<template>`-Element. Das bedeutet,
   dass `x-teleport` sich auf alles bezieht, was sich _innerhalb_ dieses
   `<template>`-Elements befindet.
2. `x-teleport="body"` ist zu lesen als: _„Verschiebe alles innerhalb dieses_
   `<template>`_-Elements an das Ende von_ `<body>`_.“_
3. `x-show` macht das _Modal_ sichtbar oder unsichtbar.

Der `teleport`-Selektor (hier '`body`') kann dabei alles sein, das von
`document.querySelector()` akzeptiert wird. Wenn mehrere Elemente passen,
bekommt der zuerst gefundene den Zuschlag.

_Schön zu wissen:_ mit `x-teleport` funktionieren auch eingebettete Modals.
Mehr dazu [hier](https://alpinejs.dev/directives/teleport#nesting).

# Magische Instanzen

## Wie man mit `$el` das aktuelle DOM-Element abgreift

> [!abstract]
> Jedes DOM-Element hat Eigenschaften, auf die wir manchmal zugreifen müssen.
Dann ist es gut, wenn `$el` einsetzen können und nicht auf
`document.getElementBy...()` angewiesen sind.

### Beispiel

```html
<div x-data x-init="console.log('Init ', $el)">
  <button @click="console.log($el)">Button</button>
</div>
```

Hier werden zwei unterschiedliche Elemente auf der konsole ausgeworfen, obwohl
beide sich selbst mit `$el` verfügbar machen. `$el` liefert die Referenz auf ein vollwertiges DOM-Element zurück – wir könnten also auf alle seine Attribute mit einfachen JavaScript-Methoden zugreifen, z.B. mit `$el.innerHTML`.

## `$ref`

Verweis auf oben: Wie man mit `$ref` [DOM-Elemente kennzeichnet]() und sie
ansteuert.

## `$watch`

> [!abstract]
> Mit Hilfe der `$watch()`-Funktion lassen sich _Alpine_-interne
> Wert-Änderungen nachverfolgen und bei Bedarf auch darauf mit JavaScript
> reagieren.

### Beispiel

```html
<script>
  // -1-
  function logModal(curValue, oldValue) {
    console.log(`'modal' changed from '${oldValue}' to '${curValue}'`)
  }
</script>
<div
  x-data="{modal: false}"
  x-init="$watch('modal', (cur, old) => logModal(cur, old))"
> <!-- -2,3,4- -->
  <button @click="modal = !modal">$watch example</button>
</div>
```

#### Anmerkungen

1. Hier wird extra eine Log-Funktion definiert, um die `x-init`-Zeile von
   Verwirrung mit Satzzeichen zu entlasten – es ist dort einfacher, eine
   Funktion aufzurufen als inline mit Backticks, einfachen und doppelten
   Anführungszeichen zu arbeiten.
0. `x-init` ist uns schon aus [anderen Zusammenhängen]() bekannt. Hier wird
   gleich nach dem Rendern `$watch()` auf den Wert von `x-data.modal`
   angesetzt und die mitgegebene Callback-Funktion für den Ereignisfall mitgegeben.
0. Dankenswerterweise kann man auch den vorher gültigen Wert (`old`) in der
   Callback-Funktion mit einbauen.
0. Die Codezeile ist wie folgt zu übersetzen: _„Sobald sich der Wert von_
   `modal` _ändert, nimm den geänderten Wert `cur` und den alten Wert `old` und
   führe `logModal()` aus – mit diesen Werten als Argumenten.

> [!warning] Bitte beachten!
> `$watch` lohnt sich nur bei einfachen Javascript-Typen: Zahlen, Strings,
> Booleans. _Referenztypen_ wie Arrays und Objekte eignen sich dafür __nicht!__
> Das hängt damit zusammen, dass Referenztypen mit Speicheradressen arbeiten;
> das einzige, was `$watch()` da als Änderung registrieren kann, ist der
> Referenzwechsel auf eine neue Speicheradresse.
>
> Das heißt: `$watch(myObj.name, ...) würde funktionieren, weil `myObj.name`
> ein einfacher Datentyp (String) ist, `$watch(myObj, ...) dagegen nicht!

## Nacharbeiten mit $nextTick()

> [!abstract]
> Manche Dinge sollten erst erledigt werden, wenn alles andere vorher fertig ist. In JavaScript kann man dafür einen [leeren Timeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#description) verwenden; in _AlpineJS_ erreicht man das gleiche mit `$nextTick()`.

### Beispiel ohne `$nextTick`

```html
<div x-data="{name: 'Zura'}">
  <button
    @click="
      name = 'John'; 
      console.log($refs.out.innerText);"
  >
     Change Name
  </button>
  <p x-ref="out" x-text="name"></p>
</div>
```

Hier wird also `x-data.name` mit “Zura” initialisiert. Dieser Name erscheint dann im Absatz mit der DOM-Referenz `out`. Soweit klar.

Beim Klick auf den Button wird der Name auf ‘John’ geändert; d.h. auch im Ausgabe-Absatz ändert sich der Name in ‘John’.

Dann aber wird der Name aus dem Ausgabe-Absatz gelesen und nochmal auf der Konsole angezeigt. Jetzt die Preisfrage: Was genau erscheint auf der Konsole?

Richtige Antwort: __Zura!!__ `console.log()` wird nämlich ausgeführt, _bevor_ der Name im Ausgabeabsatz ein Update erfährt! Oder in den Worten von oben: ohne dass vorher alles fertig ist!

### Beispiel mit $nextTick

```html
<div x-data="{name: 'Zura'}">
  <button
    @click="
      name = 'John'; 
      $nextTick(() => console.log($refs.out.innerText));"
  >
     Change Name
  </button>
  <p x-ref="out" x-text="name"></p>
</div>
```

Hier erscheint tatsächlich ‘John’ auf der Konsole! Woran liegt das?

`$nextTick()` hat ein Geheimnis: Es ist _asynchron,_ und das bedeutet: Seine Ausführung wird _aufgeschoben,_ bis vorher alles fertig ist, und das bedeutet hier: bis der Name im Ausgabe-Absatz sein Update bekommen hat! Die Ausführung des Callbacks erfolgt also _einen Tick später_ als der Abschluss aller vorher zu leistenden Arbeiten.

## Die Wurzel des Components: $root

> [!abstract]
>
> `$root` ist einfach nur die Referenz auf das aktuelle Component-Element, also
> das Element, in dem die aktuellen `x-data` angelegt wurden.  

### Beispiel

```html
<div x-data id="1">
  <div>
    <div x-data id="2">
      <div>
        <button @click="console.log($root)">Button</button>
      </div>
    </div>
  </div>
</div>
```

Welches ist hier das aktuelle Component? Für den Button das nächstliegende, und das ist das mit `id="2"`. Das ist die `$root`.

## $data – x-data als Javascript-Objekt

> [!abstract]
> Mit `x-data` lässt sich in _AlpineJS_ in 98% aller Fälle schon wunderbar arbeiten. In den übrigen 2% brauchen wir `x-data` als reines JavaScript-Objekt. Dafür gibt es dann `$data`.

### Beispiel

```javascript
// file: app.js
document.addEventListener('alpine:init', () => {
  Alpine.data("dropdown", () => ({
    open: false,
    message: "Something",

    toggle() {
      this.open = !this.open;
    },
  }));
});
```
```html
<!-- file: index.html -->
<head>
  <script src="./app.js"></script> 
  <script
    defer
    src="./assets/alpinejs.min.js"
  ></script>
</head>
<body>
  <div x-data="dropdown">
    <div>
      <button @click="console.log($data.message)">$data</button>
    </div>
  </div>
</body>
```

So viel Code für so wenig Inhalt! 

Jedenfalls sehen wir im `<button>` Element, wie wir das aktuelle `x-data`-Objekt in die Konsolen-Nachricht bekommen und dort auf das `message`-Attribut Zugriff erhalten.

## Automatisch unvergleichlich mit $id 

> [!abstract]
>
> $id ist in der Praxis sehr, sehr nützlich, wenn man sich für viele gleichartige Elemente unterschiedliche IDs (für `id="..."`) aus den Fingern saugen muss, um sie unterscheiden zu können:

### Beispiel: Automatische IDs

```html
<input type="text" :id="$id('text-input')">
<!-- => id="text-input-1" -->
 
<input type="text" :id="$id('text-input')">
<!-- => id="text-input-2" -->
```

Mit `$id()` ist es Sache von _AlpineJS,_ sich die IDs aus den Fingern zu saugen.

### Beispiel: Automatische IDs für dieselbe Gruppe

```html
<div x-data>
  <div x-id="['text-input']">
    <label :for="$id('text-input')" />
    <!-- => for="text-input-1" -->
    <input type="text" :id="$id('text-input')" />
    <!-- => id="text-input-1" -->
  </div>
</div>

<div x-data>
  <div x-id="['text-input']">
    <label :for="$id('text-input')" />
    <!-- => for="text-input-2" -->
    <input type="text" :id="$id('text-input')" />
    <!-- => id="text-input-2" -->
  </div>
</div>
```

Anders als im Beispiel vorher wird hier mit `x-id` eine _ID-Gruppe_ festgelegt. Effekt: Innerhalb dieser Gruppe bekommen alle „Antragsteller dieselbe ID zugewiesen. Das ist z.B. ebenfalls sehr nützich in `x-for`-Schleifen, wo wir in jeder Iteration mit `x-id` eine neue ID-Gruppe festlegen können.


