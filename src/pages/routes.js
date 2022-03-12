import { Dashboard, History } from 'pages'

export const routes = [
  { path: '/', exact: true, component: Dashboard },
  { path: '/history', component: History, authRequired: true },
]
