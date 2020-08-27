/** Function to trigger commands intended for the custom list, returns true if no command was executed */
function CustomCommands({ command, parameters, sender, commandCall }) {
  switch (command) {
    case "whisperforward":
      if (!cursedConfig.customWhisperForward)
        sendWhisper(sender, "Whispers will be forwarded", true);
      else
        sendWhisper(sender, "Whispers will no longer be forwarded", true);
      cursedConfig.customWhisperForward = !cursedConfig.customWhisperForward;
      break;
    case "approveleave":
      if (!cursedConfig.customApproveLeave)
        sendWhisper(sender, "Needs approval before leaving", true);
      else
        sendWhisper(sender, "No longer needs approval before leaving", true);
      cursedConfig.customApproveLeave = !cursedConfig.customApproveLeave;
      break;
    case "approvelists":
      if (!cursedConfig.customApproveLists)
        sendWhisper(sender, "No longer has control of her whitelist and friends", true);
      else
        sendWhisper(sender, "Now has control of her whitelist and friends", true);
      cursedConfig.customApproveLists = !cursedConfig.customApproveLists;
      break;
    case "lockwhitelist":
      if (!cursedConfig.customLockPerms)
        sendWhisper(sender, "Locked on whitelist", true);
      else
        sendWhisper(sender, "Permissions are opened", true);
      cursedConfig.customLockPerms = !cursedConfig.customLockPerms;
      break;
    case "allowleave":
      cursedConfig.customCanLeave = Date.now();
      SendChat(FetchName(sender) + " allows " + Player.Name + " to leave.");
      sendWhisper(sender, "Can leave within the next 20 seconds.", true);
      break;
  default:
    // No command found
      return true;
  }
}