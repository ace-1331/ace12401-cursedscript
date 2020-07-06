/** Function to trigger commands intended for the owners or wearer, returns true if no command was executed */
function PrivateCommands({ command, parameters, sender }) {
  switch (command) {
    case "listpresets":
      TryPopTip(45);
      let presets = cursedConfig.cursedPresets.map(P =>
        P.name + " [" + P.cursedItems.map(CI =>
          (AssetGroup.find(G => G.Name == CI.group) || {}).Description || "Unknown Group"
        ).join(", ") + "]"
      ).join(", ");
      sendWhisper(sender, presets);
      break;
    case "configreport":
      let toReport = ["isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasRestraintVanish", "hasForcedSensDep", "hasHiddenDisplay", "isEatingCommands", "hasFullLengthMode", "hasFullBlindMode", "hasNoEasyEscape", "hasSecretOrgasm", "hasBlockedOOC", "forbidorgasm", "hasDCPrevention", "hasForcedMeterOff", "hasForcedMeterLocked", "hasDCPrevention"];
      let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ");
      sendWhisper(sender, report);
      break;
    case "showenforced": {
      const report =
        cursedConfig.charData.filter(e => e.isEnforced).map(e => {
          let tmpstr = "#" + e.Number + ", ";
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
    case "shownicknames": {
      let report = cursedConfig.charData
        .filter(n => n.Nickname && n.Nickname != n.SavedName)
        .map(n => " #" + n.Number + " " + n.Nickname)
        .join(", ");
      sendWhisper(sender, "Currently set nicknames:" + report);
      break;
    }
    case "showtitles": {
      let report = "";
      cursedConfig.charData
        .filter(t => t.Titles.length > 0)
        .map(t => "#" + t.Number + " " + t.Titles.join(", "))
        .join(", ");
      sendWhisper(sender, "Currently set titles: " + report);
      break;
    }
    case "speechreport": {
      let tmpstr = [];
      cursedConfig.charData.forEach(el => {
        tmpstr.push(el.Number);
      });
      sendWhisper(sender, `Here are the speech constraints --> Members to respect: ${tmpstr.join(", #")}, Banned words: ${cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "none"}, Contractions Ban: ${cursedConfig.hasNoContractions} , Muted: ${cursedConfig.isMute || cursedConfig.hasFullMuteChat} , Sound: ${cursedConfig.hasSound ? cursedConfig.sound : "none"}, Entry message: ${cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "none"}, Restrained speech mode: ${cursedConfig.hasRestrainedSpeech}, Doll talk: ${cursedConfig.hasDollTalk}, OOC while gagged: ${!cursedConfig.hasBlockedOOC},must retype messages: ${cursedConfig.mustRetype}.`);
      break;
    }
    case "isclassic":
      if (!cursedConfig.isClassic)
        sendWhisper(sender, "The curse will act like it did before. (Messages containing transgressions will be sent, but punishments will still be applied.)");
      else
        sendWhisper(sender, "The curse will no longer act like it did before. (Messages containing transgressions will NOT be sent.)");
      cursedConfig.isClassic = !cursedConfig.isClassic;
      break;
    case "fullblindfold":
      if (!cursedConfig.hasFullBlindMode) {
        sendWhisper(sender, "(All blindfolds will completely blind the wearer.)");
        Asset.forEach(A => A.Effect && A.Effect.find(E => E.includes("Blind")) ? A.Effect.push("BlindHeavy") : "");
      } else {
        sendWhisper(sender, "(Blindfolds will behave normally.)");
        AssetLoadAll();
      }
      cursedConfig.hasFullBlindMode = !cursedConfig.hasFullBlindMode;
      break;
    default:
      // No command found
      return true;
  }
}

