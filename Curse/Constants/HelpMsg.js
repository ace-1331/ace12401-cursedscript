//************************************ LONG STRINGS ************************************//
/** Initializes all the long strings needed to split them from the rest of the code */
function InitHelpMsg() {
  window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => {return { Name: el.Name, isCursed: el.isCursed };}).filter(n => n.Name == cursedConfig.slaveIdentifier && n.isCursed).length > 1
    ? "WARNING: Potential clash with another character!" : ""}

    //WEARER FUNCTIONS//

    >>> Curses <<<
    -curseitem [group] [hours]
    
    >>> Information <<<
    -tip
    -tip reset
    -help
    -showblacklist
    -showstrikes
    -listsentences

    >>> Config Commands <<<
    *NEW*-togglecommand [command]
    -wardrobev2
    -eatcommands
    -hidedisplay
    -restraintvanish
    -issilent
    -blacklist [a member number]
    -mistress [a member number]
    -owner [a member number]
    -commandchar [! / & / $ / #]
    -identifier [new identifier]
    -forwardall
    -savecolors
    INTENSE V:-capture

    >>>Speech Commands<<<
    INTENSE:-talk [target id] [sentence id]
    
    >>> Other Commands <<<
    -draw [nb of cards] [players]
    -shuffle
    *NEW*-settitle [number][title]
    INTENSE V:-nickname [Number] [Nickname]
    
    //PUBLIC FUNCTIONS//
    -showstrikes
    *NEW*-transgressions
    *NEW*-listoffcommands
    -help
    *CHANGED*-respect
    *NEW*-selftitle [title]
    *NEW*-deletetitle
    -punish
    *NEW*-reward
    -edge
    -asylumtimeleft
    -readnote
    -sendnote
    -orgasmcount
    *NEW*INTENSE V:-namechange[nickname]
    INTENSE V:-deletenickname
    INTENSE V:-blockrename
    INTENSE V:-allowrename
    INTENSE V:-capture

    //MISTRESS FUNCTIONS//
    >>> Basic Commands<<<
    -kneel
    -cursereport
    -changestrikes [+/- nb strikes]
    -enforce [a member number] [optional custom title instead of defaults]
    -settitle [number][title]
    *NEW*-givetitle [title]
    -deletetitle [number]
    -mistress [a member number]
    -public
    -deactivateonpresence
    -savecolors
    INTENSE V:-nickname [Number][Nickname]
    *CHANGED*INTENSE V:-rename [nickname]
    INTENSE V:-deletenickname [Number]

    >>>Speech Commands<<<
    -dolltalk
    -mute
    -cursedspeech
    -banword [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearwords
    -contractions
    
    >>>Curses<<<
    -curseitem [group]
    -curseitem [group] [hours]
    *NEW*-clothed
    -naked
    -vibes
    *NEW*-vibratorintensity [off,max,etc.]
    -permakneel
    
    >>>Configurations<<<
    *NEW* -loadpresetcurses [name]
    *NEW* -loadpreset [name]
    *NEW* -savepreset [name]

    //OWNER AND WEARER FUNCTIONS//
    >>> Information <<<
    -speechreport
    -showmistresses
    -showowners
    -showenforced
    -configreport
    *NEW*-listpresets
    
    >>> Configurations <<<
    -isclassic
    *NEW*-fullblindfold
    
    //OWNER FUNCTIONS//
    >>>Basic Commands<<<
    -asylum [nb of hours]
    *NEW* -sendasylum
    -owner [a member number]

    >>>Configuration Commands<<<
    
    *NEW*-clearpunishments
    *NEW*-retype
    *NEW*-strictness [low/normal/strict]
    *NEW*-punishmentrestraint [1-10] [group]
    -resetorgasmcount
    -guestnotes
    -readnotes
    -disablepunishments
    -onlyonpresence
    -restrainplay
    -fullpublic
    -afk
    -note
    -reminderinterval [seconds]
    -clearallreminders
    INTENSE VERSION: -leash
    INTENSE VERSION: -norescue
    INTENSE VERSION: -sensdep
    INTENSE VERSION:-preventdc
    INTENSE VERSION:-meterlocked
    INTENSE VERSION:-meteroff
    *NEW* INTENSE VERSION:-secretorgasm
    *NEW* INTENSE VERSION:-blockooc
    *NEW* INTENSE VERSION:-safeword
    *NEW* INTENSE VERSION:-disableblocking

    >>>Club rules Commands<<<
    -forcedlabor
    -remoteself
    -remoteblock
    -unlockself
    -keyblock
    -blockchange
    
    >>>Speech Commands<<<
    -enforceentrymessage
    -entrymessage [sentence]
    INTENSE V:-restrainedspeech
    INTENSE V:-self [I, this slave, etc.]
    INTENSE V:-target [id] [target]
    INTENSE V:-sentence [id] [sentence]
    INTENSE V:-listsentences
    INTENSE V:-forcedsay [sentence]
    INTENSE V:-say [sentence]
    INTENSE V:-fullmute
    INTENSE V:-enablesound
    INTENSE V:-sound ["oink", "meow", ...]

    >>>Curses<<<
    -forbidorgasm
    -blockorgasm
    -clearcurses
    -reminders
    -togglereminder [reminder]
    
    //CLUB OWNER FUNCTIONS//
    >>>Configuration Commands<<<
    -looseowner
    INTENSE VERSION: -lockowner
    INTENSE VERSION: -locknewlover
    INTENSE VERSION: -locknewsub

    ---------
    More on various features:
    https://github.com/ace-1331/ace12401-cursedscript/wiki
    ---------
    Join us on Discord!
    https://discord.com/invite/9dtkVFP
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}
    </pre>`;
}
