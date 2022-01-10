import React from "react";
import "./Indicator.css"

export interface IndicatorProps {
    label: string
    value: string
    color?: string
}

export class Indicator extends React.Component<IndicatorProps> {
    render() {
        if (this.props.color === undefined) {
            return (
                <div className="Indicator">
                    <div className="label">{this.props.label}</div>
                    <div className="value">{this.props.value}</div>
                </div>
            )
        } else {
            return (
                <div className="Indicator">
                    <div className="label" style={{ color: this.props.color }}>{this.props.label}</div>
                    <div className="value" style={{ color: this.props.color }}>{this.props.value}</div>
                </div>
            )
        }
    }
}