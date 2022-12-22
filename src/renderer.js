const { Injector, webpack, Logger } = replugged;

const PLUGIN_ID = "dev.penguinspy.ppl-moe"
const inject = new Injector();
const logger = new Logger("Plugin", PLUGIN_ID);

const classes = {
  pplMoePronouns: "ppl-moe-pronouns"
}

// i18n placeholder
const Messages = {
  TAB: "ppl.moe"
}

export async function start() {
  const React = replugged.common.React;
  const Pronouns = (await import("./components/Pronouns.js")).default;
  const Profile = (await import("./components/Profile.js")).default;


  // pronouns in message header
  /*webpack.waitForModule(webpack.filters.bySource(/.\(.,.\(\)\.timestampVisibleOnHover,.\),.\(.,.\(\)\.timestampInline,.\),/), { raw: true })
    .then(({ exports: MessageHeader }) => {
      inject.after(MessageHeader, Object.keys(MessageHeader)[0], ([props], res) => {
        logger.log("MessageHeader", props, res)

        if(props.isEdited) return res
        else return [res,
          React.createElement("span", { className: classes.pplMoePronouns },
            React.createElement(Pronouns, { userId: props.user.id })
          )
        ]
      })
    })*/

  // user profile modal
  webpack.waitForModule(webpack.filters.bySource(/;case (.+\..+\.)USER_INFO_CONNECTIONS:case (.+\..+\.)USER_INFO:default:return\(0,/), { raw: true })
    .then(({ exports: UserProfileModal }) => {
      //logger.log("UserProfileModal", UserProfileModal)

      inject.after(UserProfileModal, 'default', ([args], res) => {
        //logger.log("userprofilemodal render", args, res)

        // i am filled with so many emotions and all of them are ᴋɪʟʟ
        const [, UserProfileTabBar, UserProfileBody] = res?.props?.children?.props?.children?.props?.children?.props?.children?.[1]?.props?.children?.[1]?.props?.children ?? []
        //logger.log("UserProfileTabBar", UserProfileTabBar.type)
        //logger.log("UserProfileBody", UserProfileBody.type)

        logger.log(res?.props?.children?.props?.children?.props?.children?.props?.children?.[1]?.props?.children?.[1]?.props?.children)

        if(!UserProfileTabBar || !UserProfileBody) {
          logger.warn("UserProfileTabBar or UserProfileBody not found! Modal:", UserProfileModal, "TabBar, Body: ", UserProfileTabBar, UserProfileBody);
          return res;
        }
        if(typeof UserProfileTabBar?.type !== "function") { // User's own profile, no tab bar rendered
          return res;                                       // TODO: render a tab bar here anyways
        }

        inject.after(UserProfileTabBar, 'type', ([args], res) => {
          logger.log("UserProfileTabBar render", args, res)
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
          logger.log("UserProfileBody render", props, res)
          if(props.selectedSection === "PPL_MOE") {
            return React.createElement(Profile, { userId: props.displayProfile.userId });
          }
          return res
        })


        return res
      })

    });
  // UserProfileTabBar props.children.props.children.props.children.props.children[1].props.children[1].props.children[1].type
  // UserProfileBody props.children.props.children.props.children.props.children[1].props.children[1].props.children[2].type
}

export function stop() {
  inject.uninjectAll();
}
