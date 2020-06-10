//************************************ LONG STRINGS ************************************//
/** Initializes all the long strings needed to split them from the rest of the code */
function InitHelpMsg() {
    window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => {return { Name: el.Name, isCursed: el.isCursed }}).filter(n => n.Name == cursedConfig.slaveIdentifier && n.isCursed).length > 1
    ? "WARNING: Potential clash with another character!" : ""}

    //WEARER FUNCTIONS//

    >>> Information <<<
    -help
    -showstrikes
    -showblacklist
    -listsentences

    >>> Config Commands <<<
    *NEW*-eatcommands
    *NEW*-hidedisplay
    *NEW*-restraintvanish
    -isclassic
    -issilent
    -blacklist [a member number]
    -mistress [a member number]
    -owner [a member number]
    -commandchar [! / & / $ / #]
    -identifier [new identifier]
    -punishmentcolor ["#colorcode"]
    -forwardall
    -savecolors
    -wardrobev2
    INTENSE V:-capture

    >>>Speech Commands<<<
    INTENSE:-talk [target id] [sentence id]
    >>> Other Commands <<<
    INTENSE V:-nickname [Number] [Name]
    INTENSE V:-deletenickname [Number] [Name]
    -draw [nb of cards] [players]
    -shuffle

    //PUBLIC FUNCTIONS//
    -help
    -respect
    -title [title to add/rem]
    -punish
    -edge
    -asylumtimeleft
    -readnote
    -sendnote
    INTENSE V:-nickname [Name]
    INTENSE V:-blocknickname
    INTENSE V:-allownickname
     *NEW* INTENSE V: -respectnickname
    INTENSE V:-capture

    //MISTRESS FUNCTIONS//
    >>> Basic Commands<<<
    -kneel
    -cursereport
    -showstrikes
    -changestrikes [+/- nb strikes]
    -enforce [a member number] [optional custom title instead of defaults]
    *NEW*-mtitle [number(optional)] [title to add/rem]
    -mistress [a member number]
    -public
    -deactivateonpresence
    *DEPRECATED*-savecolors
    INTENSE V:-mnickname [Number] [Name]
    INTENSE V:-deletenickname [Number]
    *NEW* INTENSE V:-respectnickname [a member number]

    >>>Speech Commands<<<
    *NEW*-dolltalk
    -mute
    -cursedspeech
    -banword [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearwords
    -contractions
    
    >>>Curses<<<
    *NEW*-curseitem [group]
    -naked
    -vibes
    -collar
    -mittens
    -paws
    -gag
    -blindfold
    -hood
    -earplugs
    -dildogag
    -panties
    -screws
    -doublegag

    //OWNER AND WEARER FUNCTIONS//
    >>> Information <<<
    -speechreport
    -showmistresses
    -showowners
    -showenforced
    -shownicknames
    -configreport

    //OWNER FUNCTIONS//
    >>>Basic Commands<<<
    -asylum [nb of hours]
    -owner [a member number]
    *NEW* -otitle [Number] [Title]
    INTENSE V:-onickname [Number] [Name]

    >>>Configuration Commands<<<
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
    INTENSE VERSION: -maid
    *NEW*INTENSE VERSION: -sensdep

    >>>Speech Commands<<<
    -enforceentrymessage
    -entrymessage [sentence]
    INTENSE V:-restrainedspeech
    INTENSE V:-self [I, this slave, etc.]
    INTENSE V:-target [id] [target]
    INTENSE V:-sentence [id] [sentence]
    INTENSE V:-listsentences
    INTENSE V: -forcedsay [sentence]
    INTENSE V: -say [sentence]
    INTENSE V: -fullmute
    INTENSE V: -enablesound
    INTENSE V: -sound ["oink", "meow", ...]

    >>>Curses<<<
    -belt
    *NEW*-clearcurses
    -reminders
    -togglereminder [reminder]
    
    //CLUB OWNER FUNCTIONS//
    >>>Configuration Commands<<<
    ctitle-[Number] [Title]
    INTENSE VERSION: -lockowner
    *NEW*INTENSE VERSION: -locknewlover
    *NEW*INTENSE VERSION: -onickname [Number] [Name]

    ---------
    More on various features:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}
    </pre>`;
}
