function PublicCommands({
    command, sender, commandCall, parameters, isOwner, isMistress
}) {
    switch (command) {
        case "punish":
            SendChat("The curse on " + Player.Name + " listens, growing angry has someone requests a punishment for the bad slave. " + Player.Name + " is  engulfed in pain as she gets spanked roughly multiple times.");
            triggerInPain();
            KneelAttempt();
            cursedConfig.strikes += 2;
            break;
        case "edge":
            SendChat("The curse on " + Player.Name + " listens, growing hungry for more moans. " + Player.Name + " gets drowned in lust as she is brought to her edge... left there for a while, unable to climax.");
            triggerInPleasure();
            KneelAttempt();
            break;
        case "respect":
            enforce(sender, false);
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
    }
}