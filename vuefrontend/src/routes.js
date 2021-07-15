// routes.js

import Home from './components/Home.vue'
import Embedding from './components/Embedding.vue'
import SlideDistribution from './components/SlideDistribution.vue'
import SlidePrinting from './components/SlidePrinting.vue'
import Settings from './components/Settings.vue'
import CaseInquiry from './components/CaseInquiry.vue'

const routes = [
  { path: '/',                  component: Home,              name: 'home', props: true },
  { path: '/embedding',         component: Embedding,         name: 'Embedding', props: true },
  { path: '/slideprinting',     component: SlidePrinting,     name: 'SlidePrinting', props: true },
  { path: '/slidedistribution', component: SlideDistribution, name: 'SlideDistribution', props: true },
  { path: '/settings',          component: Settings,          name: 'Settings', props: true },
  { path: '/caseinquiry',       component: CaseInquiry,       name: 'CaseInquiry', props: true}
]

export default routes
