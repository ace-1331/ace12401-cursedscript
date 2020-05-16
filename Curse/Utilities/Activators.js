//************************************  Curse Activations ************************************//
function procGenericItem(item, group) {
    //Makes sure the player has the items
    if (!cursedConfig.genericProcs.includes(group)) {
        cursedConfig.genericProcs.push(group);
        if (Player.BlockItems.filter(it => it.Name == item && it.Group == group).length !== 0) { 
            popChatSilent("You currently have a curse activated for which the item is blocked, the curse will not apply the following item, please disable the curse using the item or unblock the item: " + item + " " + group);  
        }
        if (!InventoryOwnerOnlyItem(InventoryGet(Player, group)) ) {
            InventoryWear(Player, item, group, GetColorSlot(group));
            cursedConfig.toUpdate.push(group);
            cursedConfig.mustRefresh = true;
        } else {
            popChatSilent("The curse is active, but did not apply the item as there was already something there which carries an owner lock.");
        }
    } else {
        popChatSilent("Error P04: The curse was deactivated because it tried to apply more than one curse to the same group. Please report this issues and how it happened. Adjust your settings accordingly to prevent this error. (Please disable conflicting curses)");
        cursedConfig.isRunning = false;
    }
}

function procCursedNaked() {
    ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
        .forEach(group => {
            InventoryRemove(Player, group);
            cursedConfig.toUpdate.push(group);
        });
    cursedConfig.mustRefresh = true;
}

function procCursedOrgasm() {
    //Wears the vibe
    if (!InventoryGet(Player, "ItemButt"))
        InventoryWear(Player, "InflVibeButtPlug", "ItemButt", GetColorSlot("ItemButt"));
    if (!InventoryGet(Player, "ItemVulva"))
        InventoryWear(Player, "InflatableVibeDildo", "ItemVulva", GetColorSlot("ItemVulva"));
    if (!InventoryGet(Player, "ItemNipples"))
        InventoryWear(Player, "TapedVibeEggs", "ItemNipples", GetColorSlot("ItemNipples"));
    if (!InventoryGet(Player, "ItemVulvaPiercings", GetColorSlot("ItemVulvaPiercings")))
        InventoryWear(Player, "VibeHeartClitPiercing", "ItemVulvaPiercings", GetColorSlot("ItemVulvaPiercings"));
    if (!InventoryGet(Player, "ItemNipplesPiercings", GetColorSlot("ItemNipplesPiercings")))
        InventoryWear(Player, "VibeHeartPiercings", "ItemNipplesPiercings", GetColorSlot("ItemNipplesPiercings"));

    //Turns them to max
    if (InventoryGet(Player, "ItemButt").Asset.Name == "InflVibeButtPlug") {
        InventoryGet(Player, "ItemButt").Property = { Intensity: 4, InflateLevel: 4, Effect: ["Egged", "Vibrating"] };
        cursedConfig.toUpdate.push("ItemButt");
    }
    if (InventoryGet(Player, "ItemVulva").Asset.Name == "InflatableVibeDildo") {
        InventoryGet(Player, "ItemVulva").Property = { Intensity: 4, InflateLevel: 4, Effect: ["Egged", "Vibrating"] };
        cursedConfig.toUpdate.push("ItemVulva");
    }
    if (InventoryGet(Player, "ItemNipples").Asset.Name == "TapedVibeEggs") {
        InventoryGet(Player, "ItemNipples").Property = { Intensity: 4, Effect: ["Egged", "Vibrating"] };
        cursedConfig.toUpdate.push("ItemNipples");
    }
    if (InventoryGet(Player, "ItemVulvaPiercings").Asset.Name == "VibeHeartClitPiercing") {
        InventoryGet(Player, "ItemVulvaPiercings").Property = { Intensity: 4, Effect: ["Egged", "Vibrating"] };
        cursedConfig.toUpdate.push("ItemVulvaPiercings");
    }
    if (InventoryGet(Player, "ItemNipplesPiercings").Asset.Name == "VibeHeartPiercings") {
        InventoryGet(Player, "ItemNipplesPiercings").Property = { Intensity: 4, Effect: ["Egged", "Vibrating"] };
        cursedConfig.toUpdate.push("ItemNipplesPiercings");
    }
    cursedConfig.mustRefresh = true;
}

function procCursedLatex() {
    //wears the items
    if (!InventoryGet(Player, "Suit")) {
        InventoryWear(Player, "SeamlessCatsuit", "Suit", GetColorSlot("Suit"));
        cursedConfig.toUpdate.push("Suit");
    }
    if (!InventoryGet(Player, "SuitLower")) {
        InventoryWear(Player, "SeamlessCatsuit", "SuitLower", GetColorSlot("SuitLower"));
        cursedConfig.toUpdate.push("SuitLower");
    }
    if (!InventoryGet(Player, "Gloves")) {
        InventoryWear(Player, "Catsuit", "Gloves", GetColorSlot("Gloves"));
        cursedConfig.toUpdate.push("Gloves");
    }
    if (!InventoryGet(Player, "ClothLower")) {
        InventoryWear(Player, "LatexPants1", "ClothLower", GetColorSlot("ClothLower"));
        cursedConfig.toUpdate.push("ClothLower");
    }
    if (!InventoryGet(Player, "ItemBoots")) {
        InventoryWear(Player, "ThighHighLatexHeels", "ItemBoots", GetColorSlot("ItemBoots"), 10);
        cursedConfig.toUpdate.push("ItemBoots");
    }
    if (!InventoryGet(Player, "ItemMouth")) {
        InventoryWear(Player, "LatexBallMuzzleGag", "ItemMouth", GetColorSlot("ItemMouth"), 10);
        cursedConfig.toUpdate.push("ItemMouth");
    }
    if (!InventoryGet(Player, "ItemArms")) {
        InventoryWear(Player, "BoxTieArmbinder", "ItemArms", GetColorSlot("ItemArms"), 15);
        cursedConfig.toUpdate.push("ItemArms");
    }
    if (!InventoryGet(Player, "ItemTorso")) {
        InventoryWear(Player, "LatexCorset1", "ItemTorso", GetColorSlot("ItemTorso"), 10);
        cursedConfig.toUpdate.push("ItemTorso");
    }
    //InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);

    cursedConfig.mustRefresh = true;
}


function procCursedPony() {
    //wears the items
    if (!InventoryGet(Player, "Suit")) {
        InventoryWear(Player, "SeamlessCatsuit", "Suit", GetColorSlot("Suit"));
        cursedConfig.toUpdate.push("Suit");
    }
    if (!InventoryGet(Player, "SuitLower")) {
        InventoryWear(Player, "SeamlessCatsuit", "SuitLower", GetColorSlot("SuitLower"));
        cursedConfig.toUpdate.push("SuitLower");
    }
    if (!InventoryGet(Player, "Gloves")) {
        InventoryWear(Player, "Catsuit", "Gloves", GetColorSlot("Gloves"));
        cursedConfig.toUpdate.push("Gloves");
    }
    if (!InventoryGet(Player, "ItemBoots")) {
        InventoryWear(Player, "PonyBoots", "ItemBoots", GetColorSlot("ItemBoots"), 10);
        cursedConfig.toUpdate.push("ItemBoots");
    }
    if (!InventoryGet(Player, "ItemMouth")) {
        InventoryWear(Player, "HarnessPonyBits", "ItemMouth", GetColorSlot("ItemMouth"), 10);
        cursedConfig.toUpdate.push("ItemMouth");
    }
    if (!InventoryGet(Player, "ItemArms")) {
        InventoryWear(Player, "ArmbinderJacket", "ItemArms", GetColorSlot("ItemArms"), 15);
        cursedConfig.toUpdate.push("ItemArms");
    }
    if (!InventoryGet(Player, "ItemLegs")) {
        InventoryWear(Player, "LeatherLegCuffs", "ItemLegs", GetColorSlot("ItemLegs"), 10);
        cursedConfig.toUpdate.push("ItemLegs");
    }
    if (!InventoryGet(Player, "ItemTorso")) {
        InventoryWear(Player, "LatexCorset1", "ItemTorso", GetColorSlot("ItemTorso"), 10);
        cursedConfig.toUpdate.push("ItemTorso");
    }
    //InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);

    cursedConfig.mustRefresh = true;
}


function procCursedRopes() {
    if (!InventoryGet(Player, "ItemArms")) {
        InventoryWear(Player, "HempRope", "ItemArms", GetColorSlot("ItemArms"), 10);
        cursedConfig.toUpdate.push("ItemArms");
    }
    if (!InventoryGet(Player, "ItemLegs")) {
        InventoryWear(Player, "HempRope", "ItemLegs", GetColorSlot("ItemLegs"), 10);
        cursedConfig.toUpdate.push("ItemLegs");
    }
    if (!InventoryGet(Player, "ItemFeet")) {
        InventoryWear(Player, "HempRope", "ItemFeet", GetColorSlot("ItemFeet"), 10);
        cursedConfig.toUpdate.push("ItemFeet");
    }

    cursedConfig.mustRefresh = true;
}

function procCursedMaid() { 
    if (!InventoryGet(Player, "Cloth")) {
        InventoryWear(Player, "MaidOutfit1", "Cloth", GetColorSlot("Cloth"), 10);
        cursedConfig.toUpdate.push("Cloth");
    }
    if (!InventoryGet(Player, "Hat")) {
        InventoryWear(Player, "MaidHairband1", "Hat", GetColorSlot("Hat"), 10);
        cursedConfig.toUpdate.push("Hat");
    }
    cursedConfig.mustRefresh = true;
}

async function checkKneeling(sender) {
    // Kneel on enforced
    if (ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)) {
        let startDate = Date.now();
        popChatSilent("Reminder: You must be on your knees when you first see someone in this room.(Someone is enforced)");
        while (Date.now() < startDate + 30000) {
            if (Player.Pose.includes("Kneel") || Player.Pose.includes("ForceKneel")) {
                return;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    // When timer is over
    if (
        ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)
        && Player.CanKneel()
    ) {
        SendChat(Player.Name + " angers the curse on her as she forgets to kneel.");
        cursedConfig.strikes += 5;
        KneelAttempt();
    }
}