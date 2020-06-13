/** Function to trigger commands intended for the owners or wearer, returns true if no command was executed */
function PrivateCommands({ command, parameters, sender }) {
    switch (command) {
        case "configreport":
            let toReport = ["punishmentColor", "isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasRestraintVanish", "hasForcedSensDep", "hasHiddenDisplay", "isEatingCommands"];
            let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
            sendWhisper(sender, report);
            break;
        case "showenforced":{
            let tmpstr = "";
            cursedConfig.charData.map(e => {
                if(e.isEnforced){
                    tmpstr += "#" + e.Number + ", ";
                    e.RespectNickname ? tmpstr += "Nickname: " + e.Nickname : tmpstr += "Name:" + e.SavedName + " Titles:" + e.Titles.join(", ");
                }
            });
            sendWhisper(sender, "Enforced list: #" + tmpstr);
           break;
        }
        case "showmistresses":
            sendWhisper(sender, "Mistresses: #" + cursedConfig.mistresses.join(" #"));
            break;
        case "showowners":
            sendWhisper(sender, "Owners: #" + cursedConfig.owners.join(" #"));
            break;
        case "shownicknames":{
            let tmpstr = "";
            cursedConfig.charData.map(n => {
                if(n.Nickname != n.SavedName){
                    tmpstr += " #" + n.Number + " " + n.Nickname;
                }
            });
            sendWhisper(sender, "Currently set nicknames:" + tmpstr);
            break;
        }
        case "showtitles":{
            let tmpstr = "";
            cursedConfig.charData.map(t => {
                if(t.Titles.length > 0){
                    tmpstr += "#" + t.Number + " " + t.Titles.join(", ");
                }
            });
            sendWhisper(sender, "Currently set titles: " + tmpstr);
            break;
        }
       case "speechreport": {
           let tmpstr = [];
           cursedConfig.charData.forEach(el => {tmpstr.push(el.Number);               
           });
           sendWhisper(sender, `Here are the speech constraints --> Members to respect: ${tmpstr.join(", #")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"}, Contractions Ban: ${cursedConfig.hasNoContractions} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}, Restrained speech mode: ${cursedConfig.hasRestrainedSpeech}, Doll talk: ${cursedConfig.hasDollTalk}.`);
           break;
       }
        default:
            // No command found
            return true;
    }
}

