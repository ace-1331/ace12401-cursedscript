//************************************ MESSAGE CHECKER ************************************//
/** Function to analyze a chatroom message and parse commands or apply certain rules to it */
function AnalyzeMessage(msg) {
    // Parse needed data
    var originalContent = msg.textContent.split("(")[0].trim();
    var textmsg = originalContent.toLowerCase();
    var types = msg.classList;
    var sender = msg.getAttribute("data-sender");
    var chatroomMembers = ChatRoomCharacter.map(el => el.MemberNumber.toString());
    var commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
    var isMistress = cursedConfig.mistresses.includes(sender.toString());
    var isOwner = cursedConfig.owners.includes(sender.toString());
    var isOnEntry = types.contains("ChatMessageEnterLeave") && sender == Player.MemberNumber;
    var isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress)

    //Ignores special types for compatibility or LARP
    if (types.contains("ChatMessageGlobal") || types.contains("ChatMessageLocalMessage")) {
        return;
    }

    // Clears whisper text
    if (sender == Player.MemberNumber && (types.contains("ChatMessageWhisper") || types.contains("ChatMessageChat"))) {
        textmsg = textmsg.split(":")
        textmsg.shift();
        textmsg = textmsg.join(":");
    }

    // Clears stuttering + * from emote and action
    textmsg = textmsg.replace(/[A-Za-z]-/g, "").replace(/^\*/g, "").replace(/\*$/g, "");

    // Checks if player should be kneeling
    if (
        (types.contains("ChatMessageEnterLeave") && cursedConfig.enforced.includes(sender) || isOnEntry && chatroomMembers.some( el => cursedConfig.enforced.includes(el)))
        && Player.CanKneel() 
        && (!Player.Pose.includes("Kneel") || !Player.Pose.includes("ForceKneel"))
    ) {
        checkKneeling(sender);
    }

    // Sends intro if the wearer has one
    if (
        isOnEntry && cursedConfig.hasEntryMsg && !cursedConfig.hasFullMuteChat
        && isActivated && !cursedConfig.isMute && !cursedConfig.hasSound
    ) {
        cursedConfig.say = cursedConfig.entryMsg;
        document.getElementById("InputChat").value = cursedConfig.entryMsg;
    }

    // Sends activated messages to an owner who enters or if the wearer entered
    if (types.contains("ChatMessageEnterLeave")) {
        if ((cursedConfig.owners.includes(sender) || cursedConfig.mistresses.includes(sender)) && chatroomMembers.includes(sender)) {
            sendWhisper(sender, "(The curse is active. Command call id: " + commandCall + ")");
        } 
        if (sender == Player.MemberNumber) {
            NotifyOwners("(The curse is active. Command call id: " + commandCall + ")")
            // Pop saved messages while outside of room
            popChatSilent();
            // Kneels if you have cursedcollar to prevent login issues
            if (cursedConfig.hasCursedKneel)
                KneelAttempt();
        }
    }

    // Checks for commands to change settings if able to
    if (
        (types.contains("ChatMessageChat") || types.contains("ChatMessageWhisper"))
        && textmsg.toLowerCase().indexOf(commandCall.toLowerCase()) != -1
        && cursedConfig.blacklist.indexOf(sender) == -1
        && Player.BlackList.filter( u => u == sender).length == 0
    ) {
        // Parses the command
        var command;
        var parameters;
        try {
            var commandString = textmsg.split(commandCall)[1];
            command = commandString.split(" ")[0];
            parameters = commandString.split(" ");
            parameters.shift();//THROWS HERE IF COMMAND IS BAD

            //Wearer only command
            if (sender == Player.MemberNumber) {
                //WearerCommands({ command, parameters, sender });
                //Quit loop to prevent wearer from doing the rest (can't add self as owner)
                return;
            }

            //Global warning to prevent spam if not the owner
            if (types.contains("ChatMessageChat")) {
                sendWhisper(sender, "--> Command cancelled. Please use commands in whispers to prevent spam.", true);
                return;
            }

            // Verifies owner for private commands
            if (isOwner) {
                OwnerCommands({ command, parameters, sender, commandCall });
            }

            //Verify mistress for private commands
            if (isMistress || isOwner || cursedConfig.hasFullPublic) {
                MistressCommands({ command, sender, parameters, isOwner });
            }

            // Checks if public has access or mistress can do all
            if (cursedConfig.hasPublicAccess || isMistress || isOwner) {
                PublicCommands({ command, sender, commandCall, parameters, isOwner, isMistress });
            } else {
                sendWhisper(sender, "(Public access is currently disabled.)")
            }
            
            //Perma commands for all
            AllCommands({ command, sender, commandCall, parameters });

        } catch (err) { console.log(err) }

    } else if (isActivated) {
        //Stuff that only applies to self
        if (sender == Player.MemberNumber) {
            //Mute
            if (cursedConfig.isMute && textmsg.length != 0 && types.contains("ChatMessageChat")) {
                SendChat(Player.Name + " angers the curse by speaking when she is not allowed to.");
                cursedConfig.strikes += 5;
            }
        }
    }
}
