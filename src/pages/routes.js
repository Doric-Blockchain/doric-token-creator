import { Dashboard, History, Tokens } from 'pages'

export const routes = [
  { path: '/', component: Dashboard },
  { path: '/history', component: History, authRequired: true },
  { path: '/tokens', component: Tokens, authRequired: true },
]
