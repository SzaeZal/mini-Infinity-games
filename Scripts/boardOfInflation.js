$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        stats:{
            points: 1,
            stars: 0,
            position: 0,
            eyeOfInfinityUnlocked: false,
            effects:{
                noRedSquareDivisions:{
                    turnsLeft: 0,
                },
                keyOfInfinity:{
                    turnsLeft: -1
                },
                lockpickKit:{
                    turnsLeft: 0
                },
                rerolls:{
                    turnsLeft: 0
                }
            },
            upgrades:{
                greenBaseDoubler:{
                    bought: false
                },
                secondDice:{
                    bought: false
                },
                antiDice:{
                    bought: false
                }
            }
        },
        shadowClone:{
            active:false,
            position: 0
        },
        options:{
            ui:{
                theme: "Dark",
                subMenuShown: true,
            }
        }
    }
    //#endregion
    //#region MultiplyPoints
    MultiplyPoints = (amount) =>{
        player.stats.points *= amount
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        Save() 
    }
    //#endregion
    //#region OpenShop
    OpenShop = (uselessParameter) =>{
        console.log("openShop")
    }
    //#endregion
    //#region  OpenSuperShop
    OpenSuperShop = (uselessParameter) =>{
        console.log("open super shop")
    }
    //#endregion
    //#region OpenStarShop
    OpenStarShop = (uselessParameter) =>{
        console.log("Open star shop")
    }
    //#endregion
    //#region DoBet
    DoBet = (uselessParameter) =>{
        console.log("I love gambling")
    }
    //#endregion
    //#region playerPositions
    let playerPositions = [
        {
            circle:{
                x:600,
                y:250
            },
            text:{
                x: 590,
                y: 260
            },
            callback:{
                name: MultiplyPoints,
                parameter: 10
            }
        },
        {
            circle:{
                x:550,
                y:200
            },
            text:{
                x: 540,
                y: 210
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:500,
                y:150
            },
            text:{
                x: 490,
                y: 160
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
        {
            circle:{
                x:440,
                y:107
            },
            text:{
                x: 430,
                y: 115
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/4
            }
        },
        {
            circle:{
                x:368,
                y:85
            },
            text:{
                x: 358,
                y: 93
            },
            callback:{
                name: MultiplyPoints,
                parameter: 5
            }
        },
        {
            circle:{
                x:285,
                y:77
            },
            text:{
                x: 275,
                y: 85
            },
            callback:{
                name: OpenShop,
                parameter: undefined
            }
        },
        {
            circle:{
                x:193,
                y:85
            },
            text:{
                x: 183,
                y: 93
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
        {
            circle:{
                x:123,
                y:112
            },
            text:{
                x: 113,
                y: 120
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/2
            }
        },
        {
            circle:{
                x:78,
                y:167
            },
            text:{
                x: 68,
                y: 175
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:60,
                y:250
            },
            text:{
                x: 50,
                y: 258
            },
            callback:{
                name: OpenSuperShop,
                parameter: undefined
            }
        },
        {
            circle:{
                x:78,
                y:333
            },
            text:{
                x: 68,
                y: 341
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:123,
                y:388
            },
            text:{
                x: 113,
                y: 396
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/4
            }
        },
        {
            circle:{
                x:193,
                y:415
            },
            text:{
                x: 183,
                y: 423
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
        {
            circle:{
                x:285,
                y:423
            },
            text:{
                x: 275,
                y: 431
            },
            callback:{
                name: DoBet,
                parameter: undefined
            }
        },
        {
            circle:{
                x:368,
                y:415
            },
            text:{
                x: 358,
                y: 423
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/5
            }
        },
        {
            circle:{
                x:440,
                y:393
            },
            text:{
                x: 430,
                y: 401
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:500,
                y:350
            },
            text:{
                x: 490,
                y: 358
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:550,
                y:300
            },
            text:{
                x: 540,
                y: 308
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/2
            }
        },
        {
            circle:{
                x:600,
                y:250
            },
            text:{
                x: 590,
                y: 260
            },
            callback:{
                name: MultiplyPoints,
                parameter: 10
            }
        },
        {
            circle:{
                x:650,
                y:200
            },
            text:{
                x: 640,
                y: 210
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:700,
                y:150
            },
            text:{
                x: 690,
                y: 160
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/4
            }
        },
        {
            circle:{
                x:760,
                y:107
            },
            text:{
                x: 750,
                y: 115
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:832,
                y:85
            },
            text:{
                x: 822,
                y: 93
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/5
            }
        },
        {
            circle:{
                x:915,
                y:77
            },
            text:{
                x: 905,
                y: 85
            },
            callback:{
                name: OpenShop,
                parameter: undefined
            }
        },
        {
            circle:{
                x:1007,
                y:85
            },
            text:{
                x: 997,
                y: 93
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
        {
            circle:{
                x:1077,
                y:112
            },
            text:{
                x: 1067,
                y: 120
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/4
            }
        },
        {
            circle:{
                x:1122,
                y:167
            },
            text:{
                x: 1112,
                y: 175
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:1140,
                y:250
            },
            text:{
                x: 1130,
                y: 258
            },
            callback:{
                name: OpenStarShop,
                parameter: undefined
            }
        },
        {
            circle:{
                x:1122,
                y:333
            },
            text:{
                x: 1112,
                y: 341
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:1077,
                y:388
            },
            text:{
                x: 1067,
                y: 396
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/2
            }
        },
        {
            circle:{
                x:1007,
                y:415
            },
            text:{
                x: 997,
                y: 423
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
        {
            circle:{
                x:915,
                y:423
            },
            text:{
                x: 905,
                y: 431
            },
            callback:{
                name: DoBet,
                parameter: undefined
            }
        },
        {
            circle:{
                x:832,
                y:415
            },
            text:{
                x: 822,
                y: 423
            },
            callback:{
                name: MultiplyPoints,
                parameter: 5
            }
        },
        {
            circle:{
                x:760,
                y:393
            },
            text:{
                x: 750,
                y: 401
            },
            callback:{
                name: MultiplyPoints,
                parameter: 1/4
            }
        },
        {
            circle:{
                x:700,
                y:350
            },
            text:{
                x: 690,
                y: 358
            },
            callback:{
                name: MultiplyPoints,
                parameter: 2
            }
        },
        {
            circle:{
                x:650,
                y:300
            },
            text:{
                x: 640,
                y: 308
            },
            callback:{
                name: MultiplyPoints,
                parameter: 4
            }
        },
    ]
    //#endregion
    //#region playerStatsCalculated
    let playerStatsCalculated={
        //idk if I need this
    }
    //#endregion   
    //#region sidebar open-close
    let sidebar = $("#sidebar")
    let isSidebarOpen=true
    $("#close-open").on("click", ()=>{
        if(isSidebarOpen){
            sidebar.removeClass("openSidebar")
            sidebar.addClass("closeSidebar")
            $("#close-open").html(`
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="49px" 
                    viewBox="0 -960 960 960" 
                    width="49px" 
                    fill="#888">
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>
            `)
        }
        else{
            sidebar.removeClass("closeSidebar")
            sidebar.addClass("openSidebar")
            $("#close-open").html(`
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="49px"
                    viewBox="0 -960 960 960"
                    width="49px"
                    fill="#888">
                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </svg>
            `)
        }
        isSidebarOpen=!isSidebarOpen
    })
    //#endregion
    //#region notification
    let notificationIds=[0]
    let notificationHiders=[]

    const ShowNotification=(notificationTitle, notificationText, notificationType)=>{
        let currentId=notificationIds[notificationIds.length-1]
        $("#notifications").append(`
            <div class="notification notification${notificationType} interactable" id="notification${currentId}">
                ${  notificationTitle!=""
                    ? `
                        <h5>${notificationTitle}</h5>
                        <hr>
                    ` : ""
                }
                ${notificationText}
            </div>    
        `)

        
        notificationHiders.push(setTimeout(()=>{
            $(`#notification${currentId}`).addClass("hiddenNotification")
        }, 4000))

        $("#notification"+currentId).on("click", ()=>{
            clearTimeout(notificationHiders[currentId])
            $(`#notification${currentId}`).addClass("hiddenNotification")
        })

        notificationIds.push(notificationIds.length)
    }
    //#endregion
    //#region dialog box
    const ShowDialogBox=(dialogTitle, dialogText, dialogType, callbackYes, callbackNo)=>{
        $("#dialogBox").html(`
            <div class="dialogBoxContainer dialogBox${dialogType}">
                <div class="dialogBoxHeader">
                    ${dialogTitle}
                    <div id="closeDialogBox" class="closeDialogBox interactable">&#10005;</div>
                </div>
                <div class="dialogBoxContent">
                    ${dialogText}
                </div>
                <div class="dialogBoxButtons">
                    ${callbackYes==undefined 
                        ? `<div id="dialogBoxCancel" class="dialogBoxButton dialogBoxButton${dialogType} interactable">I understand</div>`
                        : `
                            <div id="dialogBoxCancel" class="dialogBoxButton dialogBoxButton${dialogType} interactable">Cancel</div>
                            <div id="dialogBoxYes" class="dialogBoxButton dialogBoxButton${dialogType} interactable">Yes</div>
                        `
                    }
                </div>
            </div>
        `)
        $("#dialogBox").removeClass("hiddenDialogBox")
        AddDialogBoxEvents(callbackYes, callbackNo)
    }

    const AddDialogBoxEvents=(callbackYes, callbackNo)=>{
        $("#closeDialogBox").on("click", ()=>{
            $("#dialogBox").addClass("hiddenDialogBox")
        })
        $("#dialogBoxCancel").on("click", ()=>{
            $("#dialogBox").addClass("hiddenDialogBox")
            if(callbackNo) callbackNo()
        })
        if(callbackYes==undefined) return
        $("#dialogBoxYes").on("click", ()=>{
            callbackYes()
            $("#dialogBox").addClass("hiddenDialogBox")
        })
    }
    //#endregion
    //#region menu navigation
    const view = $("#view")
    let mainMenuIndex=2
    let subMenuIndexes=[0, 0, 0]
    let subMenuLimits=[0, 1, 0]
    $(document).keydown((e)=>{  
        if(e.originalEvent.code == "KeyS" || e.originalEvent.code == "ArrowDown"){
            mainMenuIndex= mainMenuIndex == subMenuLimits.length-1 ? 0 : mainMenuIndex+1
            mainMenuCallbacks[mainMenuIndex]()
        }
        else if(e.originalEvent.code == "KeyW" || e.originalEvent.code == "ArrowUp"){
            mainMenuIndex= mainMenuIndex == 0 ? subMenuLimits.length-1 : mainMenuIndex-1
            mainMenuCallbacks[mainMenuIndex]()
        }
        else if(e.originalEvent.code == "KeyA" || e.originalEvent.code == "ArrowLeft"){
            subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == 0 ? subMenuLimits[mainMenuIndex] : subMenuIndexes[mainMenuIndex]-1
            mainMenuCallbacks[mainMenuIndex]()
        }
        else if(e.originalEvent.code == "KeyD" || e.originalEvent.code == "ArrowRight"){
            subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == subMenuLimits[mainMenuIndex] ? 0 : subMenuIndexes[mainMenuIndex]+1
            mainMenuCallbacks[mainMenuIndex]()
        }
    })

    //#endregion
    //#region Settings
    $("#options").on("click", ()=>{
        mainMenuIndex=0
        GoToSettings()
    })

    const GoToSettings = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ''}>
                <div class="subMenuItem selectedSubMenuItem">
                    Settings
                </div>
            </div>
            <div class="mainView">
                <div class="settings">
                    <div class="setting">
                        <div class="settingTitle">
                            Theme
                        </div>
                        <div class="options">
                            <div id="themeDarkOption" class="option interactable ${player.options.ui.theme=="Dark" ? "selectedOption" : ""}">
                                Dark
                            </div>
                            <div id="themeLightOption" class="option interactable ${player.options.ui.theme=="Light" ? "selectedOption" : ""}">
                                Light
                            </div>
                        </div>
                    </div>
                    <div class="setting">
                        <div class="settingTitle">
                            Sub menu display
                        </div>
                        <div class="options">
                            <div id="subMenuDisplayShownOption" class="option interactable ${player.options.ui.subMenuShown==true ? "selectedOption" : ""}">
                                Shown
                            </div>
                            <div id="subMenuDisplayHiddenOption" class="option interactable ${player.options.ui.subMenuShown==false ? "selectedOption" : ""}">
                                Hidden
                            </div>
                        </div>
                    </div>
                    <div class="setting">
                        <div class="settingTitle">
                            Save Related
                        </div>
                        <div class="options">
                            <div id="exportSaveToClipboard" class="option interactable">
                                Export Save to clipboard
                            </div>
                            <div id="importSave" class="option interactable">
                                Import Save
                            </div>
                            <div id="hardReset" class="option danger interactable">
                                Hard Reset
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        `)
        AddSettingsUIEvents()
    }
    //#endregion
    //#region Settings Events
    const AddSettingsUIEvents = () =>{

        $("#themeDarkOption").on("click", ()=>SetTheme("Dark"))
        $("#themeLightOption").on("click", ()=>SetTheme("Light"))

        $("#subMenuDisplayShownOption").on("click", ()=>SetSubMenuShown(true))
        $("#subMenuDisplayHiddenOption").on("click", ()=>SetSubMenuShown(false))

        $("#exportSaveToClipboard").on("click", ()=>ExportSaveToClipboard())
        $("#importSave").on("click", ()=>{ ShowDialogBox("Import Save",
             "Importing a save will overwrite your current save. <br> <input id='dialogBoxTextarea' placeholder='paste your save here'> </input>", "Warning", ImportSave)})
        $("#hardReset").on("click", ()=>{ ShowDialogBox("Hard Reset", "Are you sure you want to hard reset? This action is irreversible.", "Danger", HardReset)})
    }
    //#endregion
    //#region Set theme
    const SetTheme = (newTheme)=>{
        $(newTheme=="Dark" ? "#themeLightOption" : "#themeDarkOption").removeClass("selectedOption")
        $("#container").removeClass(`theme-${newTheme == "Light" ? "dark" : "light"}`)
        player.options.ui.theme=newTheme
        $(newTheme=="Dark" ? "#themeDarkOption" : "#themeLightOption").addClass("selectedOption")
        $("#container").addClass(`theme-${newTheme == "Light" ? "light" : "dark"}`)
        Save()
    }
    //#endregion
    //#region Set subMenuShown
    const SetSubMenuShown = (newDisplay)=>{
        player.options.ui.subMenuShown=newDisplay
        GoToSettings()
        Save()
    }
    //#endregion
    //#region Export Save to clipboard
    const ExportSaveToClipboard = ()=>{
        let save= localStorage.getItem("replicantiIncSave")
        navigator.clipboard.writeText(save);
        ShowNotification("Success", "Save exported to clipboard", "Success")
    }
    //#endregion
    //#region Information nav
    $("#information").on("click", ()=>{
        mainMenuIndex=1
        GoToInformation()
    })

    const GoToInformation = () =>{
        switch(subMenuIndexes[1]){
            case 0:
                GoToMainInformation();
                break;
            case 1:
                GoToChangelogInformation();
                break;
            default:
                console.log("Settings sub navigation broke")
                break;
        }
    }
    //#endregion
    //#region GoToMainInformation
    const GoToMainInformation = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
                <div id="changelogSubMenuItem" class="subMenuItem interactable">
                    Changelog
                </div>
            </div>
            <div class="mainView">
                <div class="gameRelatedMainInfo">
                    <div class="informationGameTitle">
                        mini-Infinity-games <br> Board of Inflation
                    </div>
                    <div class="gameVersion">
                        V1: Release
                    </div>
                    <div class="gameAuthor">
                        Made by SzaeZal
                    </div>
                </div>
            </div>
        `)

        AddMainInformationUIEvents()
    }
    //#endregion
    //#region AddMainInformationUIEvents
    const AddMainInformationUIEvents=()=>{
        if(player.options.ui.subMenuShown==true){
            $("#changelogSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=1
                GoToChangelogInformation()
            })
        }
        else{
            $("#changelogSubMenuItem").removeClass("interactable")
        }
    }
    //#endregion
    //#region GoToChangelogInformation
    const GoToChangelogInformation = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem interactable" id="mainInformationSubMenuItem">
                    Main
                </div>
                <div class="subMenuItem selectedSubMenuItem">
                    Changelog
                </div>
            </div>
            <div class="mainView">
                <div class="changelog">
                    <div class="version">
                        <div class="changelogVersionName">
                            V1: Release
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                <li>Added board game</li>
                                <li>Added settings</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>    
        `)
        AddChangelogInformationUIEvents()
    }
    //#endregion
    //#region AddChangelogInformationUIEvents
    const AddChangelogInformationUIEvents=()=>{
        if(player.options.ui.subMenuShown==true){
            $("#mainInformationSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=0
                GoToMainInformation()
            })
        }
        else{
            $("#mainInformationSubMenuItem").removeClass("interactable")
        }
    }
    //#endregion
    //#region game menu
    $("#gameMenuItem").on("click", ()=>{
        mainMenuIndex=2
        GoToGameMenu()
    })

    const GoToGameMenu=()=>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                
            </div>  
        `)
        AddGameMenuUIEvents()  
    }
    //#endregion
    //#region  AddGameMenuUIEvents
    const AddGameMenuUIEvents = ()=>{
        
    }
    //#endregion
    //#region RollDice
    const RollDice = ()=>{
        let rng=0
        if(player.stats.upgrades.secondDice.bought==true){
            let rng2
            for(let i=0; i<10; i++){
                setTimeout(()=>{
                    rng=1 + Math.floor(Math.random() * 6)
                    rng2=1 + Math.floor(Math.random() * 6)
                    $("#diceResults").text(`${rng} - ${rng2}`)
                }, i*50)
            }

            setTimeout(()=>{
                player.stats.position+=rng
                MoveToTile(playerPositions[player.stats.position])
                playerPositions[player.stats.position].callback.name(playerPositions[player.stats.position].callback.parameter)
                Save()
            }, 1000 )
        }
        else{
            for(let i=0; i<10; i++){
                setTimeout(()=>{
                    rng=1 + Math.floor(Math.random() * 6)
                    $("#diceResults").text(`${rng}`)
                }, i*50)
            }

            setTimeout(()=>{
                player.stats.position+=rng
                MoveToTile(playerPositions[player.stats.position])
                playerPositions[player.stats.position].callback.name(playerPositions[player.stats.position].callback.parameter)
                Save()
            }, 1000 )
        }
    }
    //#endregion
    //#region MoveToTile
    const MoveToTile = (position) =>{
        $("#playerPositionIndicator").html(`
                <circle r="30" cx="${position.circle.x}" cy="${position.circle.y}" fill="rgba(255, 255, 255, 0.5)" stroke="white"/>
                <text x="${position.text.x}" y="${position.text.y}" font-size="35">p</text>
            `)
    }
    //#endregion
    //#region FormatNumber
    const FormatNumber= (numberToFormat)=>{
        let result = Math.floor(numberToFormat).toString();
        if (numberToFormat < 10) {
        result = (Math.floor(numberToFormat * 100) / 100).toString();
        }
        if (numberToFormat > 1000000) {
        result =
            Math.floor(
            Math.pow(
                10,
                Math.log10(numberToFormat) -
                Math.floor(Math.log10(numberToFormat))
            ) * 100
            ) /
            100 +
            "e" +
            Math.floor(Math.log10(numberToFormat));
        }
        return result; 
    }
    //#endregion
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("boardOfInflationSave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("boardOfInflationSave");
        if (jwt != null) {
            let [payload, signature] = jwt.split(".");
            if (JSON.parse(atob(signature)) != "LeastObviousSignature") {
                alert("Ey man how about you don't alter the localstorage aight?");
                return null;
            }
            return atob(payload);
        }
        return null;
    };
    
    const Load = () => {
        let playerSaveJson = DecodePartialJwt();
        try {
            let playerSaveParsed = JSON.parse(playerSaveJson);
            player = Object.assign({}, player, playerSaveParsed);

            CheckForMissingData();

            SetTheme(player.options.ui.theme);
        
        }
        catch (e) {
            console.log(e);
        }
    };
    
    const CheckForMissingData = () => {

    };

    const HardReset = () => {
        localStorage.removeItem("boardOfInflationSave");
        location.reload();
    };
    
    //#endregion
    //#region Import save
    const ImportSave = ()=>{
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("boardOfInflationSave", saveText)
        location.reload()
    }

    const ImportSaveFromText= (text)=>{
        localStorage.setItem("boardOfInflationSave", text)
        location.reload()
    }
    //#endregion
    mainMenuCallbacks=[GoToSettings, GoToInformation, GoToGameMenu] 
    AddGameMenuUIEvents()
    Load()

    if(window.innerWidth<500){
        ShowDialogBox("Warning", "This game is not optimized for small screens. <br> Please use a device with a larger screen for the best experience. <br> or use landscape orientation", "Warning")
    }
    //setTimeout(()=>{debugger;} , 15000)
    /*for(let i=0; i<playerPositions.length; i++){
        setTimeout(()=>{
            MoveToTile(playerPositions[i])
        }, i*500)
        
    }*/
   RollDice()
})