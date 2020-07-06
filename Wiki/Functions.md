# All functions
**Disclaimer: this list is kept up-to-date with the latest version, old versions may not contain the same commands. Other functions marked as new may still be in testing therefore not available on the latest stable release. Use the help command to see the commands available in your version**

**Note: most functions are meant to be switches, calling it again with the same parameter will turn it off**

**Note: for more on cursed item, check the wiki page on this topic**

## WEARER ONLY FUNCTIONS
### Information
- **NEW** tip //Note: gives an unseen tip from the tip list
- **NEW** tip reset //Note: re-enables all tips
- help
- showstrikes
- showblacklist
- listsentences
### Configurations
- quickban //Note: bans all known trolls and players in your blacklist from the current room if you are an admin
- eatcommands //Note: messages containing valid commands will not be shown in the wearer's chatlog
- restraintvanish //Note: will make the curse remove restraints when item curses are disabled
- hidedisplay //Note: remove the display icons showing who wears the curse
- wardrobev2 //Note: this enables the enhanced appearance menu
- isclassic //Note: The curse will send messages containing transgressions along with the punishment
- issilent //Note: all curse messages will be silent and only shown to the wearer
- forwardall //Note: all whispers *sent by the curse* will be displayed to you.
- blacklist [a member number] //Note: this blacklist is strictly for the curse and is different than the in-club one
- mistress [a member number]
- owner [a member number] //Note: your official owner in the club is an owner by default on load
- commandchar [! / & / $ / #]
- identifier [new identifier]
- savecolors //Note: this save your current colors to have the curse reapply them
- **Intense mode**: capture //Note: enables the feature where others can capture you with the capture function
### Speech 
- talk [target id] [sentence id] //Note: use this command to talk in restrained speech mode with the allowed targets and sentences.
### Other
- draw [nb of cards] [players] //Note: cards will be drawn in turns, not all at once for each player
- shuffle
- **Intense mode**: nickname [MemberNumber] [Name] //Note: owners have priority over other nicknames
- **Intense mode**: deletenickname [MemberNumber]

## PUBLIC (AND HIGHER PERMISSION LEVELS)
- **NEW**  orgasmcount
- respect
- punish //Note: adds strikes
- **NEW** reward //Note: removes strikes
- edge
- asylumtimeleft
- help
- readnote
- sendnote //Note: attaches a note to the wearer so the owners can read them
- **Intense mode**: nickname [Name] //Note: anyone can change their name back if they dislike what was given to them
- **Intense mode**: blocknickname //Note: when you delete your own nickname, it blocks anyone from changing it again unless you allow it with the function down under
- **Intense mode**: allownickname
- **Intense mode**: respectnickname
- **Intense mode**: capture //Note: captures the wearer if capture mode is on

## MISTRESS (AND HIGHER PERMISSION LEVELS)
### Basic
- kneel
- savecolors //Note: this save your current colors to have the curse reapply them
- showstrikes
- changestrikes [+/- nb strikes]
- cursereport
- mistress [a member number]
- enforce [a member number]
- public //Note: disables the public from using public functions
- deactivateonpresence [on/off] //Note: lifts all restrictions to allow for normal play while your mistress is there
- mtitle [number(optional)] [title to add/remove] //Note: adds a custom title for the given number in the list
- mtitle [respectnickname] //Note: toggle enforced for the nickname
- **Intense mode**: mnickname [MemberNumber] [Name] //Note: owners have priority over other nicknames
### Speech
- speech //Note: enables the word bans in place
- banword [the word itself] //Note: Don't forget to enable them first! (See command above)
- banbegging [on/off]
- banfirstperson [on/off]
- contractions //Note: disabled the use of contractions like I'll, she'll won't.
- dolltalk 
### Curses
- curseitem [group] //Note: curse any item of a given group (see the wiki page on the topic for the list of groups)
- **NEW** curseitem [group] [nb of hours] //Note: Curses a group for a given time (1 minute to 7 days)
- naked
- **NEW** clothed //Note: toggles off all clothing curses to reverse the naked command
- vibes
- collar
- mute
- mittens
- gag 
- blindfold 
- hood
- earplugs
- dildogag
- panties 
- screws 
- paws
- doublegag
### Configurations
- **NEW** loadpresetcurses [name] //Note: toggles on the cursed *groups* from the preset to the currently worn items
- **NEW** loadpreset [name] //Note: toggles on the cursed **items** from the preset
- **NEW** savepreset [name] //Note: saves the current item curses as a preset
## OWNER FUNCTIONS
### Basic
- note //Note: this attaches a note anyone can read to the wearer
- **Intense mode**: onickname [MemberNumber] [Name] //Note: owners have priority over other nicknames
- asylum [nb of hours] //Note: can be decimal or negative
- **NEW** sendasylum //Note: if the patient has time left on her timer, you can send her to the asylum entrance this way
- owner [a member number]
- otitle [Number] [Title]
### Configurations
- **New** resetorgasmcount
- **Intense mode**: sensdep //Note: locks the wearer's settings to disable examine + total sensdep
- reminderinterval [seconds] //Note: there is a minimum of 1 minute between them
- clearallreminders
- guestnotes //Note: enable the ability for others to attach notes to the wearer
- readnotes //Note: displays all the notes people attached to the wearer
- fullpublic //Note: turns mistress functions into public functions
- afk //Note: punishes the wearer for being afk if the afk timer is activated
- restrainplay //Note: this prevents the wearer from changing their mistresses/owners
- disablepunishments //Note: disables the curse-given punishments
- onlyonpresence //Note: disables the curse when your owner is not present
- **Intense mode**: maid //Note: Removes main hall maid release option
- **Intense mode**: leash //Note: turns on "leashing" so any owner can triple beep the user to force-pull then into a room
- **New Intense mode:** preventdc //Note: prevents the wearer from being able to reload to the main hall when tied inside a room (if the room exists after reloading)
- **New Intense mode:** meterlocked //Note: locks the arousal meter to automatic mode
- **New Intense mode:** meteroff //Note: locks the arousal meter to off mode (with or without activity)
- **New Intense mode:** blockooc //Note: prevents the wearer from using OOC in normal chat messages (allows whispers and emotes)
### Speech
- enforceentrymessage //Note:  Requires the wearer to be able to speak normally. Be mindful of banned words.
- clearwords
- entrymessage [sentence] //Note: all text after the word entrymessage will be taken
- **INTENSE V:** -restrainedspeech //Note: toggles restrained speech mode
- **INTENSE V:** -self //Note: changes the way %self% tags are replaced by a given text (default is "I") (restrained speech)
- **INTENSE V:** -target [id] [target] //Note: adds a target with the given id (restrained speech)
- **INTENSE V:** -sentence [id] [sentence] //Note: adds a sentence with the given id (restrained speech)
- **INTENSE V:** -listsentences //Note: shows the sentence and target ids of the wearer (restrained speech)
- **Intense mode**: forcedsay [sentence] //Note: all text after the word forcedsay will be taken. Requires the wearer to be able to speak.
- **Intense mode**: say [sentence] //Note: all text after the word say will be taken. Requires the wearer to be able to speak.
- **Intense mode**: fullmute //Note: blocks the wearer from sending normal chat messages
- **Intense mode**: enablesound
- **Intense mode**: sound ["oink", "meow", etc.] //Note: each letter specified will require it to be in order in the sentence, any other letter won't be accepted. (It accepts .',!?-) 
### Curses
- **New** forbidorgasm //Note: punishes the wearer for having an orgasm with the meter
- **New** blockorgasm //Note: prevents the meter from ever triggering an orgasm
- clearcurses //Note: clears all curses
- belt
- reminders //Note: enables/disables current set of reminders
- togglereminder [reminder] //Note: adds or removes a reminder from the list
### Built-in club rules
**IMPORTANT, THESE NEED TO BE ENABLED BY THE CLUB OWNER, AND ARE NOT DISABLED IF THE CURSE IS TURNED OFF
- **New** forcedlabor
- **New** remoteself
- **New** remoteblock
- **New** unlockself
- **New** keyblock
- **New** blockchange
## OWNERS/WEARER FUNCTIONS
### Information
- speechreport
- showmistresses
- showowners
- showenforced
- shownicknames
- configreport
- **NEW** listpresets
## CLUB OWNER FUNCTIONS
### Configurations
- ctitle [Number] [Title]
- **New** looseowner //Note: Enables access to built-in club rules for curse owners
- Intense mode: locknewsub //Note: prevents the wearer from collaring new subs
- **Intense mode**: lockowner  //Note: disables the ability to break a trial/collar
- **Intense mode**: locknewlover  //Note: disables the ability to have new lovers