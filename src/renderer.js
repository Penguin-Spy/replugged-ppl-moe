const { Injector, webpack, Logger } = replugged;
const inject = new Injector();
const logger = new Logger("Plugin", "dev.penguinspy.ppl-moe");

const PLUGIN_ID = "dev.penguinspy.ppl-moe"
const classes = {
  pplMoePronouns: "ppl-moe-pronouns"
}

export async function start() {
  const React = replugged.common.React;
  const Pronouns = (await import("./Pronouns.js")).default;

  const botTagModule = webpack.getBySource(".botTagCompact")
  inject.instead(botTagModule, Object.keys(botTagModule)[0], (args, fn, obj) => {
    const props = args[0];
    const res = fn.apply(obj, args);
    logger.log("bottag", props)

    if(props.isRepliedMessage) return res
    else return [res,
      React.createElement("span", { className: classes.pplMoePronouns, "data-compact": props.compact },
        React.createElement(Pronouns, { userId: props.user.id })
      )
    ]
  })
}

export function stop() {
  inject.uninjectAll();
}
