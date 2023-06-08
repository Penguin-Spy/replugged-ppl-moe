import { React, flux as Flux } from "replugged/common";
import { ContextMenu } from "replugged/components";
import pplMoeStore from "../profileStore.js";
import Messages from "../i18n.js";
const { MenuItem } = ContextMenu;

const action = (profile) => {
  open(`https://ppl.moe/u/${encodeURIComponent(profile.unique_url)}`)
}

export default function UserContextItem(userId) {
  pplMoeStore.fetchProfile(userId) // can't use React.useEffect because, uh, discord gets mad or something

  logger.log("item render", userId)
  const profile = pplMoeStore.getProfile(userId)

  if(profile) {
    logger.log("profile: ", profile)
    return (
      <MenuItem id="ppl-moe" label={"View " + profile.name + "'s profile"} action={() => action(profile)} />
    )
  } else if(profile === undefined) {
    logger.log("profile undefined ", profile)
    return (
      <MenuItem id="ppl-moe" label={`ppl.moe profile not loaded`} />
    )
  }
  logger.log("profile false: ", profile)
  return false
}
