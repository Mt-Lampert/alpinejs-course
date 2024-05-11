import Alpine from 'alpinejs'
import './index.css'

window.Alpine = Alpine

document.addEventListener("alpine:init", () => {

  Alpine.data("tabs", () => ({
    tabs: [
      {
        name: 'Home',
        text: 'lorem ipsum for Home.',
      },
      {
        name: 'Users',
        text: 'lorem ipsum for Users.',
      },
      {
        name: 'Settings',
        text: 'lorem ipsum for Settings.',
      },
    ],
    active: 'Home',
    activeText: 'lorem ipsum for Home',

    toggle(tabname){
      let activeTab = this.tabs.find((tab) => tab.name === tabname)
      this.active= tabname
      this.activeText = activeTab.text
    }
  }))
})

 
Alpine.start()

// vim: ts=2:sw=2:fdm=indent
