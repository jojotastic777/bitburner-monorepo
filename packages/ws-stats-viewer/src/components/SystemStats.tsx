import { ExtendedProcessInfo, ViewMessage } from "@global/statsViewer";
import React from "react";
import { Indicator } from "./Indicator";
import { StatBox } from "./StatBox";
import { SERVER_ADDRESS } from "../constants"

interface SystemStatsState {
    processes: ExtendedProcessInfo[]
}

export class SystemStats extends React.Component<{}, SystemStatsState> {
    public ws?: WebSocket

    constructor (props: {}) {
        super(props)

        this.state = {
            processes: []
        }
    }
    
    public componentDidMount() {
        this.ws = new WebSocket(SERVER_ADDRESS)

        this.ws.onmessage = (ev) => {
            let message: ViewMessage = JSON.parse(ev.data)

            if (message.state !== undefined) {
                let processes = message.state.processes

                this.setState({
                    processes: processes
                })
            }
        }
    }

    public componentWillUnmount() {
        this.ws?.close()
    }

    public render() {
        return (
            <StatBox title="System Stats">
                <Indicator label="Process Count" color="var(--blue)" value={this.state.processes.length.toString()} />
            </StatBox>
        )
    }
}