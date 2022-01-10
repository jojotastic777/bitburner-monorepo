import { ViewMessage } from "@global/statsViewer";
import React from "react";
import { BarIndicator } from "./BarIndicator";
import { Indicator } from "./Indicator";
import { StatBox } from "./StatBox";
import numeral from "numeral";
import { SERVER_ADDRESS } from "../constants";

interface RamStatsState {
    local_total: number
    local_used: number
    local_free: number

    remote_total: number
    remote_used: number
    remote_free: number
}

export class RamStats extends React.Component<{}, RamStatsState> {
    public ws?: WebSocket

    constructor (props: {}) {
        super(props)

        this.state = {
            local_total: 0,
            local_used: 0,
            local_free: 0,

            remote_total: 0,
            remote_used: 0,
            remote_free: 0
        }
    }
    
    public componentDidMount() {
        this.ws = new WebSocket(SERVER_ADDRESS)

        this.ws.onmessage = (ev) => {
            let message: ViewMessage = JSON.parse(ev.data)

            if (message.state !== undefined) {
                let ram = message.state.ram

                this.setState({
                    local_total: ram.local.total,
                    local_used: ram.local.used,
                    local_free: ram.local.free,

                    remote_total: ram.remote.total,
                    remote_used: ram.remote.used,
                    remote_free: ram.remote.free
                })
            }
        }
    }

    public componentWillUnmount() {
        this.ws?.close()
    }

    public render() {
        return (
            <StatBox title="RAM Stats">
                <BarIndicator label="Local" color="var(--teal)" value={`${numeral(this.state.local_used * 1e9).format("0.00b")} / ${numeral(this.state.local_total * 1e9).format("0.00b")}`} frac={this.state.local_used / this.state.local_total} />
                <Indicator label="Free" color="var(--teal)" value={numeral(this.state.local_free * 1e9).format("0.00b")} />
                <hr />
                <BarIndicator label="Remote" color="var(--teal)" value={`${numeral(this.state.remote_used * 1e9).format("0.00b")} / ${numeral(this.state.remote_total * 1e9).format("0.00b")}`} frac={this.state.remote_used / this.state.remote_total} />
                <Indicator label="Free" color="var(--teal)" value={numeral(this.state.remote_free * 1e9).format("0.00b")} />
            </StatBox>
        )
    }
}