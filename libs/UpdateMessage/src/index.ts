export type UpdateMessage = {
  type: "add" | "change" | "remove",
  path: string
  content?: string
}