//************************************ MESSAGE CHECKER ************************************//
function AnalyzeMessage(msg) {
    // Parse needed data
    var originalContent = msg.textContent.split("(")[0].trim();
    var textmsg = originalContent.toLowerCase();
    var types = msg.classList;
    var sender = msg.getAttribute("data-sender");
    var chatroomMembers = ChatRoomCharacter.map(el => el.MemberNumber.toString());
    var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    var isMistress = cursedConfig.mistresses.includes(sender);
    var isOwner = cursedConfig.owners.includes(sender);
    var isOnEntry = types.contains("ChatMessageEnterLeave") && sender == Player.MemberNumber;
    var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) ||  !cursedConfig.enabledOnMistress )
    
    // Clears whisper text
    if (sender == Player.MemberNumber && (types.contains("ChatMessageWhisper") || types.contains("ChatMessageChat"))) { 
        textmsg = textmsg.split(":")
        textmsg.shift();
        textmsg = textmsg.join(":");
    }
    
    // Clears stuttering
    textmsg = textmsg.replace(/[A-Za-z]-/g, "");
    
    // Checks if player should be kneeling
    if (
        types.contains("ChatMessageEnterLeave") && isOnEntry
        && sender != Player.MemberNumber && Player.CanKneel() && isActivated
    ) { 
        if (
            [...cursedConfig.enforced, ...cursedConfig.mistresses, ...cursedConfig.owners]
                .includes(sender)
        ) { 
            checkKneeling(sender);
        }
    }
    
    // Sends intro if the wearer has one
    if (isOnEntry && cursedConfig.hasEntryMsg && !cursedConfig.hasFullMuteChat && !cursedConfig.isMute && isActivated) { 
        cursedConfig.say = cursedConfig.entryMsg;
        document.getElementById("InputChat").value = cursedConfig.entryMsg;
    }
    
    // Sends activated messages to an owner who enters or if the wearer entered
    if (types.contains("ChatMessageEnterLeave")) { 
        if (cursedConfig.owners.includes(sender) && chatroomMembers.includes(sender)) { 
            sendWhisper(sender, "(The curse is active on me... and you are amongst my owners... use it wisely.)");
        }
        if (sender == Player.MemberNumber) { 
            chatroomMembers.forEach(el => { 
                if (cursedConfig.owners.includes(el)) { 
                    sendWhisper(el, "(The curse is active on me... and you are amongst my owners... use it wisely.)");
                } 
            })
        }
    }
    
    // Checks for commands to change settings if able to, self is not able to do it
    if (
        (types.contains("ChatMessageChat") || types.contains("ChatMessageWhisper"))
        && textmsg.toLowerCase().indexOf(commandCall.toLowerCase()) != -1
        && cursedConfig.blacklist.indexOf(sender) == -1
    ) {
        // Parses the command
        var command;
        var parameters;
        try {
            var commandString = textmsg.split(commandCall)[1];
            command = commandString.split(" ")[0];
            parameters = commandString.split(" ");
            parameters.shift();//THROWS HERE IF COMMAND IS BAD
            
            //Defaults to on
            if (parameters.length == 0)
                parameters.push("on");
            
            //Wearer only command
            if (sender == Player.MemberNumber) {
                WearerCommands(command);
                //Quit loop to prevent wearer from doing the rest (can't add self as owner)
                return;
            }
            
            // Verifies owner for private commands
            // Checks if public has access or mistress can do all
            if (isOwner) {
                OwnerCommands(command);
            }
            
            //Verify mistress for private commands
            if (isMistress || isOwner) {
                MistressCommands(command);
            }
            
            // Checks if public has access or mistress can do all
            if (cursedConfig.hasPublicAccess || isMistress || isOwner) {
                PublicCommands(command);
            }
        
        } catch (err) { console.log(err) }
        
    } else if ( isActivated ) {
        //Checks if settings are respected otherwise
        VerifyRestrictions();
    }
}
