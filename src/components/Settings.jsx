import { webpack, util, plugins } from "replugged";
import { SwitchItem } from "replugged/components";
import { DropdownSettings } from "../constants.js";
import Messages from "../i18n.js";

const mod = webpack.getBySource(/.\.options,.=.\.placeholder/)
const DropdownMenu = webpack.getFunctionBySource(/.\.options,.=.\.placeholder/, mod)

function useDropdownSetting(settings, key) {
  const initial = settings.get(key);
  const [value, setValue] = React.useState(initial);

  return {
    value,
    isSelected: (compareValue) => {
      return compareValue === value
    },
    onSelect: (newValue) => {
      setValue(newValue);
      settings.set(key, newValue);
    },
  };
}

function DropdownMenuItem(props) {
  function serialize(value) { return value } // not relevant but DropdownMenu calls it

  // todo: this is bad and dumb and will break,
  //  figure out how to mimic discord's settings stuff
  const res = SwitchItem({
    note: props.note, children: props.children, disabled: props.disabled
  })

  const switchItemElement = res?.props?.children?.[0]?.props?.children?.props?.children
  if(switchItemElement === undefined) return null

  switchItemElement[1] = (
    <DropdownMenu
      isDisabled={props.disabled}
      options={props.options}
      isSelected={props.isSelected}
      select={props.onSelect}
      serialize={serialize}>
    </DropdownMenu>
  );

  return res
}

export function Settings() {
  const PronounDBenabled = plugins.plugins.get("dev.penguinspy.pronoundb") && !plugins.getDisabled().includes("dev.penguinspy.pronoundb")
  return (
    <div>
      <DropdownMenuItem
        note={PronounDBenabled ? Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_NOTE_ENABLED : Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_NOTE_DISABLED}
        options={DropdownSettings.pronoundb_compat}
        disabled={!PronounDBenabled}
        {...useDropdownSetting(settings, "pronoundb_compat")}>
        {Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_TITLE}
      </DropdownMenuItem>
    </div>
  );
}
