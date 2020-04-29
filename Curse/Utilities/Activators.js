//************************************  Curse Activations ************************************//
function procGenericItem(item, group, color) {
    //Makes sure the player has the items
    if (!cursedConfig.genericProcs.includes(group)) {
        cursedConfig.genericProcs.push(group);
        InventoryWear(Player, item, group, color);
        cursedConfig.toUpdate.push(group);
        cursedConfig.mustRefresh = true;
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
        InventoryWear(Player, "InflVibeButtPlug", "ItemButt");
    if (!InventoryGet(Player, "ItemVulva"))
        InventoryWear(Player, "InflatableVibeDildo", "ItemVulva");
    if (!InventoryGet(Player, "ItemNipples"))
        InventoryWear(Player, "TapedVibeEggs", "ItemNipples");
    if (!InventoryGet(Player, "ItemVulvaPiercings"))
        InventoryWear(Player, "VibeHeartClitPiercing", "ItemVulvaPiercings");
    if (!InventoryGet(Player, "ItemNipplesPiercings"))
        InventoryWear(Player, "VibeHeartPiercings", "ItemNipplesPiercings");

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
        InventoryWear(Player, "SeamlessCatsuit", "Suit", "#111111");
        cursedConfig.toUpdate.push("Suit");
    }
    if (!InventoryGet(Player, "SuitLower")) { 
        InventoryWear(Player, "SeamlessCatsuit", "SuitLower", "#111111");
        cursedConfig.toUpdate.push("SuitLower");
    }
    if (!InventoryGet(Player, "Gloves")) { 
        InventoryWear(Player, "Catsuit", "Gloves", "#111111");
        cursedConfig.toUpdate.push("Gloves");
    }
    if (!InventoryGet(Player, "ClothLower")) { 
        InventoryWear(Player, "LatexPants1", "ClothLower", "#111111");
        cursedConfig.toUpdate.push("ClothLower");
    }
    if (!InventoryGet(Player, "ItemBoots")) { 
        InventoryWear(Player, "ThighHighLatexHeels", "ItemBoots", "#111111", 10);
        cursedConfig.toUpdate.push("ItemBoots");
    }
    if (!InventoryGet(Player, "ItemMouth")) { 
        InventoryWear(Player, "LatexBallMuzzleGag", "ItemMouth", "#222222", 10);
        cursedConfig.toUpdate.push("ItemMouth");
    }
    if (!InventoryGet(Player, "ItemArms")) { 
        InventoryWear(Player, "BoxTieArmbinder", "ItemArms", "#222222", 15);
        cursedConfig.toUpdate.push("ItemArms");
    }
    if (!InventoryGet(Player, "ItemTorso")) { 
        InventoryWear(Player, "LatexCorset1", "ItemTorso", "#111111", 10);
        cursedConfig.toUpdate.push("ItemTorso");
    }
    //InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);

    cursedConfig.mustRefresh = true;
}


function procCursedPony() {
    //wears the items
    if (!InventoryGet(Player, "Suit")) { 
        InventoryWear(Player, "SeamlessCatsuit", "Suit", "#440000");
        cursedConfig.toUpdate.push("Suit");
    }
    if (!InventoryGet(Player, "SuitLower")) { 
        InventoryWear(Player, "SeamlessCatsuit", "SuitLower", "#440000");
        cursedConfig.toUpdate.push("SuitLower");
    }
    if (!InventoryGet(Player, "Gloves")) { 
        InventoryWear(Player, "Catsuit", "Gloves", "#440000");
        cursedConfig.toUpdate.push("Gloves");
    }
    if (!InventoryGet(Player, "ItemBoots")) { 
        InventoryWear(Player, "PonyBoots", "ItemBoots", "#550000", 10);
        cursedConfig.toUpdate.push("ItemBoots");
    }
    if (!InventoryGet(Player, "ItemMouth")) { 
        InventoryWear(Player, "HarnessPonyBits", "ItemMouth", "#660000", 10);
        cursedConfig.toUpdate.push("ItemMouth");
    }
    if (!InventoryGet(Player, "ItemArms")) { 
        InventoryWear(Player, "ArmbinderJacket", "ItemArms", "#550000", 15);
        cursedConfig.toUpdate.push("ItemArms");
    }
    if (!InventoryGet(Player, "ItemLegs")) { 
        InventoryWear(Player, "LeatherLegCuffs", "ItemLegs", "#550000", 10);
        cursedConfig.toUpdate.push("ItemLegs");
    }
    if (!InventoryGet(Player, "ItemTorso")) { 
        InventoryWear(Player, "LatexCorset1", "ItemTorso", "#550000", 10);
        cursedConfig.toUpdate.push("ItemTorso");
    }
    //InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);

    cursedConfig.mustRefresh = true;
}

async function checkKneeling(sender) {
    // Kneel on enforced
    var startDate = Date.now();
    popChatSilent(" Reminder: Kneeling when #" + sender + " enters is required.");
    while (Date.now() < startDate + 30000) {
        if (Player.Pose.includes("Kneel") || Player.Pose.includes("ForceKneel")) {
            return;
        }
        await new Promise(r => setTimeout(r, 2000));
    }
    if (ChatRoomCharacter.map(char => char.MemberNumber.toString()).includes(sender)) {
        SendChat(Player.Name + " angers the curse on her as she forgets to kneel.");
        popChatSilent("Kneeling when #" + sender + " enters is required.");
        cursedConfig.strikes += 5;
        KneelAttempt();
    }
}