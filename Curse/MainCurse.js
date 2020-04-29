//************************************ LOOP LOGIC ************************************//

//Verify function that applies the curses if needed
function CursedCheckUp() {
    //Gets the messages
    let messagesToVerify = [];

    //Run the script only in chatrooms
    if (CurrentScreen == "ChatRoom") {
        messagesToVerify = document.querySelectorAll('.ChatMessage:not([verified=true]');
        
        playerThing();
        
        //Verifies if a mistress is here
        if (cursedConfig.disaledOnMistress || cursedConfig.enabledOnMistress) {
            cursedConfig.mistressIsHere = false;
            [...cursedConfig.mistresses, ...cursedConfig.owners].forEach(miss =>
                ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(miss)
                    ? cursedConfig.mistressIsHere = true : ''
            );
        }

        //Verifies if an owner is here
        if (cursedConfig.enabledOnMistress) {
            cursedConfig.ownerIsHere = false;
            cursedConfig.owners.forEach(miss =>
                ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(miss)
                    ? cursedConfig.ownerIsHere = true : ''
            );
        }

        //Making sure all names are up-to-date
        //Try catch in case the updated player is no longer there (extreme edge case)
        try {
            //Save real name, restores if curse is not running
            ChatRoomCharacter.forEach(char => {
                let user = cursedConfig.nicknames.filter(c => c.Number == char.MemberNumber);
                if (user.length > 0) {
                    if (char.Name != user[0].Nickname && !user[0].SavedName) {
                        cursedConfig.nicknames.filter(c => c.Number == char.MemberNumber)[0].SavedName = char.Name;
                    }
                    char.Name = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && !cursedConfig.blacklist.includes(char.MemberNumber.toString()) && !Player.BlackList.includes(char.MemberNumber) && !Player.GhostList.includes(char.MemberNumber) ? user[0].Nickname : user[0].SavedName;
                }
            });
        } catch { console.log("failed to update a name") }

        //LARP Warn
        if (ChatRoomSpace == "LARP" && !cursedConfig.wasLARPWarned) {
            popChatSilent("LARP Room detected: the curse is inactive in this room");
            //Only pop the message once per LARP room, and reset the curse items when going back in a normal room 
            cursedConfig.wasLARPWarned = true;
            cursedConfig.onRestart = true;
        }

        //When it should be ran 
        if (ChatRoomSpace != "LARP") {
            //Running the normal curse
            if (!cursedConfig.onRestart) {
                cursedConfig.wasLARPWarned = false;

                //Triggers the function for unverified messages
                messagesToVerify.forEach(msg => {
                    AnalyzeMessage(msg);

                    // Marks message as verified
                    var verifiedAtt = document.createAttribute("verified");
                    verifiedAtt.value = "true";
                    msg.setAttributeNode(verifiedAtt);
                });

                //Runs only if something happened
                if (messagesToVerify.length > 0) {
                    // Appearance checks & punishment application outside of LARP
                    // Functions return true if something changed, so refresh or procs will notify with var
                    if (AppearanceCheck() || PunishmentCheck() || cursedConfig.mustRefresh) {
                        //Reloads Char
                        CharacterLoadEffect(Player);
                        ChatRoomCharacterUpdate(Player);
                        /*let before = cursedConfig.toUpdate.length;
                        cursedConfig.toUpdate = cursedConfig.toUpdate.filter((g, i) => cursedConfig.toUpdate.indexOf(g) === i);
                        if (before - cursedConfig.toUpdate.length > 0) {
                            popChatSilent("Warning: The curse tried to apply more than one curse to the same slot. You may have configuration issues. Please disable the curse if it's spamming. Error: WA01");
                        }
                        cursedConfig.toUpdate.forEach(group => {
                            ChatRoomCharacterItemUpdate(Player, group);
                        });*/
                        cursedConfig.mustRefresh = false;
                        cursedConfig.toUpdate = [];
                    }
                }
            }
            
            //Running the curse on restart for fairness
            if (cursedConfig.onRestart) {
                let oldLog = [...cursedConfig.chatlog];
                let oldStrikes = cursedConfig.strikes;
                //Process the required things
                if (AppearanceCheck() || cursedConfig.mustRefresh) {
                    //Reloads Char for free
                    CharacterLoadEffect(Player);
                    ChatRoomCharacterUpdate(Player);
                    /*let before = cursedConfig.toUpdate.length;
                    cursedConfig.toUpdate = cursedConfig.toUpdate.filter((g, i) => cursedConfig.toUpdate.indexOf(g) === i);
                    if (before - cursedConfig.toUpdate.length > 0) {
                        popChatSilent("Warning: The curse tried to apply more than one curse to the same slot. You may have configuration issues. Please disable the curse if it's spamming. Error: WA01");
                    }
                    cursedConfig.toUpdate.forEach(group => {
                        ChatRoomCharacterItemUpdate(Player, group);
                    });*/
                    cursedConfig.mustRefresh = false;
                    cursedConfig.toUpdate = [];
                    //Resumes as normal
                    cursedConfig.chatlog = oldLog;
                    cursedConfig.strikes = oldStrikes;
                    popChatSilent("Your current curses have been applied with no punishments.");
                }
                cursedConfig.onRestart = false;
            }
        }
    }

    // Saves if needed, strip not required data
    if (messagesToVerify.length > 0) {
        try {
            const dbConfigs = { ...cursedConfig };
            const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say"];
            toDelete.forEach(prop => delete dbConfigs[prop]);
            localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
        } catch { }
    }

    // Loops if activated
    if (cursedConfig.isRunning)
        setTimeout(CursedCheckUp, 1800);
}

// Chat sender queue loop
function ChatlogProcess() {
    playerThing();
    //Optimizes send times, removes fast dupes, keeps the order, does not work while restarting
    let purged = 0;
    if (cursedConfig.chatlog.length != 0 && !cursedConfig.onRestart) {
        let actionTxt = cursedConfig.chatlog.shift();
        let before = cursedConfig.chatlog.length;
        cursedConfig.chatlog = cursedConfig.chatlog.filter(el => el != actionTxt);
        purged = before - cursedConfig.chatlog.length;
        popChatGlobal(actionTxt);
        cursedConfig.chatStreak++;
    } else {
        cursedConfig.chatStreak = 0;
    }

    //Spam block 
    if (cursedConfig.chatStreak > 5 || purged > 3) {
        cursedConfig.isRunning = false;
        cursedConfig.chatlog = [];
        popChatSilent("ERROR S011: Spam detected, the curse sent too many messages too quickly, it has been disabled. Please correct the issue before re-enabling the script. If it was a bug, please contact Ace__#5558 on discord");
    }
    setTimeout(ChatlogProcess, 500);
}