//************************************  HELPERS ************************************//
/** Saves the curse settings to local storage, possibility to trim what does not need to be stored */
function SaveConfigs() {
    try {
        const dbConfigs = { ...cursedConfig };
        const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say", "warned"];
        toDelete.forEach(prop => delete dbConfigs[prop]);
        localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
    } catch { }
}

/** Sends a message to all owners/mistresses in a room */
function NotifyOwners(msg, sendSelf) {
    ChatRoomCharacter.forEach(char => {
        if (
            cursedConfig.owners.includes(char.MemberNumber.toString()) || cursedConfig.mistresses.includes(char.MemberNumber.toString())
        ) {
            sendWhisper(char.MemberNumber, msg);
            // Character knows the curse is there, no need to warn anymore
            if (!cursedConfig.warned.includes(char.MemberNumber.toString()))
                cursedConfig.warned.push(char.MemberNumber.toString());
        }
    });
    if (sendSelf) {
        popChatSilent(msg);
    }
}

/** Pop a message for everyone to see, will not if player is not in a room */
function popChatGlobal(actionTxt, isNormalTalk) {
    if (actionTxt.length > 1000) {
        actionTxt = actionTxt.substring(0, 1000);
        cursedConfig.hadOverflowMsg = true;
        popChatSilent("(The curse tried to send a message longer than 1000 characters which the server cannot handle. Please watch your configurations to prevent this from happening. The message was trimmed. Error: C01)", "Error");
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

/** Pop all messages for the wearer to see, will save if player is not in a room */
function popChatSilent(actionTxt, senderName) {
    //Add to log
    if (!window.savedSilent) window.savedSilent = [];
    if (actionTxt) window.savedSilent.push({ actionTxt, senderName });

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
        span.innerHTML = (silentMsg.senderName || "Curse") + ": ";
        div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
        div.setAttribute('data-time', ChatRoomCurrentTime());
        div.setAttribute('data-sender', Player.MemberNumber);
        div.setAttribute('verifed', "true");
        div.innerHTML = span.outerHTML + "(" + silentMsg.actionTxt + ")";

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

/** Send a whisper to a target */
function sendWhisper(target, msg, sendSelf, forceHide) {
    if (msg.length > 1000) {
        msg = msg.substring(0, 1000);
        cursedConfig.hadOverflowMsg = true;
        popChatSilent("(The curse tried to send a whisper longer than 1000 characters which the server cannot handle. Please watch your configurations to prevent this from happening. The message was trimmed. Error: W02)", "Error");
    }

    if (!isNaN(target)) {
        ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: parseInt(target) });
        if (sendSelf) {
            popChatSilent(msg);
        } else if (cursedConfig.hasForward && !forceHide) {
            popChatSilent(msg, "Whisper sent to #" + target);
        }
    }
}

/** Sends a chat message to the queue */
function SendChat(actionTxt) {
    //Does not send chat if in silent mode
    if (!cursedConfig.isSilent) {
        //Add to queue
        cursedConfig.chatlog.push(actionTxt);
    } else {
        NotifyOwners(actionTxt, true);
    }
}

/** Tries to make the wearer kneel */
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

/** Import config utility to switch device or save before testing (console only) */
function cursedImport(curseSaveFile) {
    cursedConfig = JSON.parse(curseSaveFile);
}

/** Export config utility to switch device or save before testing (console only) */
function cursedExport() {
    return JSON.stringify(cursedConfig);
}

/** Add someone to the enforced list */
function enforce(sender, priority, parameters) {
    let shouldSendSelf = sender != Player.MemberNumber;
    let enforcee;
    let defaults = ["miss", "mistress", "goddess", "owner"];
    let newTitle;

    if (parameters && !isNaN(parameters[0]) && priority >= 2) {
        enforcee = ParseInt(parameters[0]);
        parameters.shift();
    }
    else enforcee = sender;
    let name = FetchName(enforcee);

    if (parameters && parameters[0] && parameters[0] != "") {
        newTitle = parameters.join(" ").replace(/[,]/g, ' ');
    }
    if (sender != enforcee && Sender != Player.Number && priority >= 2 || enforcee == sender || sender == Player.Number) {
        // Do we know the enforcee? may already have titles / nickname / be enforced
        let currentEnforcer = cursedConfig.nicknames.find(e => e.Number == enforcee);
        if (currentEnforcer) {
            if (currentEnforcer.isEnforced) {       //find auth of enforced titles
                if (priority >= currentEnforcer.TPriority) {
                    //target enforced amd priority to remove
                    currentEnforcer.isEnforced = false;
                    currentEnforcer.TPriority = 0;
                    //remove titles
                    currentEnforcer.Titles = [];
                    //no titles or nickname, forget the person
                    if (currentEnforcer.Nickname == currentEnforcer.SavedName) {
                        let ind = cursedConfig.nicknames.indexOf(u => u.Number == currentEnforcer.Number);
                        cursedConfig.nicknames.splice(ind, 1);
                    }
                    SendWhisper(sender, currentEnforcer.SavedName + " no longer has enforcement protocols on " + cursedConfig.slaveIdentifier + (priority >= 2 ? " as requested by her mistress." : "."), shouldSendSelf);
                    return;
                }   //else not enough authority
                else {
                    SendWhisper(sender, cursedConfig.slaveIdentifier + "'s enforcement protocols were given by a higher power and are not removed.", shouldSendSelf);
                    return;
                }
            }   //else not enforced, check for titles and add defaults if not
            // given custom title
            if (newTitle) {
                currentEnforcer.Titles.push(newTitle);
                currentEnforcer.TPriority = priority;
            }
            //give defaults
            else {
                currentEnforcer.Titles.push(defaults);
            }
            currentEnforcer.isEnforced = true;
            SendChat(Player.Name + " now has enforcement protocols on " + currentEnforcer.SavedName + (priority >= 2 ? " as requested by her mistress." : "."));
            return;
        }    // Don't know enforcee, add her in
        else if (!currentEnforcer) {
            if (newTitle) {
            newTitle = [newTitle];
            }
            else {
                newTitle = defaults;
            }
            cursedConfig.nicknames.push({ Number: enforcee, Nickname: name, NPriority: 0, SavedName: name, isEnforced: true, RespectNickname: false, TPriority: priority, Titles: newTitle });
            SendChat(name + " now has enforcement protocols on " + cursedConfig.slaveIdentifier + (priority >= 2 ? " as requested by her mistress." : "."));
            return;
        }
    }
}

function toggleTitle(sender, priority, parameters) {
    let shouldSendSelf = sender != Player.MemberNumber;
    let enforcee = (!isNaN(parameters[0]) ? ParseInt(parameters.shift()) : sender);
    let newTitle;
    let titlee = cursedConfig.nicknames.find(e => e.Number == enforcee);

    if (parameters[0] && parameters[0] != "") {
        newTitle = parameters.join(" ").replace(/[,]/g, ' ');
    }
    else {
        sendWhisper(sender, "Please provide a title to add or remove.");
        return;
    }
    if (sender != enforcee && priority >= 2 || enforcee == sender) {
        // Do we know her > check for title ? add : remove
        if (titlee) {
            if (titlee.Titles.includes(newTitle)) {
                if (priority >= titlee.TPriority) {
                    titlee.Titles = titlee.Titles.filter(t => t != newTitle);
                    if (titlee.Titles.length == 0)
                        titlee.isEnforced = false;
                    if(titlee.Nickname == titlee.SavedName) {
                        let ind = cursedConfig.nicknames.indexOf(u => u.Number == enforcee);
                        cursedConfig.nicknames.splice(ind, 1);
                    }
                    SendWhisper(sender, cursedConfig.slaveIdentifier + " no longer has the title " + newTitle + "."), shouldSendSelf;
                }
                else {
                    //no auth
                    sendWhisper(sender, "The title '" + newTitle + "' for " + titlee.Name + " was given by a higher power and has not been removed.");
                }   //did or didn't remove - leave
             }
            else {
                //title doesn't exist
                titlee.Titles.push(newTitle);
                if (titlee.TPriority < priority) {
                    titlee.TPriority = priority;
                }
                SendWhisper(sender, "(New title for " + enforcee + " : " + newTitle + " Priority [" + priority + "])", shouldSendSelf);
            }
        }
        else{
            let name = FetchName(enforcee);
            // don't know her, create and add
            cursedConfig.nicknames.push({ Number: enforcee, Nickname: name, NPriority: null, SavedName: name, isEnforced: false, RespectNickname: false, TPriority: priority, Titles: newTitle });
            sendWhisper(sender, "(New title for " + name + " : " + newTitle + " Priority [" + priority + "])", shouldSendSelf);
        }
    }
}
function forceNickname(sender, parameters) {
    let target = (!isNaN(parameters[0]) ? ParseInt(parameters[0]) : sender);
    let respected = cursedConfig.nicknames.find(e => e.Number == target);
    if(hasIntenseVersion){
        if (respected) {
            if (respected.Nickname != respected.SavedName) {
                if (!respected.RespectNickname) {
                    respected.isEnforced = true;
                    respected.RespectNickname = true;
                    sendWhisper(sender, "From now on " + cursed.slaveIdentifier + " must respect " + respected.Nickname + " by her by her nickname", shouldSendSelf);
                }
                else {
                    respected.RespectNickname = false;
                    if (respected.Titles.length > 0 && respected.Titles[0] != "") {
                        sendWhisper(sender, cursedConfig.slaveIdentifier + " is no to longer call " + respected.Titles[0] + " " + respected.SavedName + " by her nickname and  enforcement Protocols have now resumed.", shouldSendSelf);
                    }
                    else {
                        respected.isEnforced = false;
                        sendWhisper(sender, cursedConfig.slaveIdentifier + " no longer needs to respect " + respected.Nickname + " by her nickname.", shouldSendSelf);
                    }
                }
            }
        }
        else{
            sendWhisper(sender, cursedConfig.slaveIdentifier + " does not have intense version enabled.");
        }
    }
    else {
        sendWhisper(sender, respected.SavedName + " does not have a nickname set yet.");
    }
}


/** Checks if an item can be worn and if it can be but is not, returns true */
function itemIsAllowed(name, group) {
    if (
        !(
            InventoryGet(Player, group)
            && InventoryGet(Player, group).Asset
            && InventoryGet(Player, group).Asset.Name == name
        ) && !InventoryGroupIsBlocked(Player, group)
        && !InventoryOwnerOnlyItem(InventoryGet(Player, group))
        && InventoryAllow(Player, Asset.find(A => A.Name == name && A.Group.Name == group))
    ) {
        return Player.BlockItems.filter(it => it.Name == name && it.Group == group).length == 0;
    }
    return false;
}

/** Checks if an item can be removed, if it can it will return true */
function itemNeedsRemoving(group) {
    return InventoryGet(Player, group)
        && !InventoryGroupIsBlocked(Player, group)
        && !InventoryOwnerOnlyItem(InventoryGet(Player, group));
}

/** 
 * Removes one or multiple restraints from a list
 * @param {string | Array<string>} groups - The group(s) for which to remove items
 */
function restraintVanish(groups) {
    if (!Array.isArray(groups)) { groups = [groups]; }
    groups.forEach(group => {
        if (
            !InventoryOwnerOnlyItem(InventoryGet(Player, group))
            && !InventoryGroupIsBlocked(Player, group)
        ) {
            InventoryRemove(Player, group);
            cursedConfig.mustRefresh = true;
        }
    });
}

/**
 * Nicknames - Set a nickname for someone
 * Priority: 0 - Wearer 1 - Anyone 2 - Mistress 3 - Owner 4 - Blocked 5 - Remove self block
*/
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
            if (oldNickname.length == 0 || (oldNickname.length > 0 && oldNickname[0].NPriority <= priority)) {
                cursedConfig.nicknames = cursedConfig.nicknames
                    .filter(u => u.Number != userNumber);
                cursedConfig.nicknames.push(
                    { Number: userNumber, Nickname: nickname, NPriority: priority, SavedName: oldNickname[0] ? oldNickname[0].SavedName : "", isEnforced: false, RespectNickname: false,TPriority:0, Titles:[] }
                );
                sendWhisper(
                    sender, "(New nickname for " + userNumber + " : " + nickname + ")", shouldSendSelf
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

/** Try to delete an existing nickname */
function DeleteNickname(parameters, sender, priority) {
    let shouldSendSelf = sender != Player.MemberNumber;
    if (!isNaN(parameters[0]) && parameters[0] != "") {
        let userNumber = parseInt(parameters[0]);
        parameters.shift();
        let oldNickname = cursedConfig.nicknames.filter(u => u.Number == userNumber) || [];
        if (oldNickname.length > 0) {
            if (oldNickname[0].NPriority <= priority) {
                //Restores name
                try {
                    ChatRoomCharacter.forEach(char => {
                        if (oldNickname[0].userNumber == char.MemberNumber) {
                            char.Name = oldNickname[0].SavedName;
                        }
                    });
                } catch (e) { console.error(e, "failed to update a name") }

                //Delete nickname
                if (oldNickname[0].Titles.length == 0) {
                    cursedConfig.nicknames = cursedConfig.nicknames.filter(u => u.Number != userNumber);
                }

                //Block changing if removed self
                if (priority == 5) {
                    cursedConfig.nicknames.push(
                        { Number: sender, Nickname: oldNickname[0].SavedName, NPriority: 5, SavedName: oldNickname[0].SavedName, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] }
                    );
                    sendWhisper(sender, "-->Deleted and blocked nickname for " + FetchName(userNumber), shouldSendSelf);
                } else if (priority == 6) {
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

/** Tries to get the name of a member number */
function FetchName(number) {
    let Name;
    ChatRoomCharacter.forEach(C => {
        if (C.MemberNumber == number) {
            Name = C.Name;
        }
    });
    cursedConfig.nicknames.forEach(C => {
        if (number == C.Number) {
            Name = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && !cursedConfig.blacklist.includes(number) && !Player.BlackList.includes(parseInt(number)) && !Player.GhostList.includes(parseInt(number)) ? C.Nickname : C.SavedName
        }
    });
    return Name || "#" + number;
}

/** Saves the worn colors for later reuse with curses */
function SaveColors() {
    try {
        Player.Appearance.forEach(item => SaveColorSlot(item.Asset.Group.Name));
        popChatSilent("Your current colors in each item slot has been saved.")
    } catch { popChatSilent("An error occured while trying to save your colors. Error: SC07", "Error") }
}

function SaveColorSlot(group) {
    cursedConfig.savedColors = cursedConfig.savedColors.filter(col => col.Group != group);
    let color = InventoryGet(Player, group) ? InventoryGet(Player, group).Color : "Default";
    cursedConfig.savedColors.push({ Group: group, Color: color });
}

/** Gets the saved color for a given slot, returns default if there is none */
function GetColorSlot(group) {
    return cursedConfig.savedColors.filter(col => col.Group == group)[0] ? cursedConfig.savedColors.filter(col => col.Group == group)[0].Color : "Default";
}

/** Cleans the data on startup */
function InitCleanup() {
    //Migrate item curses (backward compatibility)
    const oldCurses = ["hasCursedBelt", "hasCursedLatex", "hasCursedBlindfold", "hasCursedHood", "hasCursedEarplugs", "hasCursedDildogag", "hasCursedPanties", "hasCursedGag", "hasCursedMittens", "hasCursedPaws", "hasCursedScrews", "hasCursedPony", "hasCursedRopes", "hasCursedMaid", "hasCursedNakedness"];

    cursedConfig.genericProcs = [];

    oldCurses.forEach(prop => {
        if (cursedConfig[prop]) {
            switch (prop) {
                case "hasCursedBelt":
                    toggleCurseItem({ name: "PolishedChastityBelt", group: "ItemPelvis", forceAdd: true });
                    break;
                case "hasCursedLatex":
                    toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true  });
                    toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true  });
                    toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true  });
                    toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true  });
                    toggleCurseItem({ name: "ThighHighLatexHeels", group: "ItemBoots", forceAdd: true  });
                    toggleCurseItem({ name: "LatexBallMuzzleGag", group: "ItemMouth", forceAdd: true  });
                    toggleCurseItem({ name: "LatexPants1", group: "ClothLower", forceAdd: true  });
                    toggleCurseItem({ name: "BoxTieArmbinder", group: "ItemArms", forceAdd: true  });
                    break;
                case "hasCursedBlindfold":
                    toggleCurseItem({ name: "FullBlindfold", group: "ItemHead", forceAdd: true  });
                    break;
                case "hasCursedHood":
                    toggleCurseItem({ name: "LeatherHoodSensDep", group: "ItemHead", forceAdd: true  });
                    break;
                case "hasCursedEarplugs":
                    toggleCurseItem({ name: "HeavyDutyEarPlugs", group: "ItemEars", forceAdd: true  });
                    break;
                case "hasCursedDildogag":
                    toggleCurseItem({ name: "DildoPlugGag", group: "ItemMouth", forceAdd: true });
                    break;
                case "hasCursedPanties":
                    toggleCurseItem({ name: "PantyStuffing", group: "ItemMouth", forceAdd: true });
                    break;
                case "hasCursedGag":
                    toggleCurseItem({ name: "BallGag", group: "ItemMouth", forceAdd: true  });
                    break;
                case "hasCursedMittens":
                    toggleCurseItem({ name: "LeatherMittens", group: "ItemHands", forceAdd: true });
                    break;
                case "hasCursedPaws":
                    toggleCurseItem({ name: "PawMittens", group: "ItemHands", forceAdd: true  });
                    break;
                case "hasCursedScrews":
                    toggleCurseItem({ name: "ScrewClamps", group: "ItemNipplesPiercings", forceAdd: true  });
                    break;
                case "hasCursedPony":
                    toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true  });
                    toggleCurseItem({ name: "LeatherLegCuffs", group: "ItemLegs", forceAdd: true  });
                    toggleCurseItem({ name: "ArmbinderJacket", group: "ItemArms", forceAdd: true });
                    toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true  });
                    toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true  });
                    toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true  });
                    toggleCurseItem({ name: "PonyBoots", group: "ItemBoots", forceAdd: true  });
                    toggleCurseItem({ name: "HarnessPonyBits", group: "ItemMouth", forceAdd: true  });
                    break;
                case "hasCursedRopes":
                    toggleCurseItem({ name: "HempRope", group: "ItemFeet", forceAdd: true  });
                    toggleCurseItem({ name: "HempRope", group: "ItemLegs", forceAdd: true  });
                    toggleCurseItem({ name: "HempRope", group: "ItemArms", forceAdd: true  });
                    break;
                case "hasCursedMaid":
                    toggleCurseItem({ name: "MaidOutfit1", group: "Cloth", forceAdd: true  });
                    toggleCurseItem({ name: "MaidHairband1", group: "Hat", forceAdd: true  });
                    break;
                case "hasCursedNakedness":
                    procCursedNaked();
                    break;
            }
        }
    });

    //Clean deprecated props
    const toDelete = ["hasCursedBunny", "lastWardrobeLock", "cursedItems", ...oldCurses];
    toDelete.forEach(prop => delete cursedConfig[prop]);

    //Cleans dupes and bad stuff
    cursedConfig.owners = cursedConfig.owners.filter((m, i) => cursedConfig.owners.indexOf(m) == i && !isNaN(m));
    cursedConfig.mistresses = cursedConfig.mistresses.filter((m, i) => cursedConfig.mistresses.indexOf(m) == i && !isNaN(m));
    cursedConfig.enforced = cursedConfig.enforced.filter((m, i) => cursedConfig.enforced.indexOf(m) == i && !isNaN(m));
    cursedConfig.blacklist = cursedConfig.blacklist.filter((m, i) => cursedConfig.blacklist.indexOf(m) == i && !isNaN(m));
    cursedConfig.bannedWords = cursedConfig.bannedWords.filter((m, i) => cursedConfig.bannedWords.indexOf(m) == i && !isNaN(m));

    //Merges Enforced and Nicknames 
    CheckEnforceMigration();
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

/** Shuffles a deck of cards */
function shuffleDeck(auto) {
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
    popChatGlobal("The deck was shuffled because it was " + (auto ? "empty." : "requested by the dealer."));
}

/** Draws a card from the deck */
function drawCard() {
    if (cardDeck.length == 0) shuffleDeck(true);
    return cardDeck.pop();
}

/** Draws several cards */
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
    function CheckEnforceMigration(){ 
        if(cursedConfig.enforced.length > 0 && cursedConfig.enforced[0] != "" || cursedConfig.nicknames.length > 0 && cursedConfig.nicknames[0] == true){
            let temparr = [];
            cursedConfig.nicknames.forEach(m => {
                if(cursedConfig.enforced.includes(m.Number)){
                    temparr.push({Number:m.Number, Nickname:m.Nickname, NPriority:m.Priority, SavedName:m.SavedName, isEnforced: true, RespectNickname: false, TPriority: 1, Titles: ["miss","mistress","goddess","owner"] });
                    let ind = cursedConfig.enforced.indexOf(m.Number);
                    cursedConfig.enforced.splice(ind,1);
                }
                else{
                    temparr.push({Number:m.Number, Nickname:m.Nickname, NPriority:m.Priority, SavedName:m.SavedName, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] });
                }
            });
            cursedConfig.enforced.forEach(num =>{
                let name = FetchName(num)
                temparr.push({Number:num, Nickname:name, NPriority: 0, SavedName:name, isEnforced: true, RespectNickname: false, TPriority: 1, Titles: ["miss","mistress","goddess","owner"] });
            });
            cursedConfig.nicknames = temparr;
        }
    }
}