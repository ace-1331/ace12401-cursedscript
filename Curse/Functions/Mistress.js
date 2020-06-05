/** Function to trigger commands intended for mistresses, returns true if no command was executed */
function MistressCommands({ command, sender, parameters, isOwner, isClubOwner }) {
    switch (command) {
        case "cursereport":
            let toReport = ["hasRestrainedSpeech", "hasPublicAccess", "hasCursedKneel", "hasCursedSpeech", "hasCursedOrgasm", "isMute", "disaledOnMistress", "enabledOnMistress", "hasEntryMsg", "hasFullMuteChat", "hasSound", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasReminders", "canReceiveNotes", "canLeash"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ") + ". Cursed item groups: " + cursedConfig.cursedAppearance.join(",");
            sendWhisper(sender, report, true);
            break;
        case "earplugs":
        case "cursedearplugs":
            toggleCurseItem({ name: "HeavyDutyEarPlugs", group: "ItemEars" });
            break;
        case "cursedhood":
        case "hood":
            toggleCurseItem({ name: "LeatherHoodSensDep", group: "ItemHead" });
            break;
        case "blindfold":
        case "cursedblindfold":
            toggleCurseItem({ name: "FullBlindfold", group: "ItemHead" });
            break;
        case "mittens":
        case "cursedmittens":
            toggleCurseItem({ name: "LeatherMittens", group: "ItemHands" });
            break;
        case "paws":
            toggleCurseItem({ name: "PawMittens", group: "ItemHands" });
            break;
        case "panties":
        case "cursedpanties":
            toggleCurseItem({ name: "PantyStuffing", group: "ItemMouth" });
            break;
        case "dildogag":
        case "curseddildogag":
            toggleCurseItem({ name: "DildoPlugGag", group: "ItemMouth" });
            break;
        case "gag":
        case "cursedgag":
            toggleCurseItem({ name: "BallGag", group: "ItemMouth" });
            break;
        case "doublegag":
        case "curseddoublegag":
            toggleCurseItem({ name: "DildoGag", group: "ItemMouth" });
            break;
        case "public":
            if (!cursedConfig.hasPublicAccess)
                sendWhisper(sender, "-->Public access enabled", true);
            else
                sendWhisper(sender, "-->Public access blocked", true);
            cursedConfig.hasPublicAccess = !cursedConfig.hasPublicAccess;
            break;
        case "collar":
        case "cursedcollar":
            if (!cursedConfig.hasCursedKneel) {
                SendChat("The curse arises on " + Player.Name + "'s collar.");
                KneelAttempt();
            } else
                SendChat("The curse on " + Player.Name + "'s collar vanished.");
            cursedConfig.hasCursedKneel = !cursedConfig.hasCursedKneel;
            break;
        case "screws":
        case "cursedscrews":
            toggleCurseItem({ name: "ScrewClamps", group: "ItemNipplesPiercings" });
            break;
        case "cursedspeech":
        case "speech":
            if (!cursedConfig.hasCursedSpeech)
                SendChat("The curse arises on " + Player.Name + "'s mouth.");
            else
                SendChat("The curse on " + Player.Name + "'s mouth vanished.");
            cursedConfig.hasCursedSpeech = !cursedConfig.hasCursedSpeech;
            break;
        case "cursedorgasms":
        case "vibes":
            if (!cursedConfig.hasCursedOrgasm) {
                SendChat("The curse arises on " + Player.Name + "'s vibrating toys.");
                vibratorGroups.forEach(G =>  procCursedOrgasm(G));
            } else {
                SendChat("The curse on " + Player.Name + "'s vibrating toys vanished.");
            }
            cursedConfig.hasCursedOrgasm = !cursedConfig.hasCursedOrgasm;
            break;
        case "cursedclothes":
        case "naked":
            procCursedNaked();
        case "enforce":
            if (!isNaN(parameters[0]) && parameters[0] != "") {
                enforce(parameters[0], true);
            } else if (!cursedConfig.enforced.includes(sender)) {
                cursedConfig.enforced.push(sender);
                SendChat(Player.Name + " now has enforced protocols on her mistress.");
            } else {
                cursedConfig.enforced.splice(cursedConfig.enforced.indexOf(sender), 1)
                SendChat(Player.Name + " no longer has enforced protocols on her mistress.");
                // Can enforce someone else with #name enforce 00000 on
            }
            break;
        case "mistress":
            if (parameters[0] && !isNaN(parameters[0])) {
                if (!cursedConfig.mistresses.includes(parameters[0])) {
                    cursedConfig.mistresses.push(parameters[0]);
                    SendChat(
                        Player.Name + " now has a new mistress (" + FetchName(parameters[0]) + ")."
                    );
                } else {
                    cursedConfig.mistresses = cursedConfig.mistresses.filter(
                        mistress => mistress != parameters[0]
                    );
                    sendWhisper(sender, "Removed mistress: " + parameters[0], true);
                }
            } else {
                sendWhisper(sender, "(Invalid arguments.)");
            }
            break;
        case "rename":
            let nickname = parameters.join(" ");
            if (nickname) {
                sendWhisper(sender, "New nickname for " + FetchName(sender) + " : " + nickname, true);
                cursedConfig.nicknames = cursedConfig.nicknames.filter(u => u.Number != sender);
                cursedConfig.nicknames.push({ Number: sender, Nickname: nickname });
            } else {
                sendWhisper(sender, "(Invalid arguments.)");
            }
            break;
        case "banfirstperson":
            if (parameters[0] == "on") {
                cursedConfig.bannedWords.push('i', 'am', "myself", "me", "my", "mine");
                sendWhisper(sender, "-->First person blocked", true);
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !['i', '"i', 'am', "myself", "me", "my", "mine"].includes(word)
                );
                sendWhisper(sender, "-->First person allowed", true);
            } else {
                sendWhisper(sender, "(Invalid arguments. Make sure you provided on or off.)");
            }
            break;
        case "banbegging":
            if (parameters[0] == "on") {
                cursedConfig.bannedWords.push('please', "beg", 'begging');
                sendWhisper(sender, "-->Begging blocked", true);
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !['please', "beg", 'begging'].includes(word)
                );
                sendWhisper(sender, "-->Begging enabled", true);
            } else {
                sendWhisper(sender, "(Invalid arguments. Make sure you provided on or off.)");
            }
            break;
        case "banword":
            if (parameters[0]) {
                if (!cursedConfig.bannedWords.includes(parameters[0])) {
                    cursedConfig.bannedWords.push(parameters[0]);
                    sendWhisper(sender, "New banned word: " + parameters[0], true);
                } else {
                    cursedConfig.bannedWords.splice(cursedConfig.bannedWords.indexOf(parameters[0]), 1)
                    sendWhisper(sender, "Word allowed: " + parameters[0], true);
                }
            } else {
                sendWhisper(sender, "(Invalid arguments.)");
            }
            break;
        case "mute":
            if (!cursedConfig.isMute)
                SendChat("The curse on " + Player.Name + " forbids her to speak.");
            else
                SendChat("The curse on " + Player.Name + " allows her to use her words again.");
            cursedConfig.isMute = !cursedConfig.isMute;
            break;
        case "dolltalk":
            if (!cursedConfig.hasDollTalk) {
                SendChat("The curse on " + Player.Name + " stops her from speaking in details.");
            } else
                SendChat("The curse on " + Player.Name + " allows her to speak normally again.");
            cursedConfig.hasDollTalk = !cursedConfig.hasDollTalk;
            break;
        case "deactivateonpresence":
            if (!cursedConfig.disaledOnMistress)
                sendWhisper(sender, "-->Curse is deactivated while a mistress is present", true);
            else
                sendWhisper(sender, "-->Curse activated while a mistress is present", true);
            cursedConfig.disaledOnMistress = !cursedConfig.disaledOnMistress;
            break;
        case "kneel":
            KneelAttempt();
            break;
        case "showstrikes":
            sendWhisper(sender, Player.Name + " has accumulated a total of " + cursedConfig.strikes + " strikes.");
            break;
        case "changestrikes":
            if (!isNaN(parameters[0]) && parameters[0] != "") {
                var strikesToAdd = parseInt(parameters[0]);
                if (strikesToAdd != 0) {
                    cursedConfig.strikes += strikesToAdd;
                    sendWhisper(sender, `${Player.Name} has had ${Math.abs(strikesToAdd)} strikes ${strikesToAdd > 0 ? "added to" : "subtracted from"} her strike counter.`, true);
                    if (cursedConfig.strikes < 0) {
                        cursedConfig.strikes = 0;
                    }
                }
            } else {
                sendWhisper(sender, "(Invalid arguments.)");
            }
            break;
        case "mnickname":
            SetNickname(parameters, sender, 2);
            break;
        case "savecolors":
            SaveColors();
            break;
        case "deletenickname":
            //Force delete self
            DeleteNickname(parameters, sender, isOwner ? 3 : 2);
            break;
        case "contractions":
            if (!cursedConfig.hasNoContractions) {
                sendWhisper(sender, "-->Can no longer use contractions.", true);
                cursedConfig.bannedWords.push("im", "youre", "youll", "cant", "wont", "havent", "arent", "shouldnt", "wouldnt");
            } else {
                sendWhisper(sender, "-->Can now use contractions.", true);
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !["im", "youre", "youll", "cant", "wont", "havent", "arent", "shouldnt", "wouldnt"].includes(word)
                );
            }
            cursedConfig.hasNoContractions = !cursedConfig.hasNoContractions;
            break;
        case "curseitem":
        case "curseditem":
            if (parameters[0]) {
                var group = textToGroup(parameters[0], isClubOwner ? 3 : isOwner ? 2 : 1);
                var currentAsset = InventoryGet(Player, group);
                if (
                    toggleCurseItem({
                        name: (currentAsset && currentAsset.Asset.Name) || "",
                        group: group
                    })
                ) {
                    sendWhisper(sender, "-->Invalid item group. Check the wiki for the list of available groups.", true);
                }
            } else {
                sendWhisper(sender, "(Invalid arguments. Specify the item group.)");
            }
            break;
        default:
            // No command found
            return true;

    }
}