function WearerCommands({ command, parameters, sender }) {
    switch (command) {
        case "configreport":
            let toReport = ["punishmentColor", "isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
            popChatSilent(sender, report, true);
            break;
        case "forwardall":
            if (!cursedConfig.hasForward)
                popChatSilent("Your curse will forward all whispers to you.");
            else
                popChatSilent("Your curse will no longer forward unnecessary whispers.");
            cursedConfig.hasForward = !cursedConfig.hasForward;
            break;
        case "issilent":
            if (!cursedConfig.isSilent)
                popChatSilent("Your curse will no longer display public messages");
            else
                popChatSilent("Your curse will resume displaying messages publicly");
            cursedConfig.isSilent = !cursedConfig.isSilent;
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
        case "shownicknames":
            popChatSilent("Currently set nicknames: " + cursedConfig.nicknames.map(n => n.Number + ": " + n.Nickname + " (Priority: " + n.Priority + ")").join(", "));
            break;
        case "speechreport":
            popChatSilent(`Here are your speech constraints --> Members to respect: ${cursedConfig.enforced.join(", ")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}. (Note that banned words with '-' and such in them are for compatibility, they will not be picked up so you can ignore them.)`);
            break;
        case "owner":
            if (cursedConfig.hasRestrainedPlay) {
                popChatSilent("Your owner disabled this command.");
                return;
            }
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
        case "mistress":
            if (cursedConfig.hasRestrainedPlay) {
                popChatSilent("Your owner disabled this command.");
                return;
            }
            if (parameters[0] == "on") {
                if (!isNaN(parameters[1]) && !cursedConfig.mistresses.includes(parameters[1])) {
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
            cursedConfig.slaveIdentifier = parameters.join(" ");
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
        case "punishmentcolor":
            cursedConfig.punishmentColor = parameters[0];
            popChatSilent("Your punishment color is now: " + parameters[0]);
            break;
        case "draw":
            if (parameters.filter(param => isNaN(param)).length == 0) {
                drawCards(parameters.shift(), parameters);
            }
            break;
        case "shuffle":
            shuffleDeck();
            break;
        case "nickname":
            SetNickname(parameters, sender, 0);
            break;
        case "deletenickname":
            DeleteNickname(parameters, sender, 0);
            break;
    }
}