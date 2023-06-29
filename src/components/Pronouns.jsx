import { React, flux as Flux, users } from "replugged/common";
import pplMoeStore from "../profileStore.js";
import "./Pronouns.css";

function Pronouns({ userId, profile, compact, pronounDBCompat }) {
  // only fetch a profile when pronouns for a different user are rendered
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  if(!settings.get("show_own_pronouns") && userId === users.getCurrentUser().id) return null

  // profile not loaded or no pronouns set
  if(!profile || profile.info?.pronouns == "") return null

  return (
    <span className="ppl-moe-pronouns"
      data-compact={compact}
      data-pronoundb-compat={pronounDBCompat}>
      {profile.info.pronouns}
    </span>
  )
}

export default Flux.connectStores(
  [pplMoeStore], // stores to pay attention to
  // props modifier: called with given props, returns additional props to be provided to the component
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId) // this could also just be in Pronouns, but it's better style to be here (i think, lol)
  })
)(React.memo(Pronouns)) // call return value of connectStores with the component to attach store & props modifer to
