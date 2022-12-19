const React = replugged.webpack.common.react;
const Flux = replugged.webpack.common.flux;

const pplMoeStore = (await import('./profileStore.js')).default;

function Pronouns({ userId, profile }) {
  React.useEffect(() => void pplMoeStore.getProfile(userId), [userId])

  // profile not loaded or no pronouns set
  if(!profile || profile.info?.pronouns == "") return React.createElement(React.Fragment, {}, ' • pronouns placeholder')
  return React.createElement(React.Fragment, {}, ' • ', profile.info.pronouns)
}

export default Flux.connectStores(
  [pplMoeStore],
  ({ userId }) => ({
    profile: pplMoeStore.getProfileSync(userId)
  })
)(React.memo(Pronouns))
