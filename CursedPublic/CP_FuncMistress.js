function MistressCommands({ command, sender, parameters }) { 
    switch (command) { 
        case "cursedearplugs":
                if (!cursedConfig.hasCursedEarplugs) {
                    SendChat("The curse arises on " + Player.Name + "'s earplugs.");
                    procGenericItem("HeavyDutyEarPlugs", "ItemEars");
                } else  
                    SendChat("The curse on " + Player.Name + "'s earplugs vanished.");
                cursedConfig.hasCursedEarplugs = !cursedConfig.hasCursedEarplugs;
                break;
        case "cursedhood":
            if (!cursedConfig.hasCursedHood) {
                cursedConfig.hasCursedBlindfold = false;
                SendChat("The curse arises on " + Player.Name + "'s VR Hood.");
                procGenericItem("LeatherHoodSensDep", "ItemHead");
            } else 
                SendChat("The curse on " + Player.Name + "'s VR Hood vanished.");
            cursedConfig.hasCursedHood = !cursedConfig.hasCursedHood;
            break;
        case "cursedblindfold":
            if (!cursedConfig.hasCursedBlindfold) {
                SendChat("The curse arises on " + Player.Name + "'s blindfold.");
                procGenericItem("FullBlindfold", "ItemHead");
                cursedConfig.hasCursedHood = false;
            } else 
                SendChat("The curse on " + Player.Name + "'s blindfold vanished.");
            cursedConfig.hasCursedBlindfold = !cursedConfig.hasCursedBlindfold;
            break;
        case "cursedmittens":
            if (!cursedConfig.hasCursedMittens) {
                SendChat("The curse arises on " + Player.Name + "'s mittens.");
                procGenericItem("LeatherMittens", "ItemHands");
            } else
                SendChat("The curse on " + Player.Name + "'s mittens disappears.");
            cursedConfig.hasCursedMittens = !cursedConfig.hasCursedMittens;
            break;
        case "cursedpanties":
            if (!cursedConfig.hasCursedPanties) {
                SendChat("The curse arises on " + Player.Name + "'s panties.");
                procGenericItem("PantyStuffing", "ItemMouth");
                cursedConfig.hasCursedDildogag = false;
                cursedConfig.hasCursedGag = false;
            } else {
                SendChat("The curse on " + Player.Name + "'s panties vanished.");
            }
            cursedConfig.hasCursedPanties = !cursedConfig.hasCursedPanties;
            break;
        case "curseddildogag":
            if (!cursedConfig.hasCursedDildogag) {
                SendChat("The curse arises on " + Player.Name + "'s dildo.");
                procGenericItem("DildoPlugGag", "ItemMouth");
                cursedConfig.hasCursedGag = false;
                cursedConfig.hasCursedPanties = false;
            } else
                SendChat("The curse on " + Player.Name + "'s dildo vanished.");
            cursedConfig.hasCursedDildogag = !cursedConfig.hasCursedDildogag;
            break;
        case "cursedgag":
            if (!cursedConfig.hasCursedGag) {
                SendChat("The curse arises on " + Player.Name + "'s gag.");
                procGenericItem("BallGag", "ItemMouth");
                cursedConfig.hasCursedDildogag = false;
                cursedConfig.hasCursedPanties = false;
            } else
                SendChat("The curse on " + Player.Name + "'s gag vanished.");
            cursedConfig.hasCursedGag = !cursedConfig.hasCursedGag;
            break;
        case "public":
            if (!cursedConfig.hasPublicAccess)
                SendChat("The curse on " + Player.Name + " now listens to the public.");
            else 
                SendChat("The curse on " + Player.Name + " no longer listens to the public.");
            cursedConfig.hasPublicAccess = !cursedConfig.hasPublicAccess;
            break;
        case "cursedcollar":
            if (!cursedConfig.hasCursedKneel) {
                SendChat("The curse arises on " + Player.Name + "'s collar.");
                KneelAttempt();
            } else 
                SendChat("The curse on " + Player.Name + "'s collar vanished.");
            cursedConfig.hasCursedKneel = !cursedConfig.hasCursedKneel;
            break;
        case "cursedlatex":
            if (!cursedConfig.hasCursedLatex) {
                SendChat("The cursed latex embraces " + Player.Name + ".");
                procCursedLatex();
            } else
                SendChat("The cursed latex lets go of " + Player.Name + ".");
            cursedConfig.hasCursedLatex = !cursedConfig.hasCursedLatex;
            break;
        case "cursedpony":
            if (!cursedConfig.hasCursedPony) {
                SendChat("" + Player.Name + " becomes a Pony.");
                procCursedPony();
            } else
                SendChat("The ponycurse lets go of " + Player.Name + ".");
            cursedConfig.hasCursedPony = !cursedConfig.hasCursedPony;
            break;
        case "cursedscrews":
            if (!cursedConfig.hasCursedScrews) {
                SendChat("The cursed screw clamps tighten around " + Player.Name + "'s nipples.");
                procGenericItem("ScrewClamps", "ItemNipples");
            } else
                SendChat("The cursed  clamps on " + Player.Name + " vanished.");
            cursedConfig.hasCursedLatex = !cursedConfig.hasCursedLatex;
            break;
        case "cursedspeech":
            if (!cursedConfig.hasCursedSpeech)
                SendChat("The curse arises on " + Player.Name + "'s mouth.");
            else
                SendChat("The curse on " + Player.Name + "'s mouth vanished.");
            cursedConfig.hasCursedSpeech = !cursedConfig.hasCursedSpeech;
            break;
        case "cursedorgasms":
            if (!cursedConfig.hasCursedOrgasm) {
                SendChat("The curse arises on " + Player.Name + "'s toys.");
                procCursedOrgasm();
            } else
                SendChat("The curse on " + Player.Name + "'s toys vanished.");
            cursedConfig.hasCursedOrgasm = !cursedConfig.hasCursedOrgasm;
            break;
        case "cursedclothes":
            if (!cursedConfig.hasCursedNakedness) {
                SendChat("The curse arises on " + Player.Name + "'s clothes.");
                procCursedNaked();
            } else
                SendChat("The curse on " + Player.Name + "'s clothes vanished.");
            cursedConfig.hasCursedNakedness = !cursedConfig.hasCursedNakedness;
            break;
        case "enforce":
            if (parameters[0] == "on") {
                if (!cursedConfig.enforced.includes(sender)) {
                    cursedConfig.enforced.push(sender);
                    SendChat(Player.Name + " now has enforced protocols on her mistress.");
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.enforced.includes(sender)) {
                    cursedConfig.enforced.splice(cursedConfig.enforced.indexOf(sender), 1)
                    SendChat(Player.Name + " no longer has enforced protocols on her mistress.");
                }
                // Can enforce someone else with #name enforce 00000 on
            } else if (!isNaN(parameters[0])) { 
                enforce([...parameters], parameters[0], true);
            }
            break;
        case "mistress":
            if (parameters[0] == "on") {
                if (parameters[1] && !cursedConfig.mistresses.includes(parameters[1])) {
                    cursedConfig.mistresses.push(parameters[1]);
                    SendChat(
                        Player.Name + " now has a new mistress (#" + parameters[1] + ")."
                    );
                }
            } else if (parameters[0] == "off") {
                if (parameters[1] && cursedConfig.mistresses.includes(parameters[1])) {
                    cursedConfig.mistresses = cursedConfig.mistresses.filter(
                        mistress => mistress != parameters[1]
                    );
                    popChatSilent("Removed mistress: " + parameters[1]);
                }
                // Can enforce someone else with #name enforce 00000 on
            }
            break;
        case "banfirstperson":
            if (parameters[0] == "on") {
                cursedConfig.bannedWords.push( 'i', '"i', 'am',  "myself", "me", "my" );
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    ![ 'i', '"i', 'am',  "myself", "me", "my"].includes(word)
                );
            }
            break;
        case "banbegging":
            if (parameters[0] == "on") {
                cursedConfig.bannedWords.push('please', "beg",  'begging');
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !['please', "beg",  'begging'].includes(word)
                );
            }
            break;
        case "banword":
            if (parameters[0] == "on") {
                if (parameters[1] && !cursedConfig.bannedWords.includes(parameters[1])) {
                    cursedConfig.bannedWords.push(
                        parameters[1], parameters[1].substring(0, 1) + "-" + parameters[1]
                    );
                }
            } else if (parameters[0] == "off") {
                if (parameters[1] && cursedConfig.bannedWords.includes(parameters[1])) {
                    cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                        word != parameters[1]
                        || word != parameters[1].substring(0, 1) + "-" + parameters[1]
                    );
                }
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
                SendChat("The curse on " + Player.Name + " lets her mistress do the work.");
            else 
                SendChat("The curse on " + Player.Name + " regains control.");
            cursedConfig.disaledOnMistress = !cursedConfig.disaledOnMistress;
            break;
        case "kneel":
            KneelAttempt();
            break;
    }
}