import { Injector, webpack, Logger } from "replugged";
import { React } from "replugged/common";

import Pronouns from "./components/Pronouns.js";
import Profile from "./components/Profile.js";
import TabBarItem from "./components/TabBarItem.js";
import "./style.css"

const PLUGIN_ID = "dev.penguinspy.ppl-moe"
const inject = new Injector();
const logger = new Logger("Plugin", PLUGIN_ID);


export async function start() {

  // pronouns in message header
  webpack.waitForModule(webpack.filters.bySource(/.=.\.renderPopout,.=.\.decorations,/))
    .then(MessageHeaderUsername => {
      const functionKey = Object.entries(MessageHeaderUsername).find(e => typeof e[1] === "function")[0]

      inject.after(MessageHeaderUsername, functionKey, ([props], res) => {
        // this is hidden with css when in a reply or in compact mode (until hovered)
        res.props.children.push(
          React.createElement(Pronouns, { userId: props.message.author.id, compact: props.compact })
        )
        return res
      })
    })


  // user profile modal
  webpack.waitForModule(webpack.filters.bySource(/;case (.+\..+\.)USER_INFO_CONNECTIONS:case (.+\..+\.)USER_INFO:default:return\(0,/), { raw: true })
    .then(({ exports: UserProfileModal }) => {

      inject.after(UserProfileModal, 'default', ([args], res) => {

        // i am filled with so many emotions and all of them are ᴋɪʟʟ
        const profileBody = res?.props?.children?.props?.children?.props?.children?.props?.children?.[1]?.props?.children?.[1]?.props?.children
        const [, UserProfileTabBar, UserProfileBody] = profileBody ?? []

        if(!UserProfileTabBar || !UserProfileBody) {
          logger.warn("UserProfileTabBar or UserProfileBody not found! Modal:", UserProfileModal, "TabBar, Body: ", UserProfileTabBar, UserProfileBody);
          return res;
        }

        inject.after(UserProfileBody, 'type', ([props], res) => {
          if(props.selectedSection === "PPL_MOE") {
            return React.createElement(Profile, { userId: props.user.id });
          }
          return res
        })

        if(typeof UserProfileTabBar?.type !== "function") { // User's own profile, no tab bar rendered
          return res;                                       // TODO: render a tab bar here anyways
        }
        inject.after(UserProfileTabBar, 'type', ([props], res) => {
          const tabs = res?.props?.children?.props?.children;
          const RealTabBarItem = res?.props?.children?.type?.Item;

          if(tabs && RealTabBarItem) {
            tabs.push(React.createElement(RealTabBarItem, {
              className: tabs[0]?.props?.className,
              id: "PPL_MOE",
              children: React.createElement(TabBarItem, { userId: props.user.id })
            }))
          }

          return res
        })

        return res
      })

    });
}

export function stop() {
  inject.uninjectAll();
}
