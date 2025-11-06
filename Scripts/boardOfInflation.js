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
        $("#shopBox").html(`
            <div class="shopHeader">
                <div class="shopTitle">
                    Shop
                    <div id="closeShop" class="closeDialogBox interactable">&#10005;</div>
                </div>
            </div>
            <div id="shopItems">
                <div class="shopItem interactable" id="greenBaseDoublerOpen">
                    <img class="itemImage" alt="green base doubler icon" src="../Images/BoardOfInflation/greenBaseDoublerIcon.png"/>
                    <div class="itemTitle">
                        Green base doubler
                    </div>
                    <div id="greenBaseDoublerBought">
                        ${player.stats.upgrades.greenBaseDoubler.bought==true ? 'Bought' : 'Not bought'} 
                    </div>
                </div>
                <div class="shopItem interactable" id="noRedDivisionsOpen">
                    <img class="itemImage" alt="no red divisions icon" src="../Images/BoardOfInflation/noRedDivisionsIcon.png"/>
                    <div class="itemTitle">
                        No red divisions
                    </div>
                    <div id="noRedDivisionsActive">
                        ${player.stats.effects.noRedSquareDivisions.turnsLeft>0 ? `${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left` : 'Not bought'} 
                    </div>
                </div>
                <div class="shopItem interactable" id="secondDiceOpen">
                    <img class="itemImage" alt="second dice icon" src="../Images/BoardOfInflation/secondDiceIcon.png"/>
                    <div class="itemTitle">
                        Second dice
                    </div>
                    <div id="secondDiceBought">
                        ${player.stats.upgrades.secondDice.bought==true ? 'Bought' : 'Not bought'} 
                    </div>
                </div>
            </div>
        `)
        $("#shopBox").removeClass("hiddenPart")
        $("#shopBox").css("border","5px solid gray")
        AddShopUIEvents()
    }
    //#endregion
    //#region AddShopUIEvents
    const AddShopUIEvents = ()=>{
        $("#closeShop").on("click", ()=>{
            $("#shopBox").html(``)
            $("#shopBox").css("border", "none")
        })
        $("#greenBaseDoublerOpen").on("mousedown", (e)=>{
            if(e.button==2){

            }
            else{
                
            }
        })
    }
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
        $("#shopBox").html(`
            <div class="betContainer">
                <div class="diceContainer">
                    <div id="betResults">-</div>
                    <div id="gamble" class="interactable">ROLL DICE</div>
                </div>
                <div id="betResult">
                </div>
            </div>
        `)
        $("#shopBox").removeClass("hiddenPart")
        $("#shopBox").css("border","5px solid green")
        $("#gamble").on("click", ()=>{
            if(player.stats.upgrades.secondDice.bought==true){
                RollDoubleDice("bet")
                setTimeout(()=>{    
                    let betMultiplier = (rolledNumbers[0] + rolledNumbers[1]) / 4
                    $("#betResult").text(`Your points were multiplies by (${rolledNumbers[0]} + ${rolledNumbers[1]}) / 4`)
                    MultiplyPoints(betMultiplier)
                }, 750)
            }
            else{
                RollSingleDice("bet")
                setTimeout(()=>{    
                    let betMultiplier = rolledNumbers[0] / 4
                    $("#betResult").text(`Your points were multiplies by ${rolledNumbers[0]} / 4`)
                    MultiplyPoints(betMultiplier)
                }, 750)
            }
            setTimeout(()=>{    
                $("#shopBox").html(``)
                $("#shopBox").css("border","none")
            }, 3000)            
        })
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
    //#region rolledNumbers
    let rolledNumbers=[0, 0]
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
        if(player.stats.points==1 && player.stats.stars==0 && player.stats.position==0){
            StartGame()
        }
        else{
            view.html(`
                <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                    <div class="subMenuItem selectedSubMenuItem">
                        Main
                    </div>
                </div>
                <div class="mainView">
                    <div class="preGameMenu">
                        <div class="playerStats">
                            <div id="playerPoints" class="playerStat">
                                Points: ${FormatNumber(player.stats.points)}
                            </div>
                            <div id="playerStars" class="playerStat">
                                Stars: ${FormatNumber(player.stats.stars)}
                            </div>
                        </div>
                        <div class="upgradesBought">
                            Upgrades bought:
                            <ul>
                                <li>Green Base Doubler: ${player.stats.upgrades.greenBaseDoubler.bought ? "Bought" : "Not bought"}</li>
                                <li>Second Dice: ${player.stats.upgrades.secondDice.bought ? "Bought" : "Not bought"}</li>
                                <li>Anti Dice: ${player.stats.upgrades.antiDice.bought ? "Bought" : "Not bought"}</li>
                            </ul>
                        </div>
                        <div class="effectsActive">
                            Effects active:
                            ${player.stats.effects.noRedSquareDivisions.turnsLeft>0
                                || player.stats.effects.keyOfInfinity.turnsLeft!=-1
                                || player.stats.effects.lockpickKit.turnsLeft>0
                                ||  player.stats.effects.rerolls.turnsLeft>0 
                            ? `
                                <ul>
                                    ${player.stats.effects.noRedSquareDivisions.turnsLeft>0 ? ` <li>No Red Square Divisions: ${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left </li>` : ""}
                                    ${player.stats.effects.keyOfInfinity.turnsLeft!=-1 ? `<li>Key of Infinity:  ${player.stats.effects.keyOfInfinity.turnsLeft} turns left </li>` : ""}
                                    ${player.stats.effects.lockpickKit.turnsLeft>0 ? ` <li>Lockpick Kit: ${player.stats.effects.lockpickKit.turnsLeft} uses left </li>` : ""}
                                    ${player.stats.effects.rerolls.turnsLeft>0 ? ` <li>Rerolls: ${player.stats.effects.rerolls.turnsLeft} uses left </li>` : ""}
                                </ul>
                            ` : "None"}
                        </div>
                        <div class="startGameSection">
                            <div id="continueGame" class="interactable startGameButton">
                                Continue Game
                            </div>
                            <div id="resetSave" class="interactable startGameButton">
                                Reset save
                            </div>
                        </div>
                    </div>
                </div>  
            `)
            AddGameMenuUIEvents()
    }  
    }
    //#endregion
    //#region  AddGameMenuUIEvents
    const AddGameMenuUIEvents = ()=>{
        $("#continueGame").on("click", ()=>{
            StartGame()
        })

        $("#resetSave").on("click", ()=>{
            ShowDialogBox("Reset Save", "Are you sure you want to reset your save? This action is irreversible.", "Danger", HardReset)
        })
    }
    //#endregion
    //#region StartGame
    const StartGame = ()=>{
        view.html(`
            <div id="subMenuInView">
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                <div id="shopBox" class="hiddenPart">
                </div>
                <div class="statDisplays">    
                    <div class="diceContainer interactable" id="rollDice">
                        <div id="diceResults">-</div>
                        <div>Next Turn</div>
                    </div>
                    <div class="playerInfoContainer">
                        <div id="playerPoints">Points: ${FormatNumber(player.stats.points)}</div>
                        <div id="playerStars">Stars: ${FormatNumber(player.stats.stars)}</div>
                    </div>
                    <div class="playerEffects hiddenPart" id="playerEffects">
                        <div class="playerEffectsColumn">
                            <div class="effectItem hiddenPart id="noRedSquareDivisions">
                                <div class="effectName">
                                    No Red Square Divisions
                                </div>
                                <div class="effectDuration" id="noRedSquareDivisionsDuration">
                                    3 Turns left
                                </div>
                            </div>
                            <div class="effectItem hiddenPart" id="keyOfInfinity">
                                <div class="effectName">
                                    Key Of Infinity
                                </div>
                                <div class="effectDuration" id="keyOfInfinityDuration">
                                    x turns left
                                </div>
                            </div>    
                        </div>
                        <div class="playerEffectsColumn">
                            <div class="effectItem hiddenPart" id="lockpickKit">
                                <div class="effectName">
                                    lockpick kit
                                </div>
                                <div class="effectDuration" id="lockpickKitDuration">
                                    x uses left
                                </div>
                            </div>
                            <div class="effectItem hiddenPart" id="rerolls">
                                <div class="effectName">
                                    Rerolls
                                </div>
                                <div class="effectDuration" id="rerollsDuration">
                                    x uses left
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>
                <svg viewBox="0 0 1200 500" width="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" class="board">
                    <g class="tile-center">
                        <path d="M 550 250 L 600 200 L 650 250 L 600 300" stroke="gray" fill="blue"/>
                        <text x="570" y="260" font-size="35">x10</text>
                    </g>
                    <g class="boardRightSide">
                        <g class="tile-multiplier">
                            <path d="M 600 200 L 650 150 L 700 200 L 650 250" stroke="gray" fill="green"/>
                            <text x="630" y="210" font-size="35">x2</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 650 150 L 700 100 L 750 150 L 700 200" stroke="gray" fill="red"/>
                            <text x="685" y="160" font-size="35">/4</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 700 100 L 785 55 L 810 125 L 750 150" stroke="gray" fill="green"/>
                            <text x="743" y="117" font-size="35">x2</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 785 55 L 860 45 L 870 110 L 810 125" stroke="gray" fill="red"/>
                            <text x="815" y="95" font-size="35">/5</text>
                        </g>
                        <g class="tile-shop">
                            <path d="M 860 45 L 970 45 L 960 110 L 870 110" stroke="gray" fill="orange"/>
                            <text x="875" y="88" font-size="30">SHOP</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 970 45 L 1055 55 L 1040 125 L 960 110" stroke="gray" fill="green"/>
                            <text x="990" y="95" font-size="35">x4</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 1055 55 L 1040 125 L 1075 150 L 1135 125" stroke="gray" fill="red"/>
                            <text x="1062" y="125" font-size="35">/4</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 1075 150 L 1135 125 L 1175 185 L 1100 210" stroke="gray" fill="green"/>
                            <text x="1100" y="180" font-size="35">x2</text>
                        </g>
                        <g class="tile-starShop">
                            <path d="M 1175 185 L 1100 210 L 1100 290 L 1175 315" stroke="gray" fill="gray"/>
                            <path d="M 1110 250 L 1127 245 L 1135 225 L 1142 245 L 1160 250 L 1145 255 L 1150 275 L 1135 262 L 1120 275 L 1125 255" fill="yellow"/>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 1100 290 L 1175 315 L 1135 375 L 1075 350" stroke="gray" fill="green"/>
                            <text x="1100" y="340" font-size="35">x2</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 1135 375 L 1075 350 L 1040 375 L 1055 445" stroke="gray" fill="red"/>
                            <text x="1060" y="400" font-size="35">/2</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 1040 375 L 1055 445 L 970 455 L 960 390" stroke="gray" fill="green"/>
                            <text x="990" y="425" font-size="35">x4</text>
                        </g>
                        <g class="tile-bet">
                            <path d="M 970 455 L 960 390 L 870 390 L 860 455" stroke="gray" fill="darkGreen"/>
                            <text x="888" y="432" font-size="30">BET</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 870 390 L 860 455 L 785 445 L 810 375" stroke="gray" fill="green"/>
                            <text x="815" y="430" font-size="35">x5</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 785 445 L 810 375 L 750 350 L 700 400" stroke="gray" fill="red"/>
                            <text x="745" y="405" font-size="35">/4</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 750 350 L 700 400 L 650 350 L 700 300" stroke="gray" fill="green"/>
                            <text x="680" y="360"  font-size="35">x2</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 650 350 L 700 300 L 650 250 L 600 300" stroke="gray" fill="green"/>
                            <text x="630" y="310"  font-size="35">x4</text>
                        </g>
                    </g>
                    <g class="eyeOfInfinity">
                        <g class="tile-eyeOfInfinity">
                            <path d="M 1100 210 L 1100 290 L 1000 290 L 1000 210" stroke="black" fill="gray"/>
                            <image x="1012" y="215" width="72px" height="72px" href="../Images/BoardOfInflation/lock.png"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 1000 210 L 1000 290 L 950 275 L 950 225" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 1000 290 L 950 275 L 925 300 L 950 350" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 925 300 L 950 350 L 850 350 L 875 300" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 875 300 L 850 350 L 800 300 L 850 275" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 800 200 L 800 300 L 850 275 L 850 225" stroke="black" fill="orange"/>
                            <text x="806" y="255" font-size="30" fill="black">x</text>
                            <text x="826" y="240" font-size="30" fill="black" rotate="90">8</text>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 1000 210 L 950 225 L 925 200 L 950 150" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 925 200 L 950 150 L 850 150 L 875 200" stroke="black" fill="gray"/>
                        </g>
                        <g class="tile-eyeOfInfinity">
                            <path d="M 875 200 L 850 150 L 800 200 L 850 225" stroke="black" fill="gray"/>
                        </g>
                    </g>
                    <g class="boardLeftSide">
                        <g class="tile-multiplier">
                            <path d="M 600 200 L 550 150 L 500 200 L 550 250" stroke="gray" fill="green"/>
                            <text x="530" y="210"  font-size="35">x2</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 550 150 L 500 100 L 450 150 L 500 200" stroke="gray" fill="green"/>
                            <text x="480" y="160" font-size="35">x4</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 500 100 L 415 55 L 390 125 L 450 150" stroke="gray" fill="red"/>
                            <text x="425" y="120" font-size="35">/4</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 415 55 L 340 45 L 330 110 L 390 125" stroke="gray" fill="green"/>
                            <text x="350" y="95" font-size="35">x5</text>
                        </g>
                        <g class="tile-shop">
                            <path d="M 340 45 L 230 45 L 240 110 L 330 110" stroke="gray" fill="orange"/>
                            <text x="248" y="88" font-size="30">SHOP</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 230 45 L 145 55 L 160 125 L 240 110" stroke="gray" fill="green"/>
                            <text x="178" y="95" font-size="35">x4</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 145 55 L 160 125 L 125 150 L 65 125" stroke="gray" fill="red"/>
                            <text x="108" y="126" font-size="35">/2</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 125 150 L 65 125 L 25 185 L 100 210" stroke="gray" fill="green"/>
                            <text x="60" y="180" font-size="35">x2</text>
                        </g>
                        <g class="tile-superShop">
                            <path d="M 25 185 L 100 210 L 100 290 L 25 315" stroke="gray" fill="darkorange"/>
                            <text x="30" y="245" font-size="22">SUPER</text>
                            <text x="35" y="270" font-size="22">SHOP</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 100 290 L 25 315 L 65 375 L 125 350" stroke="gray" fill="green"/>
                            <text x="60" y="340" font-size="35">x2</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 65 375 L 125 350 L 160 375 L 145 445" stroke="gray" fill="red"/>
                            <text x="110" y="400" font-size="35">/4</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 160 375 L 145 445 L 230 455 L 240 390" stroke="gray" fill="green"/>
                            <text x="175" y="425" font-size="35">x4</text>
                        </g>
                        <g class="tile-bet">
                            <path d="M 230 455 L 240 390 L 330 390 L 340 455" stroke="gray" fill="darkGreen"/>
                            <text x="255" y="432" font-size="30">BET</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 330 390 L 340 455 L 415 445 L 390 375" stroke="gray" fill="red"/>
                            <text x="355" y="425" font-size="35">/5</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 415 445 L 390 375 L 450 350 L 500 400" stroke="gray" fill="green"/>
                            <text x="417" y="403" font-size="35">x2</text>
                        </g>
                        <g class="tile-multiplier">
                            <path d="M 450 350 L 500 400 L 550 350 L 500 300" stroke="gray" fill="green"/>
                            <text x="480" y="360" font-size="35">x2</text>
                        </g>
                        <g class="tile-divider">
                            <path d="M 550 350 L 600 300 L 550 250 L 500 300" stroke="gray" fill="red"/>
                            <text x="535" y="310" font-size="35">/2</text>
                        </g>
                    </g>
                    <g id="playerPositionIndicator">
                    </g>
                    
                    <g id="shadowPositionIndicator" class="hiddenPart">
                        <circle r="30" cx="600" cy="250" fill="rgba(0, 0, 0, 0.5)" stroke="black"/>
                        <text x="590" y="260" font-size="35">s</text>
                    </g>
                    <g id="openShopButton" class="hiddenPart">
                        <rect width="200" height="100" x="200" y="200" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)"/>
                        <text x="225" y="260" font-size="35">Open shop</text>
                    </g>
                </svg>
            </div>
        `)
        MoveToTile(playerPositions[player.stats.position])
        $("#rollDice").on("click", DoTurn)
        CheckForSpecialTiles()
    }
    //#endregion
    //#region DoTurn
    const DoTurn = ()=>{
        $("#shopBox").html(``)
        $("#shopBox").css("border", "none")
        if(player.stats.upgrades.secondDice.bought==false){
            RollSingleDice("dice")     
            setTimeout(()=>{
                player.stats.position+=rolledNumbers[0]
                if( player.stats.position>=playerPositions.length){
                    player.stats.position -=playerPositions.length
                }
                MoveToTile(playerPositions[player.stats.position])
                playerPositions[player.stats.position].callback.name(playerPositions[player.stats.position].callback.parameter)
                CheckForSpecialTiles()
                Save()
            }, 1000 )
        }
        else{
            RollDoubleDice("dice")
            setTimeout( ()=>{
                player.shadowClone.position += rolledNumbers[0] + rolledNumbers[1]
                if( player.shadowClone.position>=playerPositions.length){
                    player.shadowClone.position -=playerPositions.length
                }
                MoveShadowToTile(playerPositions[player.shadowClone.position])

                if(player.shadowClone.position == player.stats.position){
                    player.stats.points=1
                }
                
                /*TODO: Gonna need another method for selecting  */
                RollDoubleDice("dice")
            }, 750)
            setTimeout(() => {
                
                MoveToTile(playerPositions[player.stats.position])
                playerPositions[player.stats.position].callback.name(playerPositions[player.stats.position].callback.parameter)
                CheckForSpecialTiles()
                Save()
            }, 1500);
        }
    }
    //#endregion
    //#region RollDice
    const RollSingleDice = (divName)=>{
        for(let i=0; i<10; i++){
            setTimeout(()=>{
                rolledNumbers[0]=1 + Math.floor(Math.random() * 6)
                $(`#${divName}Results`).text(`${rolledNumbers[0]}`)
            }, i*50)
        }
    }

    const RollDoubleDice = (divName)=>{
        for(let i=0; i<10; i++){
            setTimeout(()=>{
                rolledNumbers[0]=1 + Math.floor(Math.random() * 6)
                rolledNumbers[1]=1 + Math.floor(Math.random() * 6)
                $(`#${divName}Results`).text(`${rolledNumbers[0]} - ${rolledNumbers[1]}`)
            }, i*50)
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
    //#region MoveShadowToTile
    const MoveShadowToTile = (position) =>{
        $("#shadowPositionIndicator").removeClass("hiddenPart")
        $("#shadowPositionIndicator").html(`
                <circle r="30" cx="${position.circle.x}" cy="${position.circle.y}" fill="rgba(0, 0, 0, 0.5)" stroke="black"/>
                <text x="${position.text.x}" y="${position.text.y}" font-size="35">p</text>
            `)
    }
    //#endregion
    //#region CheckForSpecialTiles
    const CheckForSpecialTiles = ()=>{
        if(player.stats.position == 5 || player.stats.position == 23){
            $("#openShopButton").removeClass("hiddenPart")
            $("#openShopButton").html(`
                <rect width="200" height="100" x="200" y="200" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)" class="interactable"/>
                <text x="225" y="260" font-size="35" class="interactable">Open shop</text>
            `)
            $("#openShopButton").on("click", OpenShop)
        }
        else if(player.stats.position == 9){
            $("#openShopButton").removeClass("hiddenPart")
            $("#openShopButton").html(`
                <rect width="200" height="100" x="200" y="200" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)" class="interactable"/>
                <text x="225" y="260" font-size="35" class="interactable">Open super shop</text>
            `)
            $("#openShopButton").on("click", OpenSuperShop)
        }
        else if(player.stats.position == 27){
            $("#openShopButton").removeClass("hiddenPart")
            $("#openShopButton").html(`
                <rect width="200" height="100" x="200" y="200" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)" class="interactable"/>
                <text x="225" y="260" font-size="35" class="interactable">Open star shop</text>
            `)
            $("#openShopButton").on("click", OpenStarShop)
        }
        else{
            $("#openShopButton").addClass("hiddenPart")
        }
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
        
            GoToGameMenu()
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
})