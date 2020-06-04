//************************************ LONG STRINGS ************************************//
/** Finds commands available and shows help messages */
funtion InitHelp(){}
function HelpMsg(sender, isClubOwner, isOwner, isMistress){
 
    let msgList =[];
 
    var intenseConfig = `Config >>> `;
    var intenseSpeech = `Speech >>> `;
    var intenseOther = `Others >>> `;
    
    var helpStart = `Calling ID: ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}
    ${ChatRoomCharacter.map(el => {return { Name: el.Name, isCursed: el.isCursed }}).filter(n => n.Name == cursedConfig.slaveIdentifier && n.isCursed).length > 1
    ? "WARNING: Potential clash with another character!" : ""}`;

// Gets available commands 
    if (isClubOwner) {
        msgList = ["clubowner", "owner", "private", "mistress", "public", "all"];
    }
    else if(isOwner) {
        msgList = ["owner", "mistress", "private", "public", "all"];
    }
    else if(isMistress){
        msgList = ["mistress","public", "all"];
    }
    else if(sender == Player.MemberNumber){
        msgList = ["wearer", "private"];
        popChatSilent(helpStart);
     }
    else if(cursedConfig.hasPublicAccess){
        if(cursedConfig.hasFullPublic){msgList.push("mistress");}
        msgList = ["public", "all"];
    }

    else{
        msgList = ["all"];
    }

    msgList.forEach(section => {
        var helpmsg = FindBlock(section);
        
        sendWhisper(sender, helpmsg);
        
        if(cursedConfig.hasIntenseVersion){
            let intenseSearch = "intense"+ section;
            FindBlock(intenseSearch)
        }
        
    });
    if(cursedConfig.hasIntenseVersion){
        sendWhisper(sender, "INTENSE COMMANDS");
        sendWhisper(sender, intenseConfig);
        sendWhisper(sender, intenseSpeech);
        sendWhisper(sender, intenseOther);
    }
    let moreinfo = `Commands are called with ${cursedConfig.commandChar + cursedConfig.slaveIdentifier}, like "${cursedConfig.commandChar + cursedConfig.slaveIdentifier} respect"
    To learn all the commands or use it for yourself, check out this repository: https://github.com/ace-1331/ace12401-cursedscript/wiki/Functions `;
    sendWhisper(sender, moreinfo +  `
    More on various features:
    https://github.com/ace-1331/
    ace12401-cursedscript/wiki
    ---------
    Made by ace (12401) - Ace__#5558
    Official release: V${currentVersion}
    `);


function FindBlock(section) {
    switch(section){
        case "wearer":
            return ` ///WEARER COMMANDS///
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
            
            -wardrobev2
            
            >>> Other Commands <<<
            -draw [nb of cards] [players]
            -shuffle`;
        case "intensewearer":{
            intenseConfig += `-allowcapture`;
            intenseSpeech += `-talk [target id] [sentence id]`;
            intenseOther += `-nickname [Number] [Name] -deletenickname [Number] [Name] `;
            break;
        }

        case "public":
            return` ///PUBLIC COMMANDS///
            -help
            -respect
            -punish
            -edge`;
        case "intensepublic":{
            intenseOther += `
            -nickname [Name]
            
            -allownickname
            -capture`;
            break;
        }

        case "mistress":
            return` ///MISTRESS COMMANDS///
             >>> Basic Commands<<<
            -kneel
            -cursereport
            -showstrikes
            -changestrikes [+/- nb strikes]
            -enforce [a member number]
            -mistress [a member number]
            -public
            -deactivateonpresence
   
        
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
            -vibes
            -collar`;
        case "intensemistress":{
            intenseOther += `
            -mnickname [Number] [Name]
            -deletenickname [Number]`;
            break;
        }

        case "private":
            return ` ///PRIVATE COMMANDS///
            >>> Information <<<
            -speechreport
            -showmistresses
            -showowners
            -showenforced
            -shownicknames
            -configreport`;
        case "intenseprivate":{
            break;
        }
            
        case "owner":
            return`///OWNER COMMANDS///
            >>>Basic Commands<<<
            -asylum [nb of hours]
            -owner [a member number]
         
            >>>Configuration Commands<<<
            -guestnotes
            -readnotes
            -disablepunishments
            -onlyonpresence
            -restrainplay
            -fullpublic
            -afk
            -note
            *NEW*-reminderinterval [seconds]
            *NEW*-clearallreminders
        
            >>>Speech Commands<<<
            -enforceentrymessage
            -entrymessage [sentence]
        
            >>>Curses<<<
            *NEW*-clearcurses
            -reminders
            -togglereminder [reminder]`;
        case "intenseowner":{
            intenseConfig += `
             -leash
             -maid
            *NEW* -sensdep`;
            intenseSpeech += `
            -restrainedspeech
            -self [I, this slave, etc.]
            -target [id] [target]
            -sentence [id] [sentence]
            -listsentences
            -forcedsay [sentence]
            -say [sentence]
            -fullmute
            -enablesound
            -sound ["oink", "meow", ...]`;
            intenseOther += `
            -onickname [Number] [Name]`;
            break;
        }
        case "clubowner":
            return ``;
        case "intenseclubowner":{
            intenseConfig += `
            -lockowner
            *NEW* -locknewlover`;
            break;
        }
       
        case "all":{
            return ` 
            -asylumtimeleft
            -readnote
            -sendnote`;
        }
        case "intenseall" :{
            intenseOther += `-blocknickname`;
        }
           
        default:
            break;
    }
}
}
