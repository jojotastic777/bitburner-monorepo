import { NS } from "@global/bitburner";
import { BatchData } from "../util/batchDeploy";

// Lifted from https://github.com/danielyxie/bitburner/blob/dev/src/PersonObjects/formulas/skill.ts
export function calculateSkill(exp: number, mult = 1): number {
  return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
}

// Adapted from calculateHackingTime from https://github.com/danielyxie/bitburner/blob/dev/src/Hacking.ts
// Also includes elements from https://github.com/danielyxie/bitburner/blob/dev/src/PersonObjects/formulas/intelligence.ts
function calculateHackTime(reqHackSkill: number, hackDifficulty: number, hackSkill: number, hackSpeedMult: number, intelligence: number) {
  const difficultyMult = reqHackSkill * hackDifficulty

  const skillFactor = (2.5 * difficultyMult + 500) / (hackSkill + 50)

  return (5 * skillFactor) / (hackSpeedMult * (1 + (Math.pow(intelligence, 0.8)) / 600))
}

export function getBatchData(ns: NS, target: string, prevBatchData: BatchData): BatchData {
  const HACK_LEVEL = calculateSkill(prevBatchData.endHackExp, ns.getPlayer().hacking_mult)
  
  return {
    endHackExp: HACK_LEVEL
  }
}

export async function main(ns: NS) {
  
}