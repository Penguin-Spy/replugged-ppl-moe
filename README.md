> **Note**  
> this is a port of my powercord-ppl-moe plugin and is still in beta! here be dragons, etc.  
> any features that are in ~~strikethrough~~ were in the original but have not been ported yet.

# replugged ppl.moe
[![downloads](https://img.shields.io/github/downloads/Penguin-Spy/replugged-ppl-moe/latest/total?color=ff69b4&logo=github)](https://github.com/Penguin-Spy/replugged-ppl-moe/releases/latest/download/dev.penguinspy.ppl-moe.asar) [![Replugged](https://img.shields.io/badge/client-Replugged-7289da?logo=discord&logoColor=fff)](https://replugged.dev/)  
This is a [Replugged](https://replugged.dev/) plugin that displays a user's [ppl.moe](https://ppl.moe/) profile as a new tab in the user's modal.  
It also shows users' pronouns next to the username in messages.  

# Features
- A new tab in the user modal that displays a user's ppl.moe profile (if they have one)
- Displays a user's pronouns in the message header.
- Automatically hides PronounDB's pronouns if there are ppl.moe ones to show (optional)
- ~~A new Discord connection that links to the profile on the ppl.moe website~~
- ~~Shows a cute little badge next to a user's name in chat messages if they have a profile~~
- ~~Optional tab icon (instead of text) for theme consistency~~

# Settings
Since Replugged is currently in beta, settings must be configured using DevTools:
```js
// Always run this first line to load the settings
PplMoeSettings = await replugged.settings.init("dev.penguinspy.ppl-moe")
// Then run one of the following lines to choose each setting:

/* PronounDB compat behavior */
PplMoeSettings.set("pronoundb-compat", "ppl-moe")   // Show only ppl.moe pronouns if both are found (default)
PplMoeSettings.set("pronoundb-compat", "pronoundb") // Show only PronounDB if both are found
PplMoeSettings.set("pronoundb-compat", "both")      // Show both if both are found
// In all cases, if only one is found then it will be shown.
```

# Known Issues
The first time you open a user modal after reloading, the tab button will not appear. Simply re-open the modal to fix this.  
If you encounter any issues *with the features that are curently implemented*, [please open a GitHub issue](https://github.com/Penguin-Spy/replugged-ppl-moe/issues).

# Installation
## Replugged
[Download the latest .asar](https://github.com/Penguin-Spy/replugged-ppl-moe/releases/latest/download/dev.penguinspy.ppl-moe.asar) and copy it to [your plugins folder](https://github.com/replugged-org/replugged#installing-plugins-and-themes).

## Other client mods
I may write a version for [Aliucord](https://github.com/Aliucord/Aliucord "A Discord mod for Android") at some point.  
This plugin will never support BetterDiscord/BandagedDiscord or whatever people are calling it this week. (it's the Minecraft Forge of Discord mods)

# Legal
Licensed under MIT. Copyright (c) 2022 Penguin_Spy

This plugin is not mantained, endorsed by or in any way affiliated with ppl.moe or amy!  
