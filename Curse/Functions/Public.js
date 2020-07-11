/** Function to trigger commands intended for public (can be turned off), returns true if no command was executed */
function PublicCommands({
  command, sender, commandCall, parameters, isOwner, isMistress
}) {
  switch (command) {
    case "punish":
      SendChat(`The curse on ${Player.Name} punishes her as requested by ${FetchName(sender)}.`);
      triggerInPain();
      KneelAttempt();
      TriggerPunishment(5, [sender]);
      break;
    case "reward":
      SendChat(`The curse on ${Player.Name} rewards her as requested by ${FetchName(sender)}.`);
      cursedConfig.strikes -= 2;
      break;
    case "edge":
      SendChat(`The curse on ${Player.Name} edges her as requested by ${FetchName(sender)}.`);
      triggerInPleasure();
      KneelAttempt();
      break;
      case "respect":
        enforce(sender);
        break;
      case "selftitle":
        addTitle(sender, false, [sender, parameters]);
        break;
      case "deletetitle": 
        ((isMistress || isOwner) && parameters.length > 0) ? deleteTitle(sender, true, parameters) : deleteTitle(sender);
        break;
      case "namechange":
        SetNickname(sender, false, [sender, parameters]);
        break;
      case "deletenickname": 
            ((isMistress || isOwner) && parameters.length > 0) ? DeleteNickname(sender, true, parameters) : DeleteNickname(sender);
        break;
    case "capture":
      if (cursedConfig.hasCaptureMode) {
        if (cursedConfig.capture.Valid < Date.now()) {
          cursedConfig.capture.capturedBy = sender;
          cursedConfig.capture.Valid = Date.now() + 300000;
          SendChat(Player.Name + " was captured by " + FetchName(sender));
          sendWhisper(sender, "For the next 5 minutes, the wearer is unable to leave a room and can be brought into any given room by beeping them.", true);
        } else if (cursedConfig.capture.capturedBy !== sender) {
          sendWhisper(sender, "Someone else has captured the wearer in the past 5 minutes, try again later.", true);
        } else {
          sendWhisper(sender, "You have already captured the wearer.", true);
        }
      } else
        popChatSilent("Capture mode disabled.");
      break;
    default:
      // No command found
      return true;
  }
}