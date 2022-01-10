import React from "react";
import "./App.css"
import { PlayerStats } from "./components/PlayerStats";
import { RamStats } from "./components/RamStats";
import { SystemStats } from "./components/SystemStats";

export class App extends React.Component {
    public render() {
        return (
            <div id="app">
                <div className="stats-container">
                    <PlayerStats />
                    <RamStats />
                    <SystemStats />
                </div>
            </div>
        )
    }
}