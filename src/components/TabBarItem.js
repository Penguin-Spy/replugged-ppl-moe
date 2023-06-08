import { webpack } from "replugged";
import { React, flux as Flux } from "replugged/common";
import { Loader } from "replugged/components";
import pplMoeStore from "../profileStore.js";
import Messages from "../i18n.js";

function TabBarItem({ userId, profile }) {
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  // profile not loaded
  if(profile === undefined) return React.createElement(Loader, { type: "pulsingEllipsis", className: "ppl-moe-tabitem-loading" })
  else if(!profile) return null // no profile

  return React.createElement(React.Fragment, {}, Messages.PPL_MOE_TAB)
}

export default Flux.connectStores(
  [pplMoeStore],
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId)
  })
)(React.memo(TabBarItem))
