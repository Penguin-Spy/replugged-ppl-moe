import { webpack } from "replugged";
import { React, flux as Flux } from "replugged/common";
import pplMoeStore from "../profileStore.js";

const LoadingAnimationModule = webpack.getModule(webpack.filters.byProps("WANDERING_CUBES"))
const LoadingAnimation = Object.values(LoadingAnimationModule).find(e => typeof e === "function")

function TabBarItem({ userId, profile }) {
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  // profile not loaded
  if(profile === undefined) return React.createElement(LoadingAnimation, { type: "pulsingEllipsis", className: "ppl-moe-tabitem-loading" })
  else if(!profile) return null // no profile

  return React.createElement(React.Fragment, {}, "ppl.moe")
}

export default Flux.connectStores(
  [pplMoeStore],
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId)
  })
)(React.memo(TabBarItem))
