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
    let difference = cursedConfig.strikes - cursedConfig.lastPunishmentAmount;
    let wasPunished = false;
    if (difference > 50 && !wasPunished) { 
        //Restraints
        if (InventoryGet(Player, "ItemMouth") == null) {
            InventoryAdd(Player, "PantyStuffing", "ItemMouth");
            InventoryAdd(Player, "HarnessBallGag", "ItemMouth2");
            InventoryAdd(Player, "SteelMuzzleGag", "ItemMouth3");
            InventoryWear(Player, "PantyStuffing", "ItemMouth", "#222222", 15);
            InventoryWear(Player, "HarnessBallGag", "ItemMouth2", "#222222", 15);
            InventoryWear(Player, "SteelMuzzleGag", "ItemMouth3", "#222222", 15);
            SendChat("The curse on " + Player.Name + " gags her.");
        }
        wasPunished = true;
        cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
    }
    if (difference > 40 && !wasPunished) { 
        //Restraints
        if (InventoryGet(Player, "ItemHead") == null) {
            InventoryAdd(Player, "FullBlindfold", "ItemHead");
            InventoryWear(Player, "FullBlindfold", "ItemHead", "#222222", 15);
            SendChat("The curse on " + Player.Name + " takes away her sight.");
        }
        wasPunished = true;
    }
    if (difference > 30 && !wasPunished) { 
        //Restraints
        if (InventoryGet(Player, "ItemArms") == null) {
            InventoryAdd(Player, "Chains", "ItemArms");
            InventoryWear(Player, "Chains", "ItemArms", "#222222", 15);
            SendChat("The curse on " + Player.Name + " restraints her arms.");
        }
        wasPunished = true;
    }
    if (difference > 20 && !wasPunished) { 
        //Restraints
        if (InventoryGet(Player, "ItemFeet") == null) {
            InventoryAdd(Player, "Chains", "ItemFeet");
            InventoryWear(Player, "Chains", "ItemFeet", "#222222", 15);
            SendChat("The curse on " + Player.Name + " restrains her feet.");
        }
        wasPunished = true;
    }
    if (difference > 10 && !wasPunished) { 
        //Restraints
        if (InventoryGet(Player, "ItemLegs") == null) {
            InventoryAdd(Player, "Chains", "ItemLegs");
            InventoryWear(Player, "Chains", "ItemLegs", "#222222", 15);
            SendChat("The curse on " + Player.Name + " restrains her legs.");
        }
        wasPunished = true;
    }
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
            SendChat("The curse on " + Player.Name + " steals her wardrobe.");
        }
        cursedConfig.lastPunishmentAmount = cursedConfig.strikes;
    }
    */
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