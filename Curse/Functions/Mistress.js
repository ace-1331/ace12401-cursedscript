/** Function to trigger commands intended for mistresses, returns true if no command was executed */
function MistressCommands({ command, sender, parameters, isOwner, isClubOwner }) {
  switch (command) {
    case "savepreset":
      TryPopTip(45);
      if (parameters[0]) {
        let filteredPresets = cursedConfig.cursedPresets.filter(P => P.name !== parameters[0]);
        cursedConfig.cursedPresets = filteredPresets;
        cursedConfig.cursedPresets.push(
          { name: parameters[0], cursedItems: [...cursedConfig.cursedAppearance] }
        );
        sendWhisper(sender, { Tag: "MistressPresetSave", Param: [parameters[0]] }, true);
      } else {
        sendWhisper(sender, { Tag: "MissingPresetName" });
      }
      break;
    case "loadpreset":
      TryPopTip(45);
      if (parameters[0]) {
        let preset = cursedConfig.cursedPresets.find(P => P.name === parameters[0]);
        if (preset) {
          // Loads the preset + do not apply punishments on the next check
          cursedConfig.cursedAppearance = [...preset.cursedItems];
          cursedConfig.onRestart = true;
          SendChat({ Tag: "MistressPresetLoadMsg", Param: [preset.name] });
          sendWhisper(sender, { Tag: "MistressPresetLoadWarning" }, true);
        } else {
          sendWhisper(sender, { Tag: "NotFoundPreset" });
        }
      } else {
        sendWhisper(sender, { Tag: "MissingPresetName" });
      }
      break;
    case "loadpresetcurses":
      TryPopTip(45);
      if (parameters[0]) {
        let preset = cursedConfig.cursedPresets.find(P => P.name === parameters[0]);
        if (preset) {
          cursedConfig.cursedAppearance = [];
          preset.cursedItems.forEach(CI => {
            let currentAsset = InventoryGet(Player, CI.group);
            toggleCurseItem(
              { name: (currentAsset && currentAsset.Asset.Name) || "", group: CI.group, isSilent: true }
            );
          });
          SendChat({ Tag: "MistressPresetLoadMsg", Param: [preset.name] });
          sendWhisper(sender, { Tag: "MistressPresetLoadWarning" }, true);
        } else {
          sendWhisper(sender, { Tag: "NotFoundPreset" });
        }
      } else {
        sendWhisper(sender, { Tag: "MissingPresetName" });
      }
      break;
    case "cursereport":
      let toReport = ["hasRestrainedSpeech", "hasPublicAccess", "hasCursedKneel", "hasCursedSpeech", "hasCursedOrgasm", "isMute", "disaledOnMistress", "enabledOnMistress", "hasEntryMsg", "hasFullMuteChat", "hasSound", "hasAntiAFK", "hasRestrainedPlay", "hasNoMaid", "hasFullPublic", "punishmentsDisabled", "isLockedOwner", "isLockedNewLover", "hasReminders", "canReceiveNotes", "canLeash"];
      let report = toReport.map(el => el + ": " + cursedConfig[el]).join(", ") + ". Cursed item groups: " + cursedConfig.cursedAppearance.map(CI => CI.group).join(",");
      sendWhisper(sender, report, true);
      break;
    case "earplugs":
      toggleCurseItem({ name: "HeavyDutyEarPlugs", group: "ItemEars" });
      break;
    case "hood":
      sendWhisper(sender, { Tag: "MistressOldCommandCurseItem" }, true)
      break;
    case "blindfold":
      toggleCurseItem({ name: "FullBlindfold", group: "ItemHead" });
      break;
    case "mittens":
      toggleCurseItem({ name: "LeatherMittens", group: "ItemHands" });
      break;
    case "paws":
      toggleCurseItem({ name: "PawMittens", group: "ItemHands" });
      break;
    case "panties":
      toggleCurseItem({ name: "PantyStuffing", group: "ItemMouth" });
      break;
    case "dildogag":
      toggleCurseItem({ name: "DildoPlugGag", group: "ItemMouth" });
      break;
    case "gag":
      toggleCurseItem({ name: "BallGag", group: "ItemMouth" });
      break;
    case "doublegag":
      toggleCurseItem({ name: "DildoGag", group: "ItemMouth" });
      break;
    case "public":
      sendWhisper(sender, {
        Tag: cursedConfig.hasPublicAccess ? "MistressBasePublicOff" : "MistressBasePublicOn"
      }, true);
      cursedConfig.hasPublicAccess = !cursedConfig.hasPublicAccess;
      break;
    case "permakneel":
      if (!cursedConfig.hasCursedKneel) {
        SendChat({ Tag: "MistressPermaKneelOn" });
        KneelAttempt();
      } else
        SendChat({ Tag: "MistressPermaKneelOff" });
      cursedConfig.hasCursedKneel = !cursedConfig.hasCursedKneel;
      break;
    case "screws":
      toggleCurseItem({ name: "ScrewClamps", group: "ItemNipples" });
      break;
    case "cursedspeech":
      SendChat(
        { Tag: cursedConfig.hasCursedSpeech? "MistressCurseSpeechsOff" : "MistressCurseSpeechsOn" }
      );
      cursedConfig.hasCursedSpeech = !cursedConfig.hasCursedSpeech;
      break;
    case "vibes":
      TryPopTip(47);
      if (!cursedConfig.hasCursedOrgasm) {
        SendChat({ Tag: "MistressCurseVibesOn" });
        vibratorGroups.forEach(G => procCursedOrgasm(G));
      } else {
        SendChat({ Tag: "MistressCurseVibesOff" });
      }
      cursedConfig.hasCursedOrgasm = !cursedConfig.hasCursedOrgasm;
      break;
    case "naked":
      procCursedNaked(true);
      break;
    case "vibratorintensity":
      TryPopTip(47);
      if (parameters[0]) {
        switch (parameters[0]) {
          case "max":
          case "maximum":
            cursedConfig.vibratorIntensity = 3;
            SendChat({ Tag: "MistressCurseVibesInt3" });
            break;
          case "high":
            cursedConfig.vibratorIntensity = 2;
            SendChat({ Tag: "MistressCurseVibesInt2" });
            break;
          case "medium":
          case "normal":
            cursedConfig.vibratorIntensity = 1;
            SendChat({ Tag: "MistressCurseVibesInt1" });
            break;
          case "low":
            cursedConfig.vibratorIntensity = 0;
            SendChat({ Tag: "MistressCurseVibesInt0" });
            break;
          case "off":
            cursedConfig.vibratorIntensity = -1;
            SendChat({ Tag: "MistressCurseVibesInt-1" });
            break;
          default:
            sendWhisper(sender, { Tag: "MistressCurseVibesError" });
            return;
        }
        vibratorGroups.forEach(G => procCursedOrgasm(G));
      } else {
        sendWhisper(sender, { Tag: "MistressCurseVibesError" });
      }
      break;
    case "clothed":
      procCursedNaked(false);
      break;
    case "enforce": {
      let priority = (isClubOwner) ? 4 : (isOwner) ? 3 : 2;
      enforce(sender, priority, parameters);
      break;
    }
    case "mtitle":
      toggleTitle(sender, 2, parameters);
      break;
    case "deafimmune":
      if (parameters[0] && !isNaN(parameters[0])) {
        if (!cursedConfig.deafImmune.includes(parameters[0])) {
          cursedConfig.deafImmune.push(parameters[0]);
        } else {
          cursedConfig.deafImmune = cursedConfig.deafImmune.filter(DI => DI != parameters[0]);
        }
      } else {
        sendWhisper(sender, { Tag: "MistressDeafImmWhisperWarn" });
      }
      sendWhisper(
        sender,{
          Tag: "MistressDeafImmWhisperList",
          Param: [(cursedConfig.deafImmune.map(MN => FetchName(MN)).join(",") || "---")]
        }, true
      );
      break;
    case "mistress":
      if (parameters[0] && !isNaN(parameters[0])) {
        if (!cursedConfig.mistresses.includes(parameters[0])) {
          cursedConfig.mistresses.push(parameters[0]);
          SendChat({ Tag: "SelfMistressAdd", Param: [FetchName(parameters[0])] });
        } else {
          cursedConfig.mistresses = cursedConfig.mistresses.filter(
            mistress => mistress != parameters[0]
          );
          sendWhisper(sender, { Tag: "SelfMistressRemove", Param: [FetchName(parameters[0])] }, true);
        }
      } else {
        sendWhisper(sender, { Tag: "GeneralInvalidArgs" });
      }
      break;
    case "rename":
      let nickname = parameters.join(" ");
      if (nickname) {
        sendWhisper(sender, { Tag: "MistressRename", Param: [FetchName(sender), nickname] }, true);
        cursedConfig.charData = cursedConfig.charData.find(u => u.Number != sender);
        if (cursedConfig.charData) {
          cursedConfig.charData.Number = sender;
          cursedConfig.charData.Nickname = nickname;
        } else {
          cursedConfig.charData.push({ Number: sender, Nickname: nickname });
        }
      } else {
        sendWhisper(sender, { Tag: "GeneralInvalidArgs" });
      }
      break;
    case "banfirstperson":
      if (parameters[0] == "on") {
        cursedConfig.bannedWords.push("i", "am", "myself", "me", "my", "mine");
        sendWhisper(sender, { Tag: "Mistress1stBlock" }, true);
      } else if (parameters[0] == "off") {
        cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
          !["i", "\"i", "am", "myself", "me", "my", "mine"].includes(word)
        );
        sendWhisper(sender, { Tag: "Mistress1stAllow" }, true);
      } else {
        sendWhisper(sender, { Tag: "MistressInvalidProvideOnOff" });
      }
      break;
    case "banbegging":
      if (parameters[0] == "on") {
        cursedConfig.bannedWords.push("please", "beg", "begging");
        sendWhisper(sender, { Tag: "MistressBeggingOn" }, true);
      } else if (parameters[0] == "off") {
        cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
          !["please", "beg", "begging"].includes(word)
        );
        sendWhisper(sender, { Tag: "MistressBeggingOff" }, true);
      } else {
        sendWhisper(sender, { Tag: "MistressInvalidProvideOnOff" });
      }
      break;
    case "banword":
      if (parameters[0]) {
        if (!cursedConfig.bannedWords.includes(parameters[0])) {
          cursedConfig.bannedWords.push(parameters[0]);
          sendWhisper(sender, { Tag: "MistressNewBanWord", Param: [parameters[0]] }, true);
        } else {
          cursedConfig.bannedWords.splice(cursedConfig.bannedWords.indexOf(parameters[0]), 1);
          sendWhisper(sender, { Tag: "MistressRemoveBanWord", Param: [parameters[0]] }, true);
        }
      } else {
        sendWhisper(sender, { Tag: "GeneralInvalidArgs" });
      }
      break;
    case "mute":
      SendChat(
        { Tag: cursedConfig.isMute ? "MistressNormalMuteOff" : "MistressNormalMuteOn" }
      );
      cursedConfig.isMute = !cursedConfig.isMute;
      break;
    case "dolltalk":
      SendChat(
        { Tag: cursedConfig.hasDollTalk ? "MistressDolltalkOff" : "MistressDolltalkOn" }
      );
      cursedConfig.hasDollTalk = !cursedConfig.hasDollTalk;
      break;
    case "deactivateonpresence":
      sendWhisper(
        sender,
        { Tag: cursedConfig.disaledOnMistress ? "MistressDeacPresOff" : "MistressDeacPresOn" },
        true
      );
      cursedConfig.disaledOnMistress = !cursedConfig.disaledOnMistress;
      break;
    case "kneel":
      KneelAttempt();
      break;
    case "changestrikes":
      if (!isNaN(parameters[0]) && parameters[0] != "") {
        let strikesToAdd = parseInt(parameters[0]);
        if (strikesToAdd != 0) {
          cursedConfig.strikes += strikesToAdd;
          sendWhisper(
            sender,
            { Tag: strikesToAdd > 0 ? "MistressChangeStrikeAdd" : "MistressChangeStrikeRemove", Param: [strikesToAdd] }, true
          );
          if (cursedConfig.strikes < 0) {
            cursedConfig.strikes = 0;
          }
        }
      } else {
        sendWhisper(sender, { Tag: "GeneralInvalidArgs" });
      }
      break;
    case "mnickname":
      SetNickname(parameters, sender, 2);
      break;
    case "savecolors":
      sendWhisper(sender, { Tag: "MistressSavedColor" });
      SaveColors();
      break;
    case "deletenickname":
      DeleteNickname(parameters, sender, isOwner ? 3 : 2);
      break;
    case "respectnickname": {
      forceNickname(sender, parameters);
      break;
    }
    case "contractions":
      if (!cursedConfig.hasNoContractions) {
        sendWhisper(sender, { Tag: "MistressContractionOn" }, true);
        cursedConfig.bannedWords.push("im", "youre", "youll", "cant", "wont", "havent", "arent", "shouldnt", "wouldnt");
      } else {
        sendWhisper(sender, { Tag: "MistressContractionOff" }, true);
        cursedConfig.bannedWords = cursedConfig.bannedWords.filter(word =>
          !["im", "youre", "youll", "cant", "wont", "havent", "arent", "shouldnt", "wouldnt"].includes(word)
        );
      }
      cursedConfig.hasNoContractions = !cursedConfig.hasNoContractions;
      break;
    case "curseitem":
      if (parameters[0]) {
        let group = textToGroup(parameters[0], isClubOwner ? 3 : isOwner ? 2 : 1);
        let currentAsset = InventoryGet(Player, group);
        let dateOfRemoval = null;

        if (parameters[1] && !isNaN(parameters[1])) {
          // Param is hours and must be higher than 1 minute and lower than 7 days
          let requestedTime = parseInt(parameters[1]);
          requestedTime *= 3.6e+6;
          if (requestedTime < 60000) requestedTime = 60000;
          if (requestedTime > 7 * 8.64e+7) requestedTime = 6.048e+8;
          dateOfRemoval = Date.now() + requestedTime;
        }

        if (
          toggleCurseItem({
            name: (currentAsset && currentAsset.Asset.Name) || "",
            group,
            dateOfRemoval
          })
        ) {
          sendWhisper(sender, { Tag: "InvalidItemGroup" }, true);
        }
      } else {
        sendWhisper(sender, { Tag: "MistressCurseItemInvalidGroup" });
      }
      break;
    case "keeprestraints":
      if (!cursedConfig.forcedRestraintsSetting) {
        sendWhisper(sender, { Tag: "forcedRestraintsSettingOn" });
      } else {
        sendWhisper(sender, { Tag: "forcedRestraintsSettingOff" });
      }
      cursedConfig.forcedRestraintsSetting = !cursedConfig.forcedRestraintsSetting;
      break;
    default:
      // No command found
      return true;

  }
}