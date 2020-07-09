"use strict";
var CursePreferenceBackground = "Sheet";
var CursePreferenceSubscreen = "";
var CursePreferenceErrors = [];
var CursePreferenceTemporaryConfig = null;
var CursePreferenceLinkSent = false;
var CursePreferenceLoaded = false;
var CursePreferenceMainLoaded = false;

//////////////////////////////////////////////////////////////////MAIN
// Validates updated data
function CursedConfigValidate() {
    CursePreferenceErrors = [];
    if (!CursePreferenceTemporaryConfig.slaveIdentifier.trim()) CursePreferenceErrors.push("Identifier");
}

function CursePreferenceLoad() {
    CursePreferenceMainLoaded = true;
	ElementCreateInput("Identifier");
	document.getElementById("Identifier").setAttribute("maxLength", 20);
	document.getElementById("Identifier").setAttribute("autocomplete", "off");
	ElementValue("Identifier", CursePreferenceTemporaryConfig.slaveIdentifier);
}
    
// Run the preference screen
function CursePreferenceRun() {
    // Draw Screen title
    DrawText(`- Curse Info Sheet: ${CursePreferenceSubscreen || 'Wearer'} -`, 500, 75, "Black", "Gray");
    DrawText('Some settings can only be changed by someone else.', 500, 125, "Black", "Gray");
    
    // Validate current inputs
    if (!CursePreferenceTemporaryConfig) CursePreferenceTemporaryConfig = { ...cursedConfig };
    CursedConfigValidate();

    // If the user is not cursed, draw not cursed
    if (!window.cursedConfig) CursePreferenceSubscreen = "NoCurse";

    // If a subscreen is active, draw that instead and unload the main one
    if (CursePreferenceSubscreen && CursePreferenceMainLoaded)  CursePreferenceUnload();
    if (CursePreferenceSubscreen == "NoCurse") return CursePreferenceSubscreenNoCurseRun();
    if (CursePreferenceSubscreen == "Lists") return CursePreferenceSubscreenListsRun();
    if (CursePreferenceSubscreen == "Permissions") return CursePreferenceSubscreenPermissionsRun();
    if (CursePreferenceSubscreen == "Punishments") return CursePreferenceSubscreenPunishmentsRun();
    if (CursePreferenceSubscreen == "Orgasms") return CursePreferenceSubscreenOrgasmsRun();
    if (CursePreferenceSubscreen == "Status") return CursePreferenceSubscreenStatusRun();
    if (CursePreferenceSubscreen == "Curses") return CursePreferenceSubscreenCursesRun();
    if (CursePreferenceSubscreen == "Speech") return CursePreferenceSubscreenSpeechRun();
    
    // Draw the screen icons
    if (CursePreferenceErrors.length == 0) {
        DrawButton(1815, 65, 90, 90, "", "White", "Icons/Exit.png");
        DrawButton(1815, 180, 90, 90, "", "White", "Icons/DialogPermissionMode.png");
        DrawButton(1815, 295, 90, 90, "", "White", "Icons/FriendList.png");
        DrawButton(1815, 410, 90, 90, "", "White", "Icons/Kidnap.png");
        DrawButton(1815, 525, 90, 90, "", "White", "Icons/Activity.png");
        DrawButton(1815, 640, 90, 90, "", "White", "Icons/Lock.png");
        DrawButton(1815, 755, 90, 90, "", "White", "Icons/Naked.png");
        DrawButton(1815, 870, 90, 90, "", "White", "Icons/Chat.png");
    }


    // MAIN PAGE //
    
    
    // Loads Main inputs if not loaded
    if (!CursePreferenceLoaded) CursePreferenceLoad();
    
    // Draw Editable
	DrawText("Identifier Name:", 250, 255, CursePreferenceErrors.includes("Identifier") ?  "Red" : "Black", "Gray");
	ElementPosition("Identifier", 650, 250, 500);
    
    // Draw Info
    DrawText(`Identifier: ${CursePreferenceTemporaryConfig.commandChar + CursePreferenceTemporaryConfig.slaveIdentifier}`, 1350, 100, "Black", "Gray");
    DrawText(`Version: ${currentManifestVersion}`, 1350, 150, "Black", "Gray");
    DrawText(`Last Stable: ${cursedVersionData ? cursedVersionData.stable : "Unknown"} - Last Beta: ${cursedVersionData ? cursedVersionData.beta : "Unknown"}`, 1350, 200, "Black", "Gray");

    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 312, 64, 64, "Enable intense mode", CursePreferenceTemporaryConfig.hasIntenseVersion);
    DrawCheckbox(100, 392, 64, 64, "Hide valid commands in chat", CursePreferenceTemporaryConfig.isEatingCommands);
    DrawCheckbox(100, 472, 64, 64, "Hide the curse display icons (Not Recommended)", CursePreferenceTemporaryConfig.hasHiddenDisplay);
    DrawCheckbox(100, 552, 64, 64, "Enable enhanced appearance menu (Recommended)", CursePreferenceTemporaryConfig.hasWardrobeV2);
    DrawCheckbox(100, 632, 64, 64, "Remove restraints when lifting curses on items.", CursePreferenceTemporaryConfig.hasRestraintVanish);
    DrawCheckbox(100, 712, 64, 64, "Do not block messages with transgressions", CursePreferenceTemporaryConfig.isClassic);
    DrawCheckbox(100, 792, 64, 64, "Do not display actions in rooms (Not Recommended)", CursePreferenceTemporaryConfig.isSilent);
    DrawCheckbox(100, 872, 64, 64, "Show me all whispers sent by the curse (Not Recommended)", CursePreferenceTemporaryConfig.hasForward);
    MainCanvas.textAlign = "center";
    
    // Sets editable value
    CursePreferenceTemporaryConfig.slaveIdentifier = ElementValue("Identifier");
}

// When the user clicks in the preference screen
function CursePreferenceClick() {

    // If a subscreen is active, process that instead
    if (CursePreferenceSubscreen == "NoCurse") return CursePreferenceSubscreenNoCurseClick();
    if (CursePreferenceSubscreen == "Lists") return CursePreferenceSubscreenListsClick();
    if (CursePreferenceSubscreen == "Permissions") return CursePreferenceSubscreenPermissionsClick();
    if (CursePreferenceSubscreen == "Punishments") return CursePreferenceSubscreenPunishmentsClick();
    if (CursePreferenceSubscreen == "Orgasms") return CursePreferenceSubscreenOrgasmsClick();
    if (CursePreferenceSubscreen == "Status") return CursePreferenceSubscreenStatusClick();
    if (CursePreferenceSubscreen == "Curses") return CursePreferenceSubscreenCursesClick();
    if (CursePreferenceSubscreen == "Speech") return CursePreferenceSubscreenSpeechClick();

    // If the user clicks on "Exit"
    if (CursePreferenceErrors.length == 0) {
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 65) && (MouseY < 155)) CursePreferenceExit();

        // If the user clicks on the sub setting buttons
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 180) && (MouseY < 270)) {
            CursePreferenceSubscreen = "Lists";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 295) && (MouseY < 385)) {
            CursePreferenceSubscreen = "Permissions";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 410) && (MouseY < 500)) {
            CursePreferenceSubscreen = "Punishments";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 525) && (MouseY < 615)) {
            CursePreferenceSubscreen = "Orgasms";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 640) && (MouseY < 730)) {
            CursePreferenceSubscreen = "Status";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 755) && (MouseY < 845)) {
            CursePreferenceSubscreen = "Curses";
        }
        if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 870) && (MouseY < 960)) {
            CursePreferenceSubscreen = "Speech";
        }
    }

    // Main page clicks
    // Checkboxes
    if (CommonIsClickAt(100, 312, 64, 64))
        CursePreferenceTemporaryConfig.hasIntenseVersion = !CursePreferenceTemporaryConfig.hasIntenseVersion;
    if (CommonIsClickAt(100, 392, 64, 64))
        CursePreferenceTemporaryConfig.isEatingCommands = !CursePreferenceTemporaryConfig.isEatingCommands;
    if (CommonIsClickAt(100, 472, 64, 64))
        CursePreferenceTemporaryConfig.hasHiddenDisplay = !CursePreferenceTemporaryConfig.hasHiddenDisplay;
    if (CommonIsClickAt(100, 552, 64, 64))
        CursePreferenceTemporaryConfig.hasWardrobeV2 = !CursePreferenceTemporaryConfig.hasWardrobeV2;
    if (CommonIsClickAt(100, 632, 64, 64))
        CursePreferenceTemporaryConfig.hasRestraintVanish = !CursePreferenceTemporaryConfig.hasRestraintVanish;
    if (CommonIsClickAt(100, 712, 64, 64))
        CursePreferenceTemporaryConfig.isClassic = !CursePreferenceTemporaryConfig.isClassic;
    if (CommonIsClickAt(100, 792, 64, 64))
        CursePreferenceTemporaryConfig.isSilent = !CursePreferenceTemporaryConfig.isSilent;
    if (CommonIsClickAt(100, 872, 64, 64))
        CursePreferenceTemporaryConfig.hasForward = !CursePreferenceTemporaryConfig.hasForward;
}

// When we leave the main screen
function CursePreferenceUnload() { 
    CursePreferenceMainLoaded = false;
    ElementRemove("Identifier");
}

// When the user exit the preference screen, we save all valid info or block with error message
function CursePreferenceExit() {
    CursePreferenceUnload();
    cursedConfig = { ...CursePreferenceTemporaryConfig };
    CursePreferenceTemporaryConfig = null;
    CurseRoomRun();
    CurrentScreen = "CurseRoom";
}



//////////////////////////////////////////////////////////////////NO CURSE
// Redirected to from the main Run function if the player is in the no curse settings subscreen
function CursePreferenceSubscreenNoCurseRun() {
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    if (!VersionIsEqualOrAbove(currentManifestVersion, cursedVersionData.minimum)) {
        DrawText("CRITICAL: YOUR CURSE IS OUT OF DATE. PLEASE UPDATE IT NOW.", 1000, 325, "Red", "Gray");
        if (!CursePreferenceLinkSent) {
            CursePreferenceLinkSent = true;
            window.open('https://github.com/ace-1331/ace12401-cursedscript/releases');
        }
    } else {
        DrawText("You are not cursed. To change your curse settings, get cursed first by talking with ace.", 1000, 325, "Black", "Gray");
    }
}

// When the user clicks in the no curse preference subscreen
function CursePreferenceSubscreenNoCurseClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
        CursePreferenceExit();
    }
}



//////////////////////////////////////////////////////////////////Lists
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenListsLoad() { 
    CursePreferenceLoaded = true;
	ElementCreateTextArea("Owners");
	document.getElementById("Owners").setAttribute("maxLength", "1000");
	document.getElementById("Owners").setAttribute("autocomplete", "off");
	ElementValue("Owners", CursePreferenceTemporaryConfig.owners.join(","));
	ElementCreateTextArea("Mistresses");
	document.getElementById("Mistresses").setAttribute("maxLength", "1000");
	document.getElementById("Mistresses").setAttribute("autocomplete", "off");
	ElementValue("Mistresses", CursePreferenceTemporaryConfig.mistresses.join(","));
	ElementCreateTextArea("Blacklist");
	document.getElementById("Blacklist").setAttribute("maxLength", "1000");
	document.getElementById("Blacklist").setAttribute("autocomplete", "off");
    ElementValue("Blacklist", CursePreferenceTemporaryConfig.blacklist.join(","));
    
    if (CursePreferenceTemporaryConfig.hasRestrainedPlay) { 
        document.getElementById("Mistresses").setAttribute("disabled", "disabled");
        document.getElementById("Owners").setAttribute("disabled", "disabled");
    }
}

function CursePreferenceSubscreenListsRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenListsLoad();
    
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    
    // Draw lists
	DrawText("Curse owners:", 350, 200, "Black", "Gray");
    ElementPosition("Owners", 350, 400, 430, 320);
    
	DrawText("Mistresses:", 925, 200, "Black", "Gray");
    ElementPosition("Mistresses", 925, 400, 430, 320);
    
	DrawText("Curse blacklist:", 1500, 200, "Black", "Gray");
    ElementPosition("Blacklist", 1500, 400, 430, 320);
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenListsClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenListsExit();
    }
}

function CursePreferenceSubscreenListsExit() { 
    // Sets editable value (Can't be erroneous)
    CursePreferenceTemporaryConfig.owners = ConvertStringToStringNumberArray(ElementValue("Owners"));
    CursePreferenceTemporaryConfig.mistresses = ConvertStringToStringNumberArray(ElementValue("Mistresses"));
    CursePreferenceTemporaryConfig.blacklist = ConvertStringToStringNumberArray(ElementValue("Blacklist"));
    
    ElementRemove("Owners");
    ElementRemove("Mistresses");
    ElementRemove("Blacklist");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}


//////////////////////////////////////////////////////////////////Permissions
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPermissionsLoad() { 
    CursePreferenceLoaded = true;
	ElementCreateTextArea("BannedCommands");
	document.getElementById("BannedCommands").setAttribute("maxLength", "1000");
	document.getElementById("BannedCommands").setAttribute("autocomplete", "off");
    ElementValue("BannedCommands", CursePreferenceTemporaryConfig.disabledCommands.join(","));
    
    if (CursePreferenceTemporaryConfig.hasFullCurse) { 
        document.getElementById("BannedCommands").setAttribute("disabled", "disabled");
    }
}

function CursePreferenceSubscreenPermissionsRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenPermissionsLoad();
    
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    
    // Info
	DrawText("List of blacklisted commands:", 1400, 100, "Black", "Gray");
    ElementPosition("BannedCommands", 1400, 300, 430, 320);
    
    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 552, 64, 64, "Allow blacklisting commands", !CursePreferenceTemporaryConfig.hasFullCurse);
    DrawCheckbox(100, 632, 64, 64, "Allow the wearer to add mistresses and owners", !CursePreferenceTemporaryConfig.hasRestrainedPlay);
    DrawCheckbox(100, 712, 64, 64, "Allow public commands", CursePreferenceTemporaryConfig.hasPublicAccess);
    DrawCheckbox(100, 792, 64, 64, "Allow the public to use mistress functions", CursePreferenceTemporaryConfig.hasFullPublic);
    DrawCheckbox(100, 872, 64, 64, "Allow curse owners to use owner rules", CursePreferenceTemporaryConfig.isLooseOwner);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPermissionsClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenPermissionsExit();
    }
}

function CursePreferenceSubscreenPermissionsExit() { 
    // Sets editable value (Can't be erroneous)
    CursePreferenceTemporaryConfig.disabledCommands = ElementValue("BannedCommands").split(",");
    
    ElementRemove("BannedCommands");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}



//////////////////////////////////////////////////////////////////Orgasms
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenOrgasmsRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

    // Info
    DrawText(`Orgasm count: ${CursePreferenceTemporaryConfig.orgasms}`, 200, 400, "Black", "Gray");

    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 472, 64, 64, "Prevent orgasms", CursePreferenceTemporaryConfig.cannotOrgasm);
    DrawCheckbox(100, 552, 64, 64, "Punish for orgasms", CursePreferenceTemporaryConfig.forbidorgasm);
    DrawCheckbox(100, 632, 64, 64, `Cursed vibrators (Intensity: ${cursedConfig.vibratorIntensity + 1}/4)`, CursePreferenceTemporaryConfig.hasCursedOrgasm);
    DrawCheckbox(100, 712, 64, 64, "Arousal meter locked to automatic", CursePreferenceTemporaryConfig.hasForcedMeterLocked);
    DrawCheckbox(100, 792, 64, 64, "Arousal meter locked to off", CursePreferenceTemporaryConfig.hasForcedMeterOff);
    DrawCheckbox(100, 872, 64, 64, "Arousal meter hidden", CursePreferenceTemporaryConfig.hasSecretOrgasm);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenOrgasmsClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreen = "";
    }
}



//////////////////////////////////////////////////////////////////Status
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenStatusRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    
    
    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 152, 64, 64, "Alter blinding items to make them fully blind the wearer", CursePreferenceTemporaryConfig.hasFullBlindMode);
    DrawCheckbox(100, 232, 64, 64, "Force the wearer to retype a message containing transgressions", CursePreferenceTemporaryConfig.mustRetype);
    DrawCheckbox(100, 312, 64, 64, "Leashing (Get dragged into another room by curse owners when receiving triple beeps)", CursePreferenceTemporaryConfig.canLeash);
    DrawCheckbox(100, 392, 64, 64, "Disable rescue maids and other NPC release dialogs", CursePreferenceTemporaryConfig.hasNoMaid);
    DrawCheckbox(100, 472, 64, 64, "Rejoin rooms you are tied in after disconnecting", CursePreferenceTemporaryConfig.hasDCPrevention);
    DrawCheckbox(100, 552, 64, 64, "Sensory Deprivation locked to total", CursePreferenceTemporaryConfig.hasForcedSensDep);
    DrawCheckbox(100, 632, 64, 64, "Prevent the wearer from having new lovers", CursePreferenceTemporaryConfig.isLockedNewLover);
    DrawCheckbox(100, 712, 64, 64, "Prevent the wearer from having new subs", CursePreferenceTemporaryConfig.isLockedNewSub);
    DrawCheckbox(100, 792, 64, 64, "Prevent the wearer from breaking their collar", CursePreferenceTemporaryConfig.isLockedOwner);
    DrawCheckbox(100, 872, 64, 64, "Disable OOC when gagged", CursePreferenceTemporaryConfig.hasBlockedOOC);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenStatusClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreen = "";
    }
    // Checkboxes
    if (CommonIsClickAt(100, 152, 64, 64))
        CursePreferenceTemporaryConfig.hasFullBlindMode = !CursePreferenceTemporaryConfig.hasFullBlindMode;
}



//////////////////////////////////////////////////////////////////Punishments
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPunishmentsRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

    // Info
    DrawText(`Current amount of strikes (auto-punish): ${CursePreferenceTemporaryConfig.strikes}`, 750, 220, "Black", "Gray");
    DrawText(`Strikes reset on: ${new Date(CursePreferenceTemporaryConfig.strikeStartTime + 6.048e+8).toLocaleString()}`, 750, 280, "Black", "Gray");
    DrawText(`Punishment restraints: `, 750, 350, "Black", "Gray");

    CursePreferenceTemporaryConfig.punishmentRestraints.forEach((PR, Idx) => {
        var A = Asset.find(A => A.Name == PR.name && A.Group.Name == PR.group)
        DrawText(`Stage ${PR.stage}: ${A.Description} (${A.Group.Description})`, 750, 410 + Idx * 60, "Black", "Gray");
    });

    MainCanvas.textAlign = "left";
    DrawCheckbox(1300, 100, 64, 64, "Auto punishment", !CursePreferenceTemporaryConfig.punishmentsDisabled);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPunishmentsClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreen = "";
    }
}


//////////////////////////////////////////////////////////////////Curses
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenCursesRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

    // Info
    DrawText(`Active curses: `, 750, 220, "Black", "Gray");

    CursePreferenceTemporaryConfig.cursedAppearance.forEach((CA, Idx) => {
        var A = Asset.find(A => A.Name == CA.name && A.Group.Name == CA.group)
        DrawText(`${A ? A.Group.Description : CA.group}: ${A ? A.Description : "Forced empty"} ${CA.dateOfRemoval ? `(Expires: ${new Date(CA.dateOfRemoval).toLocaleString()})` : ''}`, 750, 270 + Idx * 50, "Black", "Gray");
    });

    MainCanvas.textAlign = "left";
    DrawCheckbox(1300, 100, 64, 64, "Cursed kneeling", CursePreferenceTemporaryConfig.hasCursedKneel);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenCursesClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreen = "";
    }
}


//////////////////////////////////////////////////////////////////Speech
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenSpeechLoad() { 
    CursePreferenceLoaded = true;
	ElementCreateTextArea("BannedWords");
	document.getElementById("BannedWords").setAttribute("autocomplete", "off");
	document.getElementById("BannedWords").setAttribute("disabled", "disabled");
	ElementValue("BannedWords", CommonConvertArrayToString(CursePreferenceTemporaryConfig.bannedWords));
}

function CursePreferenceSubscreenSpeechRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenSpeechLoad();
    
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    // Info
	DrawText("List of banned words:", 1400, 100, "Black", "Gray");
	ElementPosition("BannedWords", 1400, 300, 430, 320);
    
    
    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 392, 64, 64, "Blocked words", CursePreferenceTemporaryConfig.hasCursedSpeech);
    DrawCheckbox(100, 472, 64, 64, "Allow contractions", !CursePreferenceTemporaryConfig.hasNoContractions);
    DrawCheckbox(100, 552, 64, 64, "Punish for speaking (Muted)", CursePreferenceTemporaryConfig.isMute);
    DrawCheckbox(100, 632, 64, 64, "Completely muted (Prevents sending normal messages)", CursePreferenceTemporaryConfig.hasFullMuteChat);
    DrawCheckbox(100, 712, 64, 64, `Has a sound (Current sound: ${CursePreferenceTemporaryConfig.sound || 'No sound set'})`, CursePreferenceTemporaryConfig.hasSound);
    DrawCheckbox(100, 792, 64, 64, "Doll talk (small words & sentences)", CursePreferenceTemporaryConfig.hasDollTalk);
    DrawCheckbox(100, 872, 64, 64, "Restrained Speech (Advanced)", CursePreferenceTemporaryConfig.hasRestrainedSpeech);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenSpeechClick() {
    // If the user clicked the exit icon to return to the main screen
    if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenSpeechExit();
    }
}

function CursePreferenceSubscreenSpeechExit() { 
    ElementRemove("BannedWords");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}