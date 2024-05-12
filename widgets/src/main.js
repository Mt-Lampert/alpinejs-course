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

  Alpine.data("carousel", () => ({
    cars: [
      { 
        file: "Austin_Saloon__1943.jpg",
        text: "The <i>Austin Saloon</i> from 1943. Pride of every businessman!"
      },
      { 
        file: "BMW_327__1950.webp",
        text: "A <i>BMW 327</i> from 1950. So gorgeous!"
      },
      {
        file: "Cadillac__1940.webp",
        text: "A Cadillac from 1940. Bogey loved it!",
      },
      {
        file: "Lincoln_Zephyr__1940.jpg",
        text: "The <i>Lincoln Zephyr</i> from 1940. A dream!"
      },
      {
        file: "Open_Packard__1-20.webp",
        text: "The <i>Open Pacard</i> from 1942. Beautiful!"
      },
      {
        file: "Packard_Twenty__1941.jpg",
        text: "The <i>Packard Twenty</i> from 1941. Groundbreaking!",
      },
      {
        file: "Riley_Kestrel__1940.jpg",
        text: "The <i>Riley Kestrel</i> from 1940. Turning every head in its time!",
      },
    ],
    currentIndex: 0,
    
    prev() {
      let max = this.cars.length - 1
      if (this.currentIndex === 0)
        this.currentIndex = max
      else
        this.currentIndex -= 1
    },

    next() {
      let max = this.cars.length - 1
      if (this.currentIndex === max)
        this.currentIndex = 0
      else
        this.currentIndex += 1
    }
  }))
})

 
Alpine.start()

// vim: ts=2:sw=2:fdm=indent
