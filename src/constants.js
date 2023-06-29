const DefaultSettings = Object.freeze({
  pronoundb_compat: "ppl-moe",
  show_own_pronouns: true
})

const DropdownSettings = Object.freeze({
  pronoundb_compat: [
    { label: "ppl.moe  ", value: "ppl-moe" },
    { label: "PronounDB", value: "pronoundb" },
    { label: "Both     ", value: "both" }
  ]
})

export {
  DefaultSettings,
  DropdownSettings
}
