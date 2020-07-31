/** Function to trigger commands intended for public (can be turned off), returns true if no command was executed */
function PublicCommands({
  command, sender, commandCall, parameters, isOwner, isMistress
}) {
  switch (command) {
    case "punish":
      SendChat({ Tag: "PublicPunish", Param: [FetchName(sender)] });
      triggerInPain();
      KneelAttempt();
      TriggerPunishment(5, [sender]);
      break;
    case "reward":
      SendChat({ Tag: "PublicReward", Param: [FetchName(sender)] });
      cursedConfig.strikes -= 2;
      break;
    case "edge":
      SendChat({ Tag: "PublicEdge", Param: [FetchName(sender)] });
      triggerInPleasure();
      KneelAttempt();
      break;
    case "respect":
      enforce(sender, 1);
      break;
    case "respectnickname": {
      forceNickname(sender, parameters);
      break;
    }
    case "title":
      toggleTitle(sender, 1, parameters);
      break;
    case "nickname":
      //Force update self
      SetNickname([sender, parameters], sender, 1);
      break;
    case "allownickname":
      DeleteNickname([sender], sender, 6);
      break;
    case "capture":
      if (cursedConfig.hasCaptureMode) {
        if (cursedConfig.capture.Valid < Date.now()) {
          cursedConfig.capture.capturedBy = sender;
          cursedConfig.capture.Valid = Date.now() + 300000;
          SendChat({ Tag: "PublicCaptureAction", Param: [FetchName(sender)] });
          sendWhisper(sender, { Tag: "PublicCaptureWhisper" }, true);
        } else if (cursedConfig.capture.capturedBy !== sender) {
          sendWhisper(sender, { Tag: "PublicCaptureSomeoneElse" }, true);
        } else {
          sendWhisper(sender, { Tag: "PublicCaptureAlready" }, true);
        }
      } else
        popChatSilent({ Tag: "PublicCaptureDisabled" });
      break;
    default:
      // No command found
      return true;
  }
}