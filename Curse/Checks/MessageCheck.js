//************************************ MESSAGE CHECKER ************************************//
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
        types.contains("ChatMessageEnterLeave") && isOnEntry
        && sender != Player.MemberNumber && Player.CanKneel() && isActivated
    ) {
        if (
            [...cursedConfig.enforced, ...cursedConfig.mistresses, ...cursedConfig.owners]
                .includes(sender + "")
        ) {
            checkKneeling(sender);
        }
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
        if (cursedConfig.owners.includes(sender) && chatroomMembers.includes(sender)) {
            sendWhisper(sender, "(The curse is active. Command call id: " + commandCall + ")");
        }
        if (sender == Player.MemberNumber) {
            chatroomMembers.forEach(el => {
                if (cursedConfig.owners.includes(el)) {
                    sendWhisper(el, "(The curse is active. Command call id: " + commandCall + ")");
                }
            });
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
                WearerCommands({ command, parameters, sender });
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
                OwnerCommands({ command, parameters, sender });
            }

            //Verify mistress for private commands
            if (isMistress || isOwner) {
                MistressCommands({ command, sender, parameters, isOwner });
            }

            // Checks if public has access or mistress can do all
            if (cursedConfig.hasPublicAccess || isMistress || isOwner) {
                PublicCommands({ command, sender, commandCall, parameters, isOwner, isMistress });
            }
            
            //Perma commands for all
            AllCommands({ command, sender, commandCall, parameters });

        } catch (err) { console.log(err) }

    } else if (isActivated) {
        //Checks if message settings are respected otherwise

        //Stuff that only applies to self
        if (sender == Player.MemberNumber) {
            //Reinforcement
            cursedConfig.enforced.forEach(memberNumber => {
                if (ChatRoomCharacter.map(el => el.MemberNumber.toString()).includes(memberNumber) && textmsg.indexOf("silent: *") == -1) {
                    var Name = ChatRoomCharacter
                        .map(el => { return { MemberNumber: el.MemberNumber, Name: el.Name } })
                        .filter(el => el.MemberNumber == memberNumber)[0].Name;
                    var requiredName = ['miss', 'mistress', 'goddess', 'owner']
                        .map(el => el + " " + Name.toLowerCase());
                    var matches = [...textmsg
                        .matchAll(new RegExp("\\b(" + Name.toLowerCase() + ")\\b", 'g'))
                    ];
                    if (!matches) matches = [];
                    var goodMatches = [];
                    requiredName.forEach(rn =>
                        goodMatches.push(...textmsg.matchAll(new RegExp(rn, 'g')))
                    );
                    if (matches.length > goodMatches.length) {
                        SendChat(Player.Name + " angers the curse on her with her lack of respect.");
                        popChatSilent("Respecting " + memberNumber + " is required.");
                        cursedConfig.strikes += 7;
                    }
                }
            });

            //Mute
            if (cursedConfig.isMute && textmsg.length != 0 && types.contains("ChatMessageChat")) {
                SendChat(Player.Name + " angers the curse by speaking when she is not allowed to.");
                cursedConfig.strikes += 5;
            }

            //Should say
            if (cursedConfig.say != "" && types.contains("ChatMessageChat") && !cursedConfig.hasFullMuteChat) {
                if (
                    textmsg.trim() != cursedConfig.say.toLowerCase().trim()
                    && Player.Effect.filter(ef => ef.indexOf("Gag") != -1).length == 0
                ) {
                    popChatSilent("You were punished for not saying the expected sentence willingly: " + cursedConfig.say);
                    document.getElementById("InputChat").value = cursedConfig.say;
                    cursedConfig.strikes += 2;
                } else {
                    cursedConfig.say = "";
                }
            }

            //Cursed Speech
            if (
                cursedConfig.hasCursedSpeech
                && textmsg.indexOf("silent: *") == -1
                && (!types.contains("ChatMessageChat") || Player.Effect.filter(E => E.indexOf("Gag") != -1).length == 0)
            ) {
                let badWords = cursedConfig.bannedWords.filter(word => (
                    textmsg.toLowerCase().replace(/(\.)|(-)/g, "").replace(/(')|(,)|(~)|(")|(!)|(\?)/g, " ").match(/[^\s]+/g) || []).includes(word.toLowerCase()
                    ));

                if (badWords.length != 0) {
                    SendChat(Player.Name + " angers the curse on her.");
                    popChatSilent("Bad girl. Bad word(s) used: " + badWords.join(", "));
                    cursedConfig.strikes += 5;
                }
            }

            //Cursed Sound
            if (
                cursedConfig.hasSound
                && cursedConfig.hasIntenseVersion
                && textmsg.indexOf("silent: *") == -1
                && textmsg.toLowerCase().replace(/(\.)|(-)|(')|(,)|(~)|(!)|(\?)/g, " ").split(" ")
                    .filter(w => {
                        return !(new RegExp("^" + cursedConfig.sound.split("").map(el => el + "*").join("") + "$", "g")).test(w);
                    }).length > 0
                && types.contains("ChatMessageChat")
                && Player.Effect.filter(E => E.indexOf("Gag") != -1).length == 0
            ) {
                SendChat(Player.Name + " angers the curse on her.");
                popChatSilent("Bad girl. You made unallowed sounds. (allowed sound: " + cursedConfig.sound + ")");
                cursedConfig.strikes++;
            }
        }
    }
}
