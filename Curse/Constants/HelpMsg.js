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
    *NEW*-hidehelp
    *NEW*-language [en/fr/ru/ger]
    -togglecommand [command]
    -wardrobev2
    -commandsv2
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
    INTENSE V:-nickname [Number] [Name]
    INTENSE V:-deletenickname [Number] [Name]

    //PUBLIC FUNCTIONS//
    *NEW*-language [en/fr/ru/ger]
    -showstrikes
    -transgressions
    -listoffcommands
    -help
    -respect
    -title [title to add/rem]
    -punish
    -reward
    -edge
    -asylumtimeleft
    -readnote
    -sendnote
    -orgasmcount
    INTENSE V:-nickname [Name]
    INTENSE V:-blocknickname
    INTENSE V:-allownickname
    INTENSE V: -respectnickname
    INTENSE V:-capture

    //MISTRESS FUNCTIONS//
    >>> Basic Commands<<<
    -kneel
    -cursereport
    -changestrikes [+/- nb strikes]
    -enforce [a member number] [optional custom title instead of defaults]
    -mtitle [number(optional)] [title to add/rem]
    -mistress [a member number]
    -public
    -deactivateonpresence
    -savecolors
    INTENSE V:-mnickname [Number] [Name]
    INTENSE V:-deletenickname [Number]
    INTENSE V:-respectnickname [a member number]

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
    -clothed
    -naked
    -vibes
    -vibratorintensity [off,max,etc.]
    -permakneel
    
    >>>Configurations<<<
    -loadpresetcurses [name]
    -loadpreset [name]
    -savepreset [name]
    *NEW*-deafimmune [number]
    *NEW*-keeprestraints

    //OWNER AND WEARER FUNCTIONS//
    >>> Information <<<
    -speechreport
    -showmistresses
    -showowners
    -showenforced
    -shownicknames
    -configreport
    -listpresets
    
    >>> Configurations <<<
    -isclassic
    -fullblindfold
    *NEW*-fullslow
    
    //OWNER FUNCTIONS//
    >>>Basic Commands<<<
    -asylum [nb of hours]
    -sendasylum
    -asylumreturntoroom
    -asylumlockdown
    -owner [a member number]
    -otitle [Number] [Title]
    INTENSE V:-onickname [Number] [Name]

    >>>Configuration Commands<<<
    -triggerword [phrase]
    -triggerduration [minutes]
    -clearpunishments
    -retype
    -strictness [low/normal/strict]
    -punishmentrestraint [1-10] [group]
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
    INTENSE VERSION:-secretorgasm
    INTENSE VERSION:-blockooc
    *NEW* INTENSE VERSION:-safeword
    INTENSE VERSION:-disableblocking

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
    -ctitle [Number] [Title]
    -looseowner
    INTENSE VERSION: -lockowner
    INTENSE VERSION: -locknewlover
    INTENSE VERSION: -locknewsub
    INTENSE VERSION: -onickname [Number] [Name]

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
