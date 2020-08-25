/** Function to trigger commands intended for the wearer. 
 * Returns true if a message should be sent 
 */
function WearerCommands({ command, parameters, sender }) {
  let r = false;
  switch (command) {
    case "togglecommand":
      TryPopTip(50);
      if (!parameters[0]) {
        popChatSilent({ Tag: "ToggleCommandInvalid" });
        return;
      }
      const optin = cursedConfig.optinCommands.find(OC => OC.command === parameters[0]);
      if (optin) {
        // When opt-in, we toggle the enabled bool
        optin.isEnabled = !optin.isEnabled;
        popChatSilent({ Tag: optin.isEnabled ? "OptinCommandToggleOn" : "OptinCommandToggleOff", Param: [parameters[0]] });
        return;
      }
      // When normal, we add/remove it from the list
      if (cursedConfig.disabledCommands.includes(parameters[0])) {
        cursedConfig.disabledCommands = cursedConfig.disabledCommands.filter(C => C !== parameters[0]);
        popChatSilent({ Tag: "RemovedBlacklistCommand", Param: [parameters[0]]});
        return;
      }
      cursedConfig.disabledCommands.push(parameters[0]);
      popChatSilent({
        Tag: parameters[0] === "ownerhub" ? "ToggleOwnerHub" : "ToggleCommand",
        Param: [parameters[0]]
      });
      break;
    case "restraintvanish":
      popChatSilent({
        Tag: cursedConfig.hasRestraintVanish ? "restraintvanishoff" : "restraintvanishon"
      });
      cursedConfig.hasRestraintVanish = !cursedConfig.hasRestraintVanish;
      break;
    case "hidehelp":
      popChatSilent({ Tag: cursedConfig.hideHelp ? "LoginHelpOff" : "LoginHelpOn" });
      cursedConfig.hideHelp = !cursedConfig.hideHelp;
      break;
    case "forwardall":
      popChatSilent({ Tag: cursedConfig.hasForward ? "forwardalloff" : "forwardallon" });
      cursedConfig.hasForward = !cursedConfig.hasForward;
      break;
    case "hidedisplay":
      popChatSilent({ Tag: cursedConfig.hasHiddenDisplay ? "hidedisplayoff" : "hidedisplayon" });
      cursedConfig.hasHiddenDisplay = !cursedConfig.hasHiddenDisplay;
      break;
    case "capture":
      if (!cursedConfig.hasIntenseVersion) {
        popChatSilent({ Tag: "NeedIntenseOn" });
        return;
      }
      popChatSilent({
        Tag: cursedConfig.hasCaptureMode ? "hasCaptureModeoff" : "hasCaptureModeon"
      });
      cursedConfig.hasCaptureMode = !cursedConfig.hasCaptureMode;
      break;
    case "wardrobev2":
      popChatSilent({ Tag: cursedConfig.hasWardrobeV2 ? "wardrobev2off" : "wardrobev2on" });
      cursedConfig.hasWardrobeV2 = !cursedConfig.hasWardrobeV2;
      break;
    case "commandsv2":
      popChatSilent({ Tag: cursedConfig.hasCommandsV2 ? "commandsv2off" : "commandsv2on" });
      cursedConfig.hasCommandsV2 = !cursedConfig.hasCommandsV2;
      break;
    case "eatcommand":
    case "eatcommands":
      popChatSilent({ Tag: cursedConfig.isEatingCommands ? "eatcommandoff" : "eatcommandon" });
      cursedConfig.isEatingCommands = !cursedConfig.isEatingCommands;
      break;
    case "issilent":
      popChatSilent({ Tag: cursedConfig.isSilent ? "issilentoff" : "issilenton" });
      cursedConfig.isSilent = !cursedConfig.isSilent;
      break;
    case "showstrikes":
      popChatSilent({ Tag: "WearerShowStrikes", Param: [cursedConfig.strikes] });
      break;
    case "help":
      InitHelpMsg();
      popChatSilent(helpTxt);
      break;
    case "showblacklist":
      popChatSilent({ Tag: "WearerShowBlacklist", Param: [cursedConfig.blacklist.join(" #")] });
      break;
    case "listsentences":
      popChatSilent({
        Tag: "WearerShowTargets",
        Param: [
          cursedConfig.targets.map(target => `${GT(Player.MemberNumber, "TxtCommand")} ${target.ident} ${GT(Player.MemberNumber, "TxtOutput")} ${target.text}`)
            .join("; - ")
        ]
      });
      popChatSilent({
        Tag: "WearerShowSentences",
        Param: [
          cursedConfig.sentences
            .map(sentence => `${GT(Player.MemberNumber, "TxtCommand")} ${sentence.ident} ${GT(Player.MemberNumber, "TxtOutput")} ${sentence.text}`).join("; - ")
        ]
      });
      break;
    case "talk":
      const target = cursedConfig.targets.filter(t => t.ident == parameters[0])[0];
      const sentence = cursedConfig.sentences.filter(s => s.ident == parameters[1])[0];
      if (target && sentence) {
        popChatGlobal(sentence.text.replace("%target%", target.text).replace("%self%", cursedConfig.self), true);
      } else {
        popChatSilent({ Tag: "WearerTalkInvalid" });
      }
      break;
    case "owner":
      if (cursedConfig.hasRestrainedPlay) {
        popChatSilent({ Tag: "RestrainPlayEnabled" });
        return;
      }
      if (parameters[0] && !isNaN(parameters[0])) {
        if (Player.MemberNumber == parameters[0]) {
          popChatSilent({ Tag: "ErrorSelfOwn" });
          return;
        }

        //Cannot remove real owner
        let realOwner = Player.Ownership ? Player.Ownership.MemberNumber : "";
        if (!cursedConfig.owners.includes(parameters[0])) {
          cursedConfig.owners.push(parameters[0]);
          SendChat({ Tag: "SelfOwnerAdd", Param: [FetchName(parameters[0])] });
        } else if (realOwner != parameters[0]) {
          cursedConfig.owners = cursedConfig.owners.filter(
            owner => owner != parameters[0]
          );
          popChatSilent({ Tag: "SelfOwnerRemove", Param: [FetchName(parameters[0])] });
        } else {
          popChatSilent({ Tag: "ErrorClubOwn" });
        }
      } else {
        popChatSilent({ Tag: "GeneralInvalidArgs" });
      }
      break;
    case "mistress":
      if (cursedConfig.hasRestrainedPlay) {
        popChatSilent({ Tag: "RestrainPlayEnabled" });
        return;
      }
      if (parameters[0] && !isNaN(parameters[0])) {
        if (Player.MemberNumber == parameters[0]) {
          popChatSilent({ Tag: "ErrorSelfMistress" });
          return;
        }
        if (!cursedConfig.mistresses.includes(parameters[0])) {
          cursedConfig.mistresses.push(parameters[0]);
          SendChat({ Tag: "SelfMistressAdd", Param: [FetchName(parameters[0])] });
        } else {
          cursedConfig.mistresses = cursedConfig.mistresses.filter(
            mistress => mistress != parameters[0]
          );
          popChatSilent({ Tag: "SelfMistressRemove", Param: [FetchName(parameters[0])] });
        }
      } else {
        popChatSilent({ Tag: "GeneralInvalidArgs" });
      }
      break;
    case "blacklist":
      if (parameters[0] && !isNaN(parameters[0]) && parameters[0] != sender) {
        if (!cursedConfig.blacklist.includes(parameters[0])) {
          cursedConfig.blacklist.push(parameters[0]);
          popChatSilent({ Tag: "WearerBlacklistAdd", Param: [FetchName(parameters[0])] }, "System");
        } else {
          cursedConfig.blacklist = cursedConfig.blacklist.filter(
            blacklist => blacklist != parameters[0]
          );
          popChatSilent({ Tag: "WearerBlacklistRemove", Param: [FetchName(parameters[0])] }, "System");
        }
      } else {
        popChatSilent({ Tag: "GeneralInvalidArgs" });
      }
      break;
    case "identifier":
    case "changeidentifier":
      cursedConfig.slaveIdentifier = parameters.join(" ") || Player.Name;
      popChatSilent({ Tag: "WearerNameChange", Param: [cursedConfig.slaveIdentifier] }, "System");
      break;
    case "commandchar":
    case "changecommandchar":
      if (["!", "@", "#", "$"].includes(parameters[0])) {
        cursedConfig.commandChar = parameters[0];
        popChatSilent({ Tag: "ValidCommandChar", Param: [parameters[0]] }, "System");
      } else
        popChatSilent({ Tag: "InvalidCommandChar", Param: [parameters.join(" ")] }, "System");
      break;
    case "punishmentcolor":
      popChatSilent({ Tag: "PunishmentColorDisabled" });
      break;
    case "draw":
      if (parameters.filter(param => isNaN(param)).length == 0) {
        drawCards(parameters.shift(), parameters);
      }
      break;
    case "shuffle":
      shuffleDeck();
      break;
    case "tip":
    case "tips":
      if (parameters[0] == "reset") {
        popChatSilent({ Tag: "TipReset" });
        cursedConfig.seenTips = [];
      }
      PopTip();
      break;
    case "savecolors":
      SaveColors();
      break;
    case "fullchatlength":
      popChatSilent({
        Tag: cursedConfig.hasFullLengthMode ? "FullLengthOff" : "FullLengthOn"
      });
      cursedConfig.hasFullLengthMode = !cursedConfig.hasFullLengthMode;
      break;
    case "quickban":
      if (ChatRoomData && ChatRoomData.Admin && ChatRoomData.Admin.includes(Player.MemberNumber)) {
        let BlockedIds = [21266, 16815, 16618, 16783, 16727, 17688, 15102, 7784, 17675, 16087, 18333, 16965, 16780, 16704, 19599, 19581, 16679, 16630, 21179, 18174, 20808, 20806, 20392, 17687, 20104, 16651, 19600, 18639, 18021, 18707, 18572, 18297, 18299, 18214, 18172, 17677, 16930, 16725, 16708, 16705, 16440, 22236, 22200, 22201, 22202, 22203, 22205, 22207, 22208, ...Player.GhostList, ...Player.BlackList];
        BlockedIds = BlockedIds.filter((ID, i) => BlockedIds.lastIndexOf(ID) === i);
        BlockedIds.forEach(troll => ServerSend("ChatRoomAdmin", { MemberNumber: troll, Action: "Ban" }));
        popChatSilent({ Tag: "QuickbanSucceed" }, "System");
      } else {
        popChatSilent({ Tag: "QuickbanError" }, "System");
      }
      break;
    case "nickname":
      SetNickname(parameters, sender, 0);
      break;
    case "deletenickname":
      DeleteNickname(parameters, sender, 0);
      break;
    case "curseitem":
    case "curseditem":
      if (parameters[0] && parameters[1] && !isNaN(parameters[1])) {
        let group = textToGroup(parameters[0], 1);
        let currentAsset = InventoryGet(Player, group);
        let dateOfRemoval = parseInt(parameters[1]);

        // Param is hours and must be higher than 1 minute and lower than 7 days
        dateOfRemoval *= 3.6e+6;
        if (dateOfRemoval < 60000) dateOfRemoval = 60000;
        if (dateOfRemoval > 7 * 8.64e+7) dateOfRemoval = 6.048e+8;
        dateOfRemoval += Date.now();

        if (
          toggleCurseItem({
            name: (currentAsset && currentAsset.Asset.Name) || "",
            group,
            property: (currentAsset && currentAsset.Property),
            forceAdd: true,
            dateOfRemoval
          })
        ) {
          sendWhisper(sender, {Tag: "InvalidItemGroup"}, true);
        }
      } else {
        sendWhisper(sender, {Tag: "CurseItemInvalidArgs"});
      }
      break;
    case "language":
      switch (parameters[0]) {
        case "en":
        case "ru":
        case "ger":
        case "fr":
          DictionaryRequest(sender, parameters[0].toUpperCase());
          popChatSilent({ Tag: "AllSetDictionary", Param: [parameters[0].toUpperCase()] }, "System");
          break;
        default:
          popChatSilent({ Tag: "AllInvalidLanguage" }, "System");
          break;
      }
      break;
    default:
      //notifies no commands were found
      r = true;
      break;

  }
  return r;
}