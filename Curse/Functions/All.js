/** Function to trigger commands intended for all, returns true if no command was executed */
function AllCommands({
    command, sender, commandCall, parameters
}) {
    switch (command) {
        case "asylumtimeleft":
            var oldLog = Log.filter(el => el.Name == "Committed");
            var timeLeft = oldLog.length > 0 ? oldLog[0].Value - CurrentTime : 0;
            timeLeft /= 3600000;
            SendChat(Player.Name + " has " +
                (timeLeft < 0 ? "0" : Math.round(timeLeft * 100) / 100) +
                " hours left in the asylum");
            break;
        case "help":{
            
            var isClubOwner = Player.Owner && Player.Ownership && (Player.Ownership.MemberNumber == sender);
            var isOwner = cursedConfig.owners.includes(sender.toString()) || isClubOwner;
            var isMistress = cursedConfig.mistresses.includes(sender.toString());

            HelpMsg(sender, isClubOwner, isOwner, isMistress);
        }
            break;
        case "blocknickname":
            //Force delete self
            DeleteNickname([sender], sender, 4);
            break;
        case "readnote":
            let note;
            try {
                note = localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`);
            } catch { console.error("Curse: Error reading note: RN05") }
            if (note) {
                sendWhisper(sender, "(A note is attached to her from her owner: " + localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`) + ")");
            }
            break;
        case "sendnote":
            let notes;
            try {
                notes = JSON.parse(localStorage.getItem(`bc-cursedReviews-${Player.MemberNumber}`)) || [];
                notes.push(FetchName(sender) + " (" + sender + "): " + parameters.join(" "));
                localStorage.setItem(`bc-cursedReviews-${Player.MemberNumber}`, JSON.stringify(notes));
            } catch (e){ console.error("Curse: Error sending notes: RS65", e) }
            sendWhisper(sender, "(Note sent to owner(s).)");
            break;
        default:
            // No command found
            return true;
    }
}
