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
   Menü-Container (Basislektion CSS, z.B [hier]() erklärt)
0. `x-data` hat im äußeren Container nur eine Status-Information: `menu: boolean`
0. `x-data` hat im innereren Container nur eine Status-Information: `submenu: boolean`
0. `x-show` bewirkt je nach Status, ob Menü oder Submenü angezeigt werden.
0. `@click` bewirkt jeweils die Statusänderung, von der die Anzeige abhängt.
0. `@click.outside` setzt `open=false`, womit Menü und Untermenü verschwinden
   oder abhängige Formatierungen sich ändern.
0. `x-transition.*` sorgt für optisch angenehme Übergänge.
   ([Mehr](https://alpinejs.dev/directives/transition))


