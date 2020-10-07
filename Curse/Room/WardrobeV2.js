/* eslint-disable */
function LoadAppearanceV2() {

  if (typeof window.AssetTypeOverrides !== "undefined") return;
  AssetGroup.forEach(e => { if (["Hat", "HairAccessory1", "HairAccessory2", "Wings", "TailStraps"].indexOf(e.Name) >= 0) e.KeepNaked = true; });
  LoadAppearanceV2Optimize();
  LoadAppearanceV2ColorPicker();
  LoadAppearanceV2Drawing();
  LoadAppearanceV2Wardrobe();

  let AppearanceAssets = [];
  let AppearanceAssetsAll = [];
  let AppearanceUndo = [];
  let AppearanceWardrobeOffset = 0;
  let AppearanceMode = "";
  let AppearanceHeight = 65;
  let AppearanceSpace = 30;
  let AppearanceOffset = 0;
  let AppearanceNumPerPage = 0;
  let AppearanceItem = null;
  let AppearanceColorUndo = true;
  let AppearanceItemUndo = true;
  let AppearanceItemsOffset = 0;
  let AppearanceTempWardrobe = [];
  let AppearanceWardrobeShouldUndo = true;
  window.AppearanceColorPaste = "#FFFFFF";
  let AppearanceTextOnly = true;
  let AppearanceBlockMode = false;
  window.AppearanceSelectedCategory = "Appearance";
  let AppearanceHover;
  let AppearanceHoverPrev;


  CharacterAppearanceWardrobeLoad = function CharacterAppearanceWardrobeLoad(C) {
    if (Player.Wardrobe == null || WardrobeSize < WardrobeSize) {
      WardrobeLoadCharacters(true);
    } else {
      WardrobeLoadCharacterNames();
    }
    ElementCreateInput("InputWardrobeName", "text", C.Name, "20");
    AppearanceMode = "Wardrobe";
    AppearanceWardrobeShouldUndo = true;
    CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
  }

  AppearanceLoad = function AppearanceLoad() {
    if (!CharacterAppearanceSelection) CharacterAppearanceSelection = Player;

    const C = CharacterAppearanceSelection;
    AppearanceUndo = [];
    AppearanceTempWardrobe = [];
    AppearanceBlockMode = false;
    AppearanceSelectedCategory = "Appearance";
    DialogFocusItem = null;

    AppearanceBuildAssets(C);
    AppearanceMode = "";
    CharacterAppearanceBackup = CharacterAppearanceStringify(C);
    if (Player.GameplaySettings && Player.GameplaySettings.EnableWardrobeIcon && CharacterAppearanceReturnRoom == "ChatRoom") {
      CharacterAppearancePreviousEmoticon = WardrobeGetExpression(Player).Emoticon;
      ServerSend("ChatRoomCharacterExpressionUpdate", { Name: "Wardrobe", Group: "Emoticon", Appearance: ServerAppearanceBundle(Player.Appearance) });
    }
  }

  // Run the character appearance selection screen
  AppearanceRun = function AppearanceRun() {
    const C = CharacterAppearanceSelection;

    // Draw the background and the character twice
    if (CharacterAppearanceHeaderText == "" || CharacterAppearanceHeaderText.indexOf("Selected Group:") == 0) {
      if (C.ID == 0) CharacterAppearanceHeaderText = TextGet("SelectYourAppearance");
      else CharacterAppearanceHeaderText = TextGet("SelectSomeoneAppearance").replace("TargetCharacterName", C.Name);
    }
    if (C.FocusGroup && C.FocusGroup.Description) {
      CharacterAppearanceHeaderText = "Selected Group: " + C.FocusGroup.Description;
    }

    DrawCharacter(C, -600, (C.IsKneeling()) ? -1100 : -100, 4, false);
    DrawCharacter(C, 750, 0, 1);
    DrawText(CharacterAppearanceHeaderText, 400, 40, "White", "Black");

    if (DialogFocusItem) {
      if (DialogFocusItem.Asset.Extended || !DialogFocusItem.Asset.TypeInfo) CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
      else AssetTypeSetDraw();
      DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
    } else if (AppearanceMode == "") {
      AppearanceNormalRun();
    } else if (AppearanceMode == "Wardrobe") {
      AppearanceWardrobeRun();
    } else if (AppearanceMode == "Color") {
      AppearanceColorRun();
    } else if (AppearanceMode == "Items") {
      AppearanceItemsRun();
    }

    // Draw the default buttons
    if (!AppearanceBlockMode && AppearanceMode !== "Color") DrawButton(1768, 25, 90, 90, "", "White", "Icons/Cancel.png", TextGet("Cancel"));
    if (C.AllowItem && AppearanceMode !== "Color") DrawButton(1885, 25, 90, 90, "", "White", "Icons/Accept.png", TextGet("Accept"));
  }

  // When the user clicks on the character appearance selection screen
  AppearanceClick = function AppearanceClick() {
    if (DialogFocusItem) {
      if (DialogFocusItem.Asset.Extended || !DialogFocusItem.Asset.TypeInfo) CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
      else AssetTypeSetClick();
    } else if (AppearanceMode == "") {
      AppearanceNormalClick();
    } else if (AppearanceMode == "Wardrobe") {
      AppearanceWardrobeClick();
    } else if (AppearanceMode == "Color") {
      AppearanceColorClick();
    } else if (AppearanceMode == "Items") {
      AppearanceItemsClick();
    }
  }

  // when the user press escape
  AppearanceExit = function AppearanceExit() {
    if (AppearanceMode == "") CharacterAppearanceExit(CharacterAppearanceSelection);
    else if (AppearanceMode == "Wardrobe") { AppearanceMode == ""; ElementRemove("InputWardrobeName"); AppearanceAssets.forEach(A => A.ReloadItem()); }
    else if (AppearanceMode == "Color") { AppearanceMode == ""; ItemColorExit(); if (AppearanceColorUndo) AppearanceRunUndo(); AppearanceItem = null; }
    else if (AppearanceMode == "Items" || AppearanceMode == "ItemsView") { if (AppearanceItemUndo) AppearanceRunUndo(); AppearanceItem = null; }
  }

  class AppearanceAssetGroup {
    constructor(C, Group) {

      this.C = C;
      this.Group = Group;
      this.CanChange = this.TestGroupAccess();
      this.Assets = [];
      this.AllowedAssets = [];
      this.View = [];
      this.ReloadItem();

      if (this.CanChange) {
        const m = new Map();
        const AddAsset = A => {
          m.set(A.Name, A);
        };

        Group.Asset
          .filter(A => A.Value == 0)
          .forEach(AddAsset);

        Player.Inventory
          .map(I => I.Asset)
          .filter(A => A)
          .filter(A => A.Group.Name == Group.Name)
          .forEach(AddAsset);

        C.Inventory
          .map(I => I.Asset)
          .filter(A => A)
          .filter(A => A.Group.Name == Group.Name)
          .forEach(AddAsset);

        m.forEach(A => this.Assets.push(A));
      }

      this.ReloadView();
    }
    TestGroupAccess() {
      if (this.C.ID == 0) return true;
      if (!this.C.AllowItem) return false;
      if (this.Group.BodyCosplay && this.C.OnlineSharedSettings && this.C.OnlineSharedSettings.BlockBodyCosplay) return false;
      if (this.Group.Clothing) return true;
      if (this.C.OnlineSharedSettings && this.C.OnlineSharedSettings.AllowFullWardrobeAccess) return true;
      return false;
    }
    ReloadItem() {
      this.Item = this.C.Appearance.find(I => I.Asset.Group.Name == this.Group.Name);
      if (this.Item && this.Item.Color) {
        this.Color = Array.isArray(this.Item.Color) ? "MultiColor" : this.Item.Color;
      } else {
        this.Color = "None";
      }
      this.LastColor = this.Item ? this.Item.Color : this.LastColor;
      const ItemName = this.Item && this.Item.Asset.Name;
      this.View.forEach(V => {
        if (V.IsWorn && ItemName != V.Asset.Name) {
          V.Color = "White";
          V.Hover = "Red";
        }
        if (!V.IsWorn && ItemName == V.Asset.Name) {
          V.Color = "Pink";
          V.Hover = (V.Asset.Extended || V.Asset.TypeInfo) ? "Red" : "Pink";
        }
        V.IsWorn = ItemName == V.Asset.Name;
      });
      this.SortView();
    }
    ReloadView() {
      this.View = this.Assets.map(A => {
        const Blocked = InventoryIsPermissionBlocked(this.C, A.Name, this.Group.Name);
        const Limited = !InventoryCheckLimitedPermission(this.C, { Asset: A });
        const IsWorn = this.Item && this.Item.Asset.Name == A.Name;
        const Usable = IsWorn && (this.Item.Asset.Extended || this.Item.Asset.TypeInfo)
        return {
          Asset: A,
          IsWorn: IsWorn,
          Blocked: Blocked || Limited,
          Color: IsWorn ? "Pink" : (Blocked || Limited) ? "Gray" : "White",
          Hover: IsWorn ? (Usable ? "Red" : "Pink") : (Blocked || Limited) ? "Gray" : "Red",
        };
      });
      this.AllowedAssets = this.View.filter(V => !V.Blocked).map(V => V.Asset);
      this.SortView();
    }
    SortView() {
      this.View.sort((a, b) => {
        // if (a.IsWorn) return -1;
        if (a.Blocked != b.Blocked) return a.Blocked ? 1 : -1;
        return 0;
      });
    }
    NextColor() {
      if (this.Item && this.Color != "MultiColor") {
        let I = this.Group.ColorSchema.indexOf(this.Color) + 1;
        if (I < 0 || I >= this.Group.ColorSchema.length) I = 0;
        this.SetColor(this.Group.ColorSchema[I], true);
      }
    }
    SetColor(Color, Undo) {
      if (this.Item) {
        if (Undo) {
          const G = this;
          const OldColor = this.Item.Color;
          AppearanceUndo.push(() => G.SetColor(OldColor));
        }
        this.Item.Color = Color;
        CharacterLoadCanvas(this.C);
        this.ReloadItem();
      }
    }
    SetItem(AssetName, Undo, Color) {
      if (Undo) {
        const G = this;
        const AssetName = this.Item && this.Item.Asset.Name;
        const Color = this.Item && this.Item.Color;
        AppearanceUndo.push(() => G.SetItem(AssetName, false, Color));
      }
      if (AssetName) InventoryWear(this.C, AssetName, this.Group.Name, Color || this.LastColor);
      else InventoryRemove(this.C, this.Group.Name);
      AppearanceAssets.forEach(A => A.ReloadItem());
    }
    GetNextItem() {
      if (this.Item) {
        const I = this.AllowedAssets.findIndex(A => A.Group.Name == this.Group.Name && A.Name == this.Item.Asset.Name) + 1;
        if (I >= this.AllowedAssets.length) {
          return this.Group.AllowNone ? null : this.AllowedAssets[0];
        } else {
          return this.AllowedAssets[I];
        }
      } else {
        return this.AllowedAssets[0];
      }
    }
    GetPrevItem() {
      if (this.Item) {
        const I = this.AllowedAssets.findIndex(A => A.Group.Name == this.Group.Name && A.Name == this.Item.Asset.Name) - 1;
        if (I < 0) {
          return this.Group.AllowNone ? null : this.AllowedAssets[this.AllowedAssets.length - 1];
        } else {
          return this.AllowedAssets[I];
        }
      } else {
        return this.AllowedAssets[this.AllowedAssets.length - 1];
      }
    }
    SetNextPrevItem(Prev) {
      let Item;
      if (Prev) {
        Item = this.GetPrevItem();
      } else {
        Item = this.GetNextItem();
      }
      this.SetItem(Item && Item.Name, true);
    }
    Strip(Undo) {
      if (this.CanStrip()) {
        this.SetItem(null, Undo == null || Undo);
      }
    }
    CanStrip() {
      return this.CanChange && this.Item && this.Group.AllowNone; // && !this.Group.KeepNaked
    }
    CopyFromMirrorGroup(Undo) {
      if (Undo) {
        const G = this;
        const AssetName = this.Item && this.Item.Asset.Name;
        const Color = this.Item.Color;
        AppearanceUndo.push(() => {
          G.SetItem(AssetName, false, Color);
        });
      }
      if (!this.Group.MirrorGroup) return;
      const M = this.C.Appearance.find(M => M.Asset && M.Asset.Group.Name == this.Group.MirrorGroup);
      if (!M) return;
      InventoryWear(this.C, M.Asset.Name, this.Group.Name, M.Color == "None" ? null : M.Color);
      AppearanceAssets.forEach(A => A.ReloadItem());
    }
    Draw(Position) {
      if (this.CanStrip()) {
        DrawButton(1365 - AppearanceHeight, 145 + Position * AppearanceOffset, AppearanceHeight, AppearanceHeight, "", "White", "Icons/Small/Naked.png", TextGet("StripItem"));
      } else if (this.Group.MirrorGroup && this.CanChange) {
        DrawButton(1365 - AppearanceHeight, 145 + Position * AppearanceOffset, AppearanceHeight, AppearanceHeight, "", "White", "Icons/Small/Exit.png", "Mirror");
      }
      if (this.CanChange)
        DrawBackNextButton(1390, 145 + Position * AppearanceOffset, 400, AppearanceHeight, this.Group.Description + ": " + CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Description"), "White", null,
          () => { const Item = this.GetPrevItem(); return Item ? Item.Description : "None" },
          () => { const Item = this.GetNextItem(); return Item ? Item.Description : "None" },
          () => "Show All Items In Group"
        );
      else DrawButton(1390, 145 + Position * AppearanceOffset, 400, AppearanceHeight, this.Group.Description + ": " + CharacterAppearanceGetCurrentValue(this.C, this.Group.Name, "Description"), "#AAAAAA");
      DrawButton(1815, 145 + Position * AppearanceOffset, 160, AppearanceHeight, this.Color, ((this.Color.indexOf("#") == 0) ? this.Color : "White"), null, (!this.CanChange && this.Group.AllowColorize && this.Color.indexOf("#") == 0) ? "Copy Color" : null);
    }
    Click() {
      if ((MouseX >= 1365 - AppearanceHeight) && (MouseX < 1365)) {
        if (this.CanStrip()) {
          this.Strip();
        } else if (this.Group.MirrorGroup && this.CanChange) {
          this.CopyFromMirrorGroup(true);
        }
      } else if ((MouseX >= 1390) && (MouseX < 1790)) {
        if (this.CanChange) {
          if (!CommonIsMobile && MouseX < 1390 + (400 / 3)) {
            this.SetNextPrevItem(true);
          } else if (!CommonIsMobile && MouseX >= 1390 + (400 / 3) * 2) {
            this.SetNextPrevItem(false);
          } else {
            AppearanceItem = this;
            this.C.FocusGroup = this.Group;
            AppearanceItem.SetItem(AppearanceItem.Item && AppearanceItem.Item.Asset.Name, true);
            AppearanceItemsOffset = 0;
            AppearanceItemUndo = true;
            AppearanceMode = "Items";
          }
        }
      } else if ((MouseX >= 1815) && (MouseX < 1975)) {
        if (this.CanChange) {
          if (this.Group.AllowColorize) {
            AppearanceItem = this;
            AppearanceItem.SetColor(this.Color == "None" ? "Default" : this.Item.Color, true);
            AppearanceColorUndo = false;
            AppearanceMode = "Color";
            ItemColorLoad(this.C, this.Item, 1300, 25, 675, 950);
            ItemColorOnExit(() => {
              AppearanceMode == "";
              if (AppearanceColorUndo) AppearanceRunUndo();
              AppearanceItem = null;
            });
          } else {
            this.NextColor(this.C, this.Name);
          }
        } else if (this.Group.AllowColorize && this.Color.indexOf("#") == 0) {
          AppearanceColorPaste = this.Color;
          if (navigator.clipboard) navigator.clipboard.writeText(AppearanceColorPaste);
        }
      }
    }
    DrawItem(X, Y, Width, Height, View, TextOnly) {
      const Hover = !CommonIsMobile && MouseIn(X, Y, Width, Height);
      let Color = Hover ? View.Hover : View.Color;
      let Asset = View.Asset || View;
      if (this.C.ID == 0 && AppearanceBlockMode) {
        const IsWorn = this.Item && this.Item.Asset.Name == Asset.Name;
        const Blocked = InventoryIsPermissionBlocked(this.C, Asset.DynamicName(Player), Asset.DynamicGroupName);
        const Limited = InventoryIsPermissionLimited(this.C, Asset.Name, Asset.Group.Name);
        Color = IsWorn ? "Gray" : Blocked ? (Hover ? "Red" : "Pink") : Limited ? (Hover ? "Orange" : "#FED8B1") : (Hover ? "Green" : "Lime");
      } else if (AppearanceHoverPrev == Asset.Name) {
        Color = Hover ? "Red" : "Orange";
      }
      DrawRect(X, Y, Width, Height, Color);
      if (!TextOnly) DrawImageResize(`Assets/${Asset.Group.Family}/${Asset.DynamicGroupName}/Preview/${Asset.Name}${Asset.DynamicPreviewIcon(CharacterGetCurrent())}.png`, X + 2, Y + 2, Width - 4, Width - 4);
      DrawTextFit(Asset.DynamicDescription(Player), X + Width / 2, TextOnly ? (Y + Height / 2 + 1) : (Y + Height - 25), Width - 4, "black");
      if (Hover && !AppearanceBlockMode) AppearanceHover = Asset.Name;
    }
    ClickItem(View) {
      let Asset = View.Asset || View;
      if (this.C.ID == 0 && AppearanceBlockMode) {
        InventoryTogglePermission({ Asset: Asset });
      } else if (View.Asset && !View.Blocked) {
        if (AppearanceHover == AppearanceHoverPrev) {
          if (Asset.Extended && Asset.TypeInfo) {
            DialogExtendItem(AppearanceItem.Item);
          }
        } else {
          AppearanceItem.SetItem(Asset.Name, true);
        }
      }
    }
    get ActiveView() {
      if (this.C.ID == 0 && AppearanceBlockMode) return this.Group.Asset;
      return this.View;
    }
  }

  window.AppearanceZones = [
    {
      Name: "Head",
      Description: "Head",
      Category: "Appearance",
      Groups: new Set([
        "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Glasses", "HairBack", "HairFront", "Mask", "Eyes", "Eyes2", "Eyebrows", "Mouth", "Necklace",
      ]),
      Zone: [[100, 0, 300, 250]]

    },
    {
      Name: "UpperBody",
      Description: "Upper Body",
      Category: "Appearance",
      Groups: new Set([
        "Cloth", "Bra", "Gloves", "TailStraps", "Wings", "Height", "BodyUpper", "Hands", "ClothAccessory", "Suit",
      ]),
      Zone: [[100, 250, 300, 200]]
    },
    {
      Name: "LowerBody",
      Description: "Lower Body",
      Category: "Appearance",
      Groups: new Set([
        "ClothLower", "Panties", "Socks", "Shoes", "BodyLower", "Nipples", "Pussy", "SuitLower",
      ]),
      Zone: [[100, 450, 300, 550]]
    },
  ];

  function AppearanceSetZone(Name) {
    const C = CharacterAppearanceSelection;
    if (C.FocusGroup && C.FocusGroup.Name == Name) {
      C.FocusGroup = null;
    } else {
      C.FocusGroup = Name && AppearanceZones.find(Z => Z.Category == AppearanceSelectedCategory && Z.Name == Name);
    }
    AppearanceAssets = AppearanceAssetsAll
      .filter(G => G.Group.Category == AppearanceSelectedCategory)
      .filter(G => C.FocusGroup == null || C.FocusGroup.Groups.has(G.Group.Name));
  }

  function AppearanceBuildAssets(C) {
    AppearanceAssets = [];
    AppearanceAssetsAll = [];

    AssetGroup
      // .filter(G => G.Family == C.AssetFamily)
      .filter(G => G.Category == "Appearance" && G.AllowCustomize && (G.Asset.length > 1 || G.AllowNone))
      .forEach(G => AppearanceAssetsAll.push(new AppearanceAssetGroup(C, G)));
    AppearanceSetZone();
  }

  function AppearanceRunUndo(NoPop) {
    if (AppearanceUndo.length > 0) {
      if (NoPop) AppearanceUndo[AppearanceUndo.length - 1]();
      else AppearanceUndo.pop()();
    }
  }

  function AppearanceNormalRun() {
    const C = CharacterAppearanceSelection;

    AppearanceOffset = AppearanceHeight + AppearanceSpace;
    AppearanceNumPerPage = parseInt(900 / AppearanceOffset);

    // Draw the top buttons with images
    if (AppearanceUndo.length > 0) DrawButton(1183, 25, 90, 90, "", "White", "Icons/Magic.png", "Undo");
    if (C.ID == 0) {
      DrawButton(1300, 25, 90, 90, "", "White", "Icons/" + ((LogQuery("Wardrobe", "PrivateRoom")) ? "Wardrobe" : "Reset") + ".png", TextGet(LogQuery("Wardrobe", "PrivateRoom") ? "Wardrobe" : "ResetClothes"));
      DrawButton(1417, 25, 90, 90, "", "White", "Icons/Random.png", TextGet("Random"));
    } else if (C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) DrawButton(1417, 25, 90, 90, "", "White", "Icons/Wardrobe.png", TextGet("Wardrobe"));
    if (C.AllowItem) DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
    if (AppearanceAssets.length > AppearanceNumPerPage) DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));

    if (CharacterAppearanceOffset >= AppearanceAssets.length) CharacterAppearanceOffset = 0;
    for (let A = CharacterAppearanceOffset; A < AppearanceAssets.length && A < CharacterAppearanceOffset + AppearanceNumPerPage; A++) {
      AppearanceAssets[A].Draw(A - CharacterAppearanceOffset);
    }
  }

  function AppearanceNormalClick() {
    const C = CharacterAppearanceSelection;

    if ((MouseX >= 1365 - AppearanceHeight) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975)) {
      for (let A = CharacterAppearanceOffset; A < AppearanceAssets.length && A < CharacterAppearanceOffset + AppearanceNumPerPage; A++) {
        if ((MouseY >= 145 + (A - CharacterAppearanceOffset) * AppearanceOffset) && (MouseY <= 145 + AppearanceHeight + (A - CharacterAppearanceOffset) * AppearanceOffset)) {
          AppearanceAssets[A].Click();
        }
      }
    }

    let HeightRatio = CharacterAppearanceGetCurrentValue(C, "Height", "Zoom");
    if ((Player != null) && (Player.VisualSettings != null) && (Player.VisualSettings.ForceFullHeight != null) && Player.VisualSettings.ForceFullHeight) HeightRatio = 1.0;
    const X = 750;
    const Xoffset = 500 * (1 - HeightRatio) / 2;
    const YOffset = 1000 * (1 - HeightRatio);
    let broke = false;
    for (let A = 0; A < AppearanceZones.length && !broke; A++)
      for (let Z = 0; Z < AppearanceZones[A].Zone.length; Z++) {
        if (((C.Pose.indexOf("Suspension") < 0) && (MouseX - X >= ((AppearanceZones[A].Zone[Z][0] * HeightRatio) + Xoffset)) && (MouseY >= (((AppearanceZones[A].Zone[Z][1] - C.HeightModifier) * HeightRatio) + YOffset)) && (MouseX - X <= (((AppearanceZones[A].Zone[Z][0] + AppearanceZones[A].Zone[Z][2]) * HeightRatio) + Xoffset)) && (MouseY <= (((AppearanceZones[A].Zone[Z][1] + AppearanceZones[A].Zone[Z][3] - C.HeightModifier) * HeightRatio) + YOffset)))
          || ((C.Pose.indexOf("Suspension") >= 0) && (MouseX - X >= ((AppearanceZones[A].Zone[Z][0] * HeightRatio) + Xoffset)) && (MouseY >= HeightRatio * ((1000 - (AppearanceZones[A].Zone[Z][1] + AppearanceZones[A].Zone[Z][3])) - C.HeightModifier)) && (MouseX - X <= (((AppearanceZones[A].Zone[Z][0] + AppearanceZones[A].Zone[Z][2]) * HeightRatio) + Xoffset)) && (MouseY <= HeightRatio * (1000 - ((AppearanceZones[A].Zone[Z][1])) - C.HeightModifier)))) {
          if (AppearanceZones[A].Category == AppearanceSelectedCategory) {
            CharacterAppearanceOffset = 0;
            AppearanceSetZone(AppearanceZones[A].Name);
            broke = true;
          }
          break;
        }
      }

    if (MouseIn(1183, 25, 90, 90)) AppearanceRunUndo();
    if (MouseIn(1300, 25, 90, 90) && (C.ID == 0) && C.AllowItem && !LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceSetDefault(C);
    if (MouseIn(1300, 25, 90, 90) && (C.ID == 0) && C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) { CharacterAppearanceWardrobeLoad(C); }
    if (MouseIn(1417, 25, 90, 90) && (C.ID == 0) && C.AllowItem) {
      const Undo = AppearanceTempWardrobe[AppearanceTempWardrobe.length] = WardrobeSaveData(C);
      AppearanceUndo.push(() => { WardrobeLoadData(C, Undo); AppearanceTempWardrobe.pop(); });
      CharacterAppearanceFullRandom(C);
    }
    if (MouseIn(1417, 25, 90, 90) && (C.ID != 0) && C.AllowItem && LogQuery("Wardrobe", "PrivateRoom")) CharacterAppearanceWardrobeLoad(C);
    if (MouseIn(1534, 25, 90, 90) && C.AllowItem) { AppearanceAssets.filter(A => A.CanStrip() && !A.Group.KeepNaked).forEach(A => A.Strip()); }
    if (MouseIn(1651, 25, 90, 90)) {
      CharacterAppearanceOffset += AppearanceNumPerPage;
      if (CharacterAppearanceOffset >= AppearanceAssets.length) CharacterAppearanceOffset = 0;
    }
    if (MouseIn(1768, 25, 90, 90)) { C.FocusGroup = null; CharacterAppearanceExit(C); }
    if (MouseIn(1885, 25, 90, 90) && C.AllowItem) { C.FocusGroup = null; CharacterAppearanceReady(C); }
  }

  function AppearanceItemsRun() {
    const C = CharacterAppearanceSelection;

    if (AppearanceItem == null) {
      AppearanceMode = "";
      return;
    }

    AppearanceOffset = AppearanceHeight + AppearanceSpace;
    AppearanceNumPerPage = parseInt(900 / AppearanceOffset) * 2;

    const View = AppearanceItem.ActiveView;

    if (AppearanceItem.Item && (AppearanceItem.Item.Asset.Extended || AppearanceItem.Item.Asset.TypeInfo)) DrawButton(1183, 25, 90, 90, "", "White", "Icons/Use.png", DialogFind(Player, "Use"));
    if (AppearanceItem.Group.AllowNone) DrawButton(1300, 25, 90, 90, "", "White", "Icons/Dress.png", "Preview");
    if (C.ID == 0 && AppearanceItem.Group.AllowCustomize && !AppearanceBlockMode) DrawButton(1417, 25, 90, 90, "", "White", "Icons/DialogPermissionMode.png", DialogFind(Player, "DialogPermissionMode"));
    if (View.length > AppearanceNumPerPage) DrawButton(1534, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
    if (AppearanceItem.CanStrip()) DrawButton(1651, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("StripItem"));

    // Creates buttons for all groups
    const AppearanceHoverLast = AppearanceHover;
    AppearanceHover = null;
    if (AppearanceTextOnly) {
      for (let A = AppearanceItemsOffset; A * 2 < View.length && A * 2 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++) {
        AppearanceItem.DrawItem(1250, 145 + (A - AppearanceItemsOffset) * AppearanceOffset, 350, AppearanceHeight, View[A * 2], AppearanceTextOnly)
        if (A * 2 + 1 >= View.length || A * 2 + 1 >= AppearanceItemsOffset * 2 + AppearanceNumPerPage) break;
        AppearanceItem.DrawItem(1630, 145 + (A - AppearanceItemsOffset) * AppearanceOffset, 350, AppearanceHeight, View[A * 2 + 1], AppearanceTextOnly);
      }
    } else {
      let X = 1250;
      let Y = 125;
      const DeltaWidth = CommonIsMobile ? 250 : 183;
      const DeltaHeight = CommonIsMobile ? 300 : 215;
      for (let A = AppearanceItemsOffset; A < View.length && A < AppearanceItemsOffset + (CommonIsMobile ? 9 : 16); A++) {
        AppearanceItem.DrawItem(X, Y, DeltaWidth - 25, DeltaHeight - 25, View[A], AppearanceTextOnly);
        X = X + DeltaWidth;
        if (X > 1800) {
          X = 1250;
          Y = Y + DeltaHeight;
        }
      }
    }
    if (!CommonIsMobile && !AppearanceBlockMode && AppearanceHoverLast != AppearanceHover) {
      if (AppearanceHover && !AppearanceHoverLast) {
        AppearanceHoverPrev = AppearanceItem && AppearanceItem.Item && AppearanceItem.Item.Asset.Name
        AppearanceItem.SetItem(AppearanceHover, true);
      }
      else if (!AppearanceHover && AppearanceHoverLast) { AppearanceRunUndo(); AppearanceHoverPrev = null; }
    }
  }

  function AppearanceItemsClick() {
    const C = CharacterAppearanceSelection;

    const View = AppearanceItem.ActiveView;

    if (AppearanceTextOnly) {
      if (MouseIn(1250, 145, 350, 830))
        for (let A = AppearanceItemsOffset; A * 2 < View.length && A * 2 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++)
          if (MouseYIn(145 + (A - AppearanceItemsOffset) * AppearanceOffset, AppearanceHeight)) {
            AppearanceItem.ClickItem(View[A * 2]);
            return;
          }

      if (MouseIn(1630, 145, 350, 830))
        for (let A = AppearanceItemsOffset; A * 2 + 1 < View.length && A * 2 + 1 < AppearanceItemsOffset * 2 + AppearanceNumPerPage; A++)
          if (MouseYIn(145 + (A - AppearanceItemsOffset) * AppearanceOffset, AppearanceHeight)) {
            AppearanceItem.ClickItem(View[A * 2 + 1]);
            return;
          }
    } else {
      let X = 1250;
      let Y = 125;
      const DeltaWidth = CommonIsMobile ? 250 : 183;
      const DeltaHeight = CommonIsMobile ? 300 : 215;
      for (let A = AppearanceItemsOffset; A < View.length && A < AppearanceItemsOffset + (CommonIsMobile ? 9 : 16); A++) {
        if (MouseIn(X, Y, DeltaWidth - 25, DeltaHeight - 25)) {
          AppearanceItem.ClickItem(View[A]);
          return;
        }
        X = X + DeltaWidth;
        if (X > 1800) {
          X = 1250;
          Y = Y + DeltaHeight;
        }
      }
    }

    if (MouseIn(1183, 25, 90, 90) && AppearanceItem.Item && (AppearanceItem.Item.Asset.Extended || AppearanceItem.Item.Asset.TypeInfo)) {
      DialogExtendItem(AppearanceItem.Item);
      return;
    }

    if (MouseIn(1300, 25, 90, 90) && AppearanceItem.Group.AllowNone) {
      AppearanceItemsOffset = 0;
      AppearanceTextOnly = !AppearanceTextOnly;
      return;
    }

    if (MouseIn(1417, 25, 90, 90) && C.ID == 0 && !AppearanceBlockMode) {
      AppearanceBlockMode = true;
      return;
    }

    if (MouseIn(1651, 25, 90, 90) && AppearanceItem.CanStrip()) { AppearanceItem.Strip(false); return; }

    if (MouseIn(1534, 25, 90, 90) && View.length > AppearanceNumPerPage) {
      if (AppearanceTextOnly) {
        AppearanceItemsOffset += AppearanceNumPerPage / 2;
        if (AppearanceItemsOffset * 2 + 1 >= View.length) AppearanceItemsOffset = 0;
      } else {
        AppearanceItemsOffset += (CommonIsMobile ? 9 : 16);
        if (AppearanceItemsOffset >= View.length) AppearanceItemsOffset = 0;
      }
      return;
    }

    if (MouseIn(1768, 25, 90, 90) && !AppearanceBlockMode) {
      AppearanceSetZone();
      AppearanceExit();
      return;
    }

    if (MouseIn(1885, 25, 90, 90)) {
      if (AppearanceBlockMode) {
        AppearanceItem.ReloadView();
        AppearanceBlockMode = false;
        return;
      }
      AppearanceItemUndo = false;
      AppearanceSetZone();
      AppearanceExit();
      return;
    }
  }

  function AppearanceColorRun() {
    if (!AppearanceItem) { AppearanceMode = ""; return; }
    ItemColorDraw(CharacterAppearanceSelection, AppearanceItem.Group.Name, 1300, 25, 675, 950, AppearanceItem);
  }

  function AppearanceColorClick() {
    if (AppearanceItem == null) {
      AppearanceMode = "";
      return;
    }
    ItemColorClick(CharacterAppearanceSelection, AppearanceItem.Group.Name, 1300, 25, 675, 950, AppearanceItem)
  }

  function AppearanceWardrobeRun() {
    const C = CharacterAppearanceSelection;
    // Draw the wardrobe top controls & buttons
    if (!AppearanceWardrobeShouldUndo) DrawButton(1300, 25, 90, 90, "", "White", "Icons/Magic.png", TextGet("Undo"));
    DrawButton(1417, 25, 90, 90, "", "White", "Icons/Dress.png", TextGet("DressManually"));
    DrawButton(1534, 25, 90, 90, "", "White", "Icons/Naked.png", TextGet("Naked"));
    DrawButton(1651, 25, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
    DrawText(CharacterAppearanceWardrobeText, 1645, 155, "White", "Gray");
    if (document.getElementById("InputWardrobeName")) ElementPosition("InputWardrobeName", 1645, 230, 690);
    else AppearanceMode = "";

    if (navigator.clipboard) {
      DrawButton(1300, 320, 180, 65, "Import", "White");
      DrawButton(1515, 320, 180, 65, "Export", "White");
      DrawButton(1730, 320, 250, 65, "Full Export", "White");
    }

    // Draw 6 wardrobe options
    for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++) {
      DrawButton(1300, 430 + (W - AppearanceWardrobeOffset) * 95, 500, 65, "", "White", "");
      DrawTextFit((W + 1).toString() + (W < 9 ? ":  " : ": ") + Player.WardrobeCharacterNames[W], 1550, 463 + (W - AppearanceWardrobeOffset) * 95, 496, "Black");
      DrawButton(1820, 430 + (W - AppearanceWardrobeOffset) * 95, 160, 65, "Save", "White", "");
    }
  }

  async function AppearanceWardrobeClick() {
    const C = CharacterAppearanceSelection;
    if (MouseIn(1651, 25, 90, 90)) {
      AppearanceWardrobeOffset += 6;
      if (AppearanceWardrobeOffset >= WardrobeSize) AppearanceWardrobeOffset = 0;
    }
    if (MouseIn(1300, 430, 500, 540))
      for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++)
        if (MouseYIn(430 + (W - AppearanceWardrobeOffset) * 95, 65)) {
          if (AppearanceWardrobeShouldUndo) {
            const Undo = AppearanceTempWardrobe[AppearanceTempWardrobe.length] = WardrobeSaveData(C);
            AppearanceUndo.push(() => { WardrobeLoadData(C, Undo); AppearanceTempWardrobe.pop(); });
            AppearanceWardrobeShouldUndo = false;
          }
          WardrobeFastLoad(C, W, false);
        }

    if (navigator.clipboard) {
      if (MouseIn(1300, 320, 180, 65)) {
        const obj = JSON.parse(lzw_decode(await navigator.clipboard.readText()));
        if (Array.isArray(obj) &&
          obj.every(Boolean) &&
          obj.every(B =>
            (Array.isArray(B) && (B.every(P => typeof P === 'string'))) ||
            (B.Name && B.Group)))
          WardrobeLoadData(CharacterAppearanceSelection, obj);
      }
      if (MouseIn(1515, 320, 180, 65)) {
        await navigator.clipboard.writeText(lzw_encode(JSON.stringify(WardrobeSaveData(CharacterAppearanceSelection, false, true))));
      }
      if (MouseIn(1730, 320, 250, 65)) {
        await navigator.clipboard.writeText(lzw_encode(JSON.stringify(WardrobeSaveData(CharacterAppearanceSelection, true, true))));
      }
    }

    if (MouseIn(1820, 430, 155, 540))
      for (let W = AppearanceWardrobeOffset; W < WardrobeSize && W < AppearanceWardrobeOffset + 6; W++)
        if (MouseYIn(430 + (W - AppearanceWardrobeOffset) * 95, 65)) {
          WardrobeFastSave(C, W);
          const LS = /^[a-zA-Z ]+$/;
          const Name = ElementValue("InputWardrobeName").trim();
          if (Name.match(LS) || Name.length == 0) {
            WardrobeSetCharacterName(W, Name);
            CharacterAppearanceWardrobeText = TextGet("WardrobeNameInfo");
          } else {
            CharacterAppearanceWardrobeText = TextGet("WardrobeNameError");
          }
        }

    if (MouseIn(1300, 25, 90, 90) && !AppearanceWardrobeShouldUndo) { AppearanceRunUndo(); AppearanceWardrobeShouldUndo = true; }
    if (MouseIn(1417, 25, 90, 90)) { AppearanceMode = ""; ElementRemove("InputWardrobeName"); }
    if (MouseIn(1534, 25, 90, 90)) { AppearanceAssets.filter(A => A.CanStrip() && !A.Group.KeepNaked).forEach(A => A.Strip()); }
    if (MouseIn(1768, 25, 90, 90)) { C.FocusGroup = null; CharacterAppearanceExit(C); }
    if (MouseIn(1885, 25, 90, 90)) { C.FocusGroup = null; CharacterAppearanceReady(C); }
  }

}

function LoadAppearanceV2Optimize() {
  window.AssetMap = new Map();
  window.AssetGroupMap = new Map();
  AssetGroup.forEach(G => { G.Asset = [], AssetGroupMap.set(G.Name, G); });
  Asset.forEach(A => { AssetGroupMap.get(A.Group.Name).Asset.push(A); AssetMap.set(A.Group.Name + A.Name, A); });
  AssetGet = function AssetGet(Family, Group, Name) {
    return AssetMap.get(Group + Name);
  };
}

function LoadAppearanceV2ColorPicker() {
  let AppearanceShade = 5;
  let AppearanceShadeMode = "LIG";

  ColorPickerSelectFromPallete = function ColorPickerSelectFromPallete(Event) {
    return ColorPickerExtraClick();
  };

  ColorPickerDraw = function ColorPickerDraw(X, Y, Width, Height, Src, Callback) {

    // Calculate Layout
    ColorPickerLayout.HueBarHeight = ColorPickerHueBarHeight;
    ColorPickerLayout.HueBarOffset = Y;
    ColorPickerLayout.PalleteHeight = ColorPickerPalleteHeight;
    ColorPickerLayout.PalleteOffset = Y + Height - ColorPickerLayout.PalleteHeight;
    ColorPickerLayout.SVPanelHeight = Height - ColorPickerLayout.HueBarHeight - ColorPickerLayout.PalleteHeight - ColorPickerSVPanelGap - ColorPickerPalleteGap;
    ColorPickerLayout.SVPanelOffset = ColorPickerLayout.HueBarOffset + ColorPickerHueBarHeight + ColorPickerSVPanelGap;

    var SVPanelOffset = ColorPickerLayout.SVPanelOffset;
    var SVPanelHeight = ColorPickerLayout.SVPanelHeight;
    var PalleteOffset = ColorPickerLayout.PalleteOffset;
    var PalleteHeight = ColorPickerLayout.PalleteHeight;

    var HSV;
    if (ColorPickerInitialHSV == null) {
      // Get initial color value based on type of source
      var Color;
      if (Src instanceof HTMLInputElement) {
        ColorPickerSourceElement = Src;
        Color = Src.value.trim();
      } else {
        if (ColorPickerSourceElement != null) {
          ColorPickerSourceElement = null;
        }
        Color = Src;
      }

      HSV = ColorPickerCSSToHSV(Color);
      ColorPickerInitialHSV = Object.assign({}, HSV);
      ColorPickerLastHSV = Object.assign({}, HSV);
      ColorPickerHSV = Object.assign({}, HSV);
      ColorPickerRemoveEventListener();   // remove possible duplicated attached event listener, just in case
      ColorPickerAttachEventListener();
    } else {
      // Watch source element change
      if (ColorPickerSourceElement != null) {
        var UserInputColor = ColorPickerSourceElement.value.trim().toUpperCase();
        if (CommonIsColor(UserInputColor)) {
          var PrevColor = ColorPickerHSVToCSS(ColorPickerHSV).toUpperCase();
          if (!ColorPickerCSSColorEquals(UserInputColor, PrevColor)) {
            if (ColorPickerCallback) {
              // Fire callback due to source element changed by user interaction
              ColorPickerCallback(UserInputColor);
            }
            ColorPickerHSV = ColorPickerCSSToHSV(UserInputColor, ColorPickerHSV);
          }
        }
      }
      // Use user updated HSV
      HSV = ColorPickerHSV;
    }

    // Draw Hue Control
    var Grad;
    Grad = MainCanvas.createLinearGradient(X, Y, X + Width, Y);
    Grad.addColorStop(0.00, "#f00");
    Grad.addColorStop(0.16, "#ff0");
    Grad.addColorStop(0.33, "#0f0");
    Grad.addColorStop(0.50, "#0ff");
    Grad.addColorStop(0.66, "#00f");
    Grad.addColorStop(0.83, "#f0f");
    Grad.addColorStop(1.00, "#f00");
    MainCanvas.fillStyle = Grad;
    MainCanvas.fillRect(X, Y, Width, ColorPickerHueBarHeight);

    // Draw S/V Panel
    DrawRect(X, SVPanelOffset, Width, SVPanelHeight, ColorPickerHSVToCSS({ H: HSV.H, S: 1, V: 1 }));

    Grad = MainCanvas.createLinearGradient(X, SVPanelOffset, X + Width, SVPanelOffset);
    Grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    Grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    MainCanvas.fillStyle = Grad;
    MainCanvas.fillRect(X, SVPanelOffset, Width, SVPanelHeight);

    Grad = MainCanvas.createLinearGradient(X, SVPanelOffset, X, SVPanelOffset + SVPanelHeight);
    Grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    Grad.addColorStop(1, "rgba(0, 0, 0, 1)");
    MainCanvas.fillStyle = Grad;
    MainCanvas.fillRect(X, SVPanelOffset, Width, SVPanelHeight);

    var CSS = ColorPickerHSVToCSS(HSV);
    DrawCircle(X + HSV.S * Width, SVPanelOffset + (1 - HSV.V) * SVPanelHeight, 8, 16, CSS);
    DrawCircle(X + HSV.S * Width, SVPanelOffset + (1 - HSV.V) * SVPanelHeight, 14, 4, (HSV.V > 0.8 && HSV.S < 0.2) ? "#333333" : "#FFFFFF");
    // Draw Hue Picker
    DrawEmptyRect(X + HSV.H * (Width - 20), Y, 20, ColorPickerHueBarHeight, "#FFFFFF");

    // Draw Pallette
    ColorPickerExtraDraw();

    ColorPickerX = X;
    ColorPickerY = Y;
    ColorPickerWidth = Width;
    ColorPickerHeight = Height;
    ColorPickerCallback = Callback;
  };

  function ColorPickerExtraDraw() {
    let Color = ColorPickerExtraGet();
    if (!Color) Color = "#FFFFFF";
    let B = Color;
    let F = ExtraColorToBW(Color);
    if (B[0] == '#') {
      DrawButton(1385, 880, 90, 90, "", Color, null, "Copy", null, () => { B = "Cyan"; });
      {
        MainCanvas.beginPath();
        MainCanvas.lineWidth = "5";
        MainCanvas.fillStyle = F;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1385 + 20, 880 + 20);
        MainCanvas.lineTo(1385 + 70, 880 + 70);
        MainCanvas.moveTo(1385 + 20, 880 + 70);
        MainCanvas.lineTo(1385 + 70, 880 + 20);
        MainCanvas.stroke();
        MainCanvas.closePath();

        MainCanvas.beginPath();
        MainCanvas.lineWidth = "5";
        MainCanvas.fillStyle = F;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.strokeRect(1385 + 20, 880 + 20, 50, 50)
        MainCanvas.stroke();
        MainCanvas.closePath();

        MainCanvas.beginPath();
        MainCanvas.lineWidth = "15";
        MainCanvas.fillStyle = B;
        MainCanvas.strokeStyle = MainCanvas.fillStyle;
        MainCanvas.moveTo(1385 + 15, 880 + 45);
        MainCanvas.lineTo(1385 + 75, 880 + 45);
        MainCanvas.moveTo(1385 + 45, 880 + 15);
        MainCanvas.lineTo(1385 + 45, 880 + 75);
        MainCanvas.stroke();
        MainCanvas.closePath();
      }
    }

    B = AppearanceColorPaste;
    DrawButton(1485, 880, 90, 90, "", AppearanceColorPaste, null, "Paste", null, () => { B = "Cyan"; });
    F = ExtraColorToBW(AppearanceColorPaste);
    {
      MainCanvas.beginPath();
      MainCanvas.lineWidth = "5";
      MainCanvas.fillStyle = F;
      MainCanvas.strokeStyle = MainCanvas.fillStyle;
      MainCanvas.moveTo(1485 + 20, 880 + 20);
      MainCanvas.lineTo(1485 + 70, 880 + 70);
      MainCanvas.moveTo(1485 + 20, 880 + 70);
      MainCanvas.lineTo(1485 + 70, 880 + 20);
      MainCanvas.stroke();
      MainCanvas.closePath();

      MainCanvas.beginPath();
      MainCanvas.lineWidth = "2";
      MainCanvas.fillStyle = F;
      MainCanvas.strokeStyle = MainCanvas.fillStyle;
      MainCanvas.lineWidth = "13";
      MainCanvas.moveTo(1485 + 25, 880 + 45);
      MainCanvas.lineTo(1485 + 65, 880 + 45);
      MainCanvas.moveTo(1485 + 45, 880 + 25);
      MainCanvas.lineTo(1485 + 45, 880 + 65);
      MainCanvas.stroke();
      MainCanvas.closePath();

      MainCanvas.beginPath();
      MainCanvas.lineWidth = "4";
      MainCanvas.fillStyle = B;
      MainCanvas.strokeStyle = MainCanvas.fillStyle;
      MainCanvas.moveTo(1485 + 25, 880 + 45);
      MainCanvas.lineTo(1485 + 65, 880 + 45);
      MainCanvas.moveTo(1485 + 45, 880 + 25);
      MainCanvas.lineTo(1485 + 45, 880 + 65);
      MainCanvas.stroke();
      MainCanvas.closePath();
    }

    DrawButton(1585, 880, 90, 90, AppearanceShadeMode, "White", null, AppearanceShadeMode == "LIG" ? "Lightness" : null);

    DrawButton(1685, 880, 90, 90, AppearanceShade.toString() + "%", "White", null, "Shade Percent");

    const Lighter = AppearanceShadeMode == "LIG" ? ExtraShadeColor(Color, AppearanceShade) : ExtraRotateColor(Color, AppearanceShade);
    DrawButton(1785, 880, 90, 90, "", Lighter, null, "Lighten");
    {
      MainCanvas.beginPath();
      MainCanvas.lineWidth = "5";
      MainCanvas.fillStyle = ExtraColorToBW(Lighter);
      MainCanvas.strokeStyle = MainCanvas.fillStyle;
      MainCanvas.moveTo(1785 + 20, 880 + 45);
      MainCanvas.lineTo(1785 + 70, 880 + 45);
      MainCanvas.moveTo(1785 + 45, 880 + 20);
      MainCanvas.lineTo(1785 + 45, 880 + 70);
      MainCanvas.stroke();
      MainCanvas.closePath();
    }

    const Darker = AppearanceShadeMode == "LIG" ? ExtraShadeColor(Color, 0 - AppearanceShade) : ExtraRotateColor(Color, 0 - AppearanceShade);
    DrawButton(1885, 880, 90, 90, "", Darker, null, "Darken");
    {
      MainCanvas.beginPath();
      MainCanvas.lineWidth = "5";
      MainCanvas.fillStyle = ExtraColorToBW(Darker);
      MainCanvas.strokeStyle = MainCanvas.fillStyle;
      MainCanvas.moveTo(1885 + 20, 880 + 45);
      MainCanvas.lineTo(1885 + 70, 880 + 45);
      MainCanvas.stroke();
      MainCanvas.closePath();
    }
  }

  function ColorPickerExtraGet() {
    var UserInputColor = ColorPickerSourceElement.value.trim().toUpperCase();
    if (CommonIsColor(UserInputColor)) return UserInputColor;
    return null;
  }

  function ColorPickerExtraSet(Color) {
    const HSV = ColorPickerCSSToHSV(Color);
    ColorPickerInitialHSV = Object.assign({}, HSV);
    ColorPickerLastHSV = Object.assign({}, HSV);
    ColorPickerHSV = Object.assign({}, HSV);
    ColorPickerNotify();
  }

  function ColorPickerExtraClick() {
    let Color = ColorPickerExtraGet();
    if (!Color) Color = "#FFFFFF";

    if (MouseIn(1385, 880, 90, 90)) {
      AppearanceColorPaste = Color;
      if (navigator.clipboard) navigator.clipboard.writeText(AppearanceColorPaste);
    }

    if (MouseIn(1485, 880, 90, 90)) {
      ColorPickerExtraSet(AppearanceColorPaste);
    }

    if (MouseIn(1555, 880, 90, 90)) {
      if (AppearanceShadeMode == "LIG") AppearanceShadeMode = "HUE";
      else AppearanceShadeMode = "LIG";
    }

    if (MouseIn(1685, 880, 90, 90)) {
      if (AppearanceShade == 5) AppearanceShade = 10;
      else if (AppearanceShade == 10) AppearanceShade = 20;
      else if (AppearanceShade == 20) AppearanceShade = 1;
      else AppearanceShade = 5;
    }

    if (MouseIn(1785, 880, 90, 90)) {
      if (AppearanceShadeMode == "LIG") {
        ColorPickerExtraSet(ExtraShadeColor(Color, AppearanceShade));
      } else if (AppearanceShadeMode == "HUE") {
        ColorPickerExtraSet(ExtraRotateColor(Color, AppearanceShade));
      }
    }

    if (MouseIn(1885, 880, 90, 90)) {
      if (AppearanceShadeMode == "LIG") {
        ColorPickerExtraSet(ExtraShadeColor(Color, 0 - AppearanceShade));
      } else if (AppearanceShadeMode == "HUE") {
        ColorPickerExtraSet(ExtraRotateColor(Color, 0 - AppearanceShade));
      }
    }
  }

  function ExtraColorGet(color, i) {
    return color[0] == "#" ? parseInt(color.substring(i * 2 + 1, i * 2 + 3), 16) : 255;
  }

  function ExtraColorToBW(color) {
    const r = ExtraColorGet(color, 0);
    const g = ExtraColorGet(color, 1);
    const b = ExtraColorGet(color, 2);
    return (r * r + g * g + b * b) <= (Math.pow(r - 255, 2) + Math.pow(g - 255, 2) + Math.pow(b - 255, 2)) ? "White" : "Black";
  }

  function ExtraShadeColor(color, percent) {
    const shade = i => {
      let x = parseInt(ExtraColorGet(color, i) * (100 + percent) / 100);
      x = x < 255 ? x : 255;
      x = x.toString(16);
      return x.length == 1 ? "0" + x : x;
    };
    return "#" + shade(0) + shade(1) + shade(2);
  }

  function ExtraRotateColor(color, rotate) {
    AppearanceHUERot.SetRotation(2 * Math.PI * rotate / 100);
    return "#" +
      AppearanceHUERot.Apply(ExtraColorGet(color, 0), ExtraColorGet(color, 1), ExtraColorGet(color, 2))
        .map(x => x.toString(16))
        .map(x => x.length == 1 ? "0" + x : x)
        .join("");
  }

  class RGBRotate {
    constructor() {
      this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    }
    Clamp(v) {
      if (v < 0) return 0;
      if (v > 255) return 255;
      return parseInt(v + 0.5);
    }
    SetRotation(degrees) {
      const cosA = Math.cos(degrees);
      const sinA = Math.sin(degrees);
      const s = Math.sqrt(1. / 3.);
      this.matrix[0][0] = cosA + (1.0 - cosA) / 3.0;
      this.matrix[0][1] = 1. / 3. * (1.0 - cosA) - s * sinA;
      this.matrix[0][2] = 1. / 3. * (1.0 - cosA) + s * sinA;
      this.matrix[1][0] = 1. / 3. * (1.0 - cosA) + s * sinA;
      this.matrix[1][1] = cosA + 1. / 3. * (1.0 - cosA);
      this.matrix[1][2] = 1. / 3. * (1.0 - cosA) - s * sinA;
      this.matrix[2][0] = 1. / 3. * (1.0 - cosA) - s * sinA;
      this.matrix[2][1] = 1. / 3. * (1.0 - cosA) + s * sinA;
      this.matrix[2][2] = cosA + 1. / 3. * (1.0 - cosA);
    }
    Apply(r, g, b) {
      const rx = r * this.matrix[0][0] + g * this.matrix[0][1] + b * this.matrix[0][2];
      const gx = r * this.matrix[1][0] + g * this.matrix[1][1] + b * this.matrix[1][2];
      const bx = r * this.matrix[2][0] + g * this.matrix[2][1] + b * this.matrix[2][2];
      return [this.Clamp(rx), this.Clamp(gx), this.Clamp(bx)];
    }
  }

  const AppearanceHUERot = new RGBRotate();

}

function LoadAppearanceV2Drawing() {
  DrawBackNextButton = function DrawBackNextButton(Left, Top, Width, Height, Label, Color, Image, BackText, NextText, ThreeWay) {
    var SplitWidth = Width / 2;
    if (typeof ThreeWay == 'function') SplitWidth = Width / 3
    var Split = Left + SplitWidth;
    // Draw the button rectangle (makes half of the background cyan colored if the mouse is over it)
    MainCanvas.beginPath();
    MainCanvas.rect(Left, Top, Width, Height);
    MainCanvas.fillStyle = Color;
    MainCanvas.fillRect(Left, Top, Width, Height);
    if (!CommonIsMobile && (MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height)) {
      MainCanvas.fillStyle = "Cyan";
      if (typeof ThreeWay == 'function' && (MouseX > Left + SplitWidth * 2)) MainCanvas.fillRect(Left + SplitWidth * 2, Top, SplitWidth, Height);
      else if (MouseX > Left + SplitWidth) MainCanvas.fillRect(Left + SplitWidth, Top, SplitWidth, Height);
      else MainCanvas.fillRect(Left, Top, SplitWidth, Height);
    }
    MainCanvas.lineWidth = '2';
    MainCanvas.strokeStyle = 'black';
    MainCanvas.stroke();
    MainCanvas.closePath();

    // Draw the text or image
    DrawTextFit(Label, Left + Width / 2, Top + (Height / 2) + 1, Width - 4, "black");
    if ((Image != null) && (Image != "")) DrawImageResize(Image, Left + 2, Top + 2, Width - 4, Height - 4);

    if (CommonIsMobile || typeof ThreeWay != 'function') return;

    // Draw the back arrow
    MainCanvas.beginPath();
    MainCanvas.fillStyle = "black";
    MainCanvas.moveTo(Left + 15, Top + Height / 5);
    MainCanvas.lineTo(Left + 5, Top + Height / 2);
    MainCanvas.lineTo(Left + 15, Top + Height - Height / 5);
    MainCanvas.stroke();
    MainCanvas.closePath();

    // Draw the next arrow
    MainCanvas.beginPath();
    MainCanvas.fillStyle = "black";
    MainCanvas.moveTo(Left + Width - 15, Top + Height / 5);
    MainCanvas.lineTo(Left + Width - 5, Top + Height / 2);
    MainCanvas.lineTo(Left + Width - 15, Top + Height - Height / 5);
    MainCanvas.stroke();
    MainCanvas.closePath();

    if (CommonIsMobile) return;

    if (BackText == null) BackText = () => "MISSING VALUE FOR: BACK TEXT";
    if (NextText == null) NextText = () => "MISSING VALUE FOR: NEXT TEXT";
    if (ThreeWay && typeof ThreeWay !== 'function') ThreeWay = () => "MISSING VALUE FOR: THREEWAY TEXT";

    // Draw the hovering text
    if ((MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height)) {
      Left = (MouseX > 1000) ? Left - 475 : Left + 115;
      Top = Top + (Height - 65) / 2;
      MainCanvas.beginPath();
      MainCanvas.rect(Left, Top, 450, 65);
      MainCanvas.fillStyle = "#FFFF88";
      MainCanvas.fillRect(Left, Top, 450, 65);
      MainCanvas.fill();
      MainCanvas.lineWidth = '2';
      MainCanvas.strokeStyle = 'black';
      MainCanvas.stroke();
      MainCanvas.closePath();
      if (ThreeWay && (MouseX > Split && MouseX <= Split + SplitWidth)) DrawTextFit(ThreeWay(), Left + 225, Top + 33, 444, "black");
      else DrawTextFit((MouseX > Split) ? NextText() : BackText(), Left + 225, Top + 33, 444, "black");
    }
  };
  DrawCharacter = function DrawCharacter(C, X, Y, Zoom, IsHeightResizeAllowed) {
    if ((C != null) && ((C.ID == 0) || (Player.Effect.indexOf("BlindHeavy") < 0) || (CurrentScreen == "InformationSheet"))) {


      // Shortcuts drawing the character to 3D if needed
      if (Draw3DEnabled) {
        Draw3DCharacter(C, X, Y, Zoom, IsHeightResizeAllowed);
        return;
      }

      // Run any existing asset scripts
      if (
        (!C.AccountName.startsWith('Online-') || !(Player.OnlineSettings && Player.OnlineSettings.DisableAnimations))
        && (!Player.GhostList || Player.GhostList.indexOf(C.MemberNumber) == -1)
      ) {
        var DynamicAssets = C.Appearance.filter(CA => CA.Asset.DynamicScriptDraw);
        DynamicAssets.forEach(Item =>
          window["Assets" + Item.Asset.Group.Name + Item.Asset.Name + "ScriptDraw"]({
            C, Item, PersistentData: () => AnimationPersistentDataGet(C, Item.Asset)
          })
        );

        // If we must rebuild the canvas due to an animation
        const refreshTimeKey = AnimationGetDynamicDataName(C, AnimationDataTypes.RefreshTime);
        const refreshRateKey = AnimationGetDynamicDataName(C, AnimationDataTypes.RefreshRate);
        const buildKey = AnimationGetDynamicDataName(C, AnimationDataTypes.Rebuild);
        const lastRefresh = AnimationPersistentStorage[refreshTimeKey] || 0;
        const refreshRate = AnimationPersistentStorage[refreshRateKey] == null ? 60000 : AnimationPersistentStorage[refreshRateKey];
        if (refreshRate + lastRefresh < CommonTime() && AnimationPersistentStorage[buildKey]) {
          CharacterRefresh(C, false);
          AnimationPersistentStorage[buildKey] = false;
          AnimationPersistentStorage[refreshTimeKey] = CommonTime();
        }
      }

      // There's 2 different canvas, one blinking and one that doesn't
      var Canvas = (Math.round(CurrentTime / 400) % C.BlinkFactor == 0) ? C.CanvasBlink : C.Canvas;

      // Applies an offset to X and Y based on the HeightRatio.  If the player prefers full height, we always use 1.0
      let HeightRatio = 1.0;
      if ((IsHeightResizeAllowed == undefined) || IsHeightResizeAllowed) HeightRatio = CharacterAppearanceGetCurrentValue(C, "Height", "Zoom");
      if ((Player != null) && (Player.VisualSettings != null) && (Player.VisualSettings.ForceFullHeight != null) && Player.VisualSettings.ForceFullHeight) HeightRatio = 1.0;
      if (Zoom == null) Zoom = 1;
      X += Zoom * Canvas.width * (1 - HeightRatio) / 2;
      if ((C.Pose.indexOf("Suspension") < 0) && (C.Pose.indexOf("SuspensionHogtied") < 0)) Y += Zoom * Canvas.height * (1 - HeightRatio);

      // If we must dark the Canvas characters
      if ((C.ID != 0) && Player.IsBlind() && (CurrentScreen != "InformationSheet")) {
        var CanvasH = document.createElement("canvas");
        CanvasH.width = Canvas.width;
        CanvasH.height = Canvas.height;
        var DarkFactor = (Player.Effect.indexOf("BlindNormal") >= 0) ? 0.3 : 0.6;
        var ctx = CanvasH.getContext("2d");
        ctx.drawImage(Canvas, 0, 0);
        // Overlay black rectangle.
        ctx.fillStyle = "rgba(0,0,0," + (1.0 - DarkFactor) + ")";
        ctx.fillRect(0, 0, CanvasH.width, CanvasH.height);
        // Re-apply character alpha channel
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(Canvas, 0, 0);
        Canvas = CanvasH;
      }

      // If we must flip the canvas vertically
      if (C.Pose.indexOf("Suspension") >= 0) {
        var CanvasH = document.createElement("canvas");
        CanvasH.width = Canvas.width;
        CanvasH.height = Canvas.height;
        CanvasH.getContext("2d").rotate(Math.PI);
        CanvasH.getContext("2d").translate(-Canvas.width, -Canvas.height);
        CanvasH.getContext("2d").drawImage(Canvas, 0, 0);
        Canvas = CanvasH;
      }

      // Draw the character and applies the zoom ratio, the canvas to draw can be shrunk based on the height modifier
      Zoom *= HeightRatio;
      let H = Canvas.height + (((C.HeightModifier != null) && (C.HeightModifier < 0)) ? C.HeightModifier : 0);
      MainCanvas.drawImage(Canvas, 0, 0, Canvas.width, H, X, Y - (C.HeightModifier * Zoom), Canvas.width * Zoom, H * Zoom);

      // Applies a Y offset if the character is suspended
      if (C.Pose.indexOf("Suspension") >= 0) Y += (Zoom * Canvas.height * (1 - HeightRatio) / HeightRatio);

      // Draw the arousal meter & game images on certain conditions
      DrawArousalMeter(C, X - Zoom * Canvas.width * (1 - HeightRatio) / 2, Y - Zoom * Canvas.height * (1 - HeightRatio), Zoom / HeightRatio);
      OnlineGameDrawCharacter(C, X - Zoom * Canvas.width * (1 - HeightRatio) / 2, Y - Zoom * Canvas.height * (1 - HeightRatio), Zoom / HeightRatio);
      if (C.HasHiddenItems) DrawImageZoomCanvas("Screens/Character/Player/HiddenItem.png", MainCanvas, 0, 0, 86, 86, X + 54 * Zoom, Y + 880 * Zoom, 70 * Zoom, 70 * Zoom);

      // Draws the character focus zones if we need too
      if ((C.FocusGroup != null) && (C.FocusGroup.Zone != null) && (CurrentScreen != "Preference")) {
        if (CurrentScreen != "Appearance") {
          // Draw all the possible zones in transparent colors (gray if free, yellow if occupied, red if blocker)
          for (var A = 0; A < AssetGroup.length; A++)
            if (AssetGroup[A].Zone != null && AssetGroup[A].Name != C.FocusGroup.Name) {
              var Color = "#80808040";
              if (InventoryGroupIsBlocked(C, AssetGroup[A].Name)) Color = "#88000580";
              else if (InventoryGet(C, AssetGroup[A].Name) != null) Color = "#D5A30080";
              DrawAssetGroupZone(C, AssetGroup[A].Zone, HeightRatio, X, Y, Color, 5);
            }
        } else {
          for (var A = 0; A < AppearanceZones.length; A++) {
            if (AppearanceZones[A].Zone != null && AppearanceZones[A].Category == AppearanceSelectedCategory) {
              DrawAssetGroupZone(C, AppearanceZones[A].Zone, HeightRatio, X, Y, "#80808040", 6);
            }
          }
        }
        // Draw the focused zone in cyan
        DrawAssetGroupZone(C, C.FocusGroup.Zone, HeightRatio, X, Y, "cyan");
      }

      // Draw the character name below herself
      if ((C.Name != "") && ((CurrentModule == "Room") || (CurrentModule == "Online") || ((CurrentScreen == "Wardrobe") && (C.ID != 0))) && (CurrentScreen != "Private")) {
        if (!Player.IsBlind()) {
          MainCanvas.font = "30px Arial";
          DrawText(C.Name, X + 255 * Zoom, Y + 980 * ((C.Pose.indexOf("SuspensionHogtied") < 0) ? Zoom : Zoom / HeightRatio), (CommonIsColor(C.LabelColor)) ? C.LabelColor : "White", "Black");
          MainCanvas.font = "36px Arial";
        }
      }

    }
  };
}

function LoadAppearanceV2Wardrobe() {
  window.WardrobeSize = 24;
  window.WardrobeLoadData = function WardrobeLoadData(C, Data, LoadAll, Update) {
    let expression = {};
    if (C.ID == 0) expression = WardrobeGetExpression(C);
    C.Appearance = C.Appearance
      .filter(a => a.Asset.Group.Category != "Appearance" || (!LoadAll && !WardrobeGroupAccessible(C, a.Asset.Group, { ExcludeNonCloth: true })));
    Data
      .map(WardrobeExtractBundle)
      .filter(w => w.Name != null && w.Group != null)
      .filter(w => C.Appearance.find(a => a.Asset.Group.Name == w.Group) == null)
      .forEach(w => {
        let A = AssetGet(C.AssetFamily, w.Group, w.Name);
        if (A &&
          (LoadAll || WardrobeGroupAccessible(C, A.Group, { ExcludeNonCloth: true })) &&
          (A.Group.Category == "Appearance") &&
          (A.Value == 0 || InventoryAvailable(Player, A.Name, A.Group.Name)))
          CharacterAppearanceSetItem(C, w.Group, A, w.Color, 0, null, false);
      });
    // Adds any critical appearance asset that could be missing, adds the default one
    AssetGroup
      .filter(g => g.Category == "Appearance" && !g.AllowNone && !C.Appearance.some(a => a.Asset.Group.Name == g.Name))
      .forEach(g => {
        if (g.MirrorGroup && InventoryGet(C, g.MirrorGroup)) {
          C.Appearance.push({ Asset: Asset.find(a => a.Group.Name == g.Name && a.Name == InventoryGet(C, g.MirrorGroup).Asset.Name), Difficulty: 0, Color: InventoryGet(C, g.MirrorGroup).Color });
        } else {
          C.Appearance.push({ Asset: Asset.find(a => a.Group.Name == g.Name), Difficulty: 0, Color: "Default" });
        }
      });
    if (C.ID == 0) Player.Appearance.forEach(A => { if (expression[A.Asset.Group.Name]) A.Property = { ...A.Property, Expression: expression[A.Asset.Group.Name] }; });
    CharacterLoadCanvas(C);
    if (Update == null || Update) {
      if (C.ID == 0 && C.OnlineID != null) ServerPlayerAppearanceSync();
      if (C.ID == 0 || C.AccountName.indexOf("Online-") == 0) ChatRoomCharacterUpdate(C);
    }
  };

  window.WardrobeSaveData = function WardrobeSaveData(C, SaveAll, Small) {
    let Data = C.Appearance
      .filter(a => a.Asset.Group.Category == "Appearance")
      .filter(a => SaveAll || WardrobeGroupAccessible(C, a.Asset.Group, { ExcludeNonCloth: true }))
      .map(Small ? WardrobeAssetBundleSmall : WardrobeAssetBundle);
    if (!SaveAll) {
      // Using Player's body as base
      Data = Data.concat(Player.Appearance
        .filter(a => a.Asset.Group.Category == "Appearance")
        .filter(a => !a.Asset.Group.Clothing)
        .map(WardrobeAssetBundle));
    }
    return Data;
  };
  window.WardrobeAssetBundle = function WardrobeAssetBundle(A) {
    if (A.Alpha && A.Alpha != 1) return { Name: A.Asset.Name, Group: A.Asset.Group.Name, Color: A.Color, Alpha: A.Alpha };
    if (A.Color && A.Color != "" && A.Color != "Default") return { Name: A.Asset.Name, Group: A.Asset.Group.Name, Color: A.Color };
    return { Name: A.Asset.Name, Group: A.Asset.Group.Name };
  };

  window.WardrobeAssetBundleSmall = function WardrobeAssetBundleSmall(A) {
    if (Array.isArray(A)) return A;
    if (A.Alpha && A.Alpha != 1) return A.Name ? [A.Name, A.Group, A.Color, A.Alpha] : [A.Asset.Name, A.Asset.Group.Name, A.Color, A.Alpha];
    if (A.Color && A.Color != "" && A.Color != "Default") return A.Name ? [A.Name, A.Group, A.Color] : [A.Asset.Name, A.Asset.Group.Name, A.Color];
    return A.Name ? [A.Name, A.Group] : [A.Asset.Name, A.Asset.Group.Name];
  };

  window.WardrobeExtractBundle = function WardrobeExtractBundle(B) {
    if (B.Name) return B;
    return { Name: B[0], Group: B[1], Color: B[2], Alpha: B[3] };
  };
  window.lzw_encode = function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i = 1; i < data.length; i++) {
      currChar = data[i];
      if (dict[phrase + currChar] != null) {
        phrase += currChar;
      }
      else {
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        dict[phrase + currChar] = code;
        code++;
        phrase = currChar;
      }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i = 0; i < out.length; i++) {
      out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
  };

  // Decompress an LZW-encoded string
  window.lzw_decode = function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i = 1; i < data.length; i++) {
      var currCode = data[i].charCodeAt(0);
      if (currCode < 256) {
        phrase = data[i];
      }
      else {
        phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
      }
      out.push(phrase);
      currChar = phrase.charAt(0);
      dict[code] = oldPhrase + currChar;
      code++;
      oldPhrase = phrase;
    }
    return out.join("");
  };
}