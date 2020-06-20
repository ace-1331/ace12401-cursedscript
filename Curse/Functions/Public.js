/** Function to trigger commands intended for public (can be turned off), returns true if no command was executed */
function PublicCommands({
  command, sender, commandCall, parameters, isClubOwner, isOwner, isMistress
}) {
  switch (command) {
    case "punish":
      SendChat(`The curse on ${Player.Name} punishes her as requested by ${FetchName(sender)}.`);
      triggerInPain();
      KneelAttempt();
      cursedConfig.strikes += 2;
      break;
    case "edge":
      SendChat(`The curse on ${Player.Name} edges her as requested by ${FetchName(sender)}.`);
      triggerInPleasure();
      KneelAttempt();
      break;
    case "respect":
          enforce(sender, 1, parameters);
      break;
    case "respectnickname": {
      forceNickname(sender, parameters);
      break;
    }
    case "title":
      toggleTitle(sender, 1, parameters);
      break;
      case "cleartitles":{
        let priority = isClubOwner ? 4 : isOwner ? 3 : isMistress ? 2 : 1;
        let target = (!isNaN(parameters[0]) && parameters[0] != "" ) ? parameters[0] : sender
        let known = cursedConfig.charData.find(t => target == t.Number);
        if(known && priority >= known.TPriority){
          known.Titles = [];
          known.TPriority = 0;
          if(!known.RespectNickname)
          known.isEnforced = false;
          sendWhisper(sender, "All titles for " + FetchName(target) + " have been cleared.", true);
          if (known.Titles.length == 0 && known.NPriority != 5 && !known.Nickname) {
            cursedConfig.charData = cursedConfig.charData.filter(u => u.Number != target);
          }
        }
        break;
      }
    case "nickname":
    //Force update self
      SetNickname(parameters, sender, 1);
      break;
    case "allownickname":
      DeleteNickname([sender], sender, 6);
      break;
    case "capture":
      if (!cursedConfig.hasIntenseVersion) {
        sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
        return;
      }
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