function OwnerCommands(
    command, sender, commandCall, originalContent, textmsg, types, sender, chatroomMembers, commandCall, isMistress, isOwner, isOnEntry, isActivated, parameters
) { 
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