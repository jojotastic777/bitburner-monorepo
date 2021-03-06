import React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"
import "./index.css"

const rootElement = document.createElement("div")
rootElement.id = "root"
document.body.appendChild(rootElement)

ReactDOM.render(<App />, rootElement)
