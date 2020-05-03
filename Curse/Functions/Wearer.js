function WearerCommands({ command, parameters, sender }) {
    let r = false;
    switch (command) {
        case "configreport":
            let toReport = ["punishmentColor", "isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
            popChatSilent(report);
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
            if (parameters[0] && !isNaN(parameters[0])) {
                //Cannot remove real owner
                var realOwner = Player.Ownership ? Player.Ownership.MemberNumber : '';
                if (!cursedConfig.owners.includes(parameters[0])) {
                    cursedConfig.owners.push(parameters[0]);
                    SendChat(
                        Player.Name + " now has a new owner (#" + parameters[0] + ")."
                    );
                } else if (realOwner != parameters[0]) {
                    cursedConfig.owners = cursedConfig.owners.filter(
                        owner => owner != parameters[0]
                    );
                    popChatSilent("Removed owner: " + parameters[0]);
                }
            } else {
                popChatSilent("(Invalid arguments.)");
            }
            break;
        case "mistress":
            if (cursedConfig.hasRestrainedPlay) {
                popChatSilent("Your owner disabled this command.");
                return;
            }
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
                    popChatSilent("Removed mistress: " + parameters[0]);
                }
            } else {
                popChatSilent("Invalid Arguments.");
            }
            break;
        case "blacklist":
            if (parameters[0] && !isNaN(parameters[0]) && parameters[0] != sender) {
                if (!cursedConfig.blacklist.includes(parameters[0])) {
                    cursedConfig.blacklist.push(parameters[0]);
                    popChatSilent("Added to blacklist: " + parameters[0]);
                } else {
                    cursedConfig.blacklist = cursedConfig.blacklist.filter(
                        blacklist => blacklist != parameters[0]
                    );
                    popChatSilent("Removed from blacklist: " + parameters[0]);
                }
            } else {
                popChatSilent("Invalid Arguments.");
            }
            break;
        case "identifier":
        case "changeidentifier":
            cursedConfig.slaveIdentifier = parameters.join(" ") || Player.Name;
            popChatSilent("Your wearer identifier was changed to: " + cursedConfig.slaveIdentifier);
            break;
        case "commandchar":
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
        case "savecolors":
            SaveColors();
            break;
        case "nickname":
            SetNickname(parameters, sender, 0);
            break;
        case "deletenickname":
            DeleteNickname(parameters, sender, 0);
            break;
        default:
            //notifies no commands were found
            r = true;
            break
            
    }
    return r;
}