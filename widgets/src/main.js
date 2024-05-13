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

  Alpine.data("accordion", () => ({
    items: [
      {
        term: "Intuitive",
        desc: "Living and thinking from the 'guts'. Easy to excite, hard to satisfy. Impatient."
      },
      {
        term: "Sensing",
        desc: "Living in the concrete side of the world. Needs all 5 senses to be satisfied. Hard to excite. Able to enjoy."
      },
      {
        term: "Extrovert",
        desc: "Cannot live without the outside world as feedback source and energy source. Social. Talkative. Being alone feels like torture",
      },
      {
        term: "Introvert",
        desc: "Needs a healthy and thriving inner world as source of truth. Prefers living secluded. Silent, but can learn ‘perfect routines’ for the outside world. Being alone feels like recharging.",
      },
      {
        term: "Feeler",
        desc: "Needs everything to ‘feel right’. Great empathy. Highly sensitive to atmosphere. Loves to be mesmerised by ‘bliss’. Social tension is torture."
      },
      {
        term: "Thinker",
        desc: "Needs to feel in control; dissociates from intense emotions. Prefers to be logical, analytical and ‘sensible’. Ivory tower tendency",
      },
      {
        term: "Deductive",
        desc: "Sees the world as some kind of ‘clockwork’ with strong rules, laws and principles. Organisation and planning is everything. Prefers judging over exploring. Love of details.", 
      },
      { 
        term: "Inductive",
        desc: "Sees the world as ‘one big grab bag’, as never-ending source of opportunities and exploration. For this type success trumps laws and principles. Solves problems with crazy, but ingenious ideas. ‘Take what you can, give nothing back!’ attitude",
      },
    ],

    activeTerm: null,

    expand(term) {
      if (this.activeTerm && term === this.activeTerm)
        this.activeTerm = null
      else
        this.activeTerm = term
    },

  }))
})

 
Alpine.start()

// vim: ts=2:sw=2:fdm=indent
