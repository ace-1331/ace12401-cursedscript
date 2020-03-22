function PublicCommands(
    command, sender, commandCall, originalContent, textmsg, types, sender, chatroomMembers, commandCall, isMistress, isOwner, isOnEntry, isActivated, parameters
) { 
    switch (command) {
        case "help":
            sendWhisper(sender, `(To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. Commands are called with ${commandCall}, like "${commandCall} enforce on")`);
            break;
        case "asylumtimeleft":
            var oldLog = Log.filter(el => el.Name == "Committed");
            var timeLeft = oldLog.length > 0 ? oldLog[0].Value - CurrentTime : 0;
            timeLeft /= 6000000;
            SendChat(Player.Name + " has " +
                (timeLeft < 0 ? "0" : Math.round(timeLeft * 100) / 100) +
                " hours left in the asylum");
            break;
        case "punish":
            SendChat("The curse on " + Player.Name + " listens, growing angry has someone requests a punishment for the bad slave. " + Player.Name + " is  engulfed in pain as she gets spanked roughly multiple times.");
            triggerInPain();
            KneelAttempt();
            cursedConfig.strikes+=2;
            break;
        case "edge":
            SendChat("The curse on " + Player.Name + " listens, growing hungry for more moans. " + Player.Name + " gets drowned in lust as she is brought to her edge... left there for a while, unable to climax.");
            triggerInPleasure();
            KneelAttempt();
            break;
        case "enforce":
            if (parameters.length == 1)
                enforce(parameters, sender, false);
            break;
        default:
                cursedConfig.log.push("unknown public command:" + command);
            break;
    }
}