//************************************  HELPERS ************************************//
/** Saves the curse settings to local storage, possibility to trim what does not need to be stored */
function SaveConfigs() {
  try {
    const dbConfigs = { ...cursedConfig };
    const toDelete = ["chatStreak", "chatlog", "mustRefresh", "isRunning", "onRestart", "wasLARPWarned", "ownerIsHere", "mistressIsHere", "genericProcs", "toUpdate", "say", "warned", "shouldPopSilent"];
    toDelete.forEach(prop => delete dbConfigs[prop]);
    localStorage.setItem(`bc-cursedConfig-${Player.MemberNumber}`, JSON.stringify(dbConfigs));
  } catch (err) { console.log(err); }
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
  if (actionTxt) cursedConfig.savedSilent.push({ actionTxt, senderName });

  //Save in log until player is in a room
  if (CurrentScreen != "ChatRoom") {
    cursedConfig.shouldPopSilent = true;
    return;
  }
  cursedConfig.shouldPopSilent = false;

  //Removes dupes keeps the last order for UX
  cursedConfig.savedSilent = cursedConfig.savedSilent.filter((m, i) => cursedConfig.savedSilent.lastIndexOf(m) === i);

  // Sort by System/Tip/Curse/Other
  const compare = (a, b) => {
    if (a.senderName == "System" && b.senderName !== "System") {
      return -1;
    }
    if (a.senderName == "Tip" && b.senderName !== "Tip") {
      return -1;
    }
    if (a.senderName == "Curse" && b.senderName !== "Curse") {
      return -1;
    }
    return 0;
  };

  cursedConfig.savedSilent.sort(compare);

  //Sends messages
  cursedConfig.savedSilent.forEach(silentMsg => {
    //Directly sends to wearer
    let div = document.createElement("div");
    let span = document.createElement("span");
    span.setAttribute("class", "ChatMessageName");
    span.innerHTML = (silentMsg.senderName || "Curse") + ": ";
    div.setAttribute("class", "ChatMessage ChatMessageWhisper");
    div.setAttribute("data-time", ChatRoomCurrentTime());
    div.setAttribute("data-sender", Player.MemberNumber);
    div.setAttribute("verifed", "true");
    div.innerHTML = span.outerHTML + "(" + silentMsg.actionTxt + ")";

    //Refocus the chat to the bottom
    let Refocus = document.activeElement.id == "InputChat";
    let ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
    if (document.getElementById("TextAreaChatLog") != null) {
      document.getElementById("TextAreaChatLog").appendChild(div);
      if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
      if (Refocus) ElementFocus("InputChat");
    }
  });

  //Clears log
  cursedConfig.savedSilent = [];

  TryPopTip(32);
}

/** Send a whisper to a target */
function sendWhisper(target, msg, sendSelf, forceHide) {
  if (msg.length > 1000) {
    msg = msg.substring(0, 1000);
    cursedConfig.hadOverflowMsg = true;
    popChatSilent("(The curse tried to send a whisper longer than 1000 characters which the server cannot handle. Please watch your configurations to prevent this from happening. The message was trimmed. Error: W02)", "Error");
  }

  if (!isNaN(target)) {
    TryPopTip(33);
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

/** Sends an unseen tip */
function PopTip() {
  if (!window.curseTips) return;
  const showTip = curseTips.find(T => !cursedConfig.seenTips.includes(T.ID) && !T.isContextual) || {};
  if (showTip.ID || showTip.ID == 0) {
    popChatSilent(showTip.Text, "Tip");
    popChatSilent("Send the command again to see another tip.", "Tip");
    cursedConfig.seenTips.push(showTip.ID);
  } else {
    popChatSilent("No more tips available for now. You might want to suggest new ones! You can also do '#name tip reset' to go through all tips again", "Tip");
  }
}

/** Sends a specific tip if it was not seen */
function TryPopTip(ID) {
  if (!window.curseTips) return;
  const showTip = curseTips.find(T => T.ID == ID && !cursedConfig.seenTips.includes(T.ID));
  if (showTip) {
    cursedConfig.seenTips.push(showTip.ID);
    popChatSilent(showTip.Text, "Tip");
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
  let [enforcee, newTitle] = GetTargetParams(sender, parameters, priority);
  let name = FetchName(enforcee);
  let defaults = ["miss", "mistress", "goddess", "owner"];
  let result;
  let currentEnforcer;
  // If not enforced, enforce them
  if (!cursedConfig.charData.some(n => n.Number == enforcee && n.isEnforced)) {
    newTitle = (newTitle && newTitle != "") ? [newTitle] : defaults;
    [result, currentEnforcer] = AddWithChecks(enforcee, newTitle, 'Titles', sender, priority);
    switch (result) {
      case "no auth":
        sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give respect protocols to others.");
        return;
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
    [result, currentEnforcer] = DeleteWithChecks(enforcee, ["miss", "mistress", "goddess", "owner", newTitle], 'Titles', sender, priority);
    switch (result) {
      case "no auth":
        sendWhisper(sender, "Permission denied. Only members with at least Mistress status may remove respect protocols from others.");
        return;
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
  let titlee;
  let result;
  if (!cursedConfig.charData.some(n => n.Number == enforcee && n.Titles.includes(newTitle))) {
    [result, titlee] = AddWithChecks(enforcee, newTitle, 'Titles', sender, priority);
    switch (result) {
      case "nothing to add":
        sendWhisper(sender, "Please provide a title to add or remove.");
        return;
      case "no auth":
        sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give titles to others.");
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
  }
  else {
    [result, titlee] = DeleteWithChecks(enforcee, newTitle, 'Titles', sender, priority);
    switch (result) {
      case "nothing to delete":
        //should only be picked up if undefined was somehow in the list
        sendWhisper(sender, "Please provide a title to add or remove.");
        return;
      case "no auth":
        sendWhisper(sender, "Permission denied. Only members with at least Mistress status may remove titles from others.");
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
  if(sender == Player.MemberNumber){
    popChatSilent("The curse prohibits you from doing changing this.");
    return;
  }
  let target = (!isNaN(parameters[0]) ? parseInt(parameters[0]) : sender);
  let respected = cursedConfig.charData.find(e => e.Number == target);

  if (!cursedConfig.hasIntenseVersion) {
    sendWhisper(sender, "(Will only work if intense mode is turned on.)", shouldSendSelf);
    return;
  }
    
  if (respected && respected.Nickname && respected.Nickname) {
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
  
  let [result, target] = AddWithChecks(userNumber, nickname, 'Nickname', sender, priority)
  switch (result) {
    case "nothing to add":
      sendWhisper(sender, "Requires a nickname.)", shouldSendSelf);
      return;
    case "no auth":
      sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give nicknames to others.");
      return;
    case "not enough auth":
      sendWhisper(sender, Player.Name + "'s nickname for " + target.Name + " was set by a higher power and cannot be changed.");
      return;
    case "blocked":
      sendWhisper(sender, "Permission denied. " + target.Name + " has blocked being given nicknames.");
      return;
    case "success":
      if (!target.SavedName || target.SavedName == "")
        target.SavedName = name;
      sendWhisper(sender, "(New nickname for " + userNumber + " : " + nickname + ")", shouldSendSelf);
      return;
    //no target, no list, - neither of these should be reached here
    default:
      sendWhisper(sender, "something went wrong or no message was set, the curse remains the same. AddNickname: " + result);
      return;
  }
}

/** Try to delete an existing nickname */
function DeleteNickname(parameters, sender, priority) {
  let shouldSendSelf = sender != Player.MemberNumber;
  let [userNumber, nickname] = GetTargetParams(sender, parameters, priority);
  let [result, oldNickname] = DeleteWithChecks(userNumber, nickname, 'Nickname', sender, priority);
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
      sendWhisper(sender, "Error, no nickname set for " + FetchName(userNumber), shouldSendSelf);
      return;
    case "no auth":
      sendWhisper(sender, "Permission denied. Only members with at least Mistress status may give nicknames to others.");
      return;
    case "not enough auth":
      sendWhisper(sender, FetchName(userNumber) + "'s nickname was given by a higher power and has not been removed.");
      return;
    case "success":
      sendWhisper(sender, "->Deleted nickname for " + FetchName(userNumber), shouldSendSelf);
      break;
    //no target, no list, nothing to delete, not known - none of these should be reached here
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
          toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true });
          toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true });
          toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true });
          toggleCurseItem({ name: "ThighHighLatexHeels", group: "ItemBoots", forceAdd: true });
          toggleCurseItem({ name: "LatexBallMuzzleGag", group: "ItemMouth", forceAdd: true });
          toggleCurseItem({ name: "LatexPants1", group: "ClothLower", forceAdd: true });
          toggleCurseItem({ name: "BoxTieArmbinder", group: "ItemArms", forceAdd: true });
          break;
        case "hasCursedBlindfold":
          toggleCurseItem({ name: "FullBlindfold", group: "ItemHead", forceAdd: true });
          break;
        case "hasCursedHood":
          toggleCurseItem({ name: "LeatherHoodSensDep", group: "ItemHead", forceAdd: true });
          break;
        case "hasCursedEarplugs":
          toggleCurseItem({ name: "HeavyDutyEarPlugs", group: "ItemEars", forceAdd: true });
          break;
        case "hasCursedDildogag":
          toggleCurseItem({ name: "DildoPlugGag", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedPanties":
          toggleCurseItem({ name: "PantyStuffing", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedGag":
          toggleCurseItem({ name: "BallGag", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedMittens":
          toggleCurseItem({ name: "LeatherMittens", group: "ItemHands", forceAdd: true });
          break;
        case "hasCursedPaws":
          toggleCurseItem({ name: "PawMittens", group: "ItemHands", forceAdd: true });
          break;
        case "hasCursedScrews":
          toggleCurseItem({ name: "ScrewClamps", group: "ItemNipplesPiercings", forceAdd: true });
          break;
        case "hasCursedPony":
          toggleCurseItem({ name: "LatexCorset1", group: "ItemTorso", forceAdd: true });
          toggleCurseItem({ name: "LeatherLegCuffs", group: "ItemLegs", forceAdd: true });
          toggleCurseItem({ name: "ArmbinderJacket", group: "ItemArms", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "Suit", forceAdd: true });
          toggleCurseItem({ name: "SeamlessCatsuit", group: "SuitLower", forceAdd: true });
          toggleCurseItem({ name: "Catsuit", group: "Gloves", forceAdd: true });
          toggleCurseItem({ name: "PonyBoots", group: "ItemBoots", forceAdd: true });
          toggleCurseItem({ name: "HarnessPonyBits", group: "ItemMouth", forceAdd: true });
          break;
        case "hasCursedRopes":
          toggleCurseItem({ name: "HempRope", group: "ItemFeet", forceAdd: true });
          toggleCurseItem({ name: "HempRope", group: "ItemLegs", forceAdd: true });
          toggleCurseItem({ name: "HempRope", group: "ItemArms", forceAdd: true });
          break;
        case "hasCursedMaid":
          toggleCurseItem({ name: "MaidOutfit1", group: "Cloth", forceAdd: true });
          toggleCurseItem({ name: "MaidHairband1", group: "Hat", forceAdd: true });
          break;
        case "hasCursedNakedness":
          procCursedNaked();
          break;
      }
    }
  });

  //Merges Enforced and Nicknames 
  CheckEnforceMigration();

  //Clean deprecated props
  const toDelete = ["punishmentColor", "hasCursedBunny", "lastWardrobeLock", "cursedItems", "nicknames", "enforced", ...oldCurses];
  toDelete.forEach(prop => delete cursedConfig[prop]);

  //Cleans dupes and bad stuff
  cursedConfig.owners = cursedConfig.owners.filter((m, i) => cursedConfig.owners.indexOf(m) == i && !isNaN(m));
  cursedConfig.mistresses = cursedConfig.mistresses.filter((m, i) => cursedConfig.mistresses.indexOf(m) == i && !isNaN(m));
  cursedConfig.blacklist = cursedConfig.blacklist.filter((m, i) => cursedConfig.blacklist.indexOf(m) == i && !isNaN(m));
  cursedConfig.bannedWords = cursedConfig.bannedWords.filter((m, i) => cursedConfig.bannedWords.indexOf(m) == i && !isNaN(m));

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

/** Shuffles a deck of cards */
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

/** Draws several cards */
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
function CheckEnforceMigration() {
  if (cursedConfig.nicknames && cursedConfig.nicknames.length > 0) {
    cursedConfig.nicknames.forEach(m => {
      if (isNaN(m.Number)) return;
      cursedConfig.charData.push({ Number: parseInt(m.Number), Nickname: m.Nickname, NPriority: m.Priority, SavedName: m.SavedName, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] });
    });
  }

  if (cursedConfig.enforced && cursedConfig.enforced.length > 0) {
    cursedConfig.enforced.forEach(num => {
      if (isNaN(num)) return;
      let found = cursedConfig.charData.find(C => C.Number == num);
      if (found) {
        found.isEnforced = true;
        found.Titles = ["miss", "mistress", "goddess", "owner"];
      } else {
        cursedConfig.charData.push({ Number: parseInt(num), NPriority: 0, isEnforced: true, RespectNickname: false, TPriority: 1, Titles: ["miss", "mistress", "goddess", "owner"] });
      }
    });
  }
}


/** Sends a character to a give room */
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
function GetTargetParams(sender, parameters, priority) {
  let target;
  let paramString;
  if (parameters && !isNaN(parameters[0])) {
    if (sender == parameters[0] || priority >= 2 || sender == Player.MemberNumber) {
      target = parseInt(parameters[0]);
    } else {
      target = sender;
      sendWhisper(sender, "Public commands cannot be applied to other members.");
    }
    parameters.shift();
  } else target = sender;
  if (parameters && parameters[0] && parameters[0] != "") {
    paramString = parameters.join(" ").replace(/[,]/g, " ");
  }
  return [parseInt(target), paramString];
}
//Adds to a list or changes a string with checks in place, if target is a number(strings will dupe without a check) charData will update List and LPriority with auth checks
//Returns ["success, target object] or ["status message", target obj if required]
function AddWithChecks(target, insertable, listName, sender, priority, ) {
  if (!target) { return ["no target",]; }
  if (!insertable) { return ["nothing to add",]; }
  
  if (Array.isArray(target)) {    // target is a list, not inside an object - add to list
    target.concat(insertable);  // for other lists you might want to add to with a check
    return "success";
  }
  if (!listName) { return ["no list set",]; }
  // If target is a number, use member number and add to charData with matched priority number
  if (!isNaN(target)) {
    if (sender == target || priority >= 2 || sender == Player.MemberNumber) {
      let pri = listName[0].toUpperCase() + 'Priority';
      let known = cursedConfig.charData.find(mem => mem.Number == target);
      // don't know them, lets make them first then add
      if (!known) {
        known = { Number: parseInt(target), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };
      }
      if (known[pri] == 5) { return ["blocked",] };
      if (known[pri] <= priority) {
        if (Array.isArray(known[listName])) {       // For lists
          if (!Array.isArray(insertable))
          insertable = [insertable];
          known[listName] = known[listName].concat(insertable.filter(el => known[listName].indexOf(el) < 0));     // e.g. Add titles and TPriority
        }
        else {                                      // For strings and not arrays
          if (insertable && insertable != "")
          known[listName] = insertable;
        }
        known[pri] = priority;
        if (!cursedConfig.charData.some(k => k.Number == known.Number)) {
          cursedConfig.charData.push(known);
          return ["success", known];
        }
      }
      else {
        return ["not enough auth", known];
      }
    }
    else {
      return ["no auth",];
    }
  }   // Use here to add anything else with a different way
}
//Removes a list or changes a string with checks in place, if target is a number charData will update List and LPriority with auth checks
//Returns ["success, target object] or ["status message", target obj if required] Also has block / allow functions
function DeleteWithChecks(target, deletable, listname, sender, priority) {
  if (!target) { return ["no target",]; }
  if (Array.isArray(target)) {         // target is a list, not inside an object - delete directly from a list
    if (!Array.isArray(deletable))
    deletable = [deletable];    // doesn't care if string, list or undefined
    target = target.filter(el => !deletable.includes(el));
    if (!deletable) { return ["nothing to delete",]; }
    return ["success",];
  }
  if (!listname) { return ["no list set",]; }
  // If target is a number, use member number and delete from charData with matched priority number
  if (!isNaN(target)) {
    if (sender != target && priority >= 5) {
      return ["sender only",];
    }
    if (target == sender || priority >= 2 || sender == Player.MemberNumber) {
      let pri = listname[0].toUpperCase() + "Priority";
      let known = cursedConfig.charData.find(mem => mem.Number == target);
      if (!known) {
        if (priority == 5) {
          known = { Number: parseInt(target), NPriority: 0, isEnforced: false, RespectNickname: false, TPriority: 0, Titles: [] };
          known[pri] = priority;
          cursedConfig.charData.push(known);
          return ["blocked", known];
        }
        else {
          return ["not known",];
        }
      }
      else {  // delete, block , allow functions here
        if (priority == 6) {
          known[pri] = 0;
          return ["allowed", known];
        }
        if (priority == 5) {
          known[pri] = 5;
          if (Array.isArray(known[listname])) {
            known[listname] = [];
          }
          else {
            delete known[listname];
          }
          return ["blocked", known];
        }
        if (known[pri] <= priority) {
          if (Array.isArray(known[listname])) {   // For Lists 
            if (!Array.isArray(deletable))
            deletable = [deletable];        // doesn't care if string, list or undefined
            known[listname] = known[listname].filter(el => !deletable.includes(el));
            if (!deletable) {
              known[pri] = 0;
              return ["nothing to delete",];
            }
          }
          else {  // For strings and not arrays 
            if (!known[listname])
            return "not set";
            
            delete known[listname];
          }
          known[pri] = 0;
          return ["success", known];
        }
        else {
          return ["not enough auth",];
        }
      }
    }
    else {
      return ["no auth",];
    }
  }   // Use here to add anything else with a different way 
}
