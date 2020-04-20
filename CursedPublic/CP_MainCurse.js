//************************************ LOOP LOGIC ************************************//

//Verify function that applies the curses if needed
function CursedCheckUp() {
    //Gets the messages
    var messagesToVerify = document.querySelectorAll('.ChatMessage:not([verified=true]');
    
    //Resets Strikes when it has been a week 
    if (cursedConfig.strikeStartTime + 604800000 < Date.now()) { 
        SendChat("The curse on " + Player.Name + " awakes, a new week has begun.");
        cursedConfig.strikeStartTime = Date.now();
        cursedConfig.strikes = 0;
    }
    
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
        
    //Triggers the function for unverified messages
    messagesToVerify.forEach(msg => {
        AnalyzeMessage(msg);
        
        // Marks message as verified
        var verifiedAtt = document.createAttribute("verified");
        verifiedAtt.value = "true";
        msg.setAttributeNode(verifiedAtt);
    });
    
    //Applies punishments for strikes
    if (cursedConfig.strikes > cursedConfig.lastPunishmentAmount + 10) { 
        //Restraints
        CharacterFullRandomRestrain(Player, "FEW");
        SendChat("The curse on " + Player.Name + " reminds her of her place.");
       /* 
        //Wardrobe for 6h at every 50
        if (
            Math.floor(cursedConfig.strikes / 50) > cursedConfig.lastWardrobeLock
        ) { 
            cursedConfig.lastWardrobeLock = Math.floor(cursedConfig.strikes / 30);
            //Add to existing time
            if (Log.filter(el => el.Name == "BlockChange").length > 0) {
                var currentVal = Log.filter(el => el.Name == "BlockChange")[0].Value;
                if (currentVal < Date.now()) { 
                    LogAdd("BlockChange", "OwnerRule", CurrentTime + 21600000);
                } else { 
                    Log.filter(el => el.Name == "BlockChange")[0].Value = currentVal + 21600000;
                }
            } else { 
                LogAdd("BlockChange", "OwnerRule", CurrentTime + 21600000);
            }
            //SendChat("The curse on " + Player.Name + " steals her wardrobe.");
        }*/
        cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
    }
    
    // Loops infinitely and Refreshes the character if needed
    if (messagesToVerify.length > 0 && CurrentScreen != "Appearance") {
        try { 
            localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(cursedConfig));
        } catch { }
        
        //Reloads Char
        ChatRoomCharacterUpdate(Player);
        CharacterLoadEffect(Player);
        ServerPlayerAppearanceSync();
        ServerPlayerLogSync();
    }
    
    if (cursedConfig.isRunning)
        setTimeout(CursedCheckUp, 2500);
}

// Chat sender queue loop
function ChatlogProcess() { 
    //Optimizes send times, removes fast dupes, keeps the order
    if (cursedConfig.chatlog.length != 0) { 
        var actionTxt = cursedConfig.chatlog.shift();
        cursedConfig.chatlog = cursedConfig.chatlog.filter(el => el != actionTxt);
        popChatGlobal(actionTxt);
    }
    setTimeout(ChatlogProcess, 500);
}