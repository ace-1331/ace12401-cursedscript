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
        cursedConfig.lastPunishmentAmount = 0;
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
    
    //Appearance checks & punishment application 
    // Functions return true if something changed, so refresh or procs will notify with var
    if (AppearanceCheck() || PunishmentCheck() || cursedConfig.mustRefresh) {
        //Reloads Char
        ChatRoomCharacterUpdate(Player);
        CharacterLoadEffect(Player);
        ServerPlayerAppearanceSync();
        cursedConfig.mustRefresh = false;
    }
    
    // Saves if needed, strip not required data
    if (messagesToVerify.length > 0) {
        try { 
            const dbConfigs = { ...cursedConfig };
            delete dbConfigs.chatStreak;
            delete dbConfigs.chatlog;
            delete dbConfigs.mustRefresh;
            delete dbConfigs.isRunning;
            delete dbConfigs.wasLARPWarned;
            delete dbConfigs.ownerIsHere;
            delete dbConfigs.mistressIsHere;
            localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
        } catch { }
    }
    
    // Loops if activated
    if (cursedConfig.isRunning)
        setTimeout(CursedCheckUp, 1800);
}

// Chat sender queue loop
function ChatlogProcess() { 
    //Optimizes send times, removes fast dupes, keeps the order
    if (cursedConfig.chatlog.length != 0) {
        var actionTxt = cursedConfig.chatlog.shift();
        cursedConfig.chatlog = cursedConfig.chatlog.filter(el => el != actionTxt);
        popChatGlobal(actionTxt);
        cursedConfig.chatStreak++;
    } else { 
        cursedConfig.chatStreak = 0;
    }
    
    //Spam block 
    if (cursedConfig.chatStreak > 5) { 
        cursedConfig.isRunning = false;
        popChatSilent("WARNING: Spam detected, the curse sent too many messages too quickly, it has been disabled. Please correct the issue before re-enabling the script. If it was a bug, please contact Ace__#5558 on discord");
    }
    setTimeout(ChatlogProcess, 500);
}