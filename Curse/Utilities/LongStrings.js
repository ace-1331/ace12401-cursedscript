//************************************ LONG STRINGS ************************************//
function InitHelpMsg() {
    window.helpTxt = `<pre>Your calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => el.Name).filter(n => n == cursedConfig.slaveIdentifier).length > 1 ? "WARNING: Potential clash with another character!" : ""}

    //WEARER FUNCTIONS//

    >>> Information <<<
    -help
    -speechreport
    -showstrikes
    -showmistresses
    -showowners
    -showenforced
    -showblacklist
    -shownicknames
    -configreport
    *NEW*-listsentences

    >>> Config Commands <<<
    -issilent
    -blacklist [a member number]
    -mistress [a member number]
    -owner [a member number]
    -commandchar [! / & / $ / #]
    -identifier [new identifier]
    -punishmentcolor ["#colorcode"]
    -forwardall
    *NEW*-isclassic
    -savecolors
    *NEW*-wardrobev2

    >>>Speech Commands<<<
    *NEW*INTENSE:-talk [target id] [sentence id]
    >>> Other Commands <<<
    INTENSE V:-nickname [Number] [Name]
    INTENSE V:-deletenickname [Number] [Name]
    -draw [nb of cards] [players]
    -shuffle

    //PUBLIC FUNCTIONS//
    -help
    -respect
    -punish
    -edge
    -asylumtimeleft
    -readnote
    INTENSE V:-nickname [Name]
    INTENSE V:-blocknickname
    INTENSE V:-allownickname

    //MISTRESS FUNCTIONS//
    >>> Basic Commands<<<
    -kneel
    -cursereport
    -showstrikes
    -changestrikes [+/- nb strikes]
    -enforce [a member number]
    -mistress [a member number]
    -public
    -deactivateonpresence
    -savecolors
    INTENSE V:-mnickname [Number] [Name]
    INTENSE V:-deletenickname [Number]

    >>>Speech Commands<<<
    -mute
    -cursedspeech
    -banword [the word itself]
    -banbegging [on/off]
    -banfirstperson [on/off]
    -clearwords
    *NEW*-contractions
    
    >>>Curses<<<
    -naked
    -vibes
    -latex
    -pony
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
    -rope
    -maiduniform


    //OWNER FUNCTIONS//
    >>>Basic Commands<<<
    -asylum [nb of hours]
    -owner [a member number]
    INTENSE V:-onickname [Number] [Name]

    >>>Configuration Commands<<<
    -disablepunishments
    -onlyonpresence
    -restrainplay
    *NEW*-fullpublic
    *NEW*-afk
    -note
    *NEW*INTENSE VERSION: -leash
    INTENSE VERSION: -lockowner
    INTENSE VERSION: -maid

    >>>Speech Commands<<<
    -enforceentrymessage
    -entrymessage [sentence]
    *NEW*INTENSE V:-restrainedspeech
    *NEW*INTENSE V:-self [I, this slave, etc.]
    *NEW*INTENSE V:-target [id] [target]
    *NEW*INTENSE V:-sentence [id] [sentence]
    *NEW*INTENSE V:-listsentences
    INTENSE V: -forcedsay [sentence]
    INTENSE V: -say [sentence]
    INTENSE V: -fullmute
    INTENSE V: -enablesound
    INTENSE V: -sound ["oink", "meow", ...]

    >>>Curses<<<
    -belt
    ---------
    More on various features:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}
    </pre>`;
}
