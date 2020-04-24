//************************************  Curse Activations ************************************//
function procGenericItem(item, group, color) { 
    //Makes sure the player has the items
    InventoryAdd(Player, item, group);
    InventoryWear(Player, item, group, color);
    cursedConfig.mustRefresh = true;
}

function procCursedNaked() { 
    ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
        .forEach(item => InventoryRemove(Player, item));
    cursedConfig.mustRefresh = true;
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
    cursedConfig.mustRefresh = true;
}

function procCursedLatex() {
    //Makes sure the player has the items
    InventoryAdd(Player, "SeamlessCatsuit", "Suit", "#111111");
    InventoryAdd(Player, "SeamlessCatsuit", "SuitLower", "#111111");
    InventoryAdd(Player, "Catsuit", "Gloves", "#111111");
    InventoryAdd(Player, "LatexPants1", "ClothLower", "#111111");
    InventoryAdd(Player, "ThighHighLatexHeels", "ItemBoots", "#111111", 10);
    InventoryAdd(Player, "LatexBallMuzzleGag", "ItemMouth", "#222222", 10);
    InventoryAdd(Player, "BoxTieArmbinder", "ItemArms", "#222222", 15);
    InventoryAdd(Player, "LatexCorset1", "ItemTorso", "#111111", 10);
    InventoryAdd(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);
     //undresses the player
    ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
   .forEach(item => InventoryRemove(Player, item));

    //wears the items
    InventoryWear(Player, "SeamlessCatsuit", "Suit", "#111111");
    InventoryWear(Player, "SeamlessCatsuit", "SuitLower", "#111111");
    InventoryWear(Player, "Catsuit", "Gloves", "#111111");
    InventoryWear(Player, "LatexPants1", "ClothLower", "#111111");
    InventoryWear(Player, "ThighHighLatexHeels", "ItemBoots", "#111111", 10);
    InventoryWear(Player, "LatexBallMuzzleGag", "ItemMouth", "#222222", 10);
    InventoryWear(Player, "BoxTieArmbinder", "ItemArms", "#222222", 15);
    InventoryWear(Player, "LatexCorset1", "ItemTorso", "#111111", 10);
    InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);
    
    cursedConfig.mustRefresh = true;
}


function procCursedPony() {
    //Makes sure the player has the items
    InventoryAdd(Player, "SeamlessCatsuit", "Suit");
    InventoryAdd(Player, "SeamlessCatsuit", "SuitLower");
    InventoryAdd(Player, "Catsuit", "Gloves", "#111111");
    InventoryAdd(Player, "PonyBoots", "ItemBoots");
    InventoryAdd(Player, "HarnessPonyBits", "ItemMouth");
    InventoryAdd(Player, "ArmbinderJacket", "ItemArms");
    InventoryAdd(Player, "LeatherLegCuffs", "ItemLegs");
    InventoryAdd(Player, "LatexCorset1", "ItemTorso");
    InventoryAdd(Player, "CollarShockUnit", "ItemNeckAccessories");
    
    //undresses the player
   ["Cloth", "ClothLower", "ClothAccessory", "Suit", "SuitLower", "Bra", "Panties", "Socks", "Shoes", "Hat", "Gloves"]
   .forEach(item => InventoryRemove(Player, item));

    //wears the items
    InventoryWear(Player, "SeamlessCatsuit", "Suit", "#440000");
    InventoryWear(Player, "SeamlessCatsuit", "SuitLower", "#440000");
    InventoryWear(Player, "Catsuit", "Gloves", "#440000");
    InventoryWear(Player, "PonyBoots", "ItemBoots", "#550000", 10);
    InventoryWear(Player, "HarnessPonyBits", "ItemMouth", "#660000", 10);
    InventoryWear(Player, "ArmbinderJacket", "ItemArms", "#550000", 15);
    InventoryWear(Player, "LeatherLegCuffs", "ItemLegs", "#550000", 10);
    InventoryWear(Player, "LatexCorset1", "ItemTorso", "#550000", 10);
    InventoryWear(Player, "CollarShockUnit", "ItemNeckAccessories", "#222222", 10);
    
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