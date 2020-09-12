"use strict";
/* eslint-disable no-var */
var CurseRoomBackground = "Boudoir";
var CurseRoomThrown = false;
var CurseRoomAce = null;
var CurseRoomAceReady = false;
var CurseRoomHasCurse = typeof cursedConfig != "undefined";

// Loads the club curse room
function CurseRoomLoad() {
    CurseRoomAceReady = false;
    CharacterReset("NPC_Ace", "Female3DCG");
    CurseRoomAce = Character["NPC_Ace"];
    CurseRoomAce.Name = "Miss Ace";
    CurseRoomAce.LabelColor = "#c0a4ff";
    CurseRoomAce.BlinkFactor = 10;
    CurseRoomAce.AllowItem = false;
    InventoryWear(CurseRoomAce, "HairBack8", "HairBack", "#c0a4ff");
    InventoryWear(CurseRoomAce, "Default", "Head", "Asian");
    InventoryWear(CurseRoomAce, "Large", "BodyUpper", "Asian");
    InventoryWear(CurseRoomAce, "Large", "BodyLower", "Asian");
    InventoryWear(CurseRoomAce, "NecklaceKey", "Necklace", "Default");
    InventoryWear(CurseRoomAce, "Eyes3", "Eyes", "#c0a4ff");
    InventoryWear(CurseRoomAce, "Eyes3", "Eyes2", "#c0a4ff");
    InventoryWear(CurseRoomAce, "Regular", "Mouth", "#69386F");
    InventoryWear(CurseRoomAce, "H0940", "Height", "Default");
    InventoryWear(CurseRoomAce, "BondageBra1", "Bra", "Default");
    InventoryWear(CurseRoomAce, "Stockings4", "Socks", "#58107B");
    InventoryWear(CurseRoomAce, "Heels2", "Shoes", "#3E175E");
    InventoryWear(CurseRoomAce, "LeatherCorsetTop1", "Cloth", "#8358B9");
    InventoryWear(CurseRoomAce, "Waspie3", "ClothLower", "#4E2877");
    InventoryWear(CurseRoomAce, "Default", "Hands", "Asian");
    InventoryWear(CurseRoomAce, "ButterflyMask1", "Glasses", "#8215DA");
    InventoryWear(CurseRoomAce, "MistressGloves", "Gloves", "#42116A");
    InventoryWear(CurseRoomAce, "HairFront14", "HairFront", "#c0a4ff");
    InventoryWear(CurseRoomAce, "BunnyEars2", "HairAccessory1", "#2D0E3E");
    InventoryWear(CurseRoomAce, "Band1", "Hat", "#fff7df");

    CurseRoomAce.Dialog = [
      { Stage: "0", Result: "Welcome to my bunny hole. I see you've found some of my magic." },
      { Stage: "0", Option: "May I get cursed, miss?", Result: "Of course! (She lays a hand on your shoulders, her eyes glow purple and you feel something odd.)", Prerequisite: "!HasCurse", Function: "CursedStarter()" },
      { Stage: "0", Option: "May I see details about my curse, miss?", Result: "Of course! (She explains her powers to you.)", Prerequisite: "HasCurse", Function: "CursedInfo()" },
      { Stage: "0", Option: "May I ask a question, miss?", NextStage: "40", Result: "(She allows you to speak.)" },
      { Stage: "0", Option: "I have something I would like to say about the curse.", Result: "I'd love to hear your thoughts, send me a message on discord or join the server. Ace___#5558 (She smiles.)" },
      { Stage: "0", Option: "May I have a taste of the curse, miss?", Result: "(She grins.) Of course, I can do many things.", Prerequisite: "HasCurse", NextStage: "30" },
      { Stage: "0", Option: "May I customize my curse, miss?", NextStage: "20", Result: "Sure, what can I do for you?", Prerequisite: "HasCurse" },
      { Stage: "0", NextStage: "10", Option: "I have found a problem and would like to reset my curse.", Result: "(She stares at you suspiciously.) Are you sure? Resetting is permanent.", Prerequisite: "HasCurse" },
      { Stage: "0", Option: "Sorry Miss Ace, I have to go.  (Leave her.)", Function: "DialogLeave()" },
      { Stage: "10", NextStage: "0", Option: "I have changed my mind.", Result: "(She looks pleased.)" },
      { Stage: "10", NextStage: "0", Option: "Yes, I want to reset my curse.", Result: "(She looks worried, yet angry as she sets you free.) Alright darling, but I am not responsible for anything if you anger your owner(s).", Function: "CursedReset()" },
      { Stage: "20", Option: "May I keep those colors, miss?", Result: "Of course, your items will reappear with those colors from now on. (She touches your shoulder and \"something\" happens.)", Function: "Colors()" },
      { Stage: "20", Option: "Do you have more in store, miss?", Result: "(Her eyes glow purple as she answers.) Of course, I have just turned up its intensity.", Prerequisite: "!HasIntense()", Function: "IntenseOn()" },
      { Stage: "20", Option: "Things have been too intense, miss. May I go back to normal mode?", Result: "Of course, I have toned down your curse.", Prerequisite: "HasIntense()", Function: "IntenseOff()" },
      { Stage: "20", Option: "Could I wear the curse permanently, miss?", Result: "(Her eyes glow purple as she answers.) Of course, you will now always be cursed when you enter the club.", Prerequisite: "!HasAlways()", Function: "AlwaysOn()" },
      { Stage: "20", Option: "Could I stop being cursed automatically when I enter the club, miss?", Result: "(Her eyes flicker, hissing as she answers. You fall on the ground as you get pushed across the room without being touched, but you manage to get back on your feet.) Sure, but be wary. I don't enjoy treason.", Prerequisite: "HasAlways()", Function: "AlwaysOff()" },
      { Stage: "20", Option: "I'm good for now, miss.", NextStage: "0", Result: "(She nods and wonders if this will get you in trouble.)" },
      { Stage: "30", Option: "(Ask her to alter your speech.)", Result: "(Her eyes glow purple.) I am surprised you dared to go this far. You are only able to meow from now on.", Prerequisite: "HasIntense()", Function: "TryMeow()" },
      { Stage: "30", Option: "(Ask her for some strange mittens.)", Result: "(Her eyes glow purple as she puts mittens on you.) Alright dear. Don't try to take them off", Function: "TryMittens()" },
      { Stage: "30", Option: "(Ask her to restrict your speech.)", Result: "(Her eyes glow purple.) My favorite! You can no longer speak in first person.", Function: "TryPerson()" },
      { Stage: "30", Option: "(Pay your respects.)", Result: "(She grins, appreciative of the respect you show her.)", Prerequisite: "HasIntense()", Function: "TryRespect()" },
      { Stage: "30", Option: "I've changed my mind, miss.", NextStage: "0", Result: "(She nods and looks disappointed she could not toy with you.)" },
      { Stage: "40", Option: "May I have the link again, miss?", Result: "(She ignores how forgetful you are and hands you a note.) github.com/ace-1331/ace12401-cursedscript" },
      { Stage: "40", Option: "Is this dangerous, miss?", Result: "This only affects you. Make sure to keep your curse up to date and listen to the directives in the github ReadMe. Running the curse on a non-approved version is done at your own risks." },
      { Stage: "40", Option: "May I have some money, miss?", Result: "(She looks furious, you have clearly insulted her.) Not going to happen, sweetheart. This is not meant to be for cheating." },
      { Stage: "40", Option: "I've changed my mind, miss.", NextStage: "0", Result: "(She nods and wonders what you are hiding from her.)" },
    ];
    
    CharacterRefresh(CurseRoomAce);
}

// Run the curse room, draw the 2 characters
function CurseRoomRun() {
  if (Player.CanKneel() && !Player.ActivePose) CharacterSetActivePose(Player, ( window.CharacterItemsHavePose ? ["Kneel", "BackBoxTie"] : "Kneel"));
  CurseRoomLoad();
  CurseRoomHasCurse = typeof cursedConfig != "undefined";
  DrawCharacter(Player, !CurseRoomThrown ? 250 : 1250, 0, 1);
  DrawCharacter(CurseRoomAce, 750, 0, 1);
  DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
  DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
  DrawButton(1885, 265, 90, 90, "", "White", "Icons/Preference.png");
}

// When the user clicks in the curse room
function CurseRoomClick() {
  if (MouseIn(!CurseRoomThrown ? 250 : 1250, 0, 500, 1000))
    CharacterSetCurrent(Player);
  if (MouseIn(750, 0, 1250-750, 1000-0)) {
    CharacterSetCurrent(CurseRoomAce);
  }
  if (MouseIn(1885, 25, 90, 90)) {
    CurseRoomThrown = false;
    CommonSetScreen("Room", "MainHall");
  }
  if (MouseIn(1885, 145, 90, 90))
    InformationSheetLoadCharacter(Player);
  if (MouseIn(1885, 265, 90, 90)) {  
    CursePreferenceRun();
    CurrentScreen = "CursePreference";
    CursePreferenceReturnRoom = "CurseRoom";
  }
}

function CurseRoomCursedReset() {
  CurseRoomEyeGlow();
  try {
    cursedConfig = window.cursedConfigInit;
  } catch (err) { console.log(err); }
  SaveConfigs();
}

async function CurseRoomCursedStarter() {
  CurseRoomEyeGlow();
  await CursedStarter();
  CurseRoomHasCurse = true;
  SaveConfigs();
}

function CurseRoomColors() {
  SaveColors();
  SaveConfigs();
}

function CurseRoomIntenseOn() {
  CurseRoomEyeGlow();
  CursedIntenseOn();
  SaveConfigs();
}

function CurseRoomIntenseOff() {
  CurseRoomEyeGlow();
  CursedIntenseOff();
  SaveConfigs();
}

function CurseRoomHasIntense() {
  return cursedConfig.hasIntenseVersion;
}

function CurseRoomAlwaysOn() {
  CurseRoomEyeGlow();
  AlwaysOnTurnOn();
}

function CurseRoomAlwaysOff() {
  CurseRoomEyeGlow();
  if (Player.CanKneel()) {
    CharacterSetActivePose(Player, "AllFours");
    setTimeout(() => CharacterSetActivePose(Player, ( window.CharacterItemsHavePose ? ["Kneel", "BackBoxTie"] : "Kneel")), 4000);
  }
  CurseRoomThrown = true;
  AlwaysOnTurnOff();
}

function CurseRoomHasAlways() {
  try {
    if (localStorage.getItem("bc-cursed-always-on") == "enabled") return true;
  } catch (err) { console.log(err); }
  return false;
}

function CurseRoomTryMittens() {
  CurseRoomEyeGlow();
  toggleCurseItem({ name: "LeatherMittens", group: "ItemHands", dateOfRemoval: Date.now() + 86400000 });
  SaveConfigs();
}

function CurseRoomTryMeow() {
  CurseRoomEyeGlow();
  cursedConfig.hasSound = true;
  cursedConfig.sound = "meow";
  SaveConfigs();
}

function CurseRoomTryPerson() {
  CurseRoomEyeGlow();
  cursedConfig.hasCursedSpeech = true;
  cursedConfig.bannedWords.push("i", "am", "myself", "me", "my", "mine");
  SaveConfigs();
}

function CurseRoomTryRespect() {
  CurseRoomEyeGlow();
  const exists = cursedConfig.charData.find(CD => CD.Number == 12401);
  if (!exists) {
    cursedConfig.charData.push({ NPriority: 0, Nickname: "Miss Ace", Number: 12401, RespectNickname: true, SavedName: "ace", TPriority: 0, Titles: [], isEnforced: false });
    SaveConfigs();
  }
}

async function CurseRoomCursedInfo() {
  DialogLeave();
  CursePreferenceRun();
  CurrentScreen = "CursePreference";
  CursePreferenceReturnRoom = "CurseRoom";
}

function CurseRoomEyeGlow() { 
  InventoryRemove(CurseRoomAce, "Eyes");
  InventoryRemove(CurseRoomAce, "Eyes2");
  InventoryWear(CurseRoomAce, "Eyes7", "Eyes", "#F5E1FD");
  InventoryWear(CurseRoomAce, "Eyes7", "Eyes2", "#F5E1FD");
  CharacterRefresh(CurseRoomAce);
  setTimeout(() => { 
    InventoryRemove(CurseRoomAce, "Eyes");
    InventoryRemove(CurseRoomAce, "Eyes2");
    InventoryWear(CurseRoomAce, "Eyes3", "Eyes", "#c0a4ff");
    InventoryWear(CurseRoomAce, "Eyes3", "Eyes2", "#c0a4ff");
    CharacterRefresh(CurseRoomAce);
  }, 6000);
}