import React from "react";
import "./StatBox.css"

interface StatBoxProps {
    title: string
}

export class StatBox extends React.Component<StatBoxProps> {
    public render() {
        return (
            <div className="StatBox">
                <div className="title">{this.props.title}</div>
                {this.props.children}
            </div>
        )
    }
}
