"use strict";
var CursePreferenceBackground = "Sheet";
var CursePreferenceSubscreen = "";
var CursePreferenceErrors = [];
var CursePreferenceTemporaryConfig = null;
var CursePreferenceLinkSent = false;
var CursePreferenceLoaded = false;
var CursePreferenceMainLoaded = false;
var CursePreferenceErrorMessage = null;
var CursePreferenceErrorMessageTime = null;
var CursePreferenceCurrentTip = "";
var CursePreferenceReturnRoom = "CurseRoom";

//////////////////////////////////////////////////////////////////MAIN
// Validates updated data
function CursedConfigValidate() {
    CursePreferenceErrors = [];
    if (!CursePreferenceTemporaryConfig.slaveIdentifier.trim())
        CursePreferenceErrors.push("Identifier");
    if (CursePreferenceErrors.length > 0) {
        CursePreferenceErrorMessage = "Input fields contain errors";
        CursePreferenceErrorMessageTime = Date.now() + 2000;
    }
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
    if (CursePreferenceErrorMessage && CursePreferenceErrorMessageTime > Date.now()) { 
        DrawText('Error: ' + CursePreferenceErrorMessage, 500, 125, "Red", "Gray");
    } else {
        DrawText('[O]: Club owner [CO]: Curse Owner+ [M]: Mistress+.', 500, 125, "Black", "Gray"); CursePreferenceErrorMessage = null;
    }

    // Validate current inputs
    if (window.cursedConfig) {
        if (!CursePreferenceTemporaryConfig) CursePreferenceTemporaryConfig = { ...cursedConfig };
        CursedConfigValidate();
    }

    // If the user is not cursed, draw not cursed
    if (!window.cursedConfig) CursePreferenceSubscreen = "NoCurse";

    // If a subscreen is active, draw that instead and unload the main one
    if (CursePreferenceSubscreen && CursePreferenceMainLoaded) CursePreferenceUnload();
    if (CursePreferenceSubscreen == "NoCurse") return CursePreferenceSubscreenNoCurseRun();
    if (CursePreferenceSubscreen == "Lists") return CursePreferenceSubscreenListsRun();
    if (CursePreferenceSubscreen == "Permissions") return CursePreferenceSubscreenPermissionsRun();
    if (CursePreferenceSubscreen == "Punishments") return CursePreferenceSubscreenPunishmentsRun();
    if (CursePreferenceSubscreen == "Orgasms") return CursePreferenceSubscreenOrgasmsRun();
    if (CursePreferenceSubscreen == "Status") return CursePreferenceSubscreenStatusRun();
    if (CursePreferenceSubscreen == "Curses") return CursePreferenceSubscreenCursesRun();
    if (CursePreferenceSubscreen == "Speech") return CursePreferenceSubscreenSpeechRun();
    if (CursePreferenceSubscreen == "Appearance") return CursePreferenceSubscreenAppearanceRun();
    if (CursePreferenceSubscreen == "Tip") return CursePreferenceSubscreenTipRun();

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

        DrawButton(1705, 755, 90, 90, "", "White", "Icons/Question.png");
        DrawButton(1705, 870, 90, 90, "", "White", "Icons/ColorPick.png");
    }


    // MAIN PAGE //


    // Loads Main inputs if not loaded
    if (!CursePreferenceMainLoaded) CursePreferenceLoad();

    // Draw Editable
    DrawText("Identifier Name:", 250, 255, CursePreferenceErrors.includes("Identifier") ? "Red" : "Black", "Gray");
    ElementPosition("Identifier", 650, 250, 500);

    // Draw Info
    DrawText(`Identifier: ${CursePreferenceTemporaryConfig.commandChar + CursePreferenceTemporaryConfig.slaveIdentifier}`, 1350, 80, "Black", "Gray");
    DrawText(`Version: ${currentManifestVersion}`, 1350, 130, "Black", "Gray");
    DrawText(`Last Stable: ${cursedVersionData ? cursedVersionData.stable : "Unknown"} - Last Beta: ${cursedVersionData ? cursedVersionData.beta : "Unknown"}`, 1350, 180, "Black", "Gray");

    // Import/Export
    if (navigator.clipboard) {
        DrawButton(1170, 215, 180, 65, "Import", "White");
        DrawButton(1370, 215, 180, 65, "Export", "White");
    }

    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 312, 64, 64, "Enable intense mode", CursePreferenceTemporaryConfig.hasIntenseVersion);
    DrawCheckbox(100, 392, 64, 64, "Hide valid commands in chat", CursePreferenceTemporaryConfig.isEatingCommands);
    DrawCheckbox(100, 472, 64, 64, "Hide the curse display icons (Not Recommended)", CursePreferenceTemporaryConfig.hasHiddenDisplay);
    DrawCheckbox(100, 552, 64, 64, "Enable enhanced appearance menu (🌟)", CursePreferenceTemporaryConfig.hasWardrobeV2);
    DrawCheckbox(100, 632, 64, 64, "Remove restraints when lifting curses on items.", CursePreferenceTemporaryConfig.hasRestraintVanish);
    DrawCheckbox(100, 712, 64, 64, "Do not block messages with transgressions", CursePreferenceTemporaryConfig.isClassic);
    DrawCheckbox(100, 792, 64, 64, "Do not display actions in rooms (Not Recommended)", CursePreferenceTemporaryConfig.isSilent);
    DrawCheckbox(100, 872, 64, 64, "Show me all whispers sent by the curse (Not Recommended)", CursePreferenceTemporaryConfig.hasForward);

    DrawCheckbox(1100, 312, 64, 64, "Capture mode", CursePreferenceTemporaryConfig.hasCaptureMode);
    DrawCheckbox(1100, 392, 64, 64, "Bigger chat input", CursePreferenceTemporaryConfig.hasFullLengthMode);
    DrawCheckbox(1100, 472, 64, 64, "Hide the help message on login", CursePreferenceTemporaryConfig.hideHelp);
    DrawCheckbox(1100, 552, 64, 64, "Enable enhanced commands (🌟)", CursePreferenceTemporaryConfig.hasCommandsV2);

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
    if (CursePreferenceSubscreen == "Appearance") return CursePreferenceSubscreenAppearanceClick();
    if (CursePreferenceSubscreen == "Tip") return CursePreferenceSubscreenTipClick();

    // If the user clicks on "Exit"
    if (CursePreferenceErrors.length == 0) {
        if (MouseIn(1815, 65, 1905-1815, 155-65)) CursePreferenceExit();

        // If the user clicks on the sub setting buttons
        if (MouseIn(1815, 180, 1905-1815, 270-180)) {
            CursePreferenceSubscreen = "Lists";
        }
        if (MouseIn(1815, 295, 1905-1815, 385-295)) {
            CursePreferenceSubscreen = "Permissions";
        }
        if (MouseIn(1815, 410, 1905-1815, 500-410)) {
            CursePreferenceSubscreen = "Punishments";
        }
        if (MouseIn(1815, 525, 1905-1815, 615-525)) {
            CursePreferenceSubscreen = "Orgasms";
        }
        if (MouseIn(1815, 640, 1905-1815, 730-640)) {
            CursePreferenceSubscreen = "Status";
        }
        if (MouseIn(1815, 755, 1905-1815, 845-755)) {
            CursePreferenceSubscreen = "Curses";
        }
        if (MouseIn(1815, 870, 1905-1815, 960-870)) {
            CursePreferenceSubscreen = "Speech";
        }

        if (MouseIn(1705, 755, 1795-1705, 845-755)) {
            CursePreferenceSubscreen = "Tip";
        }
        if (MouseIn(1705, 870, 1795-1705, 960-870)) {
            CursePreferenceSubscreen = "Appearance";
        }
    }

    // Main page clicks
    // Checkboxes
    if (MouseIn(100, 312, 64, 64))
        CursePreferenceTemporaryConfig.hasIntenseVersion = !CursePreferenceTemporaryConfig.hasIntenseVersion;
    if (MouseIn(100, 392, 64, 64))
        CursePreferenceTemporaryConfig.isEatingCommands = !CursePreferenceTemporaryConfig.isEatingCommands;
    if (MouseIn(100, 472, 64, 64))
        CursePreferenceTemporaryConfig.hasHiddenDisplay = !CursePreferenceTemporaryConfig.hasHiddenDisplay;
    if (MouseIn(100, 552, 64, 64))
        CursePreferenceTemporaryConfig.hasWardrobeV2 = !CursePreferenceTemporaryConfig.hasWardrobeV2;
    if (MouseIn(100, 632, 64, 64))
        CursePreferenceTemporaryConfig.hasRestraintVanish = !CursePreferenceTemporaryConfig.hasRestraintVanish;
    if (MouseIn(100, 712, 64, 64))
        CursePreferenceTemporaryConfig.isClassic = !CursePreferenceTemporaryConfig.isClassic;
    if (MouseIn(100, 792, 64, 64))
        CursePreferenceTemporaryConfig.isSilent = !CursePreferenceTemporaryConfig.isSilent;
    if (MouseIn(100, 872, 64, 64))
        CursePreferenceTemporaryConfig.hasForward = !CursePreferenceTemporaryConfig.hasForward;

    if (MouseIn(1100, 312, 64, 64))
        CursePreferenceTemporaryConfig.hasCaptureMode = !CursePreferenceTemporaryConfig.hasCaptureMode;
    if (MouseIn(1100, 392, 64, 64))
        CursePreferenceTemporaryConfig.hasFullLengthMode = !CursePreferenceTemporaryConfig.hasFullLengthMode;
    if (MouseIn(1100, 472, 64, 64))
        CursePreferenceTemporaryConfig.hideHelp = !CursePreferenceTemporaryConfig.hideHelp;
    if (MouseIn(1100, 552, 64, 64))
        CursePreferenceTemporaryConfig.hasCommandsV2 = !CursePreferenceTemporaryConfig.hasCommandsV2;

    // Import/Export
    if (navigator.clipboard) {
        if (MouseIn(1170, 215, 180, 65)) {
            CursePreferenceImportConfig();
        }
        if (MouseIn(1370, 215, 180, 65)) {
            CursePreferenceExportConfig();
        }
    }
}

async function CursePreferenceExportConfig() { 
    try {
        await navigator.clipboard.writeText(
            LZString.compressToUTF16(JSON.stringify(CursePreferenceTemporaryConfig))
        );
        DrawCustomBeepText("Curse data copied to clipboard!");
    } catch (err) { 
        CursePreferenceErrorMessage = "Could not export.";
        CursePreferenceErrorMessageTime = Date.now() + 10000;
    }
}

async function CursePreferenceImportConfig() { 
    try {
        const clip = await navigator.clipboard.readText();
        const configs = JSON.parse(LZString.decompressFromUTF16(clip));
        // We need to make sure this is the same version
        let hasError = false;
        Object.keys(configs).forEach(K => { 
            if (CursePreferenceTemporaryConfig[K] == undefined) { 
                CursePreferenceErrorMessage = "Wrong config version. Contains: " + K;
                CursePreferenceErrorMessageTime = Date.now() + 10000;
                hasError = true;
                return;
            }
        });
        if (!hasError) {
            CursePreferenceTemporaryConfig = { ...CursePreferenceTemporaryConfig, ...configs };
            DrawCustomBeepText("Curse data imported from the clipboard!");
        }
    } catch (err) { 
        console.log(err)
        CursePreferenceErrorMessage = "Could not import, invalid config string.";
        CursePreferenceErrorMessageTime = Date.now() + 10000;
    }
}

// When we leave the main screen
function CursePreferenceUnload() {
    CursePreferenceMainLoaded = false;
    ElementRemove("Identifier");
}

// When the user exit the preference screen, we save all valid info or block with error message
function CursePreferenceExit() {
    if (cursedConfig) {
        cursedConfig = { ...CursePreferenceTemporaryConfig };
        SaveConfigs();
        DrawCustomBeepText("Curse data saved.");
    }
    CursePreferenceUnload();
    CursePreferenceTemporaryConfig = null;
    if (CursePreferenceReturnRoom == "CurseRoom") {
        CurseRoomRun();
        CurrentScreen = "CurseRoom";
    } else { 
        CommonSetScreen("Online", "ChatRoom");
    }
}



//////////////////////////////////////////////////////////////////NO CURSE
// Redirected to from the main Run function if the player is in the no curse settings subscreen
function CursePreferenceSubscreenNoCurseRun() {
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
    if (cursedVersionData && !VersionIsEqualOrAbove(currentManifestVersion, cursedVersionData.minimum)) {
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
    if (MouseIn(1815, 75, 1905-1815, 165-75)) {
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
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
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
    DrawCheckbox(100, 552, 64, 64, "[CO] Allow blacklisting commands", !CursePreferenceTemporaryConfig.hasFullCurse);
    DrawCheckbox(100, 632, 64, 64, "[CO] Allow the wearer to add mistresses and owners", !CursePreferenceTemporaryConfig.hasRestrainedPlay);
    DrawCheckbox(100, 712, 64, 64, "[M] Allow public commands", CursePreferenceTemporaryConfig.hasPublicAccess);
    DrawCheckbox(100, 792, 64, 64, "[CO] Allow the public to use mistress functions", CursePreferenceTemporaryConfig.hasFullPublic);
    DrawCheckbox(100, 872, 64, 64, "[O] Allow curse owners to use owner rules", CursePreferenceTemporaryConfig.isLooseOwner);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPermissionsClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
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
    DrawCheckbox(100, 472, 64, 64, "[CO] Prevent orgasms", CursePreferenceTemporaryConfig.cannotOrgasm);
    DrawCheckbox(100, 552, 64, 64, "[CO] Punish for orgasms", CursePreferenceTemporaryConfig.forbidorgasm);
    DrawCheckbox(100, 632, 64, 64, `[M] Cursed vibrators (Intensity: ${cursedConfig.vibratorIntensity + 1}/4)`, CursePreferenceTemporaryConfig.hasCursedOrgasm);
    DrawCheckbox(100, 712, 64, 64, "[CO] Arousal meter locked to automatic", CursePreferenceTemporaryConfig.hasForcedMeterLocked);
    DrawCheckbox(100, 792, 64, 64, "[CO] Arousal meter locked to off", CursePreferenceTemporaryConfig.hasForcedMeterOff);
    DrawCheckbox(100, 872, 64, 64, "[CO] Arousal meter hidden from wearer", CursePreferenceTemporaryConfig.hasSecretOrgasm);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenOrgasmsClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
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
    DrawCheckbox(100, 232, 64, 64, "[CO] Wearer must retype a message containing transgressions", CursePreferenceTemporaryConfig.mustRetype);
    DrawCheckbox(100, 312, 64, 64, "[CO] Drag wearer in a room by owners on triple beeps", CursePreferenceTemporaryConfig.canLeash);
    DrawCheckbox(100, 392, 64, 64, "[CO] Disable rescue maids and other NPC release dialogs", CursePreferenceTemporaryConfig.hasNoMaid);
    DrawCheckbox(100, 472, 64, 64, "[CO] Rejoin rooms you are tied in after disconnecting", CursePreferenceTemporaryConfig.hasDCPrevention);
    DrawCheckbox(100, 552, 64, 64, "[CO] Sensory Deprivation locked to total", CursePreferenceTemporaryConfig.hasForcedSensDep);
    DrawCheckbox(100, 632, 64, 64, "[O] Prevent the wearer from having new lovers", CursePreferenceTemporaryConfig.isLockedNewLover);
    DrawCheckbox(100, 712, 64, 64, "[O] Prevent the wearer from having new subs", CursePreferenceTemporaryConfig.isLockedNewSub);
    DrawCheckbox(100, 792, 64, 64, "[O] Prevent the wearer from breaking their collar", CursePreferenceTemporaryConfig.isLockedOwner);
    DrawCheckbox(100, 872, 64, 64, "[CO] Disable OOC when gagged", CursePreferenceTemporaryConfig.hasBlockedOOC);


    DrawCheckbox(1200, 312, 64, 64, "Permanently slowed", CursePreferenceTemporaryConfig.hasFullSlowMode);
    DrawCheckbox(1200, 392, 64, 64, "[M] Forced 'keep restraints on login'", CursePreferenceTemporaryConfig.forcedRestraintsSetting);
    DrawCheckbox(1200, 472, 64, 64, `[CO] Enable reminder (1 every ${(CursePreferenceTemporaryConfig.reminderInterval/60000).toFixed(1)} min.)`, CursePreferenceTemporaryConfig.hasReminders);
    DrawCheckbox(1050, 552, 64, 64, "[CO] Disables the curse when no owner is there", CursePreferenceTemporaryConfig.enabledOnMistress);
    DrawCheckbox(1050, 632, 64, 64, "[M] Disables the curse when with a mistress", CursePreferenceTemporaryConfig.disaledOnMistress);
    DrawCheckbox(1050, 712, 64, 64, "[CO] Can receive public notes", CursePreferenceTemporaryConfig.canReceiveNotes);
    DrawCheckbox(1050, 792, 64, 64, "[CO] Punish on AFK timer triggers", CursePreferenceTemporaryConfig.hasAntiAFK);
    DrawCheckbox(1050, 872, 64, 64, "[CO] Allow safeword", !CursePreferenceTemporaryConfig.hasNoEasyEscape);
    
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenStatusClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreen = "";
    }
    // Checkboxes
    if (MouseIn(100, 152, 64, 64))
        CursePreferenceTemporaryConfig.hasFullBlindMode = !CursePreferenceTemporaryConfig.hasFullBlindMode;
    if (MouseIn(1200, 312, 64, 64))
        CursePreferenceTemporaryConfig.hasFullSlowMode = !CursePreferenceTemporaryConfig.hasFullSlowMode;
}



//////////////////////////////////////////////////////////////////Punishments
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenPunishmentsLoad() {
    CursePreferenceLoaded = true;
    ElementCreateTextArea("Transgressions");
    document.getElementById("Transgressions").setAttribute("autocomplete", "off");
    document.getElementById("Transgressions").setAttribute("disabled", "disabled");
    ElementValue("Transgressions", CursePreferenceTemporaryConfig.transgressions.map(T => T.Count + "x " + T.Name).join(","));
}

function CursePreferenceSubscreenPunishmentsRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenPunishmentsLoad();

    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

    // Info
    DrawText(`Current amount of strikes (auto-punish): ${CursePreferenceTemporaryConfig.strikes}`, 750, 220, "Black", "Gray");
    DrawText(`Strikes reset on: ${new Date(CursePreferenceTemporaryConfig.strikeStartTime + 6.048e+8).toLocaleString()}`, 750, 280, "Black", "Gray");
    DrawText(`Punishment restraints: `, 750, 350, "Black", "Gray");

    CursePreferenceTemporaryConfig.punishmentRestraints.sort((a, b) => a.stage - b.stage).forEach((PR, Idx) => {
        var A = Asset.find(A => A.Name == PR.name && A.Group.Name == PR.group)
        DrawText(`Stage ${PR.stage}: ${A.Description} (${A.Group.Description})`, 750, 410 + Idx * 60, "Black", "Gray");
    });

    DrawText("Recorded transgressions:", 1450, 350, "Black", "Gray");
    ElementPosition("Transgressions", 1450, 550, 530, 320);

    MainCanvas.textAlign = "left";
    DrawCheckbox(1200, 100, 64, 64, "[CO] Auto punishment", !CursePreferenceTemporaryConfig.punishmentsDisabled);
    DrawText(`Auto punishment strictness: ${CursePreferenceTemporaryConfig.strictness == 0.5 ? "Easy" : CursePreferenceTemporaryConfig.strictness == 1 ? "Normal" : "Harsh"}`, 1175, 200, "Black", "Gray");
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenPunishmentsClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenPunishmentsExit();
    }
}

function CursePreferenceSubscreenPunishmentsExit() {
    ElementRemove("Transgressions");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
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
        DrawText(`${A ? A.Group.Description : (AssetGroup.find(G => G.Name == CA.group) || {}).Description}: ${A ? A.Description : "Forced empty"} ${CA.dateOfRemoval ? `(Expires: ${new Date(CA.dateOfRemoval).toLocaleString()})` : ''}`, 750, 270 + Idx * 50, "Black", "Gray");
    });

    if (CursePreferenceTemporaryConfig.cursedAppearance.length == 0) {
        DrawText("No cursed item active.", 750, 470, "Black", "Gray");
    }

    MainCanvas.textAlign = "left";
    DrawCheckbox(1300, 100, 64, 64, "[M] Cursed kneeling", CursePreferenceTemporaryConfig.hasCursedKneel);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenCursesClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
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
    ElementValue("BannedWords", CursePreferenceTemporaryConfig.bannedWords.join(","));
    ElementCreateTextArea("EntryMsg");
    document.getElementById("EntryMsg").setAttribute("autocomplete", "off");
    document.getElementById("EntryMsg").setAttribute("disabled", "disabled");
    ElementValue("EntryMsg", CursePreferenceTemporaryConfig.entryMsg);
    ElementCreateTextArea("DeafImmune");
    document.getElementById("DeafImmune").setAttribute("autocomplete", "off");
    document.getElementById("DeafImmune").setAttribute("disabled", "disabled");
    ElementValue("DeafImmune", CursePreferenceTemporaryConfig.deafImmune.join(","));
    ElementCreateTextArea("TriggerWord");
    document.getElementById("TriggerWord").setAttribute("autocomplete", "off");
    document.getElementById("TriggerWord").setAttribute("disabled", "disabled");
    ElementValue("TriggerWord", "Trigger: " + (CursePreferenceTemporaryConfig.triggerWord.word || "No trigger word set.") + " Duration: " +  (CursePreferenceTemporaryConfig.triggerWord.triggerDuration/60000) + " minutes");
}

function CursePreferenceSubscreenSpeechRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenSpeechLoad();

    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

    // Info
    DrawText("List of banned words:", 1400, 90, "Black", "Gray");
    ElementPosition("BannedWords", 1400, 180, 650, 120);

    DrawText("Introduction message:", 1400, 290, "Black", "Gray");
    ElementPosition("EntryMsg", 1400, 350, 650, 60);

    DrawText("Trigger word/phrase:", 1400, 430, "Black", "Gray");
    ElementPosition("TriggerWord", 1400, 490, 650, 60);
    
    DrawText("Users who's voice will not be deafened:", 1400, 570, "Black", "Gray");
    ElementPosition("DeafImmune", 1400, 620, 650, 60);
    
    // Checkboxes
    MainCanvas.textAlign = "left";
    DrawCheckbox(100, 312, 64, 64, "[CO] Wearer has an introduction message", CursePreferenceTemporaryConfig.hasEntryMsg);
    DrawCheckbox(100, 392, 64, 64, "[M] Blocked words enabled", CursePreferenceTemporaryConfig.hasCursedSpeech);
    DrawCheckbox(100, 472, 64, 64, "[M] Allow contractions", !CursePreferenceTemporaryConfig.hasNoContractions);
    DrawCheckbox(100, 552, 64, 64, "[M] Punish for speaking (Muted)", CursePreferenceTemporaryConfig.isMute);
    DrawCheckbox(100, 632, 64, 64, "[CO] Full mute (Prevents sending normal messages)", CursePreferenceTemporaryConfig.hasFullMuteChat);
    DrawCheckbox(100, 712, 64, 64, `[CO] Has a sound (Current sound: ${CursePreferenceTemporaryConfig.sound || 'No sound set'})`, CursePreferenceTemporaryConfig.hasSound);
    DrawCheckbox(100, 792, 64, 64, "[M] Doll talk (small words & sentences)", CursePreferenceTemporaryConfig.hasDollTalk);
    DrawCheckbox(100, 872, 64, 64, "[CO] Restrained Speech (Advanced)", CursePreferenceTemporaryConfig.hasRestrainedSpeech);
    MainCanvas.textAlign = "center";
}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenSpeechClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenSpeechExit();
    }
}

function CursePreferenceSubscreenSpeechExit() {
    ElementRemove("EntryMsg");
    ElementRemove("BannedWords");
    ElementRemove("DeafImmune");
    ElementRemove("TriggerWord");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}



//////////////////////////////////////////////////////////////////Appearance
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenAppearanceLoad() {
    CursePreferenceLoaded = true;
    ElementCreateTextArea("Presets");
    document.getElementById("Presets").setAttribute("disabled", "disabled");
    document.getElementById("Presets").setAttribute("autocomplete", "off");
    ElementValue("Presets", CursePreferenceTemporaryConfig.cursedPresets.map(P => P.name + " [" + P.cursedItems.map(CI => (AssetGroup.find(G => G.Name == CI.group) || {}).Description || "Unknown Group").join(", ") + "]").join(", "));
    ElementCreateTextArea("Colors");
    document.getElementById("Colors").setAttribute("disabled", "disabled");
    document.getElementById("Colors").setAttribute("autocomplete", "off");
    ElementValue("Colors", CursePreferenceTemporaryConfig.savedColors.map(C => (AssetGroup.find(G => G.Name == C.Group) || {}).Description + ": " + C.Color));

}

function CursePreferenceSubscreenAppearanceRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenAppearanceLoad();

    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");


    // Draw lists
    DrawText("Registered colors:", 500, 180, "Black", "Gray");
    ElementPosition("Colors", 500, 550, 730, 670);

    DrawText("Saved presets:", 1375, 180, "Black", "Gray");
    ElementPosition("Presets", 1375, 550, 730, 670);

}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenAppearanceClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenAppearanceExit();
    }
}

function CursePreferenceSubscreenAppearanceExit() {
    ElementRemove("Presets");
    ElementRemove("Colors");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}

//////////////////////////////////////////////////////////////////Appearance
// Redirected to from the main Run function if the player is in the lists settings subscreen
function CursePreferenceSubscreenTipLoad() {
    CursePreferenceLoaded = true;
    ElementCreateTextArea("Tips");
    document.getElementById("Tips").setAttribute("disabled", "disabled");
    document.getElementById("Tips").setAttribute("autocomplete", "off");
    ElementValue("Tips", CursePreferenceCurrentTip);
}



function CursePreferenceSubscreenTipRun() {
    // Load if needed
    if (!CursePreferenceLoaded) CursePreferenceSubscreenTipLoad();

    if (CursePreferenceErrors.length == 0)
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");


    // Draw lists
    DrawText("Tip:", 750, 200, "Black", "Gray");
    DrawButton(920, 160, 180, 65, "Give me a tip", "White");
    DrawButton(1120, 160, 180, 65, "Reset tips", "White");
    ElementPosition("Tips", 1000, 580, 730, 670);
    ElementValue()

}

// When the user clicks in the audio lists subscreen
function CursePreferenceSubscreenTipClick() {
    // If the user clicked the exit icon to return to the main screen
    if (MouseIn(1815, 75, 1905-1815, 165-75) && (CursePreferenceErrors.length == 0)) {
        CursePreferenceSubscreenTipExit();
    }
    
    if (MouseIn(920, 160, 1100-920, 225-160)) { 
        CursePreferenceCurrentTip = PopTip(true);
        ElementValue("Tips", CursePreferenceCurrentTip);
    }
    
    if (MouseIn(1120, 160, 1300-1120, 225-160)) { 
        CursePreferenceTemporaryConfig.seenTips = [];
        cursedConfig.seenTips = [];
        ElementValue("Tips", "Tip list reset. You will be able to see all tips again.");
    }
}

function CursePreferenceSubscreenTipExit() {
    ElementRemove("Tips");
    CursePreferenceSubscreen = "";
    CursePreferenceLoaded = false;
}