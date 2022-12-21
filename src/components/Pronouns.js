const { React, flux: Flux } = replugged.common;
const pplMoeStore = (await import('../profileStore.js')).default;

function Pronouns({ userId, profile }) {
  // only fetch a profile when pronouns for a different user are rendered
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  // profile not loaded or no pronouns set
  if(!profile || profile.info?.pronouns == "") return React.createElement(React.Fragment, {}, ' • nil')
  return React.createElement(React.Fragment, {}, ' • ', profile.info.pronouns)
}

export default Flux.connectStores(
  [pplMoeStore], // stores to pay attention to
  // props modifier: called with given props, returns additional props to be provided to the component
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId) // this could also just be in Pronouns, but it's better style to be here (i think, lol)
  })
)(React.memo(Pronouns)) // call return value of connectStores with the component to attach store & props modifer to
