/** Function to trigger commands intended for the official wearer's club owner, returns true if no command was executed */
function ClubOwnerCommands({ command, parameters, sender, commandCall }) {
  switch (command) {
    case "lockowner":
      if (!cursedConfig.hasIntenseVersion) {
        sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
        return;
      }
      if (!cursedConfig.isLockedOwner)
        SendChat("The curse keeps " + Player.Name + " from leaving her owner.");
      else
        SendChat("The curse allows " + Player.Name + " to break her collar.");
      cursedConfig.isLockedOwner = !cursedConfig.isLockedOwner;
      break;
    case "looseowner":
      if (!cursedConfig.isLooseOwner)
        sendWhisper(sender, "(Curse owners are now allowed to use built-in club rules. WARNING: These official built-in club rules are not tied to the curse, this means disabling the curse will not disable club rules like confiscating remotes, locks, or blocking wardrobe changes)", true);
      else
        sendWhisper(sender, "(Curse owners are no longer allowed to use built-in club rules.)", true);
      cursedConfig.isLooseOwner = !cursedConfig.isLooseOwner;
      break;
    case "locknewlover":
      if (!cursedConfig.hasIntenseVersion) {
        sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
        return;
      }
      if (cursedConfig.isLockedNewLover)
        sendWhisper(sender, "Can have new lovers.", true);
      else
        sendWhisper(sender, "Cannot have new lovers.", true);
      cursedConfig.isLockedNewLover = !cursedConfig.isLockedNewLover;
      break;
    case "locknewsub":
      if (!cursedConfig.hasIntenseVersion) {
        sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
        return;
      }
      if (cursedConfig.isLockedNewSub)
        sendWhisper(sender, "Can collar players again.", true);
      else
        sendWhisper(sender, "Cannot collar new submissives.", true);
      cursedConfig.isLockedNewSub = !cursedConfig.isLockedNewSub;
      break;
    case "ctitle":
      toggleTitle(sender, 4, parameters);
      break;
    case "cnickname":
      SetNickname(parameters, sender, 4);
      break;
    default:
    // No command found
      return true;
  }
}

