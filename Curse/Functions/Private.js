/** Function to trigger commands intended for the owners or wearer, returns true if no command was executed */
function PrivateCommands({ command, parameters, sender }) {
  switch (command) {
    case "configreport":{
      let toReport = ["isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasRestraintVanish", "hasForcedSensDep", "hasHiddenDisplay", "isEatingCommands"];
      let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
      sendWhisper(sender, report);
      break;
    }
    case "showenforced":{
      let report =
      cursedConfig.charData.filter(e => e.isEnforced).map(e => {
        e.RespectNickname ? tmpstr += "Nickname: " + e.Nickname : tmpstr += "Name: " + (e.Nickname ? e.SavedName : FetchName(e.Number)) + " Titles: " + e.Titles.join(", ");
        return tmpstr;
      }).join(", ");
      sendWhisper(sender, "Enforced list: " + report);
      break;
    }
    case "showmistresses":
      sendWhisper(sender, "Mistresses: #" + cursedConfig.mistresses.join(" #"));
      break;
    case "showowners":
      sendWhisper(sender, "Owners: #" + cursedConfig.owners.join(" #"));
      break;
    case "shownicknames":{
      let report = cursedConfig.charData.filter(n => n.Nickname)
      .map(n => " #" + n.Number + " " + n.Nickname)
      .join(", ");
      sendWhisper(sender, "Currently set nicknames:" + report);
      break;
    }
    case "showtitles":{
      let report =
      cursedConfig.charData.filter(t => t.Titles.length > 0).map(t => {
        let tmpstr = "#" + t.Number + " Titles: " + t.Titles.join(", ");
        return tmpstr;
      }).join(", ");
      sendWhisper(sender, "Currently set titles: " + report);
      break;
    }
    case "speechreport":{
      let tmpstr = [];
      cursedConfig.charData.forEach(el => {
        tmpstr.push(el.Number);
      });
      sendWhisper(sender, `Here are the speech constraints --> Members to respect: ${tmpstr.join(", #")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"}, Contractions Ban: ${cursedConfig.hasNoContractions} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}, Restrained speech mode: ${cursedConfig.hasRestrainedSpeech}, Doll talk: ${cursedConfig.hasDollTalk}.`);
      break;
    }
    default:
      // No command found
      return true;
  }
}

