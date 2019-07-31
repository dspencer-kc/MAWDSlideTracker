// routes.js

import Home from './components/SlidesV3.vue'
// import SlidePrinter from './components/SlidesV3.vue'
import SlideDistribution from './components/SlideDistribution.vue'

const routes = [
  { path: '/', component: Home, name: 'home', props: true },
  // { path: '/slideprinter', component: SlidePrinter, name: 'SlidePrinter', props: true }
  { path: '/slidedistribution', component: SlideDistribution, name: 'SlideDistribution', props: true }
]

export default routes
