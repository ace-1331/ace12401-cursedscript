// Curse globals
var currentManifestVersion: string;
var currentVersion: number;
var cursedConfigInit: any;
var cursedConfig: any;
var oldStorage: any;
var oldVersion: any;
var vibratorGroups: any;
var brokenVibratingItems: any;
var curseTips: any[];
var cursedPunishments: any[];
var helpTxt: string;
var Commands: any[];

var CommandSet: any;
var CommandCombine: any;

var _: {
	(text: any, ...args: any[]): any;
	translate: any,
	setFormatter(newFormatter: any): void;
	format(...rest: any[]): string;
	setDynamicTranslator(newDynoTrans: any): void;
	setTranslation(newTranslation: any): void;
}

// BC Globals
var CurrentScreen: string;
var ChatRoomSpace: string;
var Asset,
	ActivityOrgasmGameResistCount,
	ActivityOrgasmPrepare,
	ActivityOrgasmStart,
	AfkTimerSetIsAfk,
	AnimationGetDynamicDataName,
	AssetAdd,
	AssetFemale3DCG,
	AssetGroup,
	AssetGroupAdd,
	AsylumBedroomLoad,
	BackgroundsGenerateList,
	BackgroundsTagAsylum,
	BackgroundsTagList,
	CellKeyDepositStaff,
	CellLoad,
	CellLock,
	CellOpenTimer,
	Character,
	CharacterAppearanceLoadCharacter,
	CharacterAppearanceReturnModule,
	CharacterAppearanceReturnRoom,
	CharacterDeleteAllOnline,
	CharacterItemsHavePose,
	CharacterLoadNPC,
	CharacterRefresh,
	CharacterReset,
	CharacterSetActivePose,
	CharacterSetCurrent,
	CharacterSetFacialExpression,
	ChatCreateBackgroundList,
	ChatRoomAdminChatAction,
	ChatRoomCharacter,
	ChatRoomCharacterUpdate,
	ChatRoomClearAllElements,
	ChatRoomCurrentTime,
	ChatRoomData,
	ChatRoomDrawCharacterOverlay,
	ChatRoomGame,
	ChatRoomHelpSeen,
	ChatRoomLastMessage,
	ChatRoomLastMessageIndex,
	ChatRoomListManipulation,
	ChatRoomLovershipOptionIs,
	ChatRoomOwnershipOptionIs,
	ChatRoomPlayerCanJoin,
	ChatRoomPlayerIsAdmin,
	ChatRoomSendChat,
	ChatRoomTarget,
	ChatRoomTargetMemberNumber,
	ChatSearchBackground,
	ChatSearchLeaveRoom,
	CurrentScreenFunctions,
	CommonIsMobile,
	CommonSetScreen,
	CurrentTime,
	DialogFind,
	DialogCanUnlock,
	DialogLeave,
	DrawArousalMeter,
	DrawButton,
	DrawCharacter,
	DrawCheckbox,
	DrawText,
	ElementCreateInput,
	ElementCreateTextArea,
	ElementFocus,
	ElementIsScrolledToEnd,
	ElementPosition,
	ElementRemove,
	ElementScrollToEnd,
	ElementValue,
	FriendListBeepLog,
	GamblingRun,
	InformationSheetLoadCharacter,
	InventoryAdd,
	InventoryAllow,
	InventoryConfiscateKey,
	InventoryConfiscateRemote,
	InventoryDelete,
	InventoryGet,
	InventoryGroupIsBlocked,
	InventoryLock,
	InventoryOwnerOnlyItem,
	InventoryLoverOnlyItem,
	InventoryRemove,
	InventoryWear,
	Log,
	LogAdd,
	LogDelete,
	LogQuery,
	LogValue,
	MaidQuartersMaid,
	MaidQuartersOnlineDrinkFromOwner,
	MainCanvas,
	MainHallClick,
	MainHallMaid,
	MainHallMaidReleasePlayer,
	MainHallMaidShamePlayer,
	MainHallRun,
	ManagementAllowReleaseChastity,
	ManagementCanBeReleasedOnline,
	ManagementCanBreakTrialOnline,
	ManagementCannotBeReleasedOnline,
	MouseIn,
	NurseryRun,
	PhotographicPlayerRelease,
	Player,
	ReputationCharacterGet,
	ServerAccountBeep,
	ServerBeep,
	ServerPlayerAppearanceSync,
	ServerPlayerLogSync,
	ServerSend,
	ServerSocket,
	SpeechGarble,
	TextGet,
	VibratorModeScriptDraw,
	WardrobeFastLoad,
	WardrobeFastSave;

var LZString;
