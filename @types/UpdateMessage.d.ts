/**
 * A message which [wsUpdater](./bitburner_bin_svc_wsUpdater.html) can understand.
 */
export type UpdateMessage = {
    type: "add" | "change" | "remove",
    path: string
    content?: string
}
