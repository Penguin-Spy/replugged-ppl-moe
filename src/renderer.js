var { Injector, webpack, Logger } = replugged;
const Inject = new Injector();
const Logger = new Logger("Plugin", "dev.penguinspy.ppl-moe");

export async function start() {
  const React = replugged.common.React;
  const Pronouns = (await import("./Pronouns.js")).default;

  const botTagModule = webpack.getBySource(".botTagCompact")
  Inject.instead(botTagModule, Object.keys(botTagModule)[0], (args, fn, obj) => {
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
}

export function stop(ctx) {
  ctx.injector.uninjectAll();
}
