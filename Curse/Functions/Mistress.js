function MistressCommands({ command, sender, parameters, isOwner }) {
    switch (command) {
        case "cursereport":
            let toReport = ["hasPublicAccess", "hasCursedBelt", "hasCursedKneel", "hasCursedLatex", "hasCursedSpeech", "hasCursedOrgasm", "hasCursedNakedness", "isMute", "disaledOnMistress", "enabledOnMistress", "hasCursedBlindfold", "hasCursedHood", "hasCursedEarplugs", "hasCursedDildogag", "hasCursedPanties", "hasCursedGag", "hasCursedMittens", "hasEntryMsg", "hasFullMuteChat", "hasCursedScrews", "hasCursedPony", "hasSound", "hasRestrainedPlay", "hasNoMaid", "punishmentsDisabled", "isLockedOwner"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
            sendWhisper(sender, report, true);
            break;
        case "earplugs":
        case "cursedearplugs":
            if (!cursedConfig.hasCursedEarplugs) {
                SendChat("The curse arises on " + Player.Name + "'s earplugs.");
                procGenericItem("HeavyDutyEarPlugs", "ItemEars");
            } else
                SendChat("The curse on " + Player.Name + "'s earplugs vanished.");
            cursedConfig.hasCursedEarplugs = !cursedConfig.hasCursedEarplugs;
            break;
        case "cursedhood":
        case "hood":
            if (!cursedConfig.hasCursedHood) {
                cursedConfig.hasCursedBlindfold = false;
                SendChat("The curse arises on " + Player.Name + "'s VR Hood.");
                procGenericItem("LeatherHoodSensDep", "ItemHead");
            } else
                SendChat("The curse on " + Player.Name + "'s VR Hood vanished.");
            cursedConfig.hasCursedHood = !cursedConfig.hasCursedHood;
            break;
        case "blindfold":
        case "cursedblindfold":
            if (!cursedConfig.hasCursedBlindfold) {
                SendChat("The curse arises on " + Player.Name + "'s blindfold.");
                procGenericItem("FullBlindfold", "ItemHead");
                cursedConfig.hasCursedHood = false;
            } else
                SendChat("The curse on " + Player.Name + "'s blindfold vanished.");
            cursedConfig.hasCursedBlindfold = !cursedConfig.hasCursedBlindfold;
            break;
        case "mittens":
        case "cursedmittens":
            if (!cursedConfig.hasCursedMittens) {
                SendChat("The curse arises on " + Player.Name + "'s mittens.");
                procGenericItem("PawMittens", "ItemHands");
            } else
                SendChat("The curse on " + Player.Name + "'s mittens disappears.");
            cursedConfig.hasCursedMittens = !cursedConfig.hasCursedMittens;
            break;
        case "panties":
        case "cursedpanties":
            if (!cursedConfig.hasCursedPanties) {
                SendChat("The curse arises on " + Player.Name + "'s panties.");
                procGenericItem("PantyStuffing", "ItemMouth");
                cursedConfig.hasCursedDildogag = false;
                cursedConfig.hasCursedGag = false;
                cursedConfig.hasCursedLatex = false;
                cursedConfig.hasCursedPony = false;
            } else {
                SendChat("The curse on " + Player.Name + "'s panties vanished.");
            }
            cursedConfig.hasCursedPanties = !cursedConfig.hasCursedPanties;
            break;
        case "dildogag":
        case "curseddildogag":
            if (!cursedConfig.hasCursedDildogag) {
                SendChat("The curse arises on " + Player.Name + "'s dildo.");
                cursedConfig.hasCursedGag = false;
                cursedConfig.hasCursedPanties = false;
                cursedConfig.hasCursedLatex = false;
                cursedConfig.hasCursedPony = false;
                procGenericItem("DildoPlugGag", "ItemMouth");
            } else
                SendChat("The curse on " + Player.Name + "'s dildo vanished.");
            cursedConfig.hasCursedDildogag = !cursedConfig.hasCursedDildogag;
            break;
        case "gag":
        case "cursedgag":
            if (!cursedConfig.hasCursedGag) {
                SendChat("The curse arises on " + Player.Name + "'s gag.");
                cursedConfig.hasCursedDildogag = false;
                cursedConfig.hasCursedPanties = false;
                cursedConfig.hasCursedLatex = false;
                cursedConfig.hasCursedPony = false;
                procGenericItem("BallGag", "ItemMouth");
            } else
                SendChat("The curse on " + Player.Name + "'s gag vanished.");
            cursedConfig.hasCursedGag = !cursedConfig.hasCursedGag;
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
        case "latex":
        case "cursedlatex":
            if (!cursedConfig.hasCursedLatex) {
                SendChat("The cursed latex embraces " + Player.Name + ".");
                cursedConfig.hasCursedPony = false;
                cursedConfig.hasCursedNakedness = false;
                cursedConfig.hasCursedGag = false;
                cursedConfig.hasCursedPanties = false;
                cursedConfig.hasCursedDildogag = false;
                procCursedLatex();
            } else
                SendChat("The cursed latex lets go of " + Player.Name + ".");
            cursedConfig.hasCursedLatex = !cursedConfig.hasCursedLatex;
            break;
        case "cursedpony":
        case "pony":
            if (!cursedConfig.hasCursedPony) {
                SendChat("" + Player.Name + " becomes a Pony.");
                cursedConfig.hasCursedLatex = false;
                cursedConfig.hasCursedNakedness = false;
                cursedConfig.hasCursedGag = false;
                cursedConfig.hasCursedPanties = false;
                cursedConfig.hasCursedDildogag = false;
                procCursedPony();
            } else
                SendChat("The ponycurse lets go of " + Player.Name + ".");
            cursedConfig.hasCursedPony = !cursedConfig.hasCursedPony;
            break;
        case "screws":
        case "cursedscrews":
            if (!cursedConfig.hasCursedScrews) {
                SendChat("The cursed screw clamps tighten around " + Player.Name + "'s nipples.");
                procGenericItem("ScrewClamps", "ItemNipples");
            } else
                SendChat("The cursed  clamps on " + Player.Name + " vanished.");
            cursedConfig.hasCursedScrews = !cursedConfig.hasCursedScrews;
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
                SendChat("The curse arises on " + Player.Name + "'s toys.");
                procCursedOrgasm();
            } else
                SendChat("The curse on " + Player.Name + "'s toys vanished.");
            cursedConfig.hasCursedOrgasm = !cursedConfig.hasCursedOrgasm;
            break;
        case "cursedclothes":
        case "naked":
            if (!cursedConfig.hasCursedNakedness) {
                SendChat("The curse arises on " + Player.Name + "'s clothes.");
                cursedConfig.hasCursedLatex = false;
                cursedConfig.hasCursedPony = false;
                procCursedNaked();
            } else
                SendChat("The curse on " + Player.Name + "'s clothes vanished.");
            cursedConfig.hasCursedNakedness = !cursedConfig.hasCursedNakedness;
            break;
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
                        Player.Name + " now has a new mistress (#" + parameters[0] + ")."
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
                cursedConfig.nicknames = cursedConfig.nicknames.filter(u => u.Number != sender);
                cursedConfig.nicknames.push({ Number: sender, Nickname: nickname });
                sendWhisper(sender, "New nickname for " + sender + " : " + nickname, true);
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
                    sendWhisper(sender, `${Player.Name} has had ${Math.abs(strikesToAdd)} strikes ${strikesToAdd > 0 ? "added to" : "subtracted from"} their strike counter.`, true);
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
    }
}
