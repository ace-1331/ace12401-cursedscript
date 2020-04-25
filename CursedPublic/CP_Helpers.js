//************************************  HELPERS ************************************//
//Pop a message, will not if player is not in a room
function popChatGlobal(actionTxt, isNormalTalk) { 
    //Save the old input to drastically reduce message cuts
    if (CurrentScreen == "ChatRoom") { 
        ServerSend("ChatRoomChat", { Content: isNormalTalk ? actionTxt : `*(${actionTxt})`, Type: isNormalTalk ? "Chat" : "Emote" });
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
function sendWhisper(target, msg, sendSelf, forceHide) { 
    if (!isNaN(target)) {
        ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: parseInt(target) });
        if (sendSelf) {
            popChatSilent(msg);
        } else if (cursedConfig.hasForward && !forceHide) { 
            popChatSilent("Whisper sent to #" + target + ": " + msg);
        }
    }
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
        CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
        cursedConfig.mustRefresh = true;
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

//Checks if an item can be worn and if it can be but is not, returns true
function itemIsAllowed(name, group) { 
    if (
        !(InventoryGet(Player, group)
        && InventoryGet(Player, group).Asset
        && InventoryGet(Player, group).Asset.Name == name)
    ) { 
        return Player.BlockItems.filter(it => it.Name == name && it.Group == group).length == 0;
    }
    return false;
}

// Card Deck
var cardDeck = [];

/*
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function shuffleDeck() { 
    cardDeck = [];
    const cardType = ["♥", "♦", "♠", "♣"];
    const cardNb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    cardType.forEach(t => {
        cardNb.forEach(nb => {
            cardDeck.push(t + nb);
        })
    });
    shuffle(cardDeck);
    shuffle(cardDeck);
    shuffle(cardDeck);
    popChatGlobal("The deck was shuffled because it was empty or requested by the dealer");
}

function drawCard() { 
    if (cardDeck.length == 0) shuffleDeck();
    return cardDeck.pop();
}

function drawCards(nbCards, players) { 
    //If no player was given, just draw X card to the current target
    players = players || [ChatRoomTargetMemberNumber.toString()];
    if (players[0] == null) {
        var drawnCards = [];
        for (let i = 0; i < nbCards; i++) {
            drawnCards.push(drawCard());
        }
        popChatGlobal("You drew the following cards: " + drawnCards.join(" "));
    } else { 
        for (let i = 0; i < nbCards; i++) {
            players.forEach(p => {
                sendWhisper(p, "(The following card was drawn: " + drawCard() + ")", true);
            });
        }
    }
}