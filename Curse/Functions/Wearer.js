function WearerCommands({ command, parameters, sender }) {
    let r = false;
    switch (command) {
        case "configreport":
            let toReport = ["punishmentColor", "isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner"];
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
        case "wardrobev2":
            if (!cursedConfig.hasWardrobeV2)
                popChatSilent("Enabled enhanced wardrobe. (Changes will be applied on the next reload.)");
            else
                popChatSilent("Disabled enhanced wardrobe. (Changes will be applied on the next reload.)");
            cursedConfig.hasWardrobeV2 = !cursedConfig.hasWardrobeV2;
            break;
        case "isclassic":
            if (!cursedConfig.isClassic)
                popChatSilent("Your curse will act like it did before. (Messages containing transgressions will be sent, but punishments will still be applied.)");
            else
            popChatSilent("Your curse will no longer act like it did before. (Messages containing transgressions will NOT be sent.)");
            cursedConfig.isClassic = !cursedConfig.isClassic;
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
            popChatSilent(`Here are your speech constraints --> Members to respect: ${cursedConfig.enforced.join(", ")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"}, Contractions Ban: ${cursedConfig.hasNoContractions} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}, Restrained speech mode: ${cursedConfig.hasRestrainedSpeech}. (Note that banned words with '-' and such in them are for compatibility, they will not be picked up so you can ignore them.)`);
            break;
        case "listsentences":
            popChatSilent("Here are your allowed targets -->" + cursedConfig.targets.map(target => `Command: ${target.ident} Ouputs: ${target.text}`).join("; - "));
            popChatSilent("Here are your allowed sentences -->" + cursedConfig.sentences.map(sentence => `Command: ${sentence.ident} Outputs: ${sentence.text}`).join("; - "));
            break;
        case "talk":
            const target = cursedConfig.targets.filter(t => t.ident == parameters[0])[0];
            const sentence = cursedConfig.sentences.filter(s => s.ident == parameters[1])[0];
            console.log(target , sentence);
            if (target && sentence) {
                popChatGlobal(sentence.text.replace("%target%", target.text).replace("%self%", cursedConfig.self), true)
            } else { 
                popChatSilent("Invalid arguments. you need to specify the target id and the sentence id like '#name talk miss yes' where miss is the target id and yes is the sentence id.");
            }
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
                        Player.Name + " now has a new owner (" + FetchName(parameters[0]) + ")."
                    );
                } else if (realOwner != parameters[0]) {
                    cursedConfig.owners = cursedConfig.owners.filter(
                        owner => owner != parameters[0]
                    );
                    popChatSilent("Removed owner: " + FetchName(parameters[0]));
                } else {
                    popChatSilent("(Cannot remove your official owner.)");
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
                        Player.Name + " now has a new mistress (" + FetchName(parameters[0]) + ")."
                    );
                } else {
                    cursedConfig.mistresses = cursedConfig.mistresses.filter(
                        mistress => mistress != parameters[0]
                    );
                    popChatSilent("Removed mistress: " + FetchName(parameters[0]));
                }
            } else {
                popChatSilent("Invalid Arguments.");
            }
            break;
        case "blacklist":
            if (parameters[0] && !isNaN(parameters[0]) && parameters[0] != sender) {
                if (!cursedConfig.blacklist.includes(parameters[0])) {
                    cursedConfig.blacklist.push(parameters[0]);
                    popChatSilent("Added to blacklist: " + FetchName(parameters[0]));
                } else {
                    cursedConfig.blacklist = cursedConfig.blacklist.filter(
                        blacklist => blacklist != parameters[0]
                    );
                    popChatSilent("Removed from blacklist: " + FetchName(parameters[0]));
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