function AllCommands({
    command, sender, commandCall,  parameters
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
        case "help":
            sendWhisper(sender, `(To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. 
            Commands are called with ${commandCall}, like "${commandCall} respect")`);
            sendWhisper(sender, `(To learn all the commands or use it for yourself, check out this repository: https://github.com/ace-1331/ace12401-cursedscript/wiki/Functions )`);
            break;
        case "blocknickname":
            //Force delete self
            DeleteNickname([sender], sender, 4);
            break;
        case "readnote":
            let note;
            try { 
                note = localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`);
            } catch { console.log("Error reading note: RN05") }
            if (note) {
                sendWhisper(sender, "(A note is attached to her from her owner: " + localStorage.getItem(`bc-cursedNote-${Player.MemberNumber}`) + ")");
            }
            break;
    }
}