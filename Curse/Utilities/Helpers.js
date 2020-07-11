//************************************  HELPERS ************************************//
/** Saves the curse settings to local storage, possibility to trim what does not need to be stored */
function SaveConfigs() {
  try {
    const dbConfigs = { ...cursedConfig };
    const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say", "warned", "shouldPopSilent"];
    toDelete.forEach(prop => delete dbConfigs[prop]);
    localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
  } catch (err) {
    alert("Your curse configs were not saved. Check the console for errors and report the issue if necessary.");
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

/** Enforces / Removes respect protocols */
function enforce(sender, isMistress, parameters) {
  let targetNo = (parameters && !isNaN(parameters[0])) ? parameters[0] : sender;
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == targetNo);

  // Don't know them - do nothing
  if (!targetChar) {
    sendWhisper(sender,"No title or nickname set for " + FetchName(targetNo) + " to be respected, please set at least one and try again.");
    return;
  }
  if (targetChar.isBlocked) {
    sendWhisper(sender, FetchName(targetNo) + " cannot be given respect protocols as they have blocked being given names and titles.");
    return;
  }
  // Toggle enforce on/off
  if (targetChar.isEnforced) {
    SendChat(Player.Name + " no longer has respect protocols for " + FetchName(targetNo) + (isMistress ? " as requested by her mistress." : "."));
  } else {
    TryPopTip(34);
    SendChat(Player.Name + " now has respect protocols for " + FetchRespectName(targetNo) + (isMistress ? " as requested by her mistress." : "."));
  }
  targetChar.isEnforced = !targetChar.isEnforced;
  // removes from charData if blank char
  if (!targetChar.Nickname && !targetChar.Title && !targetChar.isEnforced && !targetChar.isBlocked) {
    let ind = cursedConfig.charDataV2.indexOf(u => u.Number == targetNo);
    cursedConfig.charDataV2.splice(ind, 1);
  }
  return;
}
/** Gives a member a title */
function addTitle(sender, isMistress, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let [targetNo, title] = GetTargetParams(sender, parameters);
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == targetNo);
  
  // Weaer can only rename if no title set
  if (sender == Player.MemberNumber && targetChar && targetChar.Title) {
    popChatSilent(FetchRespectName + " already has a title set.");
    return;
  }
  // Wearer tried to give themself a title (OwnerHub is ok to set own)
  if (targetNo == Player.MemberNumber && sender == targetNo && !cursedConfig.disabledCommands.includes("ownerhub")) {
    popChatSilent("You may not set your own title.");
    return;
  }
  // Public tried to give somone else a title
  if (targetNo != sender && !isMistress && sender != Player.MemberNumber) {
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give titles to others.", shouldSendSelf);
    return;
  }
  if (!title || title == "") {
    sendWhisper(sender, "Please provide a title to give.", shouldSendSelf);
    return;
  }
  title = title[0].toUpperCase() + title.slice(1);
// Don't know them - add them
  if (!targetChar) {
    targetChar = { Number: parseInt(targetNo), isEnforced: false, isBlocked: false, SavedName: FetchName(targetNo) };
    cursedConfig.charDataV2.push(targetChar);
  }
  if (targetChar.isBlocked) {
    sendWhisper(sender, FetchName(targetNo) + " has blocked being given names and titles.");
    return;
  }

  sendWhisper(sender, "(New title for " + targetNo + " : " + title + ".)", shouldSendSelf);
  if (!targetChar.SavedName)
    targetChar.SavedName = FetchName;
  targetChar.Title = title;
}
/** Deletes a members title */
function deleteTitle(sender, isMistress, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let targetNo = (parameters && !isNaN(parameters[0])) ? parseInt(parameters[0]) : sender;
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == targetNo);

  if (!targetChar || !targetChar.Title) {
    sendWhisper(sender, FetchName(targetNo) + " does not have a title set.");
    return;
  }
  // Wearer tried to delete a title (OwnerHub is ok to delete own)
  if (sender == Player.MemberNumber && !(cursedConfig.disabledCommands.includes("ownerhub") && targetNo == Player.MemberNumber)) {
    popChatSilent("You may not remove titles");
    return;
  }
  // Public tried to remove somone elses title
  if (targetNo != sender && !isMistress) {
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may remove titles from others.", shouldSendSelf);
    return;
  }

  delete targetChar.Title;
  //Restores name
  try {
    ChatRoomCharacter.forEach(char => {
      if (targetChar.Number == char.MemberNumber) {
        char.Name = targetChar.Nickname ? targetChar.FetchRespectName(targetNo) : FetchName(targetNo);
      }
    });
  } catch (e) { console.error(e, "failed to update a name"); }
  // remove blank char from charData
  if (!targetChar.Nickname && !targetChar.isEnforced && !targetChar.isBlocked) {
    let ind = cursedConfig.charDataV2.indexOf(u => u.Number == targetNo);
    cursedConfig.charDataV2.splice(ind, 1);
  }
  sendWhisper(sender, FetchName(targetNo) + " no longer has a title for " + Player.Name + " to use.", shouldSendSelf);
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

///** Sets a Nickname for a member */
function SetNickname(sender, isMistress, parameters) {
  TryPopTip(19);
  let shouldSendSelf = sender != Player.MemberNumber;
  let [targetNo, nickname] = GetTargetParams(sender, parameters);
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == targetNo);

  // Weaer can only rename if no nickname set
  if (sender == Player.MemberNumber && targetChar && targetChar.Title) {
    popChatSilent(FetchRespectName + " already has a nickname set.");
    return;
  }
  // Wearer tried to give themself a title (OwnerHub is ok to set own)
  if (targetNo == Player.MemberNumber && sender == targetNo && !cursedConfig.disabledCommands.includes("ownerhub")) {
    sendWhisper(sender, "You may not set your own nickname.", "Curse");
    return;
  }
  if(targetNo != sender && !isMistress) {
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give nicknames to others.", shouldSendSelf);
    return;
  }
  if (!nickname || nickname == "") {
    sendWhisper(sender, "Please provide a nickname to give.", shouldSendSelf);
    return;
  }
  nickname = nickname[0].toUpperCase() + nickname.slice(1);
  // Don't know them - add them
  if (!targetChar) {
    targetChar = { Number: parseInt(targetNo), isEnforced: false, isBlocked: false, SavedName: FetchName(targetNo) };
    cursedConfig.charDataV2.push(targetChar);
  }
  if (targetChar.isBlocked) {
    sendWhisper(sender, FetchName(targetNo) + " has blocked being given names and titles.");
    return;
  }
  sendWhisper(sender, "(New nickname for " + targetNo + " : " + nickname + ".", shouldSendSelf);
  if (!targetChar.SavedName)
    targetChar.SavedName = FetchName;
  targetChar.Nickname = nickname;
}
///** Try to delete an existing nickname */
function DeleteNickname(sender, isMistress, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let targetNo = (parameters && !isNaN(parameters[0])) ? parseInt(parameters[0]) : sender;
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == targetNo);

  if (!targetChar || !targetChar.Nickname) {
    sendWhisper(sender, FetchName(targetNo) + " does not have a nickname set.");
    return;
  }
  // Wearer tried to delete a nickname (OwnerHub is ok to delete own)
  if (sender == Player.MemberNumber && !(cursedConfig.disabledCommands.includes("ownerhub") && targetNo == Player.MemberNumber)) {
    popChatSilent("You may not remove nicknames.");
    return;
  }
  // Public tried to remove somone elses nickname
  if (targetNo != sender && !isMistress) {
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may remove nicknames from others.", shouldSendSelf);
    return;
  }

  delete targetChar.Nickname;
  //Restores name
  try {
    ChatRoomCharacter.forEach(char => {
      if (targetChar.Number == char.MemberNumber) {
        char.Name = targetChar.Title ? targetChar.FetchRespectName(targetNo) : FetchName(targetNo);
      }
    });
  } catch (e) { console.error(e, "failed to update a name"); }
  // remove blank char from charData
  if (!targetChar.Title && !targetChar.isEnforced && !targetChar.isBlocked) {
    let ind = cursedConfig.charDataV2.indexOf(u => u.Number == targetNo);
    cursedConfig.charDataV2.splice(ind, 1);
  }
  sendWhisper(sender, Player.Name + " no longer has a nickname for " + FetchName(targetNo) + ".", shouldSendSelf);
}
/** Blocks sender from being given titles and nicknames */
function BlockRename(sender) {
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == sender);
  if (!targetChar) {
    targetChar = { Number: parseInt(sender), isEnforced: false, isBlocked: false };
    cursedConfig.charDataV2.push(targetChar);
  }

  delete targetChar.Title;
  delete targetChar.Nickname;
  targetChar.isEnforced = false;
  targetChar.isBlocked = true;
  sendWhisper(sender, "-->Blocked renaming " + FetchName(sender) + " for " + Player.Name, shouldSendSelf);
}
/** Allows titles and nicknames to be given to sender */
function AllowRename(sender) {
  let targetChar = cursedConfig.charDataV2.find(e => e.Number == sender);
  if (targetChar && targetChar.isBlocked)
    cursedConfig.charDataV2.splice(cursedConfig.charDataV2.indexOf(e => e.Number == targetChar.Number), 1);

  sendWhisper(sender, "-->Allowed renaming for " + FetchName(userNumber), shouldSendSelf);
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
/** Tries to get the respected name from a member number */
function FetchRespectName(number) {
  let respectName;
  let targetChar = cursedConfig.charDataV2.find(C => C.Number == number);
  if (targetChar) {
    let name = targetChar.Nickname ? targetChar.Nickname : FetchName(number);
    respectName = targetChar.Title ? targetChar.Title + " " + name : name;
  }
  else {
    respectName = FetchName(number);
  }
    return respectName;
}
/** Saves the worn colors for later reuse with curses */
function SaveColors() {
  TryPopTip(6);
  try {
    Player.Appearance.forEach(item => SaveColorSlot(item.Asset.Group.Name));
    popChatSilent("Your current colors in each item slot has been saved.");
  } catch (err) { popChatSilent("An error occured while trying to save your colors. Error: SC07", "Error"); }
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
  popChatGlobal("The deck was shuffled because it was " + (auto ? "empty." : "requested by the dealer."));
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
    popChatGlobal("You drew the following cards: " + drawnCards.join(" "));
  } else {
    for (let i = 0; i < nbCards; i++) {
      players.forEach(p => {
        sendWhisper(p, "(The following card was drawn: " + drawCard() + ")", true);
      });
    }
  }

}


/** Sends a character to a give room 
 * @param {string} ame - Room name
*/
function SendToRoom(name) {
  ElementRemove("Friendlist");
  ElementRemove("InputChat");
  ElementRemove("TextAreaChatLog");
  ServerSend("ChatRoomLeave", "");
  ServerSend("ChatRoomLeave", "");
  CommonSetScreen("Online", "ChatSearch");
  ChatRoomSpace = "";
  OnlineGameName = "";
  ChatSearchLeaveRoom = "MainHall";
  ChatSearchBackground = "IntroductionDark";
  ChatCreateBackgroundList = CommonBackgroundList.slice();
  ChatRoomPlayerCanJoin = true;
  ServerSend("ChatRoomJoin", { Name: name });
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
  let intenseMode = ["locknewlover", "lockowner", "locknewsub", "capture", "fullmute", "secretorgasms", "safeword", "norescue", "preventdc", "sensdep", "meterlocked", "meteroff", "enablesound", "restrainedspeech", "target", "self", "blockooc", "sentence", "sound", "forcedsay", "say","selftitle","settitle","givetitle","namechange","nickname","rename"];
  if (!cursedConfig.hasIntenseVersion && intenseMode.includes(command)) { 
    sendWhisper(sender, "(Will only work if intense mode is turned on.)", true);
    return;
  }
  
  //When full curse is on, we don't worry about anything
  if (cursedConfig.hasFullCurse) return true;
  
  // Ownerhub
  if (cursedConfig.disabledCommands.includes("ownerhub")) {
    sendWhisper(sender, "(The wearer is running the curse in owner mode. This means no one can interact with their curse.)", true);
    TryPopTip(50);
    return false;
  }
  
  // Disabled optins
  let isOptin = cursedConfig.optinCommands.find(OC => OC.command == command);
  if (isOptin && !isOptin.isEnabled) {
    sendWhisper(sender, `(The opt-in command ${command} is disabled. The wearer needs to turn it on if they wish to.)`, true);
    popChatSilent(`If you wish to turn on an optin command, you need to do "${cursedConfig.commandChar + cursedConfig.slaveIdentifier} togglecommand ${command}". Opt-in commands are usually more restrictive or troublesome. Think twice before enabling this command.`);
    TryPopTip(50);
    return false;
  }
  
  //Blacklist
  if (cursedConfig.disabledCommands.includes(command)) {
    sendWhisper(sender, `(The command ${command} is disabled. The wearer needs to remove it from their blacklist if they wish to.)`, true);
    popChatSilent(`If you wish to re-enable a command, you need to do "${cursedConfig.commandChar + cursedConfig.slaveIdentifier} togglecommand ${command}".`);
    TryPopTip(50);
    return false;
  }
  return true;
}

/** Converts a list of numbers split by , into an array of numbers */
function ConvertStringToStringNumberArray(string) { 
  return string.split(",").map(s => s.trim()).filter(s => !isNaN(s));
}