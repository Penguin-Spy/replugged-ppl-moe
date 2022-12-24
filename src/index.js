import { Injector, webpack, Logger } from "replugged";
import { React } from "replugged/common";

import Pronouns from "./components/Pronouns.js";
import Profile from "./components/Profile.js";
import "./style.css"

const PLUGIN_ID = "dev.penguinspy.ppl-moe"
const inject = new Injector();
const logger = new Logger("Plugin", PLUGIN_ID);

// i18n placeholder
const Messages = {
  TAB: "ppl.moe"
}

export async function start() {

  // pronouns in message header
  webpack.waitForModule(webpack.filters.bySource(/.=.\.renderPopout,.=.\.decorations,/))
    .then(MessageHeaderUsername => {
      const functionKey = Object.entries(MessageHeaderUsername).find(e => typeof e[1] === "function")[0]

      inject.after(MessageHeaderUsername, functionKey, ([props], res) => {
        //logger.log("MessageHeader", props, res)

        //todo: don't add them when in a replied message (props.message. is reply or whatever)
        res.props.children.push(
          React.createElement(Pronouns, { userId: props.message.author.id })
        )

        return res
      })
    })


  // user profile modal
  webpack.waitForModule(webpack.filters.bySource(/;case (.+\..+\.)USER_INFO_CONNECTIONS:case (.+\..+\.)USER_INFO:default:return\(0,/), { raw: true })
    .then(({ exports: UserProfileModal }) => {
      //logger.log("UserProfileModal", UserProfileModal)

      inject.after(UserProfileModal, 'default', ([args], res) => {
        //logger.log("userprofilemodal render", args, res)

        // i am filled with so many emotions and all of them are ᴋɪʟʟ
        const profileBody = res?.props?.children?.props?.children?.props?.children?.props?.children?.[1]?.props?.children?.[1]?.props?.children
        const [, UserProfileTabBar, UserProfileBody] = profileBody ?? []
        //logger.log("UserProfileTabBar", UserProfileTabBar.type)
        //logger.log("UserProfileBody", UserProfileBody.type)
        //logger.log(profileBody)

        if(!UserProfileTabBar || !UserProfileBody) {
          logger.warn("UserProfileTabBar or UserProfileBody not found! Modal:", UserProfileModal, "TabBar, Body: ", UserProfileTabBar, UserProfileBody);
          return res;
        }
        if(typeof UserProfileTabBar?.type !== "function") { // User's own profile, no tab bar rendered
          return res;                                       // TODO: render a tab bar here anyways
        }

        inject.after(UserProfileTabBar, 'type', ([args], res) => {
          //logger.log("UserProfileTabBar render", args, res)
          const tabs = res?.props?.children?.props?.children;
          const TabBarItem = res?.props?.children?.type?.Item;
          if(tabs) {
            tabs.push(React.createElement(TabBarItem, {
              className: tabs[0]?.props?.className,
              id: "PPL_MOE",
              children: Messages.TAB
            }))
          }
          return res
        })
        inject.after(UserProfileBody, 'type', ([props], res) => {
          //logger.log("UserProfileBody render", props, res)
          if(props.selectedSection === "PPL_MOE") {
            return React.createElement(Profile, { userId: props.displayProfile.userId });
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
