function AllCommands({
    command, sender, commandCall,  parameters
}) { 
    switch (command) {
        case "help":
            sendWhisper(sender, `(To use the curse on me, ask me about the commands... there are more available depending on your permissions [blacklist, public, mistress, owner]. 
            Commands are called with ${commandCall}, like "${commandCall} enforce on")`);
            sendWhisper(sender, `(To learn all the commands or use it for yourself, check out this repository: https://github.com/ace-1331/ace12401-cursedscript/wiki/Functions )`);
            break;
        case "blocknickname":
            //Force delete self
            DeleteNickname([sender], sender, 4);
            break;
    }
}