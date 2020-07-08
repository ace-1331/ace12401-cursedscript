"use strict";
var CursePreferenceBackground = "Sheet";
var CursePreferenceSubscreen = "";
var CursePreferenceErrors = [];
var CursePreferenceTemporaryConfig = null;

//////////////////////////////////////////////////////////////////MAIN
function CursedConfigValidate() { 
    
}

// Run the preference screen
function CursePreferenceRun() {
    // Validate current inputs
    if (!CursePreferenceTemporaryConfig) CursePreferenceTemporaryConfig = { ...cursedConfig };
    CursedConfigValidate();
    
    // Screen title
    DrawText(`- Curse Info Sheet: ${CursePreferenceSubscreen || 'Wearer'} -`, 500, 100, "Black", "Gray");
    DrawText('Some settings can only be changed by someone else.', 500, 150, "Black", "Gray");
    
    // If the user is not cursed, draw not cursed
    if (!window.cursedConfig) CursePreferenceSubscreen = "NoCurse";
    
	// If a subscreen is active, draw that instead
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
    
    
    // Draw Actual main configurations
    // Inputs
    
	DrawText(`Identifier: (${CursePreferenceTemporaryConfig.commandChar + CursePreferenceTemporaryConfig.slaveIdentifier})`, 505, 200, "Black", "Gray");
	
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

// When the user exit the preference screen, we save all valid info or block with error message
function CursePreferenceExit() {
    cursedConfig = { ...CursePreferenceTemporaryConfig };
    CursePreferenceTemporaryConfig = null;
    CurseRoomRun();
    CurrentScreen = "CurseRoom";
}



//////////////////////////////////////////////////////////////////NO CURSE
// Redirected to from the main Run function if the player is in the no curse settings subscreen
function CursePreferenceSubscreenNoCurseRun() {
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawText("You are not cursed. To change your curse settings, get cursed first by talking with ace.", 1000, 325, "Black", "Gray");
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
function CursePreferenceSubscreenListsRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenListsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Permissions
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPermissionsRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPermissionsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
		CursePreferenceSubscreen = "";
	}
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
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenStatusClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Punishments
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPunishmentsRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    
    // Info
    DrawText(`Current amount of strikes (auto-punish): ${CursePreferenceTemporaryConfig.strikes}`, 750, 220, "Black", "Gray");
    DrawText(`Strikes reset on: ${new Date(CursePreferenceTemporaryConfig.strikeStartTime + 6.048e+8).toLocaleDateString()}`, 750, 280, "Black", "Gray");
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
function CursePreferenceSubscreenSpeechRun() {
    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenSpeechClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (CursePreferenceErrors.length == 0)) {
		CursePreferenceSubscreen = "";
	}
}