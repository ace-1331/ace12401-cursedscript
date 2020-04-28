//************************************  HELPERS ************************************//
//Pop a message, will not if player is not in a room
function popChatGlobal(actionTxt, isNormalTalk) {
    if (actionTxt.length > 1000) {
        actionTxt = actionTxt.substring(0, 1000);
        cursedConfig.hadOverflowMsg = true;
        popChatSilent("(The curse tried to send a message longer than 1000 characters which the server cannot handle. Please watch your configurations to prevent this from happening. The message was trimmed. Error: C01)");
    }
    
    if (CurrentScreen == "ChatRoom" && actionTxt != "") {
        if (isNormalTalk) {
            ServerSend("ChatRoomChat", { Content: actionTxt, Type: "Chat" });
        } else {
            ServerSend("ChatRoomChat", {
                Content: "Beep", Type: "Action", Dictionary: [
                    { Tag: "Beep", Text: "msg" },
                    { Tag: "Biep", Text: "msg" },
                    { Tag: "Sonner", Text: "msg" },
                    { Tag: "msg", Text: actionTxt }]
            });
        }
    }
}

function popChatSilent(actionTxt) {
    //Add to log
    if (!window.savedSilent) window.savedSilent = [];
    if (actionTxt) window.savedSilent.push(actionTxt);

    //Save in log until player is in a room
    if (CurrentScreen != "ChatRoom") {
        return
    }

    //Removes dupes
    window.savedSilent = window.savedSilent.filter((m, i) => window.savedSilent.indexOf(m) === i);

    //Sends messages
    window.savedSilent.forEach(silentMsg => {
        //Directly sends to wearer
        var div = document.createElement("div");
        div.setAttribute('class', 'ChatMessage ChatMessageEmote');
        div.setAttribute('data-time', ChatRoomCurrentTime());
        div.setAttribute('data-sender', Player.MemberNumber);
        div.setAttribute('verifed', "true");
        div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(Player.LabelColor) + ';');
        div.innerHTML = "SILENT: *" + silentMsg + "*";

        //Refocus the chat to the bottom
        var Refocus = document.activeElement.id == "InputChat";
        var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
        if (document.getElementById("TextAreaChatLog") != null) {
            document.getElementById("TextAreaChatLog").appendChild(div);
            if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
            if (Refocus) ElementFocus("InputChat");
        }
    });

    //Clears log
    window.savedSilent = [];
}

//Send a whisper
function sendWhisper(target, msg, sendSelf, forceHide) {
    if (msg.length > 1000) {
        msg = msg.substring(0, 1000);
        cursedConfig.hadOverflowMsg = true;
        popChatSilent("(The curse tried to send a whisper longer than 1000 characters which the server cannot handle. Please watch your configurations to prevent this from happening. The message was trimmed. Error: W02)");
    }
    
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
            SendChat(Player.Name + " now has enforced protocols on #" + sender + (isMistress ? " has requested by her owner" : "."));
        }
    } else if (parameters.includes("off")) {
        if (cursedConfig.enforced.includes(sender)) {
            cursedConfig.enforced.splice(cursedConfig.enforced.indexOf(sender), 1)
            SendChat(Player.Name + " no longer has enforced protocols on #" + sender + (isMistress ? " has requested by her owner" : "."));
        }
    }
}

//Checks if an item can be worn and if it can be but is not, returns true
function itemIsAllowed(name, group) {
    console.log(name, group, !InventoryGet(Player, group))
    if (
        !InventoryGet(Player, group) &&
        !(InventoryGet(Player, group)
            && InventoryGet(Player, group).Asset
            && InventoryGet(Player, group).Asset.Name == name)
    ) {
        return Player.BlockItems.filter(it => it.Name == name && it.Group == group).length == 0;
    }
    return false;
}

//Nicknames
//Priority: 0 - Wearer 1 - Anyone 2 - Mistress 3 - Owner 4 - Blocked 5 - Remove self block
function SetNickname(parameters, sender, priority) {
    let shouldSendSelf = sender != Player.MemberNumber;
    if (!cursedConfig.hasIntenseVersion) {
        sendWhisper(sender, "(Will only work if intense mode is turned on.)", shouldSendSelf);
        return;
    }
    if (!isNaN(parameters[0])) {
        let userNumber = parseInt(parameters[0]);
        parameters.shift();
        console.log(parameters, parameters.join(" "))
        let nickname = parameters.join(" ").replace(/[,]/g, ' ');
        if (nickname) {
            let oldNickname = cursedConfig.nicknames.filter(u => u.Number == userNumber) || [];
            if (oldNickname.length == 0 || (oldNickname.length > 0 && oldNickname[0].Priority <= priority)) {
                cursedConfig.nicknames = cursedConfig.nicknames
                    .filter(u => u.Number != userNumber);
                cursedConfig.nicknames.push(
                    { Number: userNumber, Nickname: nickname, Priority: priority, SavedName: oldNickname[0] && oldNickname[0].length > 0 ? oldNickname[0].SavedName : "" }
                );
                sendWhisper(
                    sender, "(New nickname for " + userNumber + " : " + nickname + ")", shouldSendSelf
                );
            } else {
                sendWhisper(
                    sender, "(Permission denied.)", shouldSendSelf
                );
            }
        }
    }
}

function DeleteNickname(parameters, sender, priority) {
    if (!isNaN(parameters[0])) {
        let userNumber = parseInt(parameters[0]);
        parameters.shift();
        let oldNickname = cursedConfig.nicknames.filter(u => u.Number == userNumber) || [];
        if (oldNickname.length > 0) {
            if (oldNickname[0].Priority <= priority) {
                //Restores name
                try {
                    ChatRoomCharacter.forEach(char => {
                        if (oldNickname[0].userNumber == char.MemberNumber) {
                            char.Name = oldNickname[0].SavedName;
                        }
                    });
                } catch (e) { console.log(e,"failed to update a name") }
                
                //Delete nickname
                cursedConfig.nicknames = cursedConfig.nicknames.filter(u => u.Number != userNumber);
                
                //Block changing if removed self
                if (priority == 4) {
                    cursedConfig.nicknames.push(
                        { Number: sender, Nickname: oldNickname[0].SavedName, Priority: 4, SavedName: oldNickname[0].SavedName }
                    );
                    sendWhisper( sender, "-->Deleted and blocked nickname for " + userNumber, true );
                } else if (priority == 5) { 
                    sendWhisper( sender, "-->Allowed nickname for " + userNumber, true );
                }
            } else {
                sendWhisper(
                    sender, "(Permission denied.)", true
                );
            }
        } else {
            sendWhisper(
                sender, "(No nickname set for this character.)", true
            );
        }
    }
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