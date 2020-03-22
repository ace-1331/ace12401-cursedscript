function MistressCommands(command) { 
    switch (command) { 
        case "cursedearplugs":
                if (parameters[0] == "on") {
                    if (!cursedConfig.hasCursedEarplugs) {
                        cursedConfig.hasCursedEarplugs = true;
                        SendChat("The curse arises on " + Player.Name + "'s earplugs.");
                        procGenericItem("HeavyDutyEarPlugs", "ItemEars");
                        cursedConfig.hasCursedBlindfold = false;
                    }
                } else if (parameters[0] == "off") {
                    if (cursedConfig.hasCursedEarplugs) {
                        cursedConfig.hasCursedEarplugs = false;
                        SendChat("The curse on " + Player.Name + "'s earplugs vanished.");
                    }
                }
                break;
        case "cursedhood":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedHood) {
                    cursedConfig.hasCursedHood = true;
                    SendChat("The curse arises on " + Player.Name + "'s VR Hood.");
                    procGenericItem("LeatherHoodSensDep", "ItemHead");
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedHood) {
                    cursedConfig.hasCursedHood = false;
                    SendChat("The curse on " + Player.Name + "'s VR Hood vanished.");
                }
            }
            break;
        case "cursedblindfold":
                if (parameters[0] == "on") {
                    if (!cursedConfig.hasCursedBlindfold) {
                        cursedConfig.hasCursedBlindfold = true;
                        SendChat("The curse arises on " + Player.Name + "'s blindfold.");
                        procGenericItem("FullBlindfold", "ItemHead");
                        cursedConfig.hasCursedHood = false;
                    }
                } else if (parameters[0] == "off") {
                    if (cursedConfig.hasCursedBlindfold) {
                        cursedConfig.hasCursedBlindfold = false;
                        SendChat("The curse on " + Player.Name + "'s blindfold vanished.");
                    }
                }
                break;
        case "cursedmittens":
                if (parameters[0] == "on") {
                    if (!cursedConfig.hasCursedMittens) {
                        cursedConfig.hasCursedMittens = true;
                        SendChat("The curse arises on " + Player.Name + "'s mittens.");
                        procGenericItem("LeatherMittens", "ItemHands");
                    }
                } else if (parameters[0] == "off") {
                    if (cursedConfig.hasCursedMittens) {
                        cursedConfig.hasCursedMittens = false;
                        SendChat("The curse on " + Player.Name + "'s mittens disappears.");
                    }
                }
                break;
        case "cursedpanties":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedPanties) {
                    cursedConfig.hasCursedPanties = true;
                    SendChat("The curse arises on " + Player.Name + "'s panties.");
                    procGenericItem("PantyStuffing", "ItemMouth");
                    cursedConfig.hasCursedDildogag = false;
                    cursedConfig.hasCursedGag = false;
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedPanties) {
                    cursedConfig.hasCursedPanties = false;
                    SendChat("The curse on " + Player.Name + "'s panties vanished.");
                }
            }
            break;
        case "curseddildogag":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedDildogag) {
                    cursedConfig.hasCursedDildogag = true;
                    SendChat("The curse arises on " + Player.Name + "'s dildo.");
                    procGenericItem("DildoPlugGag", "ItemMouth");
                    cursedConfig.hasCursedGag = false;
                    cursedConfig.hasCursedPanties = false;
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedDildogag) {
                    cursedConfig.hasCursedDildogag = false;
                    SendChat("The curse on " + Player.Name + "'s dildo vanished.");
                }
            }
            break;
        case "cursedgag":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedGag) {
                    cursedConfig.hasCursedGag = true;
                    SendChat("The curse arises on " + Player.Name + "'s gag.");
                    procGenericItem("BallGag", "ItemMouth");
                    cursedConfig.hasCursedDildogag = false;
                    cursedConfig.hasCursedPanties = false;
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedGag) {
                    cursedConfig.hasCursedGag = false;
                    SendChat("The curse on " + Player.Name + "'s gag vanished.");
                }
            }
            break;
        case "public":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasPublicAccess) {
                    cursedConfig.hasPublicAccess = true;
                    SendChat("The curse on " + Player.Name + " now listens to the public.");
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasPublicAccess) {
                    cursedConfig.hasPublicAccess = false;
                    SendChat("The curse on " + Player.Name + " no longer listens to the public.");
                }
            }
            break;
        case "cursedcollar":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedKneel) {
                    cursedConfig.hasCursedKneel = true;
                    SendChat("The curse arises on " + Player.Name + "'s collar.");
                    KneelAttempt();
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedKneel) {
                    cursedConfig.hasCursedKneel = false;
                    SendChat("The curse on " + Player.Name + "'s collar vanished.");
                }
            }
            break;
        case "cursedlatex":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedLatex) {
                    cursedConfig.hasCursedLatex = true;
                    SendChat("The cursed latex embraces " + Player.Name + ".");
                    procCursedLatex();
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedLatex) {
                    cursedConfig.hasCursedLatex = false;
                    SendChat("The cursed latex lets go of " + Player.Name + ".");
                }
            }
            break;
        case "cursedspeech":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedSpeech) {
                    cursedConfig.hasCursedSpeech = true;
                    SendChat("The curse arises on " + Player.Name + "'s mouth.");
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedSpeech) {
                    cursedConfig.hasCursedSpeech = false;
                    SendChat("The curse on " + Player.Name + "'s mouth vanished.");
                }
            }
            break;
        case "cursedorgasms":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedOrgasm) {
                    cursedConfig.hasCursedOrgasm = true;
                    SendChat("The curse arises on " + Player.Name + "'s toys.");
                    procCursedOrgasm();
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedOrgasm) {
                    cursedConfig.hasCursedOrgasm = false;
                    SendChat("The curse on " + Player.Name + "'s toys vanished.");
                }
            }
            break;
        case "cursedclothes":
            if (parameters[0] == "on") {
                if (!cursedConfig.hasCursedNakedness) {
                    cursedConfig.hasCursedNakedness = true;
                    SendChat("The curse arises on " + Player.Name + "'s clothes.");
                    procCursedNaked();
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.hasCursedNakedness) {
                    cursedConfig.hasCursedNakedness = false;
                    SendChat("The curse on " + Player.Name + "'s clothes vanished.");
                }
            }
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
                cursedConfig.bannedWords.push(
                    'i', '"i', 'am', "i-i", "a-am", "myself", "m-myself", "me", "my"
                );
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !['i', '"i', 'am', "i-i", "a-am", "myself", "m-myself", "me", "my"].includes(word)
                );
            }
            break;
        case "banbegging":
            if (parameters[0] == "on") {
                cursedConfig.bannedWords.push(
                    'please', 'p-please', "beg", 'b-beg', 'begging', 'b-begging'
                );
            } else if (parameters[0] == "off") {
                cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
                    !['please', 'p-please', "beg", 'b-beg', 'begging', 'b-begging']
                        .includes(word)
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
            if (parameters[0] == "on") {
                if (!cursedConfig.isMute) {
                    SendChat("The curse on " + Player.Name + " forbids her to speak.");
                    cursedConfig.isMute = true;
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.isMute) {
                    SendChat(
                        "The curse on " + Player.Name
                        + " allows her to use her words again."
                    );
                    cursedConfig.isMute = false;
                }
            }
            break;
        case "deactivateonpresence":
            if (parameters[0] == "on") {
                if (!cursedConfig.disaledOnMistress) {
                    SendChat("The curse on " + Player.Name + " lets her mistress do the work.");
                    cursedConfig.disaledOnMistress = true;
                }
            } else if (parameters[0] == "off") {
                if (cursedConfig.disaledOnMistress) {
                    SendChat(
                        "The curse on " + Player.Name
                        + " regains control."
                    );
                    cursedConfig.disaledOnMistress = false;
                }
            }
            break;
        default:
            cursedConfig.log.push("unknown mistress command:" + command);
            break;
    }
}