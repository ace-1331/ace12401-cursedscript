//************************************ MESSAGE CHECKER ************************************//
function AnalyzeMessage(msg) {
    // Parse needed data
    var originalContent = msg.textContent.split("(")[0].trim();
    var textmsg = originalContent.toLowerCase();
    var types = msg.classList;
    var sender = msg.getAttribute("data-sender");
    var chatroomMembers = ChatRoomCharacter.map(el => el.MemberNumber.toString());
    var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    var isMistress = cursedConfig.mistresses.includes(sender);
    var isOwner = cursedConfig.owners.includes(sender);
    var isOnEntry = types.contains("ChatMessageEnterLeave") && sender == Player.MemberNumber;
    var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) ||  !cursedConfig.enabledOnMistress )
    
    // Clears whisper text
    if (sender == Player.MemberNumber && (types.contains("ChatMessageWhisper") || types.contains("ChatMessageChat"))) { 
        textmsg = textmsg.split(":")
        textmsg.shift();
        textmsg = textmsg.join(":");
    }
    
    // Clears stuttering
    textmsg = textmsg.replace(/[A-Za-z]-/g, "");
    
    // Checks if player should be kneeling
    if (
        types.contains("ChatMessageEnterLeave") && isOnEntry
        && sender != Player.MemberNumber && Player.CanKneel() && isActivated
    ) { 
        if (
            [...cursedConfig.enforced, ...cursedConfig.mistresses, ...cursedConfig.owners]
                .includes(sender)
        ) { 
            checkKneeling(sender);
        }
    }
    
    // Sends intro if the wearer has one
    if (isOnEntry && cursedConfig.hasEntryMsg && !cursedConfig.hasFullMuteChat && !cursedConfig.isMute && isActivated) { 
        cursedConfig.say = cursedConfig.entryMsg;
        document.getElementById("InputChat").value = cursedConfig.entryMsg;
    }
    
    // Sends activated messages to an owner who enters or if the wearer entered
    if (types.contains("ChatMessageEnterLeave")) { 
        if (cursedConfig.owners.includes(sender) && chatroomMembers.includes(sender)) { 
            sendWhisper(sender, "(The curse is active on me... and you are amongst my owners... use it wisely.)");
        }
        if (sender == Player.MemberNumber) { 
            chatroomMembers.forEach(el => { 
                if (cursedConfig.owners.includes(el)) { 
                    sendWhisper(el, "(The curse is active on me... and you are amongst my owners... use it wisely.)");
                } 
            })
        }
    }
    
    // Checks for commands to change settings if able to, self is not able to do it
    if (
        (types.contains("ChatMessageChat") || types.contains("ChatMessageWhisper"))
        && textmsg.toLowerCase().indexOf(commandCall.toLowerCase()) != -1
        && cursedConfig.blacklist.indexOf(sender) == -1
    ) {
        // Parses the command
        var command;
        var parameters;
        try {
            var commandString = textmsg.split(commandCall)[1];
            command = commandString.split(" ")[0];
            parameters = commandString.split(" ");
            parameters.shift();//THROWS HERE IF COMMAND IS BAD
            //Defaults to on
            if (parameters.length == 0)
                parameters.push("on");
            console.log(command, parameters)
            //Wearer only command
            if (sender == Player.MemberNumber) {
                switch (command) {
                    case "issilent":
                        if (parameters[0] == "on") {
                            if (!cursedConfig.isSilent) {
                                cursedConfig.isSilent = true;
                                popChatSilent("Your curse will no longer display public messages");
                            }
                        } else if (parameters[0] == "off") {
                            if (cursedConfig.isSilent) {
                                cursedConfig.isSilent = false;
                                popChatSilent("Your curse will resume displaying messages publicly");
                            }
                        }
                        break;
                    case "showstrikes":
                        popChatSilent("You have " + cursedConfig.strikes + " strikes.");
                        break;
                    case "help":
                        popChatSilent(helpTxt);
                        break;
                    case "showblacklist":
                        popChatSilent("Your blacklist: #" + cursedConfig.blacklist.join(" #"));
                        break;
                    case "showenforced":
                        popChatSilent("Your enforced list: #" + cursedConfig.enforced.join(" #"));
                        break;
                    case "showmistresses":
                        popChatSilent("Your mistresses: #" + cursedConfig.mistresses.join(" #"));
                        break;
                    case "showowners":
                        popChatSilent("Your owners: #" + cursedConfig.owners.join(" #"));
                        break;
                    case "owner":
                        if (parameters[0] == "on") {
                            if (parameters[1] && !cursedConfig.owners.includes(parameters[1])) {
                                cursedConfig.owners.push(parameters[1]);
                                SendChat(
                                    Player.Name + " now has a new owner (#" + parameters[1] + ")."
                                );
                            }
                        } else if (parameters[0] == "off") {
                            //Cannot remove real owner
                            var realOwner = Player.Ownership ? Player.Ownership.MemberNumber : '';
                            if (
                                parameters[1] && cursedConfig.owners.includes(parameters[1])
                                && realOwner != parameters[1]
                            ) {
                                cursedConfig.owners = cursedConfig.owners.filter(
                                    owner => owner != parameters[1]
                                );
                                popChatSilent("Removed owner: " + parameters[1]);
                            }
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
                        }
                        break;
                    case "blacklist":
                        if (parameters[0] == "on") {
                            if (parameters[1] && !cursedConfig.blacklist.includes(parameters[1])) {
                                cursedConfig.blacklist.push(parameters[1]);
                                popChatSilent("Added to blacklist: " + parameters[1]);
                            }
                        } else if (parameters[0] == "off") {
                            if (parameters[1] && cursedConfig.blacklist.includes(parameters[1])) {
                                cursedConfig.blacklist = cursedConfig.blacklist.filter(
                                    blacklist => blacklist != parameters[1]
                                );
                                popChatSilent("Removed from blacklist: " + parameters[1]);
                            }
                        }
                        break;
                    case "changeidentifier":
                            cursedConfig.slaveIdentifier = parameters[0].join(" ");
                            popChatSilent("Your wearer identifier was changed to: " + cursedConfig.slaveIdentifier);
                        break;
                    case "changecommandchar":
                        if (["!", "@", "#", "$"].includes(parameters[0])) { 
                            cursedConfig.commandChar = parameters[0];
                            popChatSilent("Your command character was changed to: " + parameters[0]);
                        }
                        else
                            popChatSilent("Invalid command character: " + parameters.join(" "));
                        break;
                    default:
                        cursedConfig.log.push("unknown wearer command:" + command);
                        break;
                }
                //Quit loop to prevent wearer from doing the rest (can't add self as owner)
                return;
            }
            
            // Verifies owner for private commands
            // Checks if public has access or mistress can do all
            if (isOwner) {
                switch (command) {
                    case "fullblockchat":
                            if (parameters[0] == "on") {
                                if (!cursedConfig.hasFullMuteChat) {
                                    cursedConfig.hasFullMuteChat = true;
                                    SendChat("The curse fully stops " + Player.Name + " from talking.");
                                    procGenericItem("PolishedChastityBelt", "ItemPelvis");
                                }
                            } else if (parameters[0] == "off") {
                                if (cursedConfig.hasFullMuteChat) {
                                    cursedConfig.hasFullMuteChat = false;
                                    SendChat("The curse lets " + Player.Name + " talk again.");
                                }
                            }
                    case "asylum":
                        if (!isNaN(parameters[0])) { 
                            //Calculate time
                            var timeToAdd = 6000000 * parameters[0];
                            SendChat(Player.Name + " has more time to spend in the asylum.");
                            oldLog = Log.filter(el => el.Name == "Committed");
                            //Send or Add to existing time
                            if (oldLog.length == 0 || oldLog[0].Value < CurrentTime) {
                                LogAdd("Committed", "Asylum", CurrentTime + timeToAdd);
                                //Send to asylum and remove items that would be a progression blocker
                                InventoryRemove(Player, "ItemFeet");
                                InventoryRemove(Player, "ItemBoots");
                                ElementRemove("InputChat");
                                ElementRemove("TextAreaChatLog");
                                ServerSend("ChatRoomLeave", "");
                                CommonSetScreen("Room", "AsylumEntrance");
                            } else { 
                                LogAdd("Committed", "Asylum", oldLog[0].Value + timeToAdd);
                            }
                        }
                        break;
                    case "entrymessage":
                        cursedConfig.entryMsg = parameters.join(" ");
                        break;
                    case "clearbannedwords":
                        cursedConfig.bannedWords = [];
                        break;
                    // case "forcedsay":
                    //     //Forces as a global msg, bypass expected "say" and bypass blockchat
                    //     var oldTarget = ChatRoomTargetMemberNumber;
                    //     var oldMuteConfig = cursedConfig.hasFullMuteChat;
                    //     cursedConfig.hasFullMuteChat = false;
                    //     ChatRoomTargetMemberNumber = null;
                        
                    //     popChatGlobal(parameters.join(" ").replace(/^\/*/g, ""), true);
                        
                    //     ChatRoomTargetMemberNumber = oldTarget;
                    //     cursedConfig.hasFullMuteChat = oldMuteConfig;
                    //     break;
                    // case "say":
                    //     if (!cursedConfig.hasFullMuteChat && !cursedConfig.isMute) { 
                    //         cursedConfig.say = parameters.join(" ")
                    //             .replace(/^\**/g, "").replace(/^\/*/g, "");//stops emotes & stops commands
                    //         document.getElementById("InputChat").value = cursedConfig.say;
                    //     }
                    //     break;
                    case "cursedbelt":
                        if (parameters[0] == "on") {
                            if (!cursedConfig.hasCursedBelt) {
                                cursedConfig.hasCursedBelt = true;
                                SendChat("The curse arises on " + Player.Name + "'s belt.");
                                procGenericItem("PolishedChastityBelt", "ItemPelvis");
                            }
                        } else if (parameters[0] == "off") {
                            if (cursedConfig.hasCursedBelt) {
                                cursedConfig.hasCursedBelt = false;
                                SendChat("The curse on " + Player.Name + "'s belt vanished.");
                            }
                        }
                        break;
                    case "onlyonpresence":
                        if (parameters[0] == "on") {
                            if (!cursedConfig.enabledOnMistress) {
                                cursedConfig.enabledOnMistress = true;
                                SendChat("The curse on" + Player.Name + " only listens while her owner is here.");
                            }
                        } else if (parameters[0] == "off") {
                            if (cursedConfig.enabledOnMistress) {
                                cursedConfig.enabledOnMistress = false;
                                SendChat("The curse on " + Player.Name + " goes back to always listening.");
                            }
                        }
                        break;
                    case "enforceentrymessage":
                        if (parameters[0] == "on") {
                            if (!cursedConfig.hasEntryMsg) {
                                cursedConfig.hasEntryMsg = true;
                                SendChat("The curse forces " + Player.Name + " to announce herself properly.");
                            }
                        } else if (parameters[0] == "off") {
                            if (cursedConfig.hasEntryMsg) {
                                cursedConfig.hasEntryMsg = false;
                                SendChat("The curse no longer forces " + Player.Name + " to announce herself.");
                            }
                        }
                        break;
                    case "owner":
                        if (parameters[0] == "on") {
                            if (parameters[1] && !cursedConfig.owners.includes(parameters[1])) {
                                cursedConfig.owners.push(parameters[1]);
                                SendChat(
                                    Player.Name + " now has a new owner (#" + parameters[1] + ")."
                                );
                            }
                        } else if (parameters[0] == "off") {
                            //Cannot remove real owner
                            var realOwner = Player.Ownership ? Player.Ownership.MemberNumber : '';
                            if (
                                parameters[1] && cursedConfig.owners.includes(parameters[1])
                                && realOwner != parameters[1]
                            ) {
                                cursedConfig.owners = cursedConfig.owners.filter(
                                    owner => owner != parameters[1]
                                );
                                popChatSilent("Removed owner: " + parameters[1]);
                            }
                        }
                        break;
                    default:
                            cursedConfig.log.push("unknown owner command:" + command);
                        break;
                }
            }
            
            //Verify mistress for private commands
            if (isMistress || isOwner) {
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
            
            // Checks if public has access or mistress can do all
            if (cursedConfig.hasPublicAccess || isMistress || isOwner) {
                switch (command) {
                    case "help":
                        sendWhisper(sender, `(To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. Commands are called with ${commandCall}, like "${commandCall} enforce on")`);
                        break;
                    case "asylumtimeleft":
                        var oldLog = Log.filter(el => el.Name == "Committed");
                        var timeLeft = oldLog.length > 0 ? oldLog[0].Value - CurrentTime : 0;
                        timeLeft /= 6000000;
                        SendChat(Player.Name + " has " +
                            (timeLeft < 0 ? "0" : Math.round(timeLeft * 100) / 100) +
                            " hours left in the asylum");
                        break;
                    case "punish":
                        SendChat("The curse on " + Player.Name + " listens, growing angry has someone requests a punishment for the bad slave. " + Player.Name + " is  engulfed in pain as she gets spanked roughly multiple times.");
                        triggerInPain();
                        KneelAttempt();
                        cursedConfig.strikes+=2;
                        break;
                    case "edge":
                        SendChat("The curse on " + Player.Name + " listens, growing hungry for more moans. " + Player.Name + " gets drowned in lust as she is brought to her edge... left there for a while, unable to climax.");
                        triggerInPleasure();
                        KneelAttempt();
                        break;
                    case "enforce":
                        if (parameters.length == 1)
                            enforce(parameters, sender, false);
                        break;
                    default:
                            cursedConfig.log.push("unknown public command:" + command);
                        break;
                }
            }
        
        } catch (err) { console.log(err) }
        
    } else if ( isActivated ) {
        //Checks if settings are respected otherwise
        //Cursed collar
        if (
            cursedConfig.hasCursedKneel
            && Player.CanKneel()
            && !Player.Pose.includes("Kneel")
        ) {
            SendChat("The cursed collar on " + Player.Name + "'s neck gives her an extreme shock, forcing her to get on her knees.");
            triggerInPain();
            KneelAttempt();
            cursedConfig.strikes++;
        }
        
        //Cursed Items
        if (
            cursedConfig.hasCursedBelt
            && !(InventoryGet(Player, "ItemPelvis")
            && InventoryGet(Player, "ItemPelvis").Asset
            && InventoryGet(Player, "ItemPelvis").Asset.Name == "PolishedChastityBelt")
            && itemIsAllowed("PolishedChastityBelt", "ItemPelvis")
        ) { 
            SendChat("The cursed chastity belt on " + Player.Name + " reappears.");
            procGenericItem("PolishedChastityBelt", "ItemPelvis");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedGag
            && !(InventoryGet(Player, "ItemMouth")
            && InventoryGet(Player, "ItemMouth").Asset
            && InventoryGet(Player, "ItemMouth").Asset.Name == "BallGag")
            && itemIsAllowed("BallGag", "ItemMouth")
        ) { 
            SendChat("The cursed gag on " + Player.Name + " reappears.");
            procGenericItem("BallGag", "ItemMouth");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedMittens
            && !(InventoryGet(Player, "ItemHands")
            && InventoryGet(Player, "ItemHands").Asset
            && InventoryGet(Player, "ItemHands").Asset.Name == "LeatherMittens")
            && itemIsAllowed("LeatherMittens", "ItemHands")
        ) { 
            SendChat("The cursed mittens on " + Player.Name + " reappears.");
            procGenericItem("LeatherMittens", "ItemHands");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedBlindfold
            && !(InventoryGet(Player, "ItemHead")
            && InventoryGet(Player, "ItemHead").Asset
            && InventoryGet(Player, "ItemHead").Asset.Name == "FullBlindfold")
            && itemIsAllowed("FullBlindfold", "ItemHead")
        ) { 
            SendChat("The cursed blindfold on " + Player.Name + " reappears.");
            procGenericItem("FullBlindfold", "ItemHead");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedHood
            && !(InventoryGet(Player, "ItemHead")
            && InventoryGet(Player, "ItemHead").Asset
            && InventoryGet(Player, "ItemHead").Asset.Name == "LeatherHoodSensDep")
            && itemIsAllowed("LeatherHoodSensDep", "ItemHead")
        ) { 
            SendChat("The cursed VR Hood on " + Player.Name + " reappears.");
            procGenericItem("LeatherHoodSensDep", "ItemHead");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedEarplugs
            && !(InventoryGet(Player, "ItemEars")
            && InventoryGet(Player, "ItemEars").Asset
            && InventoryGet(Player, "ItemEars").Asset.Name == "HeavyDutyEarPlugs")
            && itemIsAllowed("HeavyDutyEarPlugs", "ItemEars")
        ) { 
            SendChat("The cursed earplugs on " + Player.Name + " reappears.");
            procGenericItem("HeavyDutyEarPlugs", "ItemEars");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedDildogag
            && !(InventoryGet(Player, "ItemMouth")
            && InventoryGet(Player, "ItemMouth").Asset
            && InventoryGet(Player, "ItemMouth").Asset.Name == "DildoPlugGag")
            && itemIsAllowed("DildoPlugGag", "ItemMouth")
        ) { 
            SendChat("The cursed dildo finds its way back into " + Player.Name + "'s mouth.");
            procGenericItem("DildoPlugGag", "ItemMouth");
            cursedConfig.strikes+=5;
        }
        
        if (
            cursedConfig.hasCursedPanties
            && !(InventoryGet(Player, "ItemMouth")
            && InventoryGet(Player, "ItemMouth").Asset
            && InventoryGet(Player, "ItemMouth").Asset.Name == "PantyStuffing")
            && itemIsAllowed("PantyStuffing", "ItemMouth")
        ) { 
            SendChat("The cursed panties find their way back into " + Player.Name + "'s mouth .");
            procGenericItem("PantyStuffing", "ItemMouth");
            cursedConfig.strikes+=5;
        }
        
        //Cursed nakedness
        if (
            cursedConfig.hasCursedNakedness
            && (InventoryGet(Player, "Cloth")
            || InventoryGet(Player, "ClothLower")
            || InventoryGet(Player, "ClothAccessory")
            || InventoryGet(Player, "Suit")
            || InventoryGet(Player, "SuitLower")
            || InventoryGet(Player, "Bra")
            || InventoryGet(Player, "Panties")
            || InventoryGet(Player, "Socks")
            || InventoryGet(Player, "Shoes")
            || InventoryGet(Player, "Hat")
            || InventoryGet(Player, "Gloves")
        )) { 
            SendChat("The curse on " + Player.Name + " makes her clothes vanish mysteriously.");
            procCursedNaked();
            cursedConfig.strikes++;
        }
        
        //Cursed Speech
        if (
            cursedConfig.hasCursedSpeech
            && sender == Player.MemberNumber
            && textmsg.indexOf("silent: *") == -1
            && cursedConfig.bannedWords
                .filter(word =>
                    textmsg.toLowerCase().split(" ").includes(word.toLowerCase())
                ).length != 0
        ) { 
            SendChat(Player.Name + " angers the curse on her.");
            popChatSilent("Bad girl. You used a banned word.");
            cursedConfig.strikes+=5;
        }
        
        //Cursed Orgasms
        if (
            cursedConfig.hasCursedOrgasm
            && ( !InventoryGet(Player, "ItemButt")
            || !InventoryGet(Player, "ItemVulva")
            || !InventoryGet(Player, "ItemNipples")
            || !InventoryGet(Player, "ItemVulvaPiercings")
            || !InventoryGet(Player, "ItemNipplesPiercings")
            || (
                InventoryGet(Player, "ItemButt").Asset.Name == "InflVibeButtPlug"
                && ( InventoryGet(Player, "ItemButt").Property.Intensity != 4
                || InventoryGet(Player, "ItemButt").Property.InflateLevel != 4 )
            ) || (
                InventoryGet(Player, "ItemVulva").Asset.Name == "InflatableVibeDildo"
                && ( InventoryGet(Player, "ItemVulva").Property.Intensity != 4
                || InventoryGet(Player, "ItemVulva").Property.InflateLevel != 4)
            ) || (
                InventoryGet(Player, "ItemNipples").Asset.Name == "TapedVibeEggs"
                && InventoryGet(Player, "ItemNipples").Property.Intensity != 4
            ) || (
                InventoryGet(Player, "ItemVulvaPiercings").Asset.Name == "VibeHeartClitPiercing"
                && InventoryGet(Player, "ItemVulvaPiercings").Property.Intensity != 4
            ) || (
                InventoryGet(Player, "ItemNipplesPiercings").Asset.Name == "VibeHeartPiercing"
                && InventoryGet(Player, "ItemNipplesPiercings").Property.Intensity != 4
            )
        )) { 
            if (
                itemIsAllowed("VibeHeartPiercing", "ItemNipplesPiercings") &&
                itemIsAllowed("VibeHeartClitPiercing", "ItemVulvaPiercings") &&
                itemIsAllowed("TapedVibeEggs", "ItemNipples") &&
                itemIsAllowed("InflatableVibeDildo", "ItemVulva") &&
                itemIsAllowed("InflVibeButtPlug", "ItemButt")
                ) { 
                    SendChat("The curse on " + Player.Name + " brings the vibrators back to their maximum intensity.");
                    procCursedOrgasm();
                    cursedConfig.strikes++;
                }
        }
        
        //Cursed latex
        if (
            cursedConfig.hasCursedLatex
            && ( !InventoryGet(Player, "Gloves")
            || !InventoryGet(Player, "Suit")
            || !InventoryGet(Player, "SuitLower")
            || InventoryGet(Player, "Gloves").Asset.Name != "Catsuit"
            || InventoryGet(Player, "Suit").Asset.Name != "Catsuit"
            || InventoryGet(Player, "SuitLower").Asset.Name != "Catsuit"
        )) { 
            SendChat("The cursed latex embraces " + Player.Name + ".");
            procCursedLatex();
            cursedConfig.strikes+=2;
        }
        
        //Stuff that only applies to self
        if (sender == Player.MemberNumber) {
            //Reinforcement
            cursedConfig.enforced.forEach(memberNumber => {
                if (ChatRoomCharacter.map(el => el.MemberNumber.toString()).includes(memberNumber) && textmsg.indexOf("silent: *") == -1) {
                    var Name = ChatRoomCharacter
                        .map(el => { return { MemberNumber: el.MemberNumber, Name: el.Name } })
                        .filter(el => el.MemberNumber == memberNumber)[0].Name;
                    var requiredName = ['miss', 'mistress', 'goddess', 'owner']
                        .map(el => el + " " + Name.toLowerCase());
                
                    var matches = [[...textmsg
                        .matchAll(new RegExp("\\b(" + Name.toLowerCase() + ")\\b", 'g'))
                    ]];
                    if (!matches) matches = [];
                    var goodMatches = [];
                    requiredName.forEach(rn =>
                        goodMatches.push([...textmsg.matchAll(new RegExp(rn, 'g'))])
                    )
                
                    if (matches[0].length > goodMatches.filter(el => el.length > 0).length) {
                        SendChat(Player.Name + " angers the curse on her with her lack of respect.");
                        popChatSilent("Respecting " + memberNumber + " is required.");
                        cursedConfig.strikes += 7;
                    }
                }
            });
            
            //Mute
            if (cursedConfig.isMute && textmsg.length != 0 && types.contains("ChatMessageChat")) { 
                SendChat(Player.Name + " angers the curse by speaking when she is not allowed to.");
                cursedConfig.strikes += 5;
            }
            
            //Should say
            if (cursedConfig.say != "" && types.contains("ChatMessageChat") && !cursedConfig.hasFullMuteChat) { 
                if (
                    textmsg.trim() != cursedConfig.say.toLowerCase().trim()
                    && Player.Effect.filter(ef => ef.indexOf("Gag") != -1).length == 0
                ) {
                    console.log(textmsg, cursedConfig.say.toLowerCase().trim());
                    popChatSilent("You were punished for not saying the expected sentence willingly: " + cursedConfig.say);
                    document.getElementById("InputChat").value = cursedConfig.say;
                    cursedConfig.strikes += 2;
                } else { 
                    cursedConfig.say = "";
                }
            }
        }
        
    }
}
