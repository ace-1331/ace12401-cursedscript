//************************************  Curse Activations ************************************//
function procGenericItem(item, group) { 
    //Makes sure the player has the items
    InventoryAdd(Player, item, group);
    InventoryWear(Player, item, group);
}

function procCursedNaked() { 
    ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
        .forEach(item => InventoryRemove(Player, item));
}

function procCursedOrgasm() {
    //Makes sure the player has the items
    InventoryAdd(Player, "InflVibeButtPlug", "ItemButt");
    InventoryAdd(Player, "InflatableVibeDildo", "ItemVulva");
    InventoryAdd(Player, "TapedVibeEggs", "ItemNipples");
    InventoryAdd(Player, "VibeHeartClitPiercing", "ItemVulvaPiercings");
    InventoryAdd(Player, "VibeHeartPiercings", "ItemNipplesPiercings");
    
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
        InventoryGet(Player, "ItemButt").Property = {};
        InventoryGet(Player, "ItemButt").Property.Intensity = 4;
        InventoryGet(Player, "ItemButt").Property.InflateLevel = 4;
        InventoryGet(Player, "ItemButt").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemVulva").Asset.Name == "InflatableVibeDildo") { 
        InventoryGet(Player, "ItemVulva").Property = {};
        InventoryGet(Player, "ItemVulva").Property.Intensity = 4;
        InventoryGet(Player, "ItemVulva").Property.InflateLevel = 4;
        InventoryGet(Player, "ItemVulva").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemNipples").Asset.Name == "TapedVibeEggs") { 
        InventoryGet(Player, "ItemNipples").Property = {};
        InventoryGet(Player, "ItemNipples").Property.Intensity = 4;
        InventoryGet(Player, "ItemNipples").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemVulvaPiercings").Asset.Name == "VibeHeartClitPiercing") { 
        InventoryGet(Player, "ItemVulvaPiercings").Property = {};
        InventoryGet(Player, "ItemVulvaPiercings").Property.Intensity = 4;
        InventoryGet(Player, "ItemVulvaPiercings").Property.Effect = ["Egged", "Vibrating"];
    }
    if (InventoryGet(Player, "ItemNipplesPiercings").Asset.Name == "VibeHeartPiercings") { 
        InventoryGet(Player, "ItemNipplesPiercings").Property = {};
        InventoryGet(Player, "ItemNipplesPiercings").Property.Intensity = 4;
        InventoryGet(Player, "ItemNipplesPiercings").Property.Effect = ["Egged", "Vibrating"];
    }
}

function procCursedLatex() {
    //Makes sure the player has the items
    InventoryAdd(Player, "Catsuit", "Suit");
    InventoryAdd(Player, "Catsuit", "SuitLower");
    InventoryAdd(Player, "Catsuit", "Gloves");
    
    //Wears the suit
    InventoryWear(Player, "Catsuit", "Suit", "#1C1A1A");
    InventoryWear(Player, "Catsuit", "SuitLower", "#1C1A1A");
    InventoryWear(Player, "Catsuit", "Gloves", "#1C1A1A");
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