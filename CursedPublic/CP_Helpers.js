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