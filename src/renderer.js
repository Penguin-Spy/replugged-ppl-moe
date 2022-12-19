console.log("[ppl-moe] Importing renderer.js")

const { /*Injector,*/ webpack, /*notices, commands, settings, quickCSS, themes, ignition, plugins*/ } = replugged;


function getFunctionKeyBySource(module, ...args) {
  return Object.entries(module).find(([key, func]) => {
    if(typeof func !== "function") return false;
    const src = func.prototype.constructor.toString() // search methods that have been injected already
    return args.every(filter => src.includes(filter))
  })?.[0]
}

export async function start(ctx) {
  const inject = ctx.injector;
  const Logger = ctx.logger;

  const React = webpack.common.react;
  const Pronouns = (await import("./Pronouns.js")).default;

  //const Header = webpack.getBySource(/var (.)=.\(\),.="h"\.concat\(Math\.min\((\1),6\)\);return\(0,.\.jsx\)/)
  //const renderFunctionKey = getFunctionKeyBySource(MessageHeader, "concat(Math.min")

  /*const MessageHeader = webpack.getBySource(/.\(.,.\(\)\.timestampVisibleOnHover,.\),.\(.,.\(\)\.timestampInline,.\),/, { raw: true }).exports
  const renderFunctionKey = Object.keys(MessageHeader)[0]

  if(MessageHeader && renderFunctionKey) {
    Logger.log("Injecting into ", MessageHeader, "'s", renderFunctionKey)
    inject.after(MessageHeader, renderFunctionKey, ([args], res) => {
      Logger.log(args, res)
      const pronouns = webpack.common.react.createElement('span', null, "test")
      //res.props.username.props.children[1].props.children.push(pronouns)
      return [pronouns, res]
    })
  } else {
    Logger.log("Didn't find Message Header: ", MessageHeader, renderFunctionKey)
  }*/

  const botTagModule = webpack.getBySource(".botTagCompact")
  inject.instead(botTagModule, Object.keys(botTagModule)[0], (args, fn, obj) => {
    const props = args[0]
    console.log("[ppl-moe] bottag", props, obj)
    return [
      fn.apply(obj, args),
      React.createElement(Pronouns, {
        userId: props.user.id
      }),
      React.createElement("span", null, "beans")
    ]
  })


  //const MessageHeader = webpack.getBySource("showTimestampOnHover")
  //const renderFunctionKey = webpackGetFunctionKeyBySource(MessageHeader, "showTimestampOnHover", "hideTimestamp")

  /*if(MessageHeader && renderFunctionKey) {
    Logger.log("Injecting into ", MessageHeader, "'s", renderFunctionKey)
    inject.after(MessageHeader, renderFunctionKey, ([args], res) => {
      Logger.log("Message Header render i think")
      Logger.log(args, res)
      const pronouns = webpack.common.react.createElement('span', null, "test")
      res.props.username.props.children[1].props.children.push(pronouns)
      return res
    })
  } else {
    Logger.log("Didn't find Message Header: ", MessageHeader, renderFunctionKey)
  }*/
}

export function stop(ctx) {
  ctx.injector.uninjectAll();
}
