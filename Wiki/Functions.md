# All functions
**Disclaimer: this list is kept up-to-date with the latest version, old versions may not contain the same commands. Other functions marked as new may still be in testing therefore not available on the latest stable release. Use the help command to see the commands available in your version**

**Note: most functions are meant to be switches, calling it again with the same parameter will turn it off**

**Note: for more on cursed item, check the wiki page on this topic**

**You can view most of your current curse options in the menu inside the bonus hole or by using the information commands**

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| Function name | Type of effect | Description of the effect | Status of the function | Only work if intense mode is active | Access level |

### The different types of functions are:

- **Action:** This function has a direct effect only and each use has no direct impact on the curse
- **Setting:** Those are usually ON / OFF or option based and serves to customize your curse, without applying an effect
- **Rule:** Similar to settings, but are accompanied with punishments if broken.

### The status are as follow:

- **New:** The function has been added recently.
- **🌟:** A commonly used and liked feature
- **Beta or In development:** Functions still undergoing tests and changes during a beta, be wary of potential weird bugs.
- **Avoid:** Those are functions that either are currently bugged, or that are scheduled to disappear in the future.

### Access level:
- **Wearer:** Designate the wearer as being able to use the function on herself
- **Public:** Public level of access, anyone can use it on the target. Some public functions can be disabled by the wearer's mistresses
- **Mistress:** Mistress level of access, gives more control but the most restrictive functions are still not open. Includes Public
- **Owner:** Owner level of access, pretty much everything outside of a handful of functions are usable. Includes Mistress and Public
- **Club owner:** Club owner level of access, only one exists and is the one who have her collar on your neck. Can do anything she wishes and includes every other access level except Wearer

When a function exists both as Wearer and another role, both will be listed

## Basic settings

These functions are for basic settings and information options and are mostly Wearer level

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| help | Action | Gives general information on the curse. Used by others, gives a link to this wiki page to have the list of functions |  |  | Wearer, Public |
| tip | Action | Allows to see one of the curse tip you have not seen |  |  | Wearer |
| tip reset | Action | Resets the list of seen tips |  |  | Wearer |
| language [fr/en/ru/ger] | Setting | Determines the language in which the messages will be sent for the person. It defaults to english. Translations can be done by contributors and rely on them to keep it up to date | IN DEVELOPMENT |  | Wearer, Public |
| commandchar [Character] | Setting | Defines the character used for command, among four choices: # $ & !. Default: # |  |  | Wearer |
| identifier [Name] | Setting | Defines the identifier used by the curse for target you. Useful if multiple people have the same name in the room or if the nickname has been changed. Default: the character's name |  |  | Wearer |
| eatcommands | Setting | Toggle to hide valid commands sent to manipulate your curse. Default: OFF |  |  | Wearer |
| isclassic | Setting | Toggle if a disallowed message according to the rules is still sent, instead of blocked. Default: OFF |  |  | Wearer |
| issilent | Setting | Curse messages are silent to all but the wearer. Doesn't hide whispered results for a wrong command. Default: OFF |  |  | Wearer |
| forwardall | Setting | Allows you to receive all whispers from the curse sent to others. Default: OFF |  |  | Wearer |
| hidedisplay | Setting | Choose to hide who has the curse active in a chatroom (the icon above their head). Default: OFF |  |  | Wearer |
| savecolors | Setting | Saves the colors used in all slots for when the curse reapply items |  |  | Wearer, Mistress |
| capture | Setting | Activates the capacity to be captured when used by the wearer, or starts a capture by others. When captured, you cannot leave a room for 5 minutes, and the one that captured you can summon you by beeping you from another room. Default: OFF |  | X | Wearer |
| clearcurses | Action | Removes all curses on the bearer, allowing to start from a clean slate |  |  | Owner |
| wardrobev2 | Setting | Gives access to the enhanced appearance menu. May break with wardrobe screen update. Default: OFF | 🌟 |  | Wearer |
| commandsv2 | Setting | Gives access to the enhanced commands with better \help. Default: OFF | NEW | X | Wearer |
| hidehelp | Setting | Removes the help message you see on every login. Default: OFF |  |  | Wearer |

## Access

These functions controls who has access to what

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| togglecommand [Command] | Setting | Set the availability of a given command |  |  | Wearer |
| mistress [ID] | Setting | Makes the character with this ID a mistress regarding the curse, giving some more access | 🌟 |  | Wearer, Mistress |
| owner [ID] | Setting | Makes the character with this ID an owner, giving pretty much full access to the curse | 🌟 |  | Wearer, Owner |
| restrainplay | Setting | Blocks the use of the 'mistress' and 'owner' function for the wearer | 🌟 |  | Owner |
| blacklist [ID] | Setting | Adds or remove a given ID in your curse related blacklist. Note that it is NOT the blacklist of your character. The ID is the one in game |  |  | Wearer |
| quickban | Action | Bans known recurrent trolls and your own blacklist in a room you are admin of | avoid |  | Wearer |
| public | Setting | Toggle access to Public level function to non-mistress. Default: ON |  |  | Mistress |
| fullpublic | Setting | Sets the victim to be fully public. This means everyone can use Mistress tier functions on the curse bearer | 🌟 |  | Owner |
| disableblocking | Setting | Makes all commands available, every commands requiring to opt-in (such as leash) are active. Use with care |  | X | Owner |
| looseowner | Setting | Gives access to club owner specific function part of the Club, to all curse owners |  |  | Club |

## Naming

These functions are all about setting an user's apparent name or title. This system will likely change in the future, please report any existing issues with it

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| nickname [ID] [Nickname] | Setting | Gives a nickname to the target, changing the name on your side only. If an owner changed a nickname, it will take precedence. Note that it is different from the Identifier function and only change the apparent name |  | X | Wearer |
| nickname [Name] | Setting | Same as the user only function in term of role, allows to change your apparent name to the curse wearer. If using doll talk, it could be useful to set yourself a nickname 6 letters long or shorter |  | X | Public |
| deletenickname [ID] | Setting | Removes the nickname given by the function above |  | X | Wearer |
| respectnickname | Rule | Forces the curse wearer to call you with your nickname, not your character name |  | X | Public |
| blocknickname | Setting | Removes your nickname, and prevent it from being changed |  | X | Public |
| allownickname | Setting | Restores the ability to have your nickname changed |  | X | Public |
| mtitle [ID] [Title] | Setting | Gives a title (such as mistress) to use when one of the rules expect one. If no ID is given, this applies to yourself |  |  | Mistress |
| mtitle [respectnickname] | Rule | Same as above, but for a given nickname |  |  | Mistress |
| otitle [ID] [Title] | Setting | Sets the title that the curse bearer must use when asked to show respect to the given person. Ignoring the ID makes it change your title |  |  | Owner |
| ctitle [Title] | Setting | Gives a title to respect for the curse bearer. It takes precedence over other similar functions |  |  | Club |
| mnickname [ID] [Nickname] | Setting | Gives a nickname to the given member that the curse bearer will see instead of the name. Note that an owner given nickname takes precedence. You can omit the ID number to change your own nickname |  | X | Mistress |
| onickname [ID] [Name] | Action | Gives a nickname to the given member that the curse bearer will see instead of the name. This one has priority over public or mistress given nicknames. You can omit the ID number to change your own nickname |  | X | Owner |

## Curse activation

These functions determine when the curse should apply

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| enforce [ID] | Setting | Allows to disable or re-enable rule enforcement regarding this mistress in particular. Useful if there's a hierarchy among mistresses. Default: ON |  |  | Mistress |
| deactivateonpresence [on/off] | Setting | Removes all restrictions in presence of a mistress. Note that it deactivate everything, even restrictions from owners | avoid |  | Mistress |
| disablepunishments | Setting | Makes it so the curse only warn you, without adding restraints from time to time for disobeying. Useful to not get your own restraints overridden, or to test things |  |  | Owner |
| onlyonpresence | Setting | Makes it so the rules are only active when an owner is in the same room as you | avoid |  | Owner |

## Information

Those commands are used to receive a variety of information

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| showblacklist | Action | Shows the accounts you have blacklisted for the curse |  |  | Wearer |
| showstrikes | Action | Shows the number of time you have broken the curse in recent days. The number can also be modified by a mistress |  |  | Public |
| orgasmcount | Action | Indicates how many orgasms the curse wearer had, useful to ensure that she didn't play behind your back |  |  | Public |
| transgressions | Action | Gives a list of past transgressions, preventing the curse bearer to hide her bad habits |  |  | Public |
| listoffcommands | Action | Shows which commands have been blacklisted by the wearer |  |  | Public |
| asylumtimeleft | Action | Allows to know how long the curse wearer has left to stay in the Asylum, given in hours |  |  | Public |
| cursereport | Action | Gives a report on what options and rules are being active on the target |  |  | Mistress |
| speechreport | Action | Gives the list of effects altering and controlling speech |  |  | Wearer, Owner |
| showmistresses | Action | Shows the list of mistress according to the curse |  |  | Wearer, Owner |
| showowners | Action | Shows the list of owners according to the curse |  |  | Wearer, Owner |
| showenforced | Action | Offers a list of all enforced rules on the character |  |  | Wearer, Owner |
| shownicknames | Action | Gives the list of nicknames and who they are associated with |  |  | Wearer, Owner |
| configreport | Action | Gives information on several configuration options |  |  | Wearer, Owner |

## Rules

Rules that the wearer must follow can be set with those commands. Speech related rules are found in their own section

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| strictness [Low/Normal/Strict] | Setting | Defines how strict the punishment for breaking rules is | |  | Owner |
| punishmentrestraint [1-10] [Item group] | Setting | Defines the currently worn item in that item group to a punishment level. When triggering said punishment, it will apply this item, or if none are present, the next one in descending order | |  | Owner |
| respect | Rule | Forces the curse wearer to show respect, by disallowing speaking the person's name without saying "Miss" or "Mistress" before her name and by enforcing the need to kneel |  |  | Public |
| punish | Action | Punishes the curse wearer, making her cry and adding strikes |  |  | Public |
| reward | Action | For good curse wearers, this removes strikes | |  | Public |
| edge | Action | Edges the target, putting an ahegao face on her. Doesn't interact with the pleasure bar, however |  |  | Public |
| kneel | Action | Puts the target on her knees, whenever possible |  |  | Mistress |
| permakneel | Rule | Keeps the curse wearer on his knees |  |  | Mistress |
| naked | Rule | Removes all clothes on the target |  |  | Mistress |
| clothed | Rule | Removes the rule about being naked | |  | Mistress |
| afk | Rule | Punishes the victim whenever she is set AFK. Requires the option to set the AFK icon to be toggled on |  |  | Owner |
| vibes | Rule | Forces all vibes to the speed set by vibratorintensity (see below), default is maximum | 🌟 |  | Mistress |
| vibratorintensity [off, low, medium, high, max] | Rule | Sets the speed for forced vibrators | |  | Mistress |
| asylum [Hours] | Rule | Adds or removes a number of hours to the time to spend at the asylum | 🌟 |  | Owner |
| sendasylum | Action | Sends the wearer to the asylum | |  | Owner |
| asylumlockdown | Action | Makes it so logging on in the asylum retains the cursed restraints, meaning the character can be locked in that room. | NEW | X | Owner |
| asylumreturntoroom | Action | Sends the wearer to her asylum bedroom (Must be in the asylum area) | NEW | X | Owner |
| triggerword [Sentence] | Setting | Sets a trigger word that allows to block the victim to interact for a given time upon hearing this word. Default: None |  |  | Owner |
| triggerduration [Minutes] | Setting | Defines the duration for which the trigger word works. Default: 5 minutes |  |  | Owner |
| sensdep | Setting | Overrides the sensory deprivation settings in the menu and forces those to maximum effect | 🌟 | X | Owner |
| fullblindfold | Setting | Makes it so all blindfolds have total effect |  |  | Wearer, Owner |
| keeprestraints | Setting | Makes it so the "keep all restraints when relogging" is forced to true | NEW |  | Mistress |
| fullslow | Setting | Makes it so the slow effect is always enabled | NEW |  | Wearer, Owner |
| deafimmune [ID] | Setting | Bypass deafness for the targeted person, allowing to simulate, for instance, communication via earbuds |  |  | Mistress |
| norescue | Setting | Blocks access to the maid service and other methods of getting free | 🌟 | X | Owner |
| leash | Setting | Toggle to allow for leashing. A leashed curse bearer can be called by an owner by beeping her three time, moving her from another room. Note that the leashed character need to be able to join the room | 🌟 | X | Owner |
| preventdc | Setting | When disconnecting, if the room the character was is still existing and can be joined, the character will be pulled back in it immediately, preventing fleeing altogether |  | X | Owner |
| meterlocked | Setting | Sets the arousal meter to automatic, preventing manual control |  | X | Owner |
| meteroff | Setting | Removes the arousal meter entirely |  | X | Owner |
| secretorgasm | Setting | Hides the arousal meter from the cursed person, without deactivating it | | X | Owner |
| forbidorgasm | Rule | Punishes the curse wearer whenever she has an orgasm, when using the arousal meter |  |  | Owner |
| noresist | Rule | Punishes the curse wearer whenever she has an orgasm, when using the arousal meter | NEW |  | Mistress |
| blockorgasm | Setting | Entirely prevents having an orgasm from the arousal meter | 🌟 |  | Owner |
| safeword | Setting | Removes access to the Safeword feature present in rooms |  | X | Owner |
| locknewsub | Setting | Prevents the curse bearer from collaring subs altogether |  | X | Club |
| lockowner | Setting | Removes the ability to remove your collar, be it trial or normal |  | X | Club |
| locknewlover | Setting | Prevents the curse bearer to have new lovers |  | X | Club |

## Cursed items

A subset of rules, those functions are all about cursed gears and clothes

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| curseitem [Group] [Hours] | Rule | Forces the equipped item in this group to not be removable. If the curse bearer tries, it will be counted as a breach of rule and reapply the item after a punishment is delivered. The item stays cursed for the duration, not giving any number means it will always stay on. However, the wearer must always specify a length of time and the maximum duration is 7 days. | 🌟 |  | Wearer, Mistress |
| listpresets | Action | Shows all presets created for the curse |  |  | Wearer, Owner |
| savepreset [Name] | Setting | Saves the current items as a curse preset to quickly set several items at once. See 'curseitems' in the Rules section for cursed items |  |  | Mistress |
| loadpreset [Name] | Rule | Loads all the items from the given curse preset |  |  | Mistress |
| loadpresetcurses [Name] | Rule | Only loads the cursed groups without changing the current items |  |  | Mistress |
| restraintvanish | Setting | Removes cursed restraints when the curse is disabled. Useful for example when the curse is only active when an owner is here. Default: OFF |  |  | Wearer |

## Speech

Anything regarding how your speech is controlled is found there. Some of these options are mutually exclusives, or can cause soft locks if used together. Be thoughful about what you apply on the wearer. Speech rules do not work with OOC and most will not impact emotes or whispers.

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| listsentences | Action | Gives the list of sentences you have at your disposal |  |  | Wearer, Owner |
| talk [Target ID] [Sentence ID] | Action | When your speech is restrained, allows to use one of the preset sentences. For a better explanation, see the "Restricted speech" page |  |  | Wearer |
| speech | Setting | Toggle for activating the word ban. Default: ON |  |  | Mistress |
| banword [word] | Rule | Bans the word in question from being used | 🌟 |  | Mistress |
| clearwords | Setting | Removes all banned words from the list |  |  | Owner |
| banbegging [on/off] | Rule | Shortcut to ban words such as "Please" |  |  | Mistress |
| blockooc | Rule | Stops the use of OOC communication with parenthesis. Doesn't block whispers however |  | X | Owner |
| banfirstperson [on/off] | Rule | Shortcut to ban words such as "I" or "Me" |  |  | Mistress |
| contractions | Rule | Ban the use of contractions, for example, I'll, I won't ... warning, it blocks all words containing ' so you cannot summon Chtulhu under that rule. Works regardless of language spoken |  |  | Mistress |
| dolltalk | Rule | Limits the curse wearer to 5 words per sentence, none able to be more than 6 letters long. Remember this when you give forced sentences to say as you might prevent the person from speaking entirely! Similarly, if you request a given title or nickname, try to make it fit those 6 letters so they can be used (and enforced). The talk function ignores this rule | 🌟 |  | Mistress |
| enforceentrymessage | Rule | Toggle if the cursed person need to speak a sentence upon entering a room |  |  | Owner |
| entrymessage | Setting | Gives the sentence that must be spoken upon entering a room with the rule above. Note that the sentence should respect the rules on speech given to be able to be said, and it could be problematic if there are several owners present |  |  | Owner |
| restrainedspeech | Rule | Defines if restricted speech mode is active. (Similar to nekobots in SL) Default: OFF | ADVANCED | X | Owner |
| self [Name] | Setting | Sentences can have a %self% tag that serves as a placeholder on how you self designate yourself. Default: "I" |  | X | Owner |
| target [Target ID] [Target] | Setting | Defines a new target for the 'talk' command. Target ID is the tag you use and Target, the word used. Having the Target empty allows to delete a given ID |  | X | Owner |
| sentence [Sentence ID] [Sentence] | Setting | Defines a new sentence for the 'talk' command. Sentence ID is the tag you use and Sentence, the sentence used. Having the sentence empty allows to delete a given ID |  | X | Owner |
| forcedsay [Sentence] | Setting | Makes the target speak and say what is told. While you need to be able to speak, it does circumvent rules like dolltalk |  | X | Owner |
| say [Sentence] | Rule | Asks the target to say a specific sentence, filling the text box for her. She is however free to disobey, or try to. This allows to ignore rules like dolltalk for this sentence in particular |  | X | Owner |
| fullmute | Setting | Prevents the curse bearer from sending normal messages altogether. Note that this is not a rule, as there is no punishment for trying to circumvent the rule. Normal messages are completely disabled, so OOC can only be used in whispers or emotes. |  | X | Owner |
| enablesound | Rule | Variation on the sentence above, limits to one sound or its variation, as shown below |  | X | Owner |
| sound [Sound] | Setting | Defines an allowed sound. Allows some punctuation such as .',!?- as variation for the curse bearer. A sound only requires letters to be in the same order, so 'bark' would also allow 'baaaaaark' or 'bark?' but not 'brak'  | 🌟 | X | Owner |
| retype | Setting | The wearer will no longer need to retype the whole message when it contains a transgression |  |  | Owner |

## Practical

Those commands don't fall in others categories

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| readnote | Action | Allows one to read notes attached to the character |  |  | Public |
| note | Action | Attaches a note on the curse wearer, which you can read using readnote |  |  | Owner |
| guestnotes | Setting | Toggle to allow or not everyone to attach a note to the victim |  |  | Owner |
| sendnote | Action | Puts a note on the curse bearer, that can be read by owners |  |  | Public |
| readnotes | Action | Reads all the notes attached so far to the character |  |  | Owner |
| capture | Action | If the target can be captured, captures her. It prevents her to leave a room for 5 minutes, and if you get inside another room, allows you to beep the victim to call her where you are, assuming she can. Not to be confused with the similar command in the Access section of this doc |  | X | Public |
| changestrikes [Number] | Action | Allows more control on adding or removing strikes than 'punish' and 'reward'. Number can be negative |  |  | Mistress |
| clearpunishments | Setting | Clears the current list of punishments displayed when using the transgressions command |  |  | Owner |
| resetorgasmcount | Action | Resets the amount of registered orgasms logged on the curse wearer |  |  | Owner |
| reminders| Setting | Set if reminders are active or not | 🌟 |  | Owner |
| reminderinterval [Seconds] | Setting | Sets the time between two reminders to be displayed |  |  | Owner |
| clearallreminders | Action | Removes all reminders created thus far |  |  | Owner |
| togglereminder [Reminder] | Setting | Sets a reminder to be given at the specified interval above |  |  | Owner |


## Fun functions

While not linked to the effect of the curse directly, those functions are available to those with it active for some fun time with friends

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| draw [Number of cards] [Player] | Action | Draw cards from a 52 cards deck. If the deck is empty, it shuffles automatically. You can specify as many member numbers to draw cards for, it will whisper the cards to each of them. If no member is specified, everyone sees the card(s) drawn |  |  | Wearer |
| shuffle | Action | Shuffle the deck of cards |  |  | Wearer |


## Built-in club rules
**IMPORTANT, THESE NEED TO BE ENABLED BY THE CLUB OWNER, AND ARE NOT DISABLED IF THE CURSE IS TURNED OFF**

This is because it isn't the curse saving this, but the character, being functions present in the base game. These functions are merely shortcuts for the Club owner instead of opening the interaction menu, but also to allow more people to toggle them on.

| Function | Type | Effect | Status | Intense | Access |
| --- | --- | --- | --- | --- | --- |
| forcedlabor | Action | Send the target to work as a maid, to serve drinks in rooms |  |  | Owner |
| remoteself | Setting | Prevents the use of remote on your own vibrators |  |  | Owner |
| remoteblock | Setting | Prevents the use of remote on any vibrators |  |  | Owner |
| unlockself | Setting | Blocks the use of keys on your own bindings |  |  | Owner |
| keyblock | Setting | Removes the use of keys entirely |  |  | Owner |
| blockchange | Setting | Removes access to the wardrobe entirely |  |  | Owner |


# Examples of use

Not all functions are easy to make use correctly, so some example uses are given. Note that you pretty much are required to be two, except for Wearer level functions, so it could be a good idea to go in a private room to experiment, and take notes of what works for you and what doesn't without being spammed with outside messages.

As a reminder, you use a command with #[Name of the person you are whispering to, or your name if a wearer function] [Function name] [Parameters, if any]. In our case, we will assume we are targeting a character named "Target", who is the only one who need the Curse installed. The functions will be applied as they go so to stay coherent if you do these all in order. You can copy these and replace the name to follow this tutorial with a friend / victim to get an idea on how it work.

We assume you are using Intense mode, as the more complex functions tends to require it. You can read these examples even if you do not plan on using intense mode.

#Target wardrobev2

This function should be used by Target. This gives access to an upgraded wardrobe, and is the typical example of a toggle function. Using it again will remove access to it. But really, this alone is a good enough reason to use the curse.


**#Target owner [ID]**

Again, Target is the one using this function and gives almost full access to the other person. You need to give their ID so the final result should be like *#Target owner 12401*


**#Target showowners**

Both can use this function, it will confirm that your new owner has been set correctly. If you made a mistake and the wrong number was added, you can redo the same command you did previously to remove the owner: *#Target owner 12401*


**#Target nickname [NewName]**

The new owner can now define her visible name for Target. Note that this won't change the name to use for commands!


For the next command, put a binding on Target's torso, such as a harness.

**#Target curseitem torso 1**

The harness on Target will be cursed for one hour. Target should try to remove it to understand the effect. If no number is provided, the curse will remain forever until it is lifted. Note that wearers can also use this function, but they must specify a number of hours.

The following examples use the advanced functions related to restrained speech. It's a good example on how to use the feature, but most importantly, it is a good way of understanding curse commands in general.

**#Target restrainedspeech**

The Owner using this on Target will limit her ability to speak. Trying should punish Target


**#Target talk**

Target need to use this. When using this, normally the command will fail. However, take a note of what is displayed. This should help you understand what you are missing


**#Target listsentences**

With Target using this, a list of allowed combinations of sentences will be given. Assuming the default ones, we will put this into practice

**#Target talk miss leave**

Now Target should be saying something akin of "May I be excused, miss?"


With this, we will now clean everything to start from a clean slate

**#Target restrainedspeech** (only if you activated it doing the Intense part)

**#Target curseitem torso** (if the item is still cursed)

**#Target deletenickname [ID]**

Are used by the owner and then

**#Target owner [ID]**

By Target

From this, you are at your starting point and can start using the curse


These examples should be enough to understand the principle.
