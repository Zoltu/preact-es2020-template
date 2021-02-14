import * as preact from 'preact'
import { App } from './components/App'

const element = preact.createElement(App, {})
preact.render(element, document.body, document.querySelector('main')!)
