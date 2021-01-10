// routes.js

import Home from './components/SlidesV3.vue'
// import SlidePrinter from './components/SlidesV3.vue'
import SlideDistribution from './components/SlideDistribution.vue'
import PathConsole from './components/PathConsole.vue'
import SlideStorage from './components/SlideStorage.vue'

const routes = [
  { path: '/', component: Home, name: 'home', props: true },
  // { path: '/slideprinter', component: SlidePrinter, name: 'SlidePrinter', props: true }
  { path: '/slidedistribution', component: SlideDistribution, name: 'SlideDistribution', props: true },
  { path: '/slidestorage', component: SlideStorage, name: 'SlideStorage', props: true },
  { path: '/pathconsole', component: PathConsole, name: 'PathConsole', props: true }
]

export default routes
