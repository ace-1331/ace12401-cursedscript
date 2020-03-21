//************************************  HELPERS ************************************//
//Pop a message, will not if player is not in a room
function popChatGlobal(actionTxt, isNormalTalk) { 
    //Save the old input to drastically reduce message cuts
    if (CurrentScreen == "ChatRoom") { 
        var previousInput = document.getElementById("InputChat").value;
        document.getElementById("InputChat")
            .value = isNormalTalk ? actionTxt : "**(" + actionTxt + ")";
        ChatRoomSendChat();
        document.getElementById("InputChat").value = previousInput;
    } 
}

function popChatSilent(actionTxt) { 
    //Directly sends to wearer
    var div = document.createElement("div");
    div.setAttribute('class', 'ChatMessage ChatMessageEmote');
    div.setAttribute('data-time', ChatRoomCurrentTime());
    div.setAttribute('data-sender', Player.MemberNumber);
    div.setAttribute('verifed', "true");
    div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(Player.LabelColor) + ';');
    div.innerHTML = "SILENT: *" + actionTxt + "*";

    var Refocus = document.activeElement.id == "InputChat";
    var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
    if (document.getElementById("TextAreaChatLog") != null) {
        document.getElementById("TextAreaChatLog").appendChild(div);
        if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
        if (Refocus) ElementFocus("InputChat");
    }
}

//Send a whisper
function sendWhisper(target, msg) { 
    var oldTarget = ChatRoomTargetMemberNumber;
    ChatRoomTargetMemberNumber = parseInt(target);
    popChatGlobal(msg, true);
    ChatRoomTargetMemberNumber = oldTarget;
}

//Sends a chat message
function SendChat(actionTxt) {
    //Does not send chat if in silent mode
    if (!cursedConfig.isSilent) {
        //Add to queue
        cursedConfig.chatlog.push(actionTxt);
    } else { 
        popChatSilent(actionTxt);
    }
}

//Tries to kneel
function KneelAttempt() { 
    if (Player.CanKneel() && !Player.Pose.includes("Kneel")) { 
        CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel":null);
    }
}

//Common Expression Triggers
function triggerInPain() { 
    CharacterSetFacialExpression(Player, "Blush", "High");
    CharacterSetFacialExpression(Player, "Eyebrows", "Soft");
    CharacterSetFacialExpression(Player, "Fluids", "TearsHigh");
    CharacterSetFacialExpression(Player, "Mouth", "Sad");
    CharacterSetFacialExpression(Player, "Eyes", "Closed", 5); 
}

function triggerInPleasure() {
    CharacterSetFacialExpression(Player, "Blush", "High");
    CharacterSetFacialExpression(Player, "Eyebrows", "Soft");
    CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");
    CharacterSetFacialExpression(Player, "Mouth", "Ahegao");
    CharacterSetFacialExpression(Player, "Eyes", "VeryLewd");  
}

//Export/Import configs
function cursedImport(curseSaveFile) { 
    cursedConfig = JSON.parse(curseSaveFile);
}

function cursedExport() { 
    return JSON.stringify(cursedConfig);
}

//Enforces someone
function enforce(parameters, sender, isMistress) { 
    if (parameters.includes("on")) {
        if (!cursedConfig.enforced.includes(sender)) {
            cursedConfig.enforced.push(sender);
            SendChat(Player.Name + " now has enforced protocols on #" + sender + (isMistress ? " has requested by her owner": "."));
        }
    } else if (parameters.includes("off")) {
        if (cursedConfig.enforced.includes(sender)) {
            cursedConfig.enforced.splice(cursedConfig.enforced.indexOf(sender), 1)
            SendChat(Player.Name + " no longer has enforced protocols on #" + sender + (isMistress ? " has requested by her owner": "."));
        }
    }
}

//************************************  Curse Activations ************************************//
function itemIsAllowed(name, group) { 
    return Player.BlockItems.filter(it => it.Name == name && it.Group == group).length == 0;
}

function procGenericItem(item, group) { 
    //Makes sure the player has the items
    InventoryAdd(Player, item, group);
    InventoryWear(Player, item, group);
}

function procCursedNaked() { 
    InventoryRemove(Player, "Cloth");
    InventoryRemove(Player, "ClothLower");
    InventoryRemove(Player, "ClothAccessory");
    InventoryRemove(Player, "Suit");
    InventoryRemove(Player, "SuitLower");
    InventoryRemove(Player, "Bra");
    InventoryRemove(Player, "Panties");
    InventoryRemove(Player, "Socks");
    InventoryRemove(Player, "Shoes");
    InventoryRemove(Player, "Hat");
    InventoryRemove(Player, "Gloves");
}

function procCursedOrgasm() {
    //Makes sure the player has the items
    InventoryAdd(Player, "InflVibeButtPlug", "ItemButt");
    InventoryAdd(Player, "InflatableVibeDildo", "ItemVulva");
    InventoryAdd(Player, "TapedVibeEggs", "ItemNipples");
    InventoryAdd(Player, "VibeHeartClitPiercing", "ItemVulvaPiercings");
    InventoryAdd(Player, "VibeHeartPiercings", "ItemNipplesPiercings");
    
    //Wears the vibe
    if (!InventoryGet(Player, "ItemButt"))
        InventoryWear(Player, "InflVibeButtPlug", "ItemButt");
    if (!InventoryGet(Player, "ItemVulva"))
        InventoryWear(Player, "InflatableVibeDildo", "ItemVulva");
    if (!InventoryGet(Player, "ItemNipples"))
        InventoryWear(Player, "TapedVibeEggs", "ItemNipples");
    if (!InventoryGet(Player, "ItemVulvaPiercings"))
        InventoryWear(Player, "VibeHeartClitPiercing", "ItemVulvaPiercings");
    if (!InventoryGet(Player, "ItemNipplesPiercings"))
        InventoryWear(Player, "VibeHeartPiercings", "ItemNipplesPiercings");
    
    //Turns them to max
    if (InventoryGet(Player, "ItemButt").Asset.Name == "InflVibeButtPlug") { 
        InventoryGet(Player, "ItemButt").Property = {};
        InventoryGet(Player, "ItemButt").Property.Intensity = 4;
        InventoryGet(Player, "ItemButt").Property.InflateLevel = 4;
        InventoryGet(Player, "ItemButt").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemVulva").Asset.Name == "InflatableVibeDildo") { 
        InventoryGet(Player, "ItemVulva").Property = {};
        InventoryGet(Player, "ItemVulva").Property.Intensity = 4;
        InventoryGet(Player, "ItemVulva").Property.InflateLevel = 4;
        InventoryGet(Player, "ItemVulva").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemNipples").Asset.Name == "TapedVibeEggs") { 
        InventoryGet(Player, "ItemNipples").Property = {};
        InventoryGet(Player, "ItemNipples").Property.Intensity = 4;
        InventoryGet(Player, "ItemNipples").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemVulvaPiercings").Asset.Name == "VibeHeartClitPiercing") { 
        InventoryGet(Player, "ItemVulvaPiercings").Property = {};
        InventoryGet(Player, "ItemVulvaPiercings").Property.Intensity = 4;
        InventoryGet(Player, "ItemVulvaPiercings").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemNipplesPiercings").Asset.Name == "VibeHeartPiercings") { 
        InventoryGet(Player, "ItemNipplesPiercings").Property = {};
        InventoryGet(Player, "ItemNipplesPiercings").Property.Intensity = 4;
        InventoryGet(Player, "ItemNipplesPiercings").Property.Effect = ["Egged", "Vibrating"];
    }
}

function procCursedLatex() {
    //Makes sure the player has the items
    InventoryAdd(Player, "Catsuit", "Suit");
    InventoryAdd(Player, "Catsuit", "SuitLower");
    InventoryAdd(Player, "Catsuit", "Gloves");
    
    //Wears the suit
    InventoryWear(Player, "Catsuit", "Suit", "#1C1A1A");
    InventoryWear(Player, "Catsuit", "SuitLower", "#1C1A1A");
    InventoryWear(Player, "Catsuit", "Gloves", "#1C1A1A");
}

async function checkKneeling(sender) { 
    // Kneel on enforced
    var startDate = Date.now();
    popChatSilent(" Reminder: Kneeling when #" + sender + " enters is required.");
    while (Date.now() < startDate + 30000) { 
        if (Player.Pose.includes("Kneel") || Player.Pose.includes("ForceKneel")) { 
            return;
        }
        await new Promise(r => setTimeout(r, 2000));
    }
    if (ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)) { 
        SendChat(Player.Name + " angers the curse on her as she forgets to kneel.");
        popChatSilent("Kneeling when #" + sender + " enters is required.");
        cursedConfig.strikes += 5;
        KneelAttempt();
    }
}