# DOCUMENTATION FOR THE SUBMISSIVES AND SLAVES SCRIPT

The design philosophy behind **SASS**: The goal is for it to only affects the wearer but others may interact with it making it opt-in only. It tries to reduce spam and stay mysterious while it informs the wearer of changes. It provides multiple settings to personalize the experience and make it compatible with multiple wearers. It is meant to complement the club and RP, it is not meant to replace any of it! The use of RP along with **SASS** is encouraged, this is why there won't be many features related to things that can already be done. (Tie up x, etc.) Most features will revolve around things that cannot be done or can hardly be done at the moment to enhance the experience and give D/s more tools. It tries not to use anything a player cannot already do therefore it will not feature anything that might be considered "cheats".

Please use the commands in whispers, they are only supported out of whispers in case a wearer has their whispers blocked in their owner's presence.

**WARNING: be careful when using the curse in a beta release/NEW VERSION**

**Last approved on the following versions: V13V**
**IN BETAS AND AFTER V13V, DO NOT USE THE CURSE IN LARP ROOMS**

Bug fixes and improvements will come, thank you for reporting them. You do not need to download this script, you only need to copy paste the latest version. It is not recommended to downgrade.

## Running the script as an extension
1. Dowload and unzip the latest version found here: https://github.com/ace-1331/ace12401-cursedscript/releases
2. Navigate to chrome://extensions/
3. Enable Developer mode
4. Click 'Load unpacked' button and browse to this folder (see the notes below)
5. Login and click on "start curse"

- You may get an error while loading the unpacked extension saying the manifest is missing or broken. This means the manifest.json file was in the wrong format after decompression/cloning. Please open the file in notepad and save it again to save it with the proper encoding.
- IMPORTANT NOTE ON RUNNING THE SCRIPT: make sure you are on a validated version of the game

## Useful information
- ALL COMMANDS ARE PREFIXED WITH THE COMMAND CHARACTER AND THE SLAVE IDENTIFIER, BY DEFAULT IT IS # AND YOUR NAME (IE. #ace help or #ace showowners)
- ALL PARAMETERS MUST BE SPLIT BY A SPACE (IE. #ace cursedbelt on)
- The parameters defaults to "on" if none are given (IE: #ace cursedmittens and #ace cursedmittens on will do the same)
- Supports OOC and is case insensitive
- The command can be preceded or followed by any text. What's important is that the whole command follows each other [this works #ace showstrikes, this #ace showstrikes also works, #ace this doesnt work showstrikes, #ace showstrikesthis wont work]
- If an item is blocked in your permissions, it will not clash with the curse, but it will not be used. Unblock the needed items to use them with the curse.
- Not compatible with old browsers. (Welcome to 2020!)
- Some things that will be coming are listed in the repository's wiki. Feel free to send your own suggestions or report bugs in the issue tracker of the repo
- Some more intense features are intentionally commented and left out of the basic version, if you wish to use them, do so at your own risk.
- The script can be saved as a "snippet" on chrome to make it easier to reuse.
- Use the intense version at your own risk!

- IMPORTANT NOTE ON PERSISTANCE: even though there are ways to circumvent how data is stored on your character, the public version contains no code that would allow that to spare the servers and respect the "no cheat" policy. To have your configurations persist between sessions, you need to be on the same device/browser and ideally -not- in incognito mode. However, there is an import and an export function available to use. Run "cursedExport()" in the console and save the whole string it gives you wherever you want. On the next browser you can use the command "cursedImport("yourgivenstringhere")" to import your configs. This will allow you to carry over your configurations between versions of the club, devices or browsers.

### The list of functions is located in the wiki
https://github.com/ace-1331/ace12401-cursedscript/wiki

-----------------------------------------------
**Made by ace (12401) - Ace__#5558**
**Official release: #9**
