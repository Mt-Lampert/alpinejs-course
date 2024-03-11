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
   
