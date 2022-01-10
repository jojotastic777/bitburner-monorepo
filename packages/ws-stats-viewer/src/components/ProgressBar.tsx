import React from "react";
import "./ProgressBar.css"

interface ProgressBarProps {
    frac: number
    color?: string
}

export class ProgressBar extends React.Component<ProgressBarProps> {
    public render() {
        if (this.props.color === undefined) {
            return (
                <div className="ProgressBar">
                    <div className="bar-fill" style={{ width: `${this.props.frac * 100}%` }}></div>
                </div>
            )
        } else {
            return (
                <div className="ProgressBar">
                    <div className="bar-fill" style={{ width: `${this.props.frac * 100}%`, backgroundColor: this.props.color }}></div>
                </div>
            )
        }
    }
}