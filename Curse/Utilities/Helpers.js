//************************************  HELPERS ************************************//
/** Saves the curse settings to local storage, possibility to trim what does not need to be stored */
function SaveConfigs() {
  try {
    const dbConfigs = { ...cursedConfig };
    const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say", "warned", "shouldPopSilent", "transgressionsWarning"];
    toDelete.forEach(prop => delete dbConfigs[prop]);
    
    // Cleans up transgressions
    if (cursedConfig.transgressions.length > 100) { 
      cursedConfig.transgressions.splice(0, cursedConfig.transgressions.length - 100);
      cursedConfig.transgressionsWarning && popChatSilent({ Tag: "ERRORT100" }, "System");
      cursedConfig.transgressionsWarning = true;
    }
    
    localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
  } catch (err) {
    alert(GT(Player.MemberNumber, { Tag: "NotSaved" }));
    console.log(err);
  }
}

/** Import config utility to switch device or save before testing (console only) 
 * @param {Object} curseSaveFile - the previously stringified cursedConfig object
*/
function cursedImport(curseSaveFile) {
  cursedConfig = JSON.parse(curseSaveFile);
}

/** Export config utility to switch device or save before testing (console only) */
function cursedExport() {
  return JSON.stringify(cursedConfig);
}

/** Add someone to the enforced list */
function enforce(sender, priority, parameters) {
  let [enforcee, newTitle] = GetTargetParams(sender, parameters);

  let name = FetchName(enforcee);
  let shouldSendSelf = sender != Player.MemberNumber;
  let defaults = ["miss", "mistress", "goddess", "owner"];

  if (sender != enforcee && sender != Player.Number && priority >= 2 || enforcee == sender || sender == Player.Number) {
    // Do we know the enforcee? may already have titles / nickname / be enforced
    let currentEnforcer = cursedConfig.charData.find(e => e.Number == enforcee);
    if (currentEnforcer) {
      if (currentEnforcer.isEnforced) {       //find auth of enforced titles
        if (priority >= currentEnforcer.TPriority) {
          //target enforced amd priority to remove
          currentEnforcer.isEnforced = false;
          currentEnforcer.TPriority = 0;
          //remove titles
          currentEnforcer.Titles = [];
          // Unenforce nickname or forget the person
          if (currentEnforcer.SavedName) {
            currentEnforcer.RespectNickname = false;
          } else if (currentEnforcer.NPriority != 5) {
            let ind = cursedConfig.charData.indexOf(u => u.Number == currentEnforcer.Number);
            cursedConfig.charData.splice(ind, 1);
          }
          SendChat(Player.Name + " no longer has enforcement protocols on " + name + (priority >= 2 ? " as requested by her mistress." : "."));
          return;
        } else {
          //else not enough authority
          sendWhisper(sender, Player.Name + "'s enforcement protocols were given by a higher power and cannot be removed.", shouldSendSelf);
          return;
        }
      }   //else not enforced, check for titles and add defaults if not
      // given custom title
      if (newTitle) {
        currentEnforcer.Titles.push(newTitle);
        currentEnforcer.TPriority = priority;
      } else if (currentEnforcer.Titles.length == 0) {
        currentEnforcer.Titles.push(...defaults);
      }
      currentEnforcer.isEnforced = true;
      TryPopTip(34);
      SendChat(Player.Name + " now has enforcement protocols on " + name + (priority >= 2 ? " as requested by her mistress." : "."));
      return;
    } else if (!currentEnforcer) {
      // Don't know enforcee, add her in
      if (newTitle) {
        newTitle = [newTitle];
      } else {
        newTitle = defaults;
      }
      cursedConfig.charData.push({ Number: parseInt(enforcee), NPriority: 0, isEnforced: true, RespectNickname: false, TPriority: priority, Titles: newTitle });
      SendChat(name + " now has enforcement protocols on " + Player.Name + (priority >= 2 ? " as requested by her mistress." : "."));
      return;
    }
  }
}

function toggleTitle(sender, priority, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let [enforcee, newTitle] = GetTargetParams(sender, parameters);
  if (!newTitle) {
    sendWhisper(sender, "Please provide a title to add or remove.");
    return;
  }
  let titlee = cursedConfig.charData.find(e => e.Number == enforcee);

  if (sender != enforcee && priority >= 2 || enforcee == sender) {
    // Do we know her > check for title ? add : remove
    if (titlee) {
      if (titlee.Titles.includes(newTitle)) {
        if (priority >= titlee.TPriority) {
          titlee.Titles = titlee.Titles.filter(t => t != newTitle);
          if (titlee.Titles.length == 0 && !titlee.RespectNickname) {
            titlee.isEnforced = false;
            if (titlee.NPriority != 5) {
              let ind = cursedConfig.charData.indexOf(u => u.Number == enforcee);
              cursedConfig.charData.splice(ind, 1);
            }
            sendWhisper(sender, cursedConfig.slaveIdentifier + " no longer has the title " + newTitle + "."), shouldSendSelf;
          }
        } else {
          //no auth
          sendWhisper(sender, "The title '" + newTitle + "' for " + titlee.Name + " was given by a higher power and has not been removed.");
        }   //did or didn't remove - leave
      } else {
        //title doesn't exist
        titlee.Titles.push(newTitle);
        if (titlee.TPriority < priority) {
          titlee.TPriority = priority;
        }
        sendWhisper(sender, "(New title for " + enforcee + " : " + newTitle + " Priority [" + priority + "])", shouldSendSelf);
      }
    } else {
      let name = FetchName(enforcee);
      // don't know her, create and add
      cursedConfig.charData.push({ Number: parseInt(enforcee), isEnforced: false, RespectNickname: false, TPriority: priority, Titles: [newTitle] });
      sendWhisper(sender, "(New title for " + name + " : " + newTitle + " Priority [" + priority + "])", shouldSendSelf);
    }
  }
}

function forceNickname(sender, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let target = (!isNaN(parameters[0]) ? parseInt(parameters[0]) : sender);
  let respected = cursedConfig.charData.find(e => e.Number == target);

  if (!cursedConfig.hasIntenseVersion) {
    sendWhisper(sender, "(Will only work if intense mode is turned on.)", shouldSendSelf);
    return;
  }

  if (respected && respected.Nickname && respected.Nickname != respected.SavedName) {
    if (!respected.RespectNickname) {
      respected.isEnforced = true;
      respected.RespectNickname = true;
      sendWhisper(sender, "From now on " + Player.Name + " must respect " + respected.Nickname + " by her nickname", shouldSendSelf);
      return;
    }

    respected.RespectNickname = false;

    if (respected.Titles.length > 0 && respected.Titles[0] != "") {
      sendWhisper(sender, Player.Name + " no longer needs to call " + FetchName(target) + " by her nickname and regular protocols have now resumed.", shouldSendSelf);
      return;
    }

    respected.isEnforced = false;
    sendWhisper(sender, Player.Name + " no longer needs to respect " + FetchName(target) + " by her nickname.", shouldSendSelf);
    return;

  } else {
    sendWhisper(sender, FetchName(target) + " does not have a nickname set yet.");
  }
}


/** Checks if an item can be worn and if it can be but is not, returns true */
function itemIsAllowed(name, group) {
  //Removes curses on invalid items
  if (name && !Asset.find(A => A.Name === name && A.Group.Name === group)) {
    cursedConfig.cursedAppearance = cursedConfig.cursedAppearance.filter(item => item.group != group);
    return false;
  }

  // Checks if it can be applied
  if (
    !(
      InventoryGet(Player, group)
      && InventoryGet(Player, group).Asset
      && InventoryGet(Player, group).Asset.Name == name
    ) && !InventoryGroupIsBlocked(Player, group)
    && !InventoryOwnerOnlyItem(InventoryGet(Player, group))
    && InventoryAllow(Player, Asset.find(A => A.Name == name && A.Group.Name == group))
  ) {
    TryPopTip(35);
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
      TryPopTip(12);
      InventoryRemove(Player, group);
      cursedConfig.mustRefresh = true;
    }
  });
}

/**
 * Nicknames - Set a nickname for someone
 * Priority: 0 - Wearer 1 - Anyone 2 - Mistress 3 - Owner 4 - ClubOwner 5 - Blocked 6 - Remove self block
*/
function SetNickname(parameters, sender, priority) {
  TryPopTip(19);
  let shouldSendSelf = sender != Player.MemberNumber;
  if (!cursedConfig.hasIntenseVersion) {
    sendWhisper(sender, "(Will only work if intense mode is turned on.)", shouldSendSelf);
    return;
  }
  let [userNumber, nickname] = GetTargetParams(sender, parameters);
  if (nickname) {
    nickname = nickname[0].toUpperCase() + nickname.slice(1);
    let target = cursedConfig.charData.find(u => u.Number == userNumber);
    if (target) {
      if (target.NPriority <= priority || target.NPriority == 6) {
        if (!target.SavedName) {
          target.SavedName = FetchName(target.Number);
        }
        target.Nickname = nickname;
        target.NPriority = priority;
      } else {
        sendWhisper(
          sender, "(Permission denied. The member may have blocked themselves from being nicknamed, or you tried to set the nickname with a permission level lower than what was set previously.)", shouldSendSelf
        );
        return;
      }
    } else {
      let name = userNumber ? FetchName(userNumber) : sender;
      cursedConfig.charData.push(
        { Number: parseInt(userNumber), Nickname: nickname, NPriority: priority, SavedName: name, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] }
      );
    }
    sendWhisper(
      sender, "(New nickname for " + userNumber + " : " + nickname + ")", shouldSendSelf
    );
  } else {
    sendWhisper(
      sender, "Requires a nickname.)", shouldSendSelf
    );
  }
}

/** Try to delete an existing nickname */
function DeleteNickname(parameters, sender, priority) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let userNumber = (!isNaN(parameters[0]) && parameters[0] != "") ? parseInt(parameters[0]) : sender;
  let oldNickname = cursedConfig.charData.find(u => u.Number == userNumber);

  if (oldNickname) {
    if (oldNickname.NPriority <= priority || oldNickname.Number == sender) {
      //Restores name
      try {
        ChatRoomCharacter.forEach(char => {
          if (oldNickname.Number == char.MemberNumber) {
            char.Name = oldNickname.SavedName ? oldNickname.SavedName : FetchName(userNumber);
            oldNickname.RespectNickname = false;
          }
        });
      } catch (e) { console.error(e, "failed to update a name"); }

      //Delete nickname
      if (oldNickname.Titles.length == 0 && oldNickname.NPriority != 5) {
        cursedConfig.charData = cursedConfig.charData.filter(u => u.Number != userNumber);
      } else {
        oldNickname.Nickname = undefined;
        oldNickname.SavedName = undefined;
      } if (priority != 6) {
        sendWhisper(sender, "->Deleted nickname for " + FetchName(userNumber), shouldSendSelf);
      }
      return;
    } else {
      sendWhisper(
        sender, "(Permission denied. The member may have blocked themselves from being nicknamed, or you tried to set the nickname with a permission level lower than what was set previously.)", shouldSendSelf
      );
      return;
    }
  }

  if (sender == userNumber) {
    //Block changing if removed self
    if (priority == 5) {
      if (oldNickname) {
        oldNickname.NPriority = 5;
        oldNickname.Nickname = undefined;
        oldNickname.SavedName = undefined;
        oldNickname.RespectNickname = false;
      } else {
        cursedConfig.charData.push(
          { Number: parseInt(sender), NPriority: 5, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] }
        );
      }
      sendWhisper(sender, "-->Blocked nickname for " + FetchName(userNumber), shouldSendSelf);
      return;
    } else if (priority == 6) {
      if (oldNickname) {
        oldNickname.NPriority = 0;
      }
      sendWhisper(sender, "-->Allowed nickname for " + FetchName(userNumber), shouldSendSelf);
      return;
    }
  }

  sendWhisper(sender, "Error, no nickname set for " + FetchName(userNumber), shouldSendSelf);
}

/** Tries to get the name of a member number */
function FetchName(number) {
  let Name;
  ChatRoomCharacter.forEach(C => {
    if (C.MemberNumber == number) {
      Name = C.Name;
    }
  });
  cursedConfig.charData.forEach(C => {
    if (number == C.Number) {
      Name = cursedConfig.hasIntenseVersion && cursedConfig.isRunning && ChatRoomSpace != "LARP" && !cursedConfig.blacklist.includes(number) && !Player.BlackList.includes(parseInt(number)) && !Player.GhostList.includes(parseInt(number)) && C.Nickname ? C.Nickname : C.SavedName || Name;
    }
  });
  return Name || "#" + number;
}

/** Saves the worn colors for later reuse with curses */
function SaveColors() {
  TryPopTip(6);
  try {
    Player.Appearance.forEach(item => SaveColorSlot(item.Asset.Group.Name));
    popChatSilent({ Tag: "SaveColorDone" });
  } catch (err) { popChatSilent({ Tag: "ErrorSC07" }, "Error"); }
}

/** Saves the worn color of a given slot
 * @param {string} group - asset group name
 */
function SaveColorSlot(group) {
  cursedConfig.savedColors = cursedConfig.savedColors.filter(col => col.Group != group);
  let color = InventoryGet(Player, group) ? InventoryGet(Player, group).Color : "Default";
  cursedConfig.savedColors.push({ Group: group, Color: color });
}

/** Gets the saved color for a given slot, returns default if there is none
 * @param {string} group - asset group name
 * @returns {string} the color code or "Default"
 */
function GetColorSlot(group) {
  return cursedConfig.savedColors.filter(col => col.Group == group)[0] ? cursedConfig.savedColors.filter(col => col.Group == group)[0].Color : "Default";
}

// Card Deck
let cardDeck = [];

/*
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/** Shuffles a deck of cards 
 * @param {boolean} auto - if it was an auto shuffle or manual shuffle
*/
function shuffleDeck(auto) {
  cardDeck = [];
  const cardType = ["♥", "♦", "♠", "♣"];
  const cardNb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  cardType.forEach(t => {
    cardNb.forEach(nb => {
      cardDeck.push(t + nb);
    });
  });
  shuffle(cardDeck);
  shuffle(cardDeck);
  shuffle(cardDeck);
  popChatGlobal({ Tag: auto ? "DeckShuffledAuto" : "DeckShuffledRequest"});
}

/** Draws a card from the deck */
function drawCard() {
  if (cardDeck.length == 0) shuffleDeck(true);
  return cardDeck.pop();
}

/** Draws several cards
 * @param {number} nbCards - amount of cards to draw per player
 * @param {string | string[]} players - player(s) to send the cards to
 */
function drawCards(nbCards, players) {
  TryPopTip(8);
  //If no player was given, just draw X card to the current target
  players = players || [ChatRoomTargetMemberNumber.toString()];
  if (players[0] == null) {
    let drawnCards = [];
    for (let i = 0; i < nbCards; i++) {
      drawnCards.push(drawCard());
    }
    popChatGlobal({ Tag: "DeckDrawnGlobal", Param: [drawnCards.join(" ")] });
  } else {
    for (let i = 0; i < nbCards; i++) {
      players.forEach(p => {
        sendWhisper(p, { Tag: "DeckDrawnWhisper", Param: [drawCard()] }, true);
      });
    }
  }

}


/** Sends a character to a given room 
 * @param {object} data - Room data
*/
function SendToRoom(data) {
  ElementRemove("FriendList");
  ElementRemove("InputChat");
  ElementRemove("TextAreaChatLog");
  ServerSend("ChatRoomLeave", "");
  CommonSetScreen("Online", "ChatSearch");
  OnlineGameName = "";
  ChatSearchLeaveRoom = "MainHall";
  ChatSearchBackground = "IntroductionDark";
  ChatRoomSpace = data.ChatRoomSpace;
  BackgroundsToPick = data.ChatRoomSpace == "Asylum" ? [BackgroundsTagAsylum] : BackgroundsTagList;
  ChatCreateBackgroundList = BackgroundsGenerateList(BackgroundsToPick);
  ChatRoomPlayerCanJoin = true;
  ServerSend("ChatRoomJoin", { Name: data.ChatRoomName });
}

function GetTargetParams(sender, parameters) {
  let target;
  let paramString;

  if (parameters && !isNaN(parameters[0])) {
    target = parseInt(parameters[0]);
    parameters.shift();
  } else target = sender;

  if (parameters && parameters[0] && parameters[0] != "") {
    paramString = parameters.join(" ").replace(/[,]/g, " ");
  }
  return [target, paramString];
}

/** Check if a optin command is enabled 
 * @param {string} command - Name of the command
 * @param {string} sender - MemberNumber of the sender
 * @returns {Boolean} if it is activated or not
*/
function CommandIsActivated(command, sender) {
  //Intense mode
  let intenseMode = ["locknewlover", "lockowner", "locknewsub", "capture", "fullmute", "secretorgasms", "safeword", "norescue", "preventdc", "sensdep", "meterlocked", "meteroff", "enablesound", "restrainedspeech", "target", "self", "blockooc", "sentence", "sound", "forcedsay", "say", "asylumlockdown", "asylumreturntoroom"];
  if (!cursedConfig.hasIntenseVersion && intenseMode.includes(command)) {
    sendWhisper(sender, { Tag: "NeedIntenseOn" }, true);
    return;
  }

  //When full curse is on, we don't worry about anything
  if (cursedConfig.hasFullCurse) return true;

  // Ownerhub
  if (cursedConfig.disabledCommands.includes("ownerhub")) {
    sendWhisper(sender, { Tag: "OwnerModeOn" }, true);
    TryPopTip(50);
    return false;
  }

  // Disabled optins
  let isOptin = cursedConfig.optinCommands.find(OC => OC.command == command);
  if (isOptin && !isOptin.isEnabled) {
    sendWhisper(sender, { Tag: "WarnOptinOff", Param: [command] }, true);
    popChatSilent({ Tag: "WarnOptinWearer", Param: [cursedConfig.commandChar + cursedConfig.slaveIdentifier, command] });
    TryPopTip(50);
    return false;
  }

  //Blacklist
  if (cursedConfig.disabledCommands.includes(command)) {
    sendWhisper(sender, { Tag: "WarnBlacklist", Param: [command] }, true);
    popChatSilent({ Tag: "WarnBlacklistWearer", Param: [cursedConfig.commandChar + cursedConfig.slaveIdentifier, command] });
    TryPopTip(50);
    return false;
  }
  return true;
}

/** Converts a list of numbers split by , into an array of numbers */
function ConvertStringToStringNumberArray(string) {
  return string.split(",").map(s => s.trim()).filter(s => !isNaN(s));
}

/** Draws a beep text */
function DrawCustomBeepText(txt) {
  ServerBeep = { Message: txt, Timer: Date.now() + 10000 }
}

/** Sends a hidden message object */
function SendCurseChatMessage(number, txt) { 
  ServerSend("ChatRoomChat", { Content: "curseinteraction " + txt, Type: "Hidden", Sender: parseInt(number) });
}

/// THIS IS A POLYFILL FOR R59 ///
/**
 * Check if the mouse position is within the boundaries of a given zone (Useful for UI components)
 * @param {number} Left - Starting position on the X axis
 * @param {number} Top - Starting position on the Y axis
 * @param {number} Width - Width of the zone
 * @param {number} Height - Height of the zone
 * @returns {boolean} - Returns TRUE if the click occurred in the given zone
 */
function MouseIn(Left, Top, Width, Height) {
	return (MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height);
}