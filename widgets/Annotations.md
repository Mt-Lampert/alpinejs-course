# Anmerkungen für die Widget-Gallerie

## Dropdown-Menü

```html
<div x-data="{ menu: false }"
  class="relative ...">
  <!-- description -->
  <h1 class="...">Dropdown Menu</h1>
  <!-- toggle button -->
  <div class="relative flex justify-center items-center">
    <button @click="menu = !menu" class="...">
      Toggle
    </button>

    <!-- Menu box -->
    <div x-data="{ submenu: false }" x-show="menu" x-transition.duration.750ms @click.outside="menu=false"
      class="...">
      <!-- Menu Item -->
      <h1 class="text-orange-800 font-bold">Item 1</h1>

      <!-- submenu package as Menu Item -->
      <div class="relative flex justify-between w-full" @click="submenu=!submenu">
        <!-- description -->
        <h1 class="text-orange-800 font-bold">Item 2</h1>
        <!-- submenu indicator -->
        <h1 class="text-orange-800 font-bold " :class="submenu ? 'rotate-90' : ''">&gt;</h1>
        <!-- sub menu box -->
        <div id="submenu" x-show="submenu" x-transition.duration.750ms
          class="absolute -right-36 ...">
          <h1 class="...">Subitem 1</h1>
          <h1 class="...">Subitem 2</h1>
          <h1 class="...">Subitem 3</h1>
        </div>

      </div>

      <h1 class="text-orange-800 font-bold">Item 3</h1>
    </div>
  </div>
</div>
```

#### Anmerkungen

1. Die inneren Abläufe erfolgen nach dem Schema: _Event löst Statusänderung
   aus, Statusänderung bewirkt (Nicht-)Anzeige._
0. `relative, absolute, top-*, left-*, -right-*`: Diese Einstellungen
   positionieren die Menü-Box _absolut,_ und zwar _relativ_ zum nächsthöheren
   Menü-Container (Basislektion CSS, z.B
   [hier](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hudKGi5o5UiWuTAGbxiLTh)
   erklärt)
0. `x-data` hat im äußeren Container nur eine Status-Information: `menu: boolean`
0. `x-data` hat im innereren Container nur eine Status-Information: `submenu: boolean`
0. `x-show` bewirkt je nach Status, ob Menü oder Submenü angezeigt werden.
0. `@click` bewirkt jeweils die Statusänderung, von der die Anzeige abhängt.
0. `@click.outside` setzt `open=false`, womit Menü und Untermenü verschwinden
   oder abhängige Formatierungen sich ändern.
0. `x-transition.*` sorgt für optisch angenehme Übergänge.
   ([Mehr](https://alpinejs.dev/directives/transition))

## 2. Modals

### Markup

```html
<div x-data="{open: false}"
  class="...">
    <!-- description -->
  <h1 class="...">Modal</h1>
    <!-- toggle button -->
  <div class="flex justify-center items-center">
    <button @click="open=true" class="...">
      Toggle the Modal
    </button>
  </div>

  <!-- Modal container as backdrop -->
  <div x-show="open" x-transition
    class="fixed top-0 right-0 bottom-0 left-0 bg-black/60 z-10 flex justify-center items-center">

    <!-- dialog box -->
    <div x-show="open" x-transition @click.outside="open=false" @keyup.escape.window="open=false"
      class="relative ...">
      <!-- X-Circle top right -->
      <div class="absolute top-4 right-4" @click="open=false">
        <svg>
          <path d="..."/>
        </svg>
      </div>
      <!-- Title -->
      <h1 class="...">Modal Content</h1>
      <p class="...">
        <!-- { dialog text } -->
      </p>
      <!-- action box -->
      <div class="flex justify-center gap-8 ...">
        <button @click="open=false" class="bg-green-400 ...">
          OK
        </button>
        <button @click="open=false" class="bg-gray-400 ...">
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Anmerkungen

1. Der Modal-Container besteht zunächst aus dem _Backdrop,_ d.h. aus der dunkel
   transparenten „Folie“ (`bg-black/60`), die über dem Viewport liegt, und zwar
   `fixed`, ohne Abstand nach oben, rechts, unten und links (`top-0 right-0
   bottom-0 left-0`).
2. Damit die Dialogbox innerhalb des Backdrops genau in der Mitte liegt,
   brauchte es `flex justify-center items-center` im Modal container.
3. Der kleine X-Kreis oben rechts in der Dialogbox wurde mit `absolute top-4
   right-4` an seiner Stelle positioniert. Damit das möglich war, musste die
   Dialogbox mit `relative` markiert werden.
4. Folgende Ereignisse lassen das Modal wieder verschwinden
    - `@click.outside` – wenn ein Klick außerhalb der Dialogbox erfolgt
    - `@click` (X-Kreis) --. wenn ein Klick auf den kleinen X-Kreis erfolgt
    - `@click` (OK-Button, Cancel-Button) – wenn ein Klick auf einen der beiden
      Buttons erfolgt
    - `@keyup.escape.window` – wenn die _Escape_-Taste gedrückt wird; in diesem
      Fall so eingestellt, dass dieses Ereignis erst dann die Statusänderung
      bewirkt, wenn es beim `window`-Element ankommt (Stichwort „Bubbling“).
      Das ist nötig, damit das Ereignis _unabhänig vom aktuellen Focus_
      verarbeitet wird, denn wo der gerade liegt, wissen nur der Browser und
      der liebe Gott – und zwar streng in dieser Reihenfolge!

### Tabs

Im folgenden Beispiel habe ich den Code für nur eine Anmerkung ausgewählt.
Alles andere sollte durch das Studium von `inde.html` und `src/main.js` klar
werden.

```html
<div class="flex flex-col justify-center items-center">
  <!-- Tabs container -->
  <div class="w-2/3 p-8 rounded-lg bg-yellow-100">
    <!-- Title container -->
    <div class="flex justify-between">
      <template x-for="tab in tabs">
        <div class="border border-stone-100 flex-1 bg-white py-2 px-4" @click="toggle(tab.name)"
          :class="active===tab.name ? 'text-blue-500' : ''">
          <p x-text="tab.name"></p>
        </div>
      </template>
    </div>
    <!-- Active-text container -->
    <div class="bg-white py-4 px-4 mt=4 w-full h-40 rounded-lg text-left">
      <template x-for="tab in tabs">
        <p x-text="activeText" x-show="active === tab.name"
          x-transition:enter="transition ease-out duration-500 delay-600"
          x-transition:enter-start="opacity-0 translate-x-16" x-transition:enter-end="opacity-1"></p>
      </template>
    </div>
  </div>
</div>
```

#### Anmerkungen

1. Der Einsatz von Transitions im _Active-text container machte es nötig,
   ___drei___ Absätze zu generieren – parallel zu den drei Elementen von
   `data.tabs`. Grund: Transitions funktionieren in _AlpineJS_ nur mit `x-show`,
   und das bedeutet, dass jedes Transitions-Element einen Status-Entscheid
   braucht, damit `x-show` von `false` auf `true` wechselt oder umgekehrt.

### Carousel

Das war eine Sensation! Ich habe alles angewendet, was ich bislang hier im
Verlauf dieses Projekts gelernt habe, und brauchte dann nicht einmal das
Original-Video. Hab die Vorlage sogar noch dort verbessert, wo sie im Original
versagt hat!

1. Ich habe von Anfang an mit einer Liste aus Daten-Objekten gearbeitet (`cars`
   in `Alpine.data('carousel)`). Damit hatte ich immer alles beieinander, was
   ich für das Carousel brauchte.
0. Drei Mal [!!!] bin ich diese Datenliste im Markup mit `x-for` durchlaufen,
   zwei Mal, um alle Elemente mit `x-show` anzuzeigen und wieder zu verbergen,
   je nachdem ob die aktuelle Index-Nummer mit `currentIndex` übereinstimmt
   oder nicht.
0. `x-show` lieferte nun das Ereignis, das nötig war, um _transitions_ zu
   triggern und das Bild und den Begleittext mit kleiner Animation bei jeder
   Änderung einfliegen zu lassen.
0. Zum Schluss habe ich 2 Navigations-Items als Schwebe-Buttons über dem Bild
   angelegt:
     - `relativ`, `absolute`, `top-*`, `left/right-*` `z-*` haben für diesen Job
       wieder fantastisch zusammengespielt.
     - Die [Heroicons](https://heroicons.com/solid) haben wirklich alles, was man
       für den normalen Hausgebrauch an Bildern benötigt. Sie haben die Vorlage
       geliefert für die Navigations-Buttons.
     - Das Nachformatieren der Icons ging überraschend sauber!

<!--
vim: ts=2:sw=2:fdm=indent
-->
