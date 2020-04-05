function OwnerCommands({ command, parameters }) {
    switch (command) {
        case "lockappearance":
            if (cursedConfig.cursedAppearance.length == 0) {
                SendChat("The curse locks " + Player.Name + "'s current appearance");
                Player.Appearance.forEach(item => {
                    if (parameters.includes("all") || item.Asset.Group.Name.indexOf("Item") != -1)
                        cursedConfig.cursedAppearance.push({ name: item.Asset.Name, group: item.Asset.Group.Name, color: item.Color });
                });
            } else {
                cursedConfig.cursedAppearance = [];
                SendChat("The curse lets " + Player.Name + " dress as she sees fit.");
            }
            cursedConfig.hasFullMuteChat = !cursedConfig.hasFullMuteChat;
            break;
        case "fullblockchat":
            if (!cursedConfig.hasFullMuteChat)
                SendChat("The curse fully stops " + Player.Name + " from talking.");
            else
                SendChat("The curse lets " + Player.Name + " talk again.");
            cursedConfig.hasFullMuteChat = !cursedConfig.hasFullMuteChat;
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
        case "forcedsay":
            if (cursedConfig.hasIntenseVersion) {
                //Forces as a global msg, bypass expected "say" and bypass blockchat
                var oldTarget = ChatRoomTargetMemberNumber;
                var oldMuteConfig = cursedConfig.hasFullMuteChat;
                cursedConfig.hasFullMuteChat = false;
                ChatRoomTargetMemberNumber = null;

                popChatGlobal(parameters.join(" ").replace(/^\/*/g, ""), true);

                ChatRoomTargetMemberNumber = oldTarget;
                cursedConfig.hasFullMuteChat = oldMuteConfig;
            }
            break;
        case "say":
            if (
                !cursedConfig.hasFullMuteChat
                && !cursedConfig.isMute
                && cursedConfig.hasIntenseVersion
            ) {
                cursedConfig.say = parameters.join(" ")
                    .replace(/^\**/g, "").replace(/^\/*/g, "");//stops emotes & stops commands
                document.getElementById("InputChat").value = cursedConfig.say;
            }
            break;
        case "cursedbelt":
            if (!cursedConfig.hasCursedBelt) {
                SendChat("The curse arises on " + Player.Name + "'s belt.");
                procGenericItem("PolishedChastityBelt", "ItemPelvis");
            } else
                SendChat("The curse on " + Player.Name + "'s belt vanished.");
            cursedConfig.hasCursedBelt = !cursedConfig.hasCursedBelt;
            break;
        case "onlyonpresence":
            if (!cursedConfig.enabledOnMistress)
                SendChat("The curse on " + Player.Name + " only listens while her owner is here.");
            else
                SendChat("The curse on " + Player.Name + " goes back to always listening.");
            cursedConfig.enabledOnMistress = !cursedConfig.enabledOnMistress;
            break;
        case "enforceentrymessage":
            if (!cursedConfig.hasEntryMsg)
                SendChat("The curse forces " + Player.Name + " to announce herself properly.");
            else
                SendChat("The curse no longer forces " + Player.Name + " to announce herself.");
            cursedConfig.hasEntryMsg = !cursedConfig.hasEntryMsg;
            break;
        case "owner":
            if (parameters[0] == "on") {
                if (!isNaN(parameters[1]) && !cursedConfig.owners.includes(parameters[1])) {
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
    }
}