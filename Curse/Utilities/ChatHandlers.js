/** Sends a message to all owners/mistresses in a room 
 * @param {string} msg - The message to send
 * @param {boolean} [sendSelf] - Should it also be sent to the wearer
*/
function NotifyOwners(msg, sendSelf) {
  ChatRoomCharacter.forEach(char => {
    if (
      cursedConfig.owners.includes(char.MemberNumber.toString()) || cursedConfig.mistresses.includes(char.MemberNumber.toString()) || Player.Ownership && Player.Ownership.MemberNumber == char.MemberNumber
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


/** Pop a message for everyone to see, will not if player is not in a room 
* @param {string} actionTxt - The text to be displayed in the action
* @param {boolean} [isNormalTalk] - Should it be a normal text message instead?
*/
function popChatGlobal(actionTxt, isNormalTalk) {
  if (actionTxt.length > 1000) {
    actionTxt = actionTxt.substring(0, 1000);
    cursedConfig.hadOverflowMsg = true;
    popChatSilent({Tag: "Error: C01"}, "Error");
  }

  if (CurrentScreen == "ChatRoom" && actionTxt != "") {
    if (isNormalTalk) {
      ServerSend("ChatRoomChat", { Content: actionTxt, Type: "Chat" });
    } else {
      var msgFR = actionTxt;
      var msgEN = actionTxt;
      var msgGER = actionTxt;
      //var msgRU = actionTxt;
      if (typeof actionTxt == "object") { 
       // _.setTranslation({ ...cursedEN, ...cursedRU });
       // msgRU = CT(actionTxt);
        _.setTranslation({ ...cursedEN, ...cursedGER });
        msgGER = CT(actionTxt);
        _.setTranslation({ ...cursedEN, ...cursedFR });
        msgFR = CT(actionTxt);
        _.setTranslation(cursedEN);
        msgEN = CT(actionTxt);
      }
      
      // RU uses beep so I cannot bypass it
      ServerSend("ChatRoomChat", {
        Content: "Beep", Type: "Action", Dictionary: [
          { Tag: "Beep", Text: "msg" },
          { Tag: "Biep", Text: msgGER },
          { Tag: "Sonner", Text: msgFR },
          { Tag: "msg", Text: msgEN }]
      });
    }
  }
}


/** Pop all messages for the wearer to see, will save if player is not in a room 
 * @param {string|object} actionTxt - The text to be displayed in the silent message
 * @param {string} [senderName] - What is the name to be displayed along with it? Defaults to 'Curse'
 */
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
  cursedConfig.savedSilent = cursedConfig.savedSilent.filter(
    (m, i) => cursedConfig.savedSilent.map(M => typeof M.actionTxt == "object" ? M.actionTxt.Tag : M.actionTxt).lastIndexOf(typeof m.actionTxt == "object" ? m.actionTxt.Tag : m.actionTxt) === i
  );

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
    if (!silentMsg.senderName) silentMsg.senderName = "Curse";
    let div = document.createElement("div");
    let span = document.createElement("span");
    span.setAttribute("class", "ChatMessageName");
    span.innerHTML = GT(Player.MemberNumber, { Tag: silentMsg.senderName })+ ": ";
    div.setAttribute("class", "ChatMessage ChatMessageWhisper");
    div.setAttribute("data-time", ChatRoomCurrentTime());
    div.setAttribute("data-sender", Player.MemberNumber);
    div.setAttribute("verifed", "true");
    div.innerHTML = span.outerHTML + "(" + (typeof silentMsg.actionTxt !== "object" ? silentMsg.actionTxt : GT(Player.MemberNumber, silentMsg.actionTxt)).replace(/^\(|\)$/g, "") + ")";

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


/** Send a whisper to a target 
 * @param {string} target - The member number to send it to
 * @param {string|object} msg - The message to send
 * @param {boolean} [sendSelf] - If the wearer should see it as a silent message
 * @param {boolean} [forceHide] - If the message should not be forwarded by fowardall
 */
function sendWhisper(target, msg, sendSelf, forceHide) {
  if (msg.length > 1000) {
    msg = msg.substring(0, 1000);
    cursedConfig.hadOverflowMsg = true;
    popChatSilent({Tag: "Error: W02"}, "Error");
  }

  if (!isNaN(target)) {
    TryPopTip(33);
    SetMemberDictionary(target);
    ServerSend("ChatRoomChat", { Content: `(${typeof msg !== "object" ? msg : CT(msg)})`, Type: "Whisper", Target: parseInt(target) });
    if (sendSelf) {
      popChatSilent(msg);
    } else if (cursedConfig.hasForward && !forceHide && target != Player.MemberNumber) {
      popChatSilent(msg, CT({Tag: "WhisperSent", Param: [FetchName(target)]}));
    }
  }
}

/** Sends a chat message to the queue 
 * @param {string} actionTxt - the message to send
*/
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
function PopTip(isRoom) {
  if (!window.curseTips) return;
  const showTip = curseTips.find(T => !cursedConfig.seenTips.includes(T.ID) && !T.isContextual) || {};
  
  let message = "";
  if (showTip.ID || showTip.ID == 0) {
    message = GT(Player.MemberNumber, { Tag: "listedtip" + showTip.ID }) + (isRoom ? GT(Player.MemberNumber, { Tag: "listedtipRoomInfo" }) : GT(Player.MemberNumber, { Tag: "listedtipChatInfo" }));
    cursedConfig.seenTips.push(showTip.ID);
  } else {
    message = GT(Player.MemberNumber, { Tag: "listedtipNoMore" });
  }
  
  if (!isRoom)
    popChatSilent(message, "Tip");
  else
    return message;
}

/** Sends a specific tip if it was not seen 
 * @param {number} ID - ID of the tip
*/
function TryPopTip(ID) {
  if (!window.curseTips || !window.cursedConfig) return;
  const showTip = curseTips.find(T => T.ID == ID && !cursedConfig.seenTips.includes(T.ID));
  if (showTip) {
    cursedConfig.seenTips.push(showTip.ID);
    popChatSilent(GT(Player.MemberNumber, { Tag: "listedtip" + showTip.ID }), "Tip");
  }
}