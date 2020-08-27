/** Function to trigger commands intended for the official wearer's club owner, returns true if no command was executed */
function ClubOwnerCommands({ command, parameters, sender, commandCall }) {
  switch (command) {
    case "lockowner":
      if (!cursedConfig.isLockedOwner)
        SendChat({ Tag: "LockOwnerOn" });
      else
        SendChat({ Tag: "LockOwnerOff" });
      cursedConfig.isLockedOwner = !cursedConfig.isLockedOwner;
      break;
    case "looseowner":
      if (!cursedConfig.isLooseOwner)
        sendWhisper(sender, { Tag: "LooseOwnerOn" }, true);
      else
        sendWhisper(sender, { Tag: "LooseOwnerOff" }, true);
      cursedConfig.isLooseOwner = !cursedConfig.isLooseOwner;
      break;
    case "locknewlover":
      if (cursedConfig.isLockedNewLover)
        sendWhisper(sender, { Tag: "LockLoverOff" }, true);
      else
        sendWhisper(sender, { Tag: "LockLoverOn" }, true);
      cursedConfig.isLockedNewLover = !cursedConfig.isLockedNewLover;
      break;
    case "locknewsub":
      if (cursedConfig.isLockedNewSub)
        sendWhisper(sender, { Tag: "LockSubOff" }, true);
      else
        sendWhisper(sender, { Tag: "LockSubOn" }, true);
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

