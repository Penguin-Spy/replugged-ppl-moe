import { util, plugins } from "replugged";
import { SelectItem } from "replugged/components";
import { DropdownSettings } from "../constants.js";
import Messages from "../i18n.js";

export function Settings() {
  const PronounDBenabled = plugins.plugins.get("dev.penguinspy.pronoundb") && !plugins.getDisabled().includes("dev.penguinspy.pronoundb")

  return (
    <div>
      <SelectItem
        note={PronounDBenabled ? Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_NOTE_ENABLED : Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_NOTE_DISABLED}
        options={DropdownSettings.pronoundb_compat}
        disabled={!PronounDBenabled}
        {...util.useSetting(settings, "pronoundb_compat")}>
        {Messages.PPL_MOE_SETTINGS_PRONOUNDB_COMPAT_TITLE}
      </SelectItem>
    </div>
  );
}
