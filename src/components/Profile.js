const { React, flux: Flux } = replugged.common;
const pplMoeStore = (await import('../profileStore.js')).default;
const { webpack } = replugged;

function div(...args) {
  if(args[1] === undefined) args = [null, args[0]];
  return React.createElement("div", args[0], args[1]);
}
function span(...args) {
  if(args[1] === undefined) args = [null, args[0]];
  return React.createElement("span", args[0], args[1]);
}
function h1(...args) {
  if(args[1] === undefined) args = [null, args[0]];
  return React.createElement("h1", args[0], args[1]);
}

const Messages = {
  "PPL_MOE": "ppl.moe",
  "PPL_MOE_GENDER": "⚧️ Gender",
  "PPL_MOE_PRONOUNS": "⚧️ Pronouns",
  "PPL_MOE_LOCATION": "📍 Location",
  "PPL_MOE_LANGUAGE": "🌎 Language",
  "PPL_MOE_WEBSITE": "🌐 Website",
  "PPL_MOE_BIRTHDAY": "🎂 Birthday",
  "PPL_MOE_ABOUT": "📝 All about {name}",
  "PPL_MOE_MONTH_01": "Jan.",
  "PPL_MOE_MONTH_02": "Feb.",
  "PPL_MOE_MONTH_03": "Mar.",
  "PPL_MOE_MONTH_04": "Apr.",
  "PPL_MOE_MONTH_05": "May.",
  "PPL_MOE_MONTH_06": "Jun.",
  "PPL_MOE_MONTH_07": "Jul.",
  "PPL_MOE_MONTH_08": "Aug.",
  "PPL_MOE_MONTH_09": "Sep.",
  "PPL_MOE_MONTH_10": "Oct.",
  "PPL_MOE_MONTH_11": "Nov.",
  "PPL_MOE_MONTH_12": "Dec.",
  "PPL_MOE_OPEN_PROFILE": "Open {name}'s profile",
  "PPL_MOE_SETTINGS_SHOW_PRONOUNS": "Show Pronouns",
  "PPL_MOE_SETTINGS_SHOW_PRONOUNS_DESCRIPTION": "Show ppl.moe pronouns at the top of the user's message",
  "PPL_MOE_SETTINGS_HIDE_PRONOUNDB": "Hide PronounDB",
  "PPL_MOE_SETTINGS_HIDE_PRONOUNDB_DESCRIPTION": "Hide PronounDB's pronouns if there are ppl.moe ones present",
  "PPL_MOE_SETTINGS_HIDE_PRONOUNDB_DESCRIPTION_INSTALL": "Install PronounDB for this setting to be relevant",
  "PPL_MOE_SETTINGS_SHOW_PROFILE_BADGE": "Show Profile Badge",
  "PPL_MOE_SETTINGS_SHOW_PROFILE_BADGE_DESCRIPTION": "Show a ppl.moe badge next to a user's name if they have a ppl.moe profile. This will display independently of pronouns.",
  "PPL_MOE_SETTINGS_USER_MODAL_ICON": "User Modal Icon",
  "PPL_MOE_SETTINGS_USER_MODAL_ICON_DESCRIPTION": "Display an icon instead of text for the User Modal tab.",
  "PPL_MOE_CONNECTION_DISCONNECT_CONTENT": "You cannot disconnect your ppl.moe profile from your Discord account.",
  "PPL_MOE_CONNECTION_VISIBILITY_CONTENT": "Profile visibility cannot be changed in Discord.",
  "PPL_MOE_CONNECTION_OK": "Ok"
}

const classes = {}
function waitForByProps(...args) {
  return webpack.waitForModule(webpack.filters.byProps(...args))
}

// all will probably resolve at the same time, but they're seperate queries to it's best to do this
Promise.all([
  waitForByProps("tabBar", "tabBarItem", "root"),
  waitForByProps("userInfoSectionHeader"),
  waitForByProps("scrollerBase", "thin")
]).then(
  ([userProfileTabBar, userProfileInfo, userProfileScroller]) => {
    const userProfileHeader = webpack.getByProps(["eyebrow"], { all: true })[2] // can't wait for this one bc it will only give the 1st one that loads

    classes.userProfileTabBar = userProfileTabBar.tabBar
    classes.userProfileTabBarItem = userProfileTabBar.tabBarItem

    classes.infoScroller = `${userProfileInfo.infoScroller} ${userProfileScroller.thin} ${userProfileScroller.fade}`
    classes.userInfoSectionHeader = `${userProfileInfo.userInfoSectionHeader} ${userProfileHeader.eyebrow}`
    classes.userInfoText = `${userProfileInfo.userInfoText} ${webpack.getByProps("markup").markup}`

    classes.loaded = true // if all above succeded, allow rendering of the profile
  })
  .catch(e => {
    console.warn("[ppl-moe] Profile failed to get classes:", e)
    classes.loaded = -1
  })


const LoadingAnimationModule = webpack.getModule(webpack.filters.byProps("WANDERING_CUBES"))
const LoadingAnimation = Object.values(LoadingAnimationModule).find(e => typeof e === "function")


function HeaderBlock(props) {
  const { tagline, badges } = props
  let badgesString = ""
  if(badges.includes("admin")) badgesString += " ⭐"
  if(badges.includes("bug_hunter")) badgesString += " 🐛"
  if(badges.includes("indev")) badgesString += " ⚒️"

  return div({ className: "ppl-moe-section-header" }, [
    span(tagline),
    div({ className: "ppl-moe-badges" }, badgesString)
  ])
}

function InfoBlock(props) {
  const { info, keyName: key } = props
  if(info[key] != "") { // If this field isn't empty
    let text

    switch(key) {
      case 'website': // If it's the website, make it a link to the text
        text = React.createElement("a", { className: "ppl-moe-link", href: info[key], target: "_blank" },
          info[key]
        )
        break
      case 'birthday':
        let birthday = info[key].split("-")
        text = Messages[`PPL_MOE_MONTH_${birthday[0]}`] + " " + birthday[1]
        break
      default:
        text = info[key]
    }

    return div([
      h1({ className: classes.userInfoSectionHeader },
        Messages[`PPL_MOE_${key.toUpperCase()}`]
      ),
      span(text),
    ])

  }
  return null // if this field is empty, specifically return null (otherwise react crashes)
}

function AboutBlock(props) {
  const { bioMarkdown, name } = props
  if(bioMarkdown != "") { // If a bio has been written
    const bioHTML = bioMarkdown
      .replace(/"/gim, "&quot;")  // Sanitize HTML stuff (so you can't put XSS in your bio :P
      .replace(/'/gim, "&apos;")
      .replace(/</gim, "&lt;")
      .replace(/>/gim, "&gt;")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")  // Format markdown (incomplete, does not include: tables, using underscores, strikethrough, seperators, code & codeblocks, lists, & more!)
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
      .replace(/\*(.*?)\*/gim, "<i>$1</i>")
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' class='ppl-moe-link'>$1</a>")
      .replace(/  $/gim, "<br>")  // double space at end of lines is line break
      .replace(/\\\n/gim, "<br>") // "\⤶" is line break
      .replace(/\r\n\r\n/gim, "<br><br>") // double carridge return-line feed is paragraph break
      .replace(/(^|[^\n])\n{2}(?!\n)/g, "$1<br><br>") // double newline, no spaces is paragraph break, RegEx magic: https://stackoverflow.com/questions/18011260/regex-to-match-single-new-line-regex-to-match-double-new-line#answer-18012521

    return div({ className: "ppl-moe-section-bio" }, [
      h1({ className: classes.userInfoSectionHeader },
        Messages.PPL_MOE_ABOUT.replace("{name}", name)
      ),
      span({ className: classes.userInfoText, dangerouslySetInnerHTML: { __html: bioHTML } }, null),
    ])
  }
  return null
}

// use (LoadingAnimation, {type:"pulsingEllipsis"}) for the spot where the tab item loads in
function Loading() {
  return div({ className: "ppl-moe-section-loading" }, [
    React.createElement(LoadingAnimation)
  ])
}

function Error(props) {
  return div({ className: "ppl-moe-section-error" }, [
    span({ className: classes.userInfoText }, props.message)
  ])
}

function Profile({ userId, profile }) {
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  if(typeof profile === "undefined" || !classes.loaded) {
    return React.createElement(Loading)
  } else if(!profile || classes.loaded === -1) {
    return React.createElement(Error, { message: `No profile` })
  }

  return (
    div({ className: classes.infoScroller, dir: "ltr", style: { 'overflow': "hidden scroll", 'padding-right': "12px" } }, [
      HeaderBlock({ tagline: profile.tagline, badges: profile.badges }),
      div({ className: "ppl-moe-section-info" }, [
        InfoBlock({ info: profile.info, keyName: 'gender' }),
        InfoBlock({ info: profile.info, keyName: 'pronouns' }),
        InfoBlock({ info: profile.info, keyName: 'location' }),
        InfoBlock({ info: profile.info, keyName: 'language' }),
        InfoBlock({ info: profile.info, keyName: 'website' }),
        InfoBlock({ info: profile.info, keyName: 'birthday' }),
      ]),
      AboutBlock({ bioMarkdown: profile.bio, name: profile.name })
    ])
  )
}

export default Flux.connectStores(
  [pplMoeStore], // stores to pay attention to
  // props modifier: called with given props, returns additional props to be provided to the component
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId) // this could also just be in Profile, but it's better style to be here (i think, lol)
  })
)(React.memo(Profile)) // call return value of connectStores with the component to attach store & props modifer to
