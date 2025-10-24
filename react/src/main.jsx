import React from "react"
import ReactDOM from "react-dom/client"
import './index.css'
import { RouterProvider } from "react-router-dom"
import router from "./router.jsx"
import { ContextProvider } from "./contexts/ContextProvider.jsx"
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
