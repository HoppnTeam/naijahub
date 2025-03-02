
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

const app = createRoot(root)
app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
