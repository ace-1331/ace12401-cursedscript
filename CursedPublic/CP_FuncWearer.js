function WearerCommands({ command, parameters }) {
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
                if (!isNaN(parameters[1])  && !cursedConfig.owners.includes(parameters[1])) {
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
                if (!isNaN(parameters[1])  && !cursedConfig.mistresses.includes(parameters[1])) {
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
        case "draw":
            if (parameters.filter(param => isNaN(param)).length == 0) {
                drawCards(parameters.shift(), parameters);
            }
            break;
        case "shuffle":
            shuffleDeck();
            break;
        default:
            cursedConfig.log.push("unknown wearer command:" + command);
            break;
    }
}