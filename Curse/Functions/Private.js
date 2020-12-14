/** Function to trigger commands intended for the owners or wearer, returns true if no command was executed */
function PrivateCommands({ command, parameters, sender }) {
  switch (command) {
    case "listpresets":
      TryPopTip(45);
      let presets = cursedConfig.cursedPresets.map(P =>
        P.name + " [" + P.cursedItems.map(CI =>
          (AssetGroup.find(G => G.Name == CI.group) || {}).Description || "???"
        ).join(", ") + "]"
      ).join(", ");
      sendWhisper(sender, presets);
      break;
    case "configreport":
      let toReport = ["isSilent", "hasForward", "commandChar", "slaveIdentifier", "hasIntenseVersion", "isClassic", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasRestraintVanish", "hasForcedSensDep", "hasHiddenDisplay", "isEatingCommands", "hasFullLengthMode", "hasFullBlindMode", "hasNoEasyEscape", "hasSecretOrgasm", "hasBlockedOOC", "hasBlockedWhisper", "forbidorgasm", "hasDCPrevention", "hasForcedMeterOff", "hasForcedMeterLocked", "hasDCPrevention"];
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
      sendWhisper(sender, { Tag: "PrivateShowEnforced", Param: [report] });
      break;
    }
    case "showmistresses":
      sendWhisper(
        sender, { Tag: "PrivateShowMistress", Param: [cursedConfig.mistresses.join(" #")] }
      );
      break;
    case "showowners":
      sendWhisper(
        sender, { Tag: "PrivateShowOwner", Param: [cursedConfig.owners.join(" #")] }
      );
      break;
    case "shownicknames": {
      let report = cursedConfig.charData
        .filter(n => n.Nickname && n.Nickname != n.SavedName)
        .map(n => " #" + n.Number + " " + n.Nickname)
        .join(", ");
      sendWhisper(sender, { Tag: "ShowNicknames", Param: [report] });
      break;
    }
    case "showtitles": {
      let report = "";
      cursedConfig.charData
        .filter(t => t.Titles.length > 0)
        .map(t => "#" + t.Number + " " + t.Titles.join(", "))
        .join(", ");
      sendWhisper(sender, { Tag: "ShowTitles", Param: [report] });
      break;
    }
    case "speechreport": {
      let tmpstr = [];
      cursedConfig.charData.forEach(el => {
        tmpstr.push(el.Number);
      });
      sendWhisper(sender, {
        Tag: "PrivateShowSpeechRestriction",
        Param: [
          tmpstr.join(", #"),
          cursedConfig.hasCursedSpeech ? cursedConfig.bannedWords.join(", ") : "---", cursedConfig.hasNoContractions,
          cursedConfig.isMute || cursedConfig.hasFullMuteChat,
          cursedConfig.hasSound ? cursedConfig.sound : "---",
          cursedConfig.hasEntryMsg ? cursedConfig.entryMsg : "---",
          cursedConfig.hasRestrainedSpeech,
          cursedConfig.hasDollTalk,
          !cursedConfig.hasBlockedOOC,
          cursedConfig.mustRetype
        ]
      });
      break;
    }
    case "isclassic":
      if (!cursedConfig.isClassic)
        sendWhisper(sender, { Tag: "IsClassicOn" });
      else
        sendWhisper(sender, { Tag: "IsClassicOff" });
      cursedConfig.isClassic = !cursedConfig.isClassic;
      break;
    case "fullblindfold":
      if (!cursedConfig.hasFullBlindMode) {
        sendWhisper(sender, { Tag: "FullBlindfoldOn" });
        Asset.forEach(A => A.Effect && A.Effect.find(E => E.includes("Blind")) ? A.Effect.push("BlindHeavy") : "");
      } else {
        sendWhisper(sender, { Tag: "FullBlindfoldOff" });
        AssetLoadAll();
      }
      cursedConfig.hasFullBlindMode = !cursedConfig.hasFullBlindMode;
      break;
      case "fullslow":
        if (!cursedConfig.hasFullSlowMode) {
          sendWhisper(sender, { Tag: "FullSlowOn" });
        } else {
          sendWhisper(sender, { Tag: "FullSlowOff" });
        }
        cursedConfig.hasFullSlowMode = !cursedConfig.hasFullSlowMode;
        break;
    default:
      // No command found
      return true;
  }
}

