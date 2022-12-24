import { webpack } from "replugged";
import { React, flux as Flux } from "replugged/common";
import pplMoeStore from "../profileStore.js";
import Messages from "../i18n.js";

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
  if(info[key] === "") return null // if this field is empty, specifically return null (otherwise react crashes)

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

function AboutBlock(props) {
  const { bioMarkdown, name } = props
  if(bioMarkdown === "") return null

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


function Profile({ userId, profile }) {
  React.useEffect(() => void pplMoeStore.fetchProfile(userId), [userId])

  if(typeof profile === "undefined" || !classes.loaded) {
    return React.createElement(LoadingAnimation, { className: "ppl-moe-section-loading" })

  } else if(!profile || classes.loaded === -1) {
    return div({ className: "ppl-moe-section-error" }, [
      span({ className: classes.userInfoText }, `An error occured. <${profile}, ${classes.loaded}>`)
    ])
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
  [pplMoeStore],
  ({ userId }) => ({
    profile: pplMoeStore.getProfile(userId)
  })
)(React.memo(Profile))
