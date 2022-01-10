import numeral from "numeral"
import React from "react";
import { StatBox } from "./StatBox";
import { BarIndicator } from "./BarIndicator";
import { Indicator } from "./Indicator";
import { ViewMessage } from "@global/statsViewer"
import "../colorScheme.css"
import { SERVER_ADDRESS } from "../constants";

function calculateExp(skill: number, mult = 1): number {
    return Math.exp((skill / mult + 200) / 32) - 534.6;
}

function calculateExpBarFraction(skill: number, exp: number, mult: number) {
    let currSkillExp = calculateExp(skill, mult)
    let nextSkillExp = calculateExp(skill + 1, mult)
    let diffSkillExp = nextSkillExp - currSkillExp

    return (exp - currSkillExp) / diffSkillExp
}

interface PlayerStatsState {
    hp: number
    max_hp: number
    money: number

    hacking: number
    hacking_frac: number

    strength: number
    strength_frac: number

    defense: number
    defense_frac: number

    dexterity: number
    dexterity_frac: number

    agility: number
    agility_frac: number

    charisma: number
    charisma_frac: number

    intelligence: number
}

export class PlayerStats extends React.Component<{}, PlayerStatsState> {
    public ws?: WebSocket

    constructor(props: {}) {
        super(props)

        this.state = {
            hp: 10,
            max_hp: 10,
            money: 1e6,

            hacking: 1,
            hacking_frac: 0,

            strength: 1,
            strength_frac: 0,

            defense: 1,
            defense_frac: 0,

            dexterity: 1,
            dexterity_frac: 0,

            agility: 1,
            agility_frac: 0,

            charisma: 1,
            charisma_frac: 0,

            intelligence: 0
        }
    }

    public componentDidMount() {
        this.ws = new WebSocket(SERVER_ADDRESS)

        this.ws.onmessage = (ev) => {
            let message: ViewMessage = JSON.parse(ev.data)

            if (message.state !== undefined) {
                let player = message.state.player

                this.setState({
                    hp: player.hp,
                    max_hp: player.max_hp,
                    money: player.money,

                    hacking: player.hacking,
                    hacking_frac: calculateExpBarFraction(player.hacking, player.hacking_exp, player.hacking_mult),

                    strength: player.strength,
                    strength_frac: calculateExpBarFraction(player.strength, player.strength_exp, player.strength_mult),

                    defense: player.defense,
                    defense_frac: calculateExpBarFraction(player.defense, player.defense_exp, player.defense_mult),

                    dexterity: player.dexterity,
                    dexterity_frac: calculateExpBarFraction(player.dexterity, player.dexterity_exp, player.dexterity_mult),

                    agility: player.agility,
                    agility_frac: calculateExpBarFraction(player.agility, player.agility_exp, player.agility_mult),

                    charisma: player.charisma,
                    charisma_frac: calculateExpBarFraction(player.charisma, player.charisma_exp, player.charisma_mult),

                    intelligence: player.intelligence
                })
            }
        }
    }

    public componentWillUnmount() {
        this.ws?.close()
    }

    public render() {
        return (
            <StatBox title="Player Stats">
                <BarIndicator label="HP"    color="var(--red)"    value={`${this.state.hp} / ${this.state.max_hp}`} frac={this.state.hp / this.state.max_hp} />
                <Indicator    label="Money" color="var(--green)"  value={`${numeral(this.state.money).format("($0.000a)")}`} />
                <BarIndicator label="Hack"  color="var(--yellow)" value={`${this.state.hacking}`} frac={this.state.hacking_frac} />
                <hr />
                <BarIndicator label="Strength"  color="var(--purple)" value={`${this.state.strength}`}  frac={this.state.strength_frac}  />
                <BarIndicator label="Defense"   color="var(--purple)" value={`${this.state.defense}`}   frac={this.state.defense_frac}   />
                <BarIndicator label="Dexterity" color="var(--purple)" value={`${this.state.dexterity}`} frac={this.state.dexterity_frac} />
                <BarIndicator label="Agility"   color="var(--purple)" value={`${this.state.agility}`}   frac={this.state.agility_frac}   />
                <BarIndicator label="Charisma"  color="var(--pink)"   value={`${this.state.charisma}`}  frac={this.state.charisma_frac}  />
                <hr />
                <Indicator label="Intelligence" color="var(--skyblue)" value={`${this.state.intelligence}`} />
            </StatBox>
        )
    }
}