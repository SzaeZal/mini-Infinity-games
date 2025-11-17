$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        unlockedChampionMedals:false,
        limboUnlocked:false,
        personalBests:{
            easy:{
                gates: 0
            },
            medium:{
                gates: 0
            },
            hard:{
                gates: 0
            },
            limbo:{
                points: 0
            }
        },
        options:{
            ui:{
                theme: "Dark",
                subMenuShown: true,
            }
        }
    }
    //#endregion
    //#region playerStatsCalculated
    let playerStatsCalculated={
        totalMedals: 0,
        medals:{
            easyMedals: 0,
            mediumMedals: 0,
            hardMedals: 0,
            limboMedals: 0
        },
    }
    //#endregion   
    //#region CurrentGame
    let currentGame={
        active:false,
        paused:false,
        numberOfGates: 1,
        gateColoredChance: 0,
        timeForGateInMs: 0,
        points: 1,
        playerPosition:0,
        difficulty:"",
        nextGateCountdown: 0,
        targetGates: 0,
        personalBest:0,
        medalGates:{
          bronze:0,
          silver:0,
          gold:0,
          champion:0
        },
        gates:[],
    }
    //#endregion
    //#region Medals
    let medalGates={
        easy:{ //TODO: change this
            bronze:   600000,
            silver:   450000,
            gold:     240000,
            champion: 120000
        },
        medium:{
            bronze:   750000,
            silver:   450000,
            gold:     250000,
            champion: 150000
        },
        hard:{
            bronze:   500000,
            silver:   350000,
            gold:     250000,
            champion: 150000
        }
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
        if(currentGame.active){
            if(e.originalEvent.code=="Space"){
                PauseGame()
            }
            else if(e.originalEvent.code == "KeyA" || e.originalEvent.code == "ArrowLeft"){
                MovePlayerLeft()
            }
            else if(e.originalEvent.code == "KeyD" || e.originalEvent.code == "ArrowRight"){
                MovePlayerRight()
            }
        }
        else{    
            if(e.originalEvent.code == "KeyS" || e.originalEvent.code == "ArrowDown"){
                mainMenuIndex= mainMenuIndex == subMenuLimits.length-1 ? 0 : mainMenuIndex+1
                mainMenuCallbacks[mainMenuIndex]()
            }
            else if(e.originalEvent.code == "KeyW" || e.originalEvent.code == "ArrowUp"){
                mainMenuIndex= mainMenuIndex == 0 ? subMenuLimits.length-1 : mainMenuIndex-1
                mainMenuCallbacks[mainMenuIndex]()
            }
            if(mainMenuIndex==2){
                if(e.originalEvent.code == "KeyA" || e.originalEvent.code == "ArrowLeft"){
                    ChosePreviousDifficulty()
                }
                else if(e.originalEvent.code == "KeyD" || e.originalEvent.code == "ArrowRight"){
                    ChoseNextDifficulty()
                }
            }
            else{
                if(e.originalEvent.code == "KeyA" || e.originalEvent.code == "ArrowLeft"){
                    subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == 0 ? subMenuLimits[mainMenuIndex] : subMenuIndexes[mainMenuIndex]-1
                    mainMenuCallbacks[mainMenuIndex]()
                }
                else if(e.originalEvent.code == "KeyD" || e.originalEvent.code == "ArrowRight"){
                    subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == subMenuLimits[mainMenuIndex] ? 0 : subMenuIndexes[mainMenuIndex]+1
                    mainMenuCallbacks[mainMenuIndex]()
                }
            }
            
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
                        mini-Infinity-games <br> Infinite gates
                    </div>
                    <div class="gameVersion">
                        V0.9: No limbo
                    </div>
                    <div class="gameAuthor">
                        Made by SzaeZal
                    </div>
                    <div class="credits">
                        Credits: <br>
                        <ul>
                            <li>Medal images by Trackmania (Trackmania is owned by Nadeo and Ubisoft)</li>
                        </ul>
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
                            V0.9: No limbo
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                <li>Added easy difficulty</li>
                                <li>Added medium difficulty</li>
                                <li>Added hard difficulty</li>
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
    highlightedDifficultyIndex=0
    
    //#region ChosePreviousDifficulty
    const ChosePreviousDifficulty = ()=>{
        highlightedDifficultyIndex--
        if(highlightedDifficultyIndex<0){
            highlightedDifficultyIndex = difficultyBoxes.length-1
        }

        AddDifficultyBoxes()
        
        let nextSelectedDifficulty = highlightedDifficultyIndex == difficultyBoxes.length -1 ? 0 : highlightedDifficultyIndex + 1
        $(`#difficulty${highlightedDifficultyIndex}`).addClass("previouslySelectedDifficultyMoveToHighlightedClass")
        $(`#difficulty${nextSelectedDifficulty}`).addClass("highlightedDifficultyMoveToNextClass")
    }
    //#endregion
    //#region ChoseNextDifficulty
    const ChoseNextDifficulty = ()=>{
        highlightedDifficultyIndex++
        if(highlightedDifficultyIndex>=difficultyBoxes.length){
            highlightedDifficultyIndex = 0
        }

        AddDifficultyBoxes()
        
        let previouslySelectedDifficulty = highlightedDifficultyIndex == 0 ? difficultyBoxes.length-1 : highlightedDifficultyIndex - 1
        $(`#difficulty${highlightedDifficultyIndex}`).addClass("nextSelectedDifficultyMoveToHighlightedClass")
        $(`#difficulty${previouslySelectedDifficulty}`).addClass("highlightedDifficultyMoveToPreviousClass")
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
                <div id="game">
                    <div class="gameDifficultySelect">
                        <div id="difficultySelectLeft">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="100%"
                                viewBox="0 0 100 300"
                                width="10%"
                                fill="#888"
                            >
                                <polygon points="100 0 0 150 100 300"/>
                            </svg>
                        </div>
                        <div id="difficulties">
                            
                        </div>
                        <div id="difficultySelectRight">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="25%"
                                viewBox="0 0 100 300"
                                width="10%"
                                fill="#888"
                            >
                                <polygon points="0 0 100 150 0 300" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>  
        `)
        AddDifficultyBoxes()
        AddGameMenuUIEvents()
    }
    //#endregion
    //#region ShowDifficultyStats
    const ShowDifficultyStats = (difficulty)=>{
        currentGame.difficulty=difficulty
       
        if(currentGame.difficulty=="Easy"){
            currentGame.numberOfGates=2
            currentGame.timeForGateInMs=5000
            currentGame.gateColoredChance=1
            currentGame.personalBest=player.personalBests.easy.gates
            currentGame.medalGates.bronze=medalGates.easy.bronze
            currentGame.medalGates.silver=medalGates.easy.silver
            currentGame.medalGates.gold=medalGates.easy.gold
            currentGame.medalGates.champion=medalGates.easy.champion
        }
        else if(currentGame.difficulty=="Medium"){
            currentGame.numberOfGates=3
            currentGame.timeForGateInMs=4000
            currentGame.gateColoredChance=0.5
            currentGame.personalBest=player.personalBests.medium.gates
            currentGame.medalGates.bronze=medalGates.medium.bronze
            currentGame.medalGates.silver=medalGates.medium.silver
            currentGame.medalGates.gold=medalGates.medium.gold
            currentGame.medalGates.champion=medalGates.medium.champion
        }
        else if(currentGame.difficulty=="Hard"){
            currentGame.numberOfGates=4
            currentGame.timeForGateInMs=3000
            currentGame.gateColoredChance=0
            currentGame.personalBest=player.personalBests.hard.gates
            currentGame.medalGates.bronze=medalGates.hard.bronze
            currentGame.medalGates.silver=medalGates.hard.silver
            currentGame.medalGates.gold=medalGates.hard.gold
            currentGame.medalGates.champion=medalGates.hard.champion
        }

        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                <div id="pauseMenu" class="hiddenPart">
                    <div class="currentDifficultyInfo theme-${player.options.ui.theme=="Dark" ? "dark" : "light"}"">
                        <div class="currentDifficultyInfoTitle">
                            ${difficulty} Difficulty
                            <div class="currentDifficultyMedal">
                                ${
                                    playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 4
                                    ? `<img src="../Images/MedalImages/championMedal.png" alt="Champion Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 3
                                    ? `<img src="../Images/MedalImages/goldMedal.png" alt="Gold Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 2
                                    ? `<img src="../Images/MedalImages/silverMedal.png" alt="Silver Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 1
                                    ? `<img src="../Images/MedalImages/bronzeMedal.png" alt="Bronze Medal" class="currentDifficultyMedalImage">`
                                    : `<div class="noMedal"></div>`
                                }
                            </div>
                        </div>
                        <div class="difficultyInfo">
                            <div class="currentDifficultyInfoPersonalBest">
                                ${player.personalBests[difficulty.toLowerCase()].gates == 0 
                                    ? " No personal best yet"
                                    : ` Personal Best: ${player.personalBests[difficulty.toLowerCase()].gates} gates`
                                }
                            </div>
                            <ul class="medalInfo">
                                <li>Bronze: ${currentGame.medalGates.bronze} gates</li>
                                <li>Silver: ${currentGame.medalGates.silver} gates</li>
                                <li>Gold: ${currentGame.medalGates.gold} gates</li>
                                ${
                                    player.unlockedChampionMedals==true
                                    ?`
                                        <li>Champion: ${currentGame.medalGates.champion} gates</li>
                                    `
                                    :""
                                }
                            </ul>
                        </div>
                        <div class="startOptions">
                            <div class="startOption interactable" id="pauseOptionResume">
                                Resume
                            </div>
                            <div class="startOption interactable" id="pauseOptionClose">
                                Exit to difficulty selection
                            </div>
                        </div>
                    </div>
                </div>
                <div id="game">
                    <div class="currentDifficultyInfo">
                        <div class="currentDifficultyInfoTitle">
                            ${difficulty} Difficulty
                            <div class="currentDifficultyMedal">
                                ${
                                    playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 4
                                    ? `<img src="../Images/MedalImages/championMedal.png" alt="Champion Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 3
                                    ? `<img src="../Images/MedalImages/goldMedal.png" alt="Gold Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 2
                                    ? `<img src="../Images/MedalImages/silverMedal.png" alt="Silver Medal" class="currentDifficultyMedalImage">`
                                    : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 1
                                    ? `<img src="../Images/MedalImages/bronzeMedal.png" alt="Bronze Medal" class="currentDifficultyMedalImage">`
                                    : `<div class="noMedal"></div>`
                                }
                            </div>
                        </div>
                        <div class="difficultyInfo">
                            <div class="currentDifficultyInfoPersonalBest">
                                ${player.personalBests[difficulty.toLowerCase()].gates == 0 
                                    ? " No personal best yet"
                                    : ` Personal Best: ${player.personalBests[difficulty.toLowerCase()].gates} gates`
                                }
                            </div>
                            <ul class="medalInfo">
                                <li>Bronze: ${currentGame.medalGates.bronze} gates</li>
                                <li>Silver: ${currentGame.medalGates.silver} gates</li>
                                <li>Gold: ${currentGame.medalGates.gold} gates</li>
                                ${
                                    player.unlockedChampionMedals==true
                                    ?`
                                        <li>Champion: ${currentGame.medalGates.champion} gates</li>
                                    `
                                    :""
                                }
                                
                            </ul>
                        </div>
                        <div class="startOptions">
                            <div class="startOption interactable" id="startOptionBronze">
                                Play against Bronze
                            </div>
                            <div class="startOption interactable" id="startOptionSilver">
                                Play against Silver
                            </div>
                            <div class="startOption interactable" id="startOptionGold">
                                Play against Gold
                            </div>
                            ${ player.unlockedChampionMedals==true
                                ? `
                                    <div class="startOption interactable" id="startOptionChampion">
                                        Play against Champion
                                    </div>
                                `
                                :``
                            }
                            <div class="startOption interactable" id="startOptionPB">
                                Play against Personal best
                            </div>
                            <div class="startOption interactable" id="startOptionClose">
                                Go back to difficulty selection
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        `)
        AddDifficultyStatsUIEvents()
    }
    //#endregion
    //#region AddDifficultyStatsUIEvents
    const AddDifficultyStatsUIEvents = ()=>{
        $("#startOptionClose").on("click", GoToGameMenu)

        $("#startOptionBronze").on("click", ()=>{
            currentGame.targetGates=currentGame.medalGates.bronze
            CountDown()
            setTimeout(StartGame, 3000)
        })
        $("#startOptionSilver").on("click", ()=>{
            currentGame.targetGates=currentGame.medalGates.silver
            CountDown()
            setTimeout(StartGame, 3000)
        })
        $("#startOptionGold").on("click", ()=>{
            currentGame.targetGates=currentGame.medalGates.gold
            CountDown()
            setTimeout(StartGame, 3000)
        })
        if(playerStatsCalculated.totalMedals>=9 ){
            $("#startOptionChampion").on("click", ()=>{
                currentGame.targetGates=currentGame.medalGates.champion
                CountDown()
                setTimeout(StartGame, 3000)
            })
        }

        $("#startOptionPB").on("click", ()=>{
            currentGame.targetTimeInMs=currentGame.difficulty!="Custom" ? currentGame.personalBestInMs : 0
            CountDown()
            setTimeout(StartGame, 3000)
        })

        $("#pauseOptionClose").on("click", ()=>{
            GoToGameMenu()
        })

        $("#pauseOptionResume").on("click", ()=>{
            ResumeGame()
        })
    }
    //#endregion
    //#region CountDown
    const CountDown = ()=>{
        $("#game").html(`<div class="countDownNumber">3</div>`)
        setTimeout(()=>{
            $("#game").html(`<div class="countDownNumber">2</div>`)
        }, 1000)
        setTimeout(()=>{
            $("#game").html(`<div class="countDownNumber">1</div>`)
        }, 2000)
    }
    //#endregion
    //#region StartGame
    let lastTickTime
    let timeTicker
    const StartGame = ()=>{
        currentGame.active=true
        currentGame.points=1
        currentGame.gates=0
        currentGame.nextGateCountdown=currentGame.timeForGateInMs
        currentGame.playerPosition=Math.floor(currentGame.numberOfGates/2)
        lastTickTime=new Date()
        GenerateGateColumns()
        timeTicker=setInterval(Timer, 25)
    }
    //#endregion
    //#region GenerateGateColumns
    const GenerateGateColumns = ()=>{
        let columnsHtml=``
        for (let i=0; i<currentGame.numberOfGates; i++){
            columnsHtml+=`
                <div class="gateColumn interactable">
                    <div class="playerPosition hiddenPlayerPosition" id="playerPosition${i}">
                        P
                    </div>
                    <div class="gate" id="gate${i}">
                    
                    </div>
                </div>
            `
        }
        
        $("#game").html(`
            <div id="pauseButton" class="interactable">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3">
                    <path d="M525-200v-560h235v560H525Zm-325 0v-560h235v560H200Zm385-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"/>
                </svg>
            </div>
            <div id="timer">
                ${FormatTime(currentGame.nextGateCountdown)}
            </div>
            <div class="gateColumns">
                ${columnsHtml}
                
            </div>
        `)

        AddGates()
        $("#playerPosition"+currentGame.playerPosition).removeClass("hiddenPlayerPosition")
        $("#pauseButton").on("click", PauseGame)
    }
    //#endregion
    //#region AddGates
    const AddGates = ()=>{
        for (let i=0; i<currentGame.numberOfGates; i++){
            let gateData=GenerateGateData()
            currentGame.gates[i]=gateData
            $(`#gate${i}`).html(gateData.html)
            if(gateData.colored){
                $(`#gate${i}`).addClass(`gateColor${gateData.color}`)
            }
            $(`#gate${i}`).css({bottom:"100%"})
        }
    }
    //#endregion
    const loop = (index)=>{
        console.log("loop")
        $(`#gate${index}`).animate({bottom: `${100*(currentGame.nextGateCountdown / currentGame.timeForGateInMs)}%`}, 10)
    }
    //#region GenerateGateData
    const GenerateGateData = ()=>{
        let gateTypes= currentGame.difficulty=="Easy"
            ? ["multiplication", "division", "exponential"]
            : currentGame.difficulty=="Medium"
            ? ["multiplication", "division", "exponential"]
            : ["multiplication", "division", "exponential", "logarithm", "sine", "cosine", "tangent"]
        let selectedGateType=gateTypes[Math.floor(Math.random()*gateTypes.length)]
        let val=Math.random()*2
        let colored=false, color=0
        if(Math.random()<=currentGame.gateColoredChance){
            colored=true
        }
        return {
            html: `x${val}`,
            colored: true,
            color: "Negative"
        }
    }
    //#endregion
    //#region Timer
    const Timer = ()=>{
        let currentTime=new Date()
        let timeSinceLastTick=currentTime-lastTickTime
        lastTickTime=currentTime
        currentGame.nextGateCountdown-=timeSinceLastTick
        if(currentGame.nextGateCountdown<=0){
            currentGame.nextGateCountdown=currentGame.timeForGateInMs
            AddGates()
        }
        for (let i=0; i<currentGame.numberOfGates; i++){
            console.log("here")
            loop(i)
        }
        $("#timer").text(`${FormatTime(currentGame.nextGateCountdown)}`)
    }
    //#endregion
    //#region PauseGame
    const PauseGame = ()=>{
        currentGame.paused=true
        clearInterval(timeTicker)
        $("#pauseMenu").removeClass("hiddenPart")    
    }
    //#endregion
    //#region ResumeGame
    const ResumeGame = ()=>{
        currentGame.paused=false
        lastTickTime=new Date()
        timeTicker=setInterval(Timer, 25)
        $("#pauseMenu").addClass("hiddenPart")
    }
    //#endregion
    
    //#region difficultyBoxes
    // previouslySelectedDifficulty, highlightedDifficulty, nextSelectedDifficulty
    let difficultyBoxes=[
        {
            html: `
                <div class="difficultyOption interactable easyDifficulty " id="difficulty0">
                    <div class="difficultyTitle"> 
                        Easy
                    </div>       
                    <ul class="difficultyDescription">
                        <li>Gate speed: 5 seconds</li>
                        <li>Gate count: 2</li>
                        <li>Gate types: multiplication, division, exponential</li>
                        <li>Colored gates</li>
                    </ul>
                    <div class="selectDifficultyButton">
                        Select
                    </div>
                </div>
            `,
            callback: ShowDifficultyStats,
            callbackParameter: "Easy"
        },
        {
            html: `
                <div class="difficultyOption mediumDifficulty " id="difficulty1">
                    <div class="difficultyTitle"> 
                        Medium
                    </div>       
                    <ul class="difficultyDescription">
                        <li>Gate speed: 4 seconds</li>
                        <li>Gate count: 3</li>
                        <li>Gate types: idk</li>
                        <li>Some Gates are colored</li>
                    </ul>
                    <div class="selectDifficultyButton">
                        Select
                    </div>
                </div> 
            `,
            callback: ShowDifficultyStats,
            callbackParameter: "Medium"
        },
        {
            html: `
                <div class="difficultyOption hardDifficulty" id="difficulty2">
                    <div class="difficultyTitle"> 
                        Hard
                    </div>       
                    <ul class="difficultyDescription">
                        <li>Gate speed: 3 seconds</li>
                        <li>Gate count: 4</li>
                        <li>Gate types: logarythm, trigonometric methods</li>
                        <li>Gates are not colored</li>
                    </ul>
                    <div class="selectDifficultyButton">
                        Select
                    </div>
                </div>
            `,
            callback: ShowDifficultyStats,
            callbackParameter: "Hard"
        },
    ]
    //#endregion
    //#region AddDifficultyBoxes
    const AddDifficultyBoxes = ()=>{
        let previouslySelectedDifficulty = highlightedDifficultyIndex == 0 ? difficultyBoxes.length-1 : highlightedDifficultyIndex - 1
        let nextSelectedDifficulty = highlightedDifficultyIndex == difficultyBoxes.length -1 ? 0 : highlightedDifficultyIndex + 1
        $("#difficulties").html(
            difficultyBoxes[previouslySelectedDifficulty].html 
            + difficultyBoxes[highlightedDifficultyIndex].html
            + difficultyBoxes[nextSelectedDifficulty].html
        )
        $(`#difficulty${previouslySelectedDifficulty}`).addClass("previouslySelectedDifficulty")
        $(`#difficulty${highlightedDifficultyIndex}`).addClass("highlightedDifficulty")
        $(`#difficulty${nextSelectedDifficulty}`).addClass("nextSelectedDifficulty")
        AddDifficultyBoxesUIEvents(previouslySelectedDifficulty, highlightedDifficultyIndex ,nextSelectedDifficulty)
    }
    //#endregion
    //#region AddDifficultyBoxesUIEvents
    const AddDifficultyBoxesUIEvents = (prev, current, next)=>{
        $(`#difficulty${prev}`).on("click", ChosePreviousDifficulty)

        $(`#difficulty${current}`).on("click", ()=>{difficultyBoxes[current].callback(difficultyBoxes[current].callbackParameter)})

        $(`#difficulty${next}`).on("click", ChoseNextDifficulty)
    }
    //#endregion
    //#region AddGameMenuUIEvents
    const AddGameMenuUIEvents = ()=>{
        $("#difficultySelectLeft").on("click", ChosePreviousDifficulty)

        $(`#difficultySelectRight`).on("click", ChoseNextDifficulty)
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
    //#region FormatTime
    const FormatTime= (timeInMs)=>{
        let totalSeconds=Math.floor(timeInMs/1000)
        let minutes=Math.floor(totalSeconds/60)
        let seconds=String(totalSeconds%60)
        let milliseconds=String(timeInMs%1000)
        if(minutes>0){
            return `${minutes}:${seconds<10? "0"+seconds : seconds}:${ 
                milliseconds<10 ? "00"+milliseconds 
                : milliseconds<100 ? "0"+milliseconds 
                : milliseconds
            }`
        }
        return `${seconds}:${ 
                milliseconds<10 ? "00"+milliseconds 
                : milliseconds<100 ? "0"+milliseconds 
                : milliseconds
            }`
    }
    //#endregion
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("infiniteGatesSave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("infiniteGatesSave");
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
        localStorage.removeItem("infiniteGatesSave");
        location.reload();
    };
    
    //#endregion
    //#region Import save
    const ImportSave = ()=>{
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("infiniteGatesSave", saveText)
        location.reload()
    }

    const ImportSaveFromText= (text)=>{
        localStorage.setItem("infiniteGatesSave", text)
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
    GoToGameMenu()
})