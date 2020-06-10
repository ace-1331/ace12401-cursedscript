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

