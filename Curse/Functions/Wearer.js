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
        popChatSilent(`The ${parameters[0]} command was set to ${optin.isEnabled ? "enabled" : "disabled"}.`);
        return;
      }
      // When normal, we add/remove it from the list
      if (cursedConfig.disabledCommands.includes(parameters[0])) {
        cursedConfig.disabledCommands = cursedConfig.disabledCommands.filter(C => C !== parameters[0]);
        popChatSilent({ Tag: "RemovedBlacklistCommand", Param: [parameters[0]]});
        return;
      }
      cursedConfig.disabledCommands.push(parameters[0]);
      popChatSilent(parameters[0] === "ownerhub" ? "The curse is now in owner hub mode. No one will be able to interact with your curse." : `The ${parameters[0]} command was blocked.`);
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
      popChatSilent("You have " + cursedConfig.strikes + " strikes.");
      break;
    case "help":
      InitHelpMsg();
      popChatSilent(helpTxt);
      break;
    case "showblacklist":
      popChatSilent("Your blacklist: #" + cursedConfig.blacklist.join(" #"));
      break;
    case "listsentences":
      popChatSilent("Here are your allowed targets -->" + cursedConfig.targets.map(target => `Command: ${target.ident} Ouputs: ${target.text}`).join("; - "));
      popChatSilent("Here are your allowed sentences -->" + cursedConfig.sentences.map(sentence => `Command: ${sentence.ident} Outputs: ${sentence.text}`).join("; - "));
      break;
    case "talk":
      const target = cursedConfig.targets.filter(t => t.ident == parameters[0])[0];
      const sentence = cursedConfig.sentences.filter(s => s.ident == parameters[1])[0];
      if (target && sentence) {
        popChatGlobal(sentence.text.replace("%target%", target.text).replace("%self%", cursedConfig.self), true);
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
        if (Player.MemberNumber == parameters[0]) {
          popChatSilent("You cannot own yourself.");
          return;
        }

        //Cannot remove real owner
        let realOwner = Player.Ownership ? Player.Ownership.MemberNumber : "";
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
        popChatSilent({ Tag: "GeneralInvalidArgs" });
      }
      break;
    case "mistress":
      if (cursedConfig.hasRestrainedPlay) {
        popChatSilent("Your owner disabled this command.");
        return;
      }
      if (parameters[0] && !isNaN(parameters[0])) {
        if (Player.MemberNumber == parameters[0]) {
          popChatSilent("You cannot be your own mistress.");
          return;
        }
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
        popChatSilent({ Tag: "GeneralInvalidArgs" });
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
        popChatSilent({ Tag: "GeneralInvalidArgs" });
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
      } else
        popChatSilent("Invalid command character: " + parameters.join(" "));
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
        popChatSilent("Chatroom ban list updated.", "System");
      } else {
        popChatSilent("Action invalid, you are not an admin.", "System");
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