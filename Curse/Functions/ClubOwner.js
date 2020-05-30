/** Function to trigger commands intended for the official wearer's club owner, returns true if no command was executed */
function ClubOwnerCommands({ command, parameters, sender, commandCall }) {
    switch (command) {
        case "lockowner":
            if (!cursedConfig.hasIntenseVersion) {
                sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
                return;
            }
            if (!cursedConfig.isLockedOwner)
                SendChat("The curse keeps " + Player.Name + " from leaving their owner.");
            else
                SendChat("The curse allows " + Player.Name + " to break their collar.");
            cursedConfig.isLockedOwner = !cursedConfig.isLockedOwner;
            break;
        default:
            // No command found
            return true;
    }
}