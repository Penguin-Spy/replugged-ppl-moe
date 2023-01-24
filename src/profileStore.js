import { flux as Flux, fluxDispatcher as FluxDispatcher } from "replugged/common";

// list of loaded profiles
const profiles = {}
// profiles[id] == undefined means we don't know if that id has a profile
//              == false     means we know that id doesn't have a profile (or is banned)
//              == Object    the object is the user's profile (could be mostly empty)
// this allows us to use !profile to check if they have a valid profile,
// as well as differentiate between unfetched & nonexistent profiles (to know if we need to fetch it)

// list of profiles currently being fetched (or previously fetched, but that's irrelevant)
const requestedProfiles = {}
// requestingProfiles[id] == boolean
// this is necessary to prevent duplicate GET requests, as useEffect is only called after every component is rendered
// if a user has 2 messages that get rendered, both will call useEffect and be rendered, and THEN the "effect" of fetchProfile is called twice


class PplMoeStore extends Flux.Store {

  // ensure we have the user's profile
  async fetchProfile(id) {
    // if we already have the profile or are already fetching it, do nothing
    if(id in profiles || id in requestedProfiles) return;

    // otherwise, start an asynchronous request for the users profile
    requestedProfiles[id] = true;
    let profile = await fetch(`https://ppl.moe/api/user/discord/${id}`)
      .then(r => r.json())
      .catch((err) => {
        if(err.statusCode != 404) logger.warn(`ppl.moe profile fetch for ${id} failed:`, err)
        return // won't re-request, & stores undefined instead of false (will cause perpetual loading animation)
      })

    // postprocess returned profile
    if(profile.banned || profile.error) profile = false

    // store it
    profiles[id] = profile

    // and notify connected components that the profile is available
    FluxDispatcher.dispatch({
      type: 'PPL_MOE_PROFILE_LOADED',
      id: id,
      loadedProfile: profile
    })
  }

  // simply try to get the user's profile, returning nothing if we haven't fetched it yet
  getProfile(id) {
    return profiles[id]
  }

  // thing for Discord's devtools (ctrl+alt+O)
  __getLocalVars() {
    return { profiles, requestedProfiles }
  }
}

export default new PplMoeStore(FluxDispatcher, {
  ['PPL_MOE_PROFILE_LOADED']: () => void 0 // this doesn't need to do anything because i'm not using Flux as intended but idc (this just needs to be callable)
})
