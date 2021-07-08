// routes.js

import Home from './components/Home.vue'
// import SlidePrinter from './components/SlidesV3.vue'
import Embedding from './components/Embedding.vue'
import SlideDistribution from './components/SlideDistribution.vue'
import SlidePrinting from './components/SlidePrinting.vue'
import Settings from './components/Settings.vue'

const routes = [
  { path: '/', component: Home, name: 'home', props: true },
  // { path: '/slideprinter', component: SlidePrinter, name: 'SlidePrinter', props: true }
  { path: '/embedding', component: Embedding, name: 'Embedding', props: true },
  { path: '/slideprinting', component: SlidePrinting, name: 'SlidePrinting', props: true },
  { path: '/slidedistribution', component: SlideDistribution, name: 'SlideDistribution', props: true },
  { path: '/settings', component: Settings, name: 'Settings', props: true }
]

export default routes
