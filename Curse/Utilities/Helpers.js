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

/** Add someone to the enforced list */
function enforce(sender, priority, parameters) {
  let [enforcee, newTitle] = GetTargetParams(sender, parameters, priority);
  let name = FetchName(enforcee);
  let defaults = ["miss", "mistress", "goddess", "owner"];
  let result;

  if (!(sender == enforcee || priority >= 2 || sender == Player.MemberNumber)){
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give or remove respect protocols for others.");
    return;
  }  
  let currentEnforcer = cursedConfig.charData.find(e => e.Number == enforcee) || { Number: parseInt(enforcee), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };
  // If not enforced, enforce them
  if (!currentEnforcer.isEnforced) {
    newTitle = (newTitle && newTitle != "") ? [newTitle] : defaults;
    result = AddWithChecks(currentEnforcer, newTitle, "Titles", priority);
    switch (result) {
      case "success":
        currentEnforcer.isEnforced = true;
        SendChat(Player.Name + " now has enforcement protocols on " + name + (priority >= 2 ? " as requested by her mistress." : "."));
        return;
      //no target, no list, no title,nothing to add, not enough auth, blocked - none of these should be reached here
      default:
        sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. => Add: " + result);
        return;
    }
  } else {
    result = DeleteWithChecks(currentEnforcer, ["miss", "mistress", "goddess", "owner", newTitle], "Titles", sender, priority);
    switch (result) {
      case "not enough auth":
        sendWhisper(sender, Player.Name + "'s enforcement protocols were given by a higher power and cannot be removed.");
        return;
      case "success":
        currentEnforcer.isEnforced = false;
        currentEnforcer.RespectNickname = false;
        SendChat(Player.Name + " no longer has enforcement protocols on " + name + (priority >= 2 ? " as requested by her mistress." : "."));
        break;
      //no target, no list, allowed, blocked, nothing to delete, not known - none of these should be reached here
      default:
        sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. => Del: " + result);
        return;
    }
    if (!currentEnforcer.Nickname && currentEnforcer.Titles.length == 0 && currentEnforcer.NPriority != 5) {
      cursedConfig.charData = cursedConfig.charData.filter(char => char.Number != currentEnforcer.Number);
    }
  }
}

function toggleTitle(sender, priority, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let [enforcee, newTitle] = GetTargetParams(sender, parameters, priority);
  let titlee = cursedConfig.charData.find(e => e.Number == enforcee) || { Number: parseInt(enforcee), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };
  let result;
  if (!(sender == enforcee || priority >= 2 || sender == Player.MemberNumber)){
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give or remove titles to others.");
    return;
  }
  if (!titlee.Titles.includes(newTitle)) {
    result = AddWithChecks(titlee, newTitle, "Titles", priority);
    switch (result) {
      case "nothing to add":
        sendWhisper(sender, "Please provide a title to add or remove.");
        return;
      case "not enough auth":
        sendWhisper(sender, Player.Name + " has titles set by a higher power and cannot be changed.");
        return;
      case "success":
        SendChat("New title for " + enforcee + " : " + newTitle + " Priority [" + priority + "]", shouldSendSelf);
        return;
        //no target, no list, blocked - none of these should be reached here
      default:
        sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. AddTitle: " + result);
        return;
    }
  } else {
    result = DeleteWithChecks(titlee, newTitle, "Titles", sender, priority);
    switch (result) {
      case "nothing to delete":
        //should only be picked up if undefined was somehow in the list
        sendWhisper(sender, "Please provide a title to add or remove.");
        return;
      case "not enough auth":
        sendWhisper(sender, "The title '" + newTitle + "' for " + titlee.Name + " was given by a higher power and has not been removed.");
        return;
      case "success":
        SendChat(Player.Name + " no longer has the title " + newTitle + "."), shouldSendSelf;
        break;
        //no target, no list, allowed, blocked, not known - none of these should be reached here
      default:
        sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. => TitleDel: " + result);
        return;
    }
    if (!titlee.Nickname && titlee.Titles.length == 0 && titlee.NPriority != 5) {
      cursedConfig.charData = cursedConfig.charData.filter(char => char.Number != titlee.Number);
    }
  }
}

function forceNickname(sender, parameters) {
  let shouldSendSelf = sender != Player.MemberNumber;
  if (!cursedConfig.hasIntenseVersion) {
    sendWhisper(sender, "(Will only work if intense mode is turned on.)", shouldSendSelf);
    return;
  }
  if(sender == Player.MemberNumber){
    popChatSilent("The curse prohibits you from doing changing this.");
    return;
  }

  let target = (!isNaN(parameters[0]) ? parseInt(parameters[0]) : sender);
  let respected = cursedConfig.charData.find(e => e.Number == target);

  if (respected && respected.Nickname) {
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
  if(sender == Player.MemberNumber && cursedConfig.hasRestrainedNicknames){
    popChatSilent("Permission Denied.  Owner has locked this function.");
    return;
  }
  let [userNumber, nickname] = GetTargetParams(sender, parameters, priority);
  if (nickname)
    nickname = nickname[0].toUpperCase() + nickname.slice(1);
  let name = FetchName(userNumber);
  
  if (!(sender == userNumber || priority >= 2 || sender == Player.MemberNumber)){
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give nicknames to others.");
    return;
  }
  let target = cursedConfig.charData.find(e => e.Number == parseInt(userNumber)) || { Number: parseInt(userNumber), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };

  let result = AddWithChecks(target, nickname, "Nickname", priority);
  switch (result) {
    case "nothing to add":
      sendWhisper(sender, "Requires a nickname.)", shouldSendSelf);
      return;
      case "not enough auth": //(qol) if target is player, nickname is repeated, should this be changed?
      sendWhisper(sender, Player.Name + "'s nickname for " + name + " was set by a higher power and cannot be changed.");
      return;
    case "blocked":
      sendWhisper(sender, "Permission denied. " + name + " has blocked being given nicknames.");
      return;
    case "success":
      if (!target.SavedName || target.SavedName == "")
        target.SavedName = name;
      sendWhisper(sender, "(New nickname for " + userNumber + " : " + nickname + ")", shouldSendSelf);
      return;
    default:
      sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. AddNickname: " + result);
      return;
  }
}

/** Try to delete an existing nickname */
function DeleteNickname(parameters, sender, priority) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let [userNumber, nickname] = GetTargetParams(sender, parameters, priority);
  if (!(sender == userNumber || priority >= 2 || sender == Player.MemberNumber)){
    sendWhisper(sender, "Permission denied. Only members with at least Mistress status may remove nicknames from others.");
    return;
  }
  let oldNickname = cursedConfig.charData.find(e => e.Number == parseInt(userNumber)) || { Number: parseInt(userNumber), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };
  
  let result = DeleteWithChecks(oldNickname, nickname, "Nickname", sender, priority);
  switch (result) {
    case "sender only":
      sendWhisper(sender, "Members may only use block / allow functions on themselves.");
      return;
    case "blocked":
      sendWhisper(sender, "->Blocked nickname for " + FetchName(userNumber), shouldSendSelf);
      break;
    case "allowed":
      sendWhisper(sender, "->Allowed nickname for " + FetchName(userNumber), shouldSendSelf);
      if (oldNickname.Titles.length == 0)
        cursedConfig.charData = cursedConfig.charData.filter(u => u.Number != userNumber);
      return;
    case "not known":
    case "not set":
      sendWhisper(sender, "No nickname set for " + FetchName(userNumber), shouldSendSelf);
      return;
    case "not enough auth":
      sendWhisper(sender, FetchName(userNumber) + "'s nickname was given by a higher power and has not been removed.");
      return;
    case "success":
      sendWhisper(sender, "->Deleted nickname for " + FetchName(userNumber), shouldSendSelf);
      break;
    //no target, no list - none of these should be reached here
    default:
      sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. => NicknameDel: " + result);
      return;
  }
  //Restores name
  try {
    ChatRoomCharacter.forEach(char => {
      if (oldNickname.Number == char.MemberNumber) {
        char.Name = oldNickname.SavedName ? oldNickname.SavedName : FetchName(userNumber);
        oldNickname.RespectNickname = false;
        delete oldNickname.SavedName;
      }
    });
  } catch (e) { console.error(e, "failed to update a name"); }
  
  if (oldNickname.Titles.length == 0 && oldNickname.NPriority != 5) {
    cursedConfig.charData = cursedConfig.charData.filter(u => u.Number != userNumber);
  }
  if(oldNickname.isEnforced && oldNickname.Titles.length > 0 && oldNickname[0] != "")
  sendWhisper(sender, Player.Name + "'s regular protocols have now resumed for " + FetchName(userNumber) + ".", shouldSendSelf);
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
  CommonSetScreen("Online", "ChatSearch");
  ChatRoomSpace = "";
  OnlineGameName = "";
  ChatSearchLeaveRoom = "MainHall";
  ChatSearchBackground = "IntroductionDark";
  ChatCreateBackgroundList = CommonBackgroundList.slice();
  ChatRoomPlayerCanJoin = true;
  ServerSend("ChatRoomJoin", { Name: name });
}
// Gets a member number and parameters, returns a target user number or sender number and a string if one was given
function GetTargetParams(sender, parameters) {
  let target;
  let paramString;
  if (parameters && !isNaN(parameters[0])) {
    target = parseInt(parameters[0]);
    parameters.shift();
  } else {
    target = sender;
  }
  if (parameters && parameters[0] && parameters[0] != "") {
    paramString = parameters.join(" ").replace(/[,]/g, " ");
  }
  return [target, paramString];
}

// Adds to a list or changes a string and matched priority if priority is high enough, if target is a char,
// charData will update List and LPriority.  Returns "success or "status message"
function AddWithChecks(target, insertable, listName, priority, ) {
  if (!target) { return "no target"; }
  if (!insertable) { return "nothing to add"; }
  if (!listName) { return "no list set"; }

  let pri = listName[0].toUpperCase() + "Priority";
  if (target[pri] && target[pri] == 5) { return "blocked"; }
  if (target[pri] && target[pri] > priority) {return "not enough auth";}
  
  // Auth check done, add to target
  if (Array.isArray(target[listName])) {       // For lists
      if (!Array.isArray(insertable))          // e.g. Add titles and TPriority
      insertable = [insertable];
      target[listName] = target[listName].concat(insertable.filter(el => target[listName].indexOf(el) < 0));   
    } else{                                    // For strings and not arrays
      if (insertable && insertable != "")      // e.g. Add Nickname and NPriority
      target[listName] = insertable;
    }
    
    target[pri] = priority;
    
    // If target is a member and not in charData, add it in
    if (target.Number && !cursedConfig.charData.some(c => c.Number == target.Number)) 
      cursedConfig.charData.push(target);
    
    return "success";    
}

//Removes a list or changes a string with checks in place, if target is a number charData will update List and LPriority with auth checks
//Returns ["success, target object] or ["status message", target obj if required] Also has block / allow functions
function DeleteWithChecks(target, deletable, listname, sender, priority) {
  if (!target) { return "no target"; }
  if (!listname) { return "no list set"; }
  if (parseInt(sender) != target.Number && priority >= 5) {return "sender only"; }
  
  let pri = listname[0].toUpperCase() + "Priority";

  // Block / Allow functions
  if (sender == target.Number && priority >= 5){
    if(priority == 5){
      if(Array.isArray(target[listname])){
        target[listname] = [];
      } else{
        delete target[listname];
      }
      target[pri] = priority;
      if(target.Number && !cursedConfig.charData.some(c => c.Number == target.Number))
      cursedConfig.charData.push(target);
      return "blocked";
    }
    if (priority == 6) {
      target[pri] = 0;
      return "allowed";
    }
  }
  // if target is a char, check if known in charData first then check target
  if(target.Number && !cursedConfig.charData.some(c => c.Number == target.Number)){
    return "not known";
  }
  if(!target[listname] || (target[listname] && target[listname] == [])){
    return "not set";
  }
// check priority and delete
  if(target[pri] > priority){
    return "not enough auth";
  } else{
    target[pri] = 0;
    
    if (Array.isArray(target[listname])) {   // For Lists
      if (!Array.isArray(deletable))
        deletable = [deletable];        // doesn't care if string, list or undefined
      target[listname] = target[listname].filter(el => !deletable.includes(el));
      
      if (!deletable) {
        return "nothing to delete";
      }
    } else {  // For strings and not arrays 
      delete target[listname];
    }
    return "success";
  }
}

/** Check if a optin command is enabled 
 * @param {string} command - Name of the command
 * @param {string} sender - MemberNumber of the sender
 * @returns {Boolean} if it is activated or not
*/
function CommandIsActivated(command, sender) { 
  //Intense mode
  let intenseMode = ["locknewlover", "lockowner", "locknewsub", "capture", "fullmute", "secretorgasms", "safeword", "norescue", "preventdc", "sensdep", "meterlocked", "meteroff", "enablesound", "restrainedspeech", "target", "self", "blockooc", "sentence", "sound", "forcedsay", "say"];
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
