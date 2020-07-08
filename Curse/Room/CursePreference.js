"use strict";
var CursePreferenceBackground = "Sheet";
var CursePreferenceSubscreen = "";

//////////////////////////////////////////////////////////////////MAIN

// Run the preference screen
function CursePreferenceRun() {
    // Screen title
    DrawText("- Curse Settings: " + (CursePreferenceSubscreen || 'Wearer') + " -", 500, 100, "Black", "Gray");
    
    // If the user is not cursed, draw not cursed
    if (!window.cursedConfig) CursePreferenceSubscreen = "NoCurse";
    
	// If a subscreen is active, draw that instead
	if (CursePreferenceSubscreen == "Lists") return CursePreferenceSubscreenListsRun();
	if (CursePreferenceSubscreen == "Permissions") return CursePreferenceSubscreenPermissionsRun();
	if (CursePreferenceSubscreen == "Punishments") return CursePreferenceSubscreenPunishmentsRun();
	if (CursePreferenceSubscreen == "Orgasms") return CursePreferenceSubscreenOrgasmsRun();
	if (CursePreferenceSubscreen == "Status") return CursePreferenceSubscreenStatusRun();
	if (CursePreferenceSubscreen == "NoCurse") return CursePreferenceSubscreenNoCurseRun();

	// Draw the main preferences
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    DrawButton(1815, 190, 90, 90, "", "White", "Icons/DialogPermissionMode.png");
    DrawButton(1815, 305, 90, 90, "", "White", "Icons/Chat.png");
    DrawButton(1815, 420, 90, 90, "", "White", "Icons/Kidnap.png");
    DrawButton(1815, 535, 90, 90, "", "White", "Icons/Activity.png");
    DrawButton(1815, 650, 90, 90, "", "White", "Icons/Lock.png");
	
}

// When the user clicks in the preference screen
function CursePreferenceClick() {

	// If a subscreen is active, process that instead
	if (CursePreferenceSubscreen == "Lists") return CursePreferenceSubscreenListsClick();
	if (CursePreferenceSubscreen == "Permissions") return CursePreferenceSubscreenPermissionsClick();
	if (CursePreferenceSubscreen == "Punishments") return CursePreferenceSubscreenPunishmentsClick();
	if (CursePreferenceSubscreen == "Orgasms") return CursePreferenceSubscreenOrgasmsClick();
	if (CursePreferenceSubscreen == "Status") return CursePreferenceSubscreenStatusClick();
	if (CursePreferenceSubscreen == "NoCurse") return CursePreferenceSubscreenNoCurseClick();

	// If the user clicks on "Exit"
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) CursePreferenceExit();

	// If the user clicks on the sub setting buttons
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 190) && (MouseY < 280)) {
		CursePreferenceSubscreen = "Lists";
	}
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 305) && (MouseY < 395)) {
		CursePreferenceSubscreen = "Permissions";
	}
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 420) && (MouseY < 510)) {
		CursePreferenceSubscreen = "Punishments";
	}
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 535) && (MouseY < 625)) {
		CursePreferenceSubscreen = "Orgasms";
	}
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 650) && (MouseY < 740)) {
		CursePreferenceSubscreen = "Status";
	}
}

// When the user exit the preference screen, we save all valid info or block with error message
function CursePreferenceExit() {
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
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenListsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Permissions
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPermissionsRun() {
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPermissionsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Orgasms
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenOrgasmsRun() {
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenOrgasmsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Status
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenStatusRun() {
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenStatusClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
		CursePreferenceSubscreen = "";
	}
}



//////////////////////////////////////////////////////////////////Punishments
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPunishmentsRun() {
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPunishmentsClick() {
	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) {
		CursePreferenceSubscreen = "";
	}
}