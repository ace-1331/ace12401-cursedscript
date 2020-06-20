//************************************ MESSAGE CHECKER ************************************//
/** Function to analyze a chatroom message and parse commands or apply certain rules to it */
function AnalyzeMessage(msg) {
  // Parse needed data
  let originalContent = msg.textContent.split("(")[0].trim();
  let textmsg = originalContent.toLowerCase();
  let types = msg.classList;
  let sender = msg.getAttribute("data-sender");
  let chatroomMembers = ChatRoomCharacter.map(el => el.MemberNumber.toString());
  let commandCall = (cursedConfig.commandChar + cursedConfig.slaveIdentifier + " ").toLowerCase();
  let isMistress = cursedConfig.mistresses.includes(sender.toString());
  let isClubOwner = Player.Owner && Player.Ownership && (Player.Ownership.MemberNumber == sender);
  let isOwner = cursedConfig.owners.includes(sender.toString()) || isClubOwner;
  let isOnEntry = types.contains("ChatMessageEnterLeave") && sender == Player.MemberNumber;
  let isActivated = !(cursedConfig.mistressIsHere && cursedConfig.disaledOnMistress)
        && ((cursedConfig.enabledOnMistress && cursedConfig.ownerIsHere) || !cursedConfig.enabledOnMistress);

  //Ignores special types for compatibility or LARP
  if (types.contains("ChatMessageGlobal") || types.contains("ChatMessageLocalMessage")) {
    return;
  }

  // Clears whisper text
  if (sender == Player.MemberNumber && (types.contains("ChatMessageWhisper") || types.contains("ChatMessageChat"))) {
    textmsg = textmsg.split(":");
    textmsg.shift();
    textmsg = textmsg.join(":");
  }

  // Clears stuttering + * from emote and action
  textmsg = textmsg.replace(/[A-Za-z]-/g, "").replace(/^\*/g, "").replace(/\*$/g, "");

  // Checks if player should be kneeling
  if (
    (types.contains("ChatMessageEnterLeave") && cursedConfig.charData.some(u => u.Number == sender && u.isEnforced ) || isOnEntry && chatroomMembers.some( el => cursedConfig.charData.some(u => u.Number == el && u.isEnforced )))
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
    //Warn only if the player is not aware
    if ((cursedConfig.owners.includes(sender) || cursedConfig.mistresses.includes(sender)) && chatroomMembers.includes(sender) && !cursedConfig.warned.includes(sender)) {
      sendWhisper(sender, "(The curse is active. Command call id: " + commandCall + ")");
      cursedConfig.warned.push(sender);
    } 
    if (sender == Player.MemberNumber) {
      NotifyOwners("(The curse is active. Command call id: " + commandCall + ")");
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
    let command;
    let parameters;
    try {
      let commandString = textmsg.split(commandCall)[1];
      command = commandString.split(" ")[0];
      parameters = commandString.split(" ");
      parameters.shift();//THROWS HERE IF COMMAND IS BAD

      //Wearer only command
      if (sender == Player.MemberNumber) {
        //Quit loop to prevent wearer from doing the rest (can't add self as owner)
        return;
      }

      //Global warning to prevent spam.
      if (types.contains("ChatMessageChat")) {
        sendWhisper(sender, "--> Command cancelled. Please use commands in whispers to prevent spam.", true);
        return;
      }

      let needWarning = true;
            
      /* Will not cascade if a command was already found */
            
      // Verifies club owner commands
      if (isClubOwner && needWarning) {
        needWarning = ClubOwnerCommands({ command, parameters, sender, commandCall });
      }
            
      if (isOwner && needWarning) {
        needWarning = PrivateCommands({ command, parameters, sender });
      }
            
      // Verifies owner for private commands
      if (isOwner && needWarning) {
        needWarning = OwnerCommands({ command, parameters, sender, commandCall, isClubOwner });
      }

      //Verify mistress for private commands
      if ((isMistress || isOwner || cursedConfig.hasFullPublic) && needWarning) {
        needWarning = MistressCommands({ command, sender, parameters, isOwner, isClubOwner });
      }
            
      // Checks if public has access or mistress can do all
      if ((cursedConfig.hasPublicAccess || isMistress || isOwner) && needWarning) {
        needWarning = PublicCommands({ command, sender, commandCall, parameters, isClubOwner, isOwner, isMistress });
      }
            
      //Perma commands for all
      if (needWarning) {
        needWarning = AllCommands({ command, sender, commandCall, parameters });
      }
            
      //Warn an attempt was made but no command was found
      if (needWarning) {
        sendWhisper(sender, `(Invalid command: A command was possibly requested, but no matching command was found. Check for typos , or verify your version number and curse settings. Info about the person who sent the command: Club owner: ${isClubOwner ? "Yes" : "No"}, Curse owner: ${isOwner ? "Yes" : "No"}, Mistress: ${isOwner || isMistress ? "Yes" : "No"}, Public access: ${cursedConfig.hasPublicAccess ? "Yes" : "No"}, Full public access: ${cursedConfig.hasFullPublic ? "Yes" : "No"})`, true);
      } else if (cursedConfig.isEatingCommands) { 
        msg.style.display = "none";
      }
                
    } catch (err) { console.error("Curse: " + err); }

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
