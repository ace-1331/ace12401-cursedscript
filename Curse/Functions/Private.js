/** Function to trigger commands intended for the owners or wearer, returns true if no command was executed */
function PrivateCommands({ command, parameters, sender }) {
    switch (command) {
        case "configreport":
            let toReport = ["punishmentColor", "isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasRestraintVanish", "hasForcedSensDep", "hasHiddenDisplay"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
            sendWhisper(sender, report);
            break;
        case "showenforced":
            sendWhisper(sender, "Enforced list: #" + cursedConfig.enforced.join(" #"));
            break;
        case "showmistresses":
            sendWhisper(sender, "Mistresses: #" + cursedConfig.mistresses.join(" #"));
            break;
        case "showowners":
            sendWhisper(sender, "Owners: #" + cursedConfig.owners.join(" #"));
            break;
        case "shownicknames":
            sendWhisper(sender, "Currently set nicknames: " + cursedConfig.nicknames.map(n => n.Number + ": " + n.Nickname + " (Priority: " + n.Priority + ")").join(", "));
            break;
        case "speechreport":
            sendWhisper(sender, `Here are the speech constraints --> Members to respect: ${cursedConfig.enforced.join(", ")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"}, Contractions Ban: ${cursedConfig.hasNoContractions} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}, Restrained speech mode: ${cursedConfig.hasRestrainedSpeech}.`);
            break;
        case "help":
            var helpTxt = helpMsg("owner");
            sendWhisper(sender, helpTxt);
            return true;
        default:
            // No command found
            return true;
    }
}

