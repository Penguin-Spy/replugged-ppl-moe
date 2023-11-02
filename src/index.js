import { modal } from "replugged/common";

export async function start() {
  modal.alert({
    title: "ppl.moe is depreciated",
    body: "ppl.moe (the website) has shut down, and so this plugin is no longer functional. please uninstall it ASAP, as it will not be updated and will likely cause things to break in the future."
  })
}

export function stop() {
}
