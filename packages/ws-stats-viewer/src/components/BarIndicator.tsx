import React from "react";
import { IndicatorProps } from "./Indicator";
import "./Indicator.css"
import "./BarIndicator.css"
import { ProgressBar } from "./ProgressBar";

interface BarIndicatorProps extends IndicatorProps {
    frac: number
}

export class BarIndicator extends React.Component<BarIndicatorProps> {
    public render() {
        if (this.props.color === undefined) {
            return (
                <div className="Indicator BarIndicator">
                    <div className="label">{this.props.label}</div>
                    <div className="value">{this.props.value}</div>
                    <ProgressBar frac={this.props.frac} />
                </div>
            )
        } else {
            return (
                <div className="Indicator BarIndicator">
                    <div className="label" style={{ color: this.props.color }}>{this.props.label}</div>
                    <div className="value" style={{ color: this.props.color }}>{this.props.value}</div>
                    <ProgressBar frac={this.props.frac} color={this.props.color} />
                </div>
            )
        }
    }
}
