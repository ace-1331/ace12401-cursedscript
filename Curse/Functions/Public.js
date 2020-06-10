/** Function to trigger commands intended for public (can be turned off), returns true if no command was executed */
function PublicCommands({
    command, sender, commandCall, parameters, isOwner, isMistress
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
            enforce(sender, 1);
            break;
        case "respectnickname": {
            forceNickname(sender);
        }
        case "title":
            toggleTitle(sender, 1, parameters);
            break;
        case "nickname":
            //Force update self
            SetNickname([sender, parameters], sender, 1);
            break;
        case "allownickname":
            DeleteNickname([sender], sender, 5);
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