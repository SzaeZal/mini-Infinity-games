$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        personalBests:{
            easy:{
                timeInMs: 0
            },
            medium:{
                timeInMs: 0
            },
            hard:{
                timeInMs: 0
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
            hardMedals: 0
        },
    }
    //#endregion
    //#region CurrentGame
    let currentGame={
        active:false,
        luckMultiplier: 1,
        cardPairs: 1,
        points: 1,
        difficulty:"",
        elapsedTime: 0,
        targetTimeInMs: 0,
        personalBestInMs:0,
        medalTimes:{
          bronze:0,
          silver:0,
          gold:0,
          champion:0
        },
        cards:{},
        cardPairs:{}
    }
    //#endregion
    //#region Medals
    let medalTimes={
        easy:{ //TODO: change times
            bronze: 60000,
            silver: 45000,
            gold: 30000,
            champion: 15000
        },
        medium:{
            bronze: 120000,
            silver: 90000,
            gold: 60000,
            champion: 30000
        },
        hard:{
            bronze: 180000,
            silver: 135000,
            gold: 90000,
            champion: 45000
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
                //pause game
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
            else if(e.originalEvent.code == "KeyA" || e.originalEvent.code == "ArrowLeft"){
                subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == 0 ? subMenuLimits[mainMenuIndex] : subMenuIndexes[mainMenuIndex]-1
                mainMenuCallbacks[mainMenuIndex]()
            }
            else if(e.originalEvent.code == "KeyD" || e.originalEvent.code == "ArrowRight"){
                subMenuIndexes[mainMenuIndex] = subMenuIndexes[mainMenuIndex] == subMenuLimits[mainMenuIndex] ? 0 : subMenuIndexes[mainMenuIndex]+1
                mainMenuCallbacks[mainMenuIndex]()
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
                        mini-Infinity-games <br> Cards of Infinity
                    </div>
                    <div class="gameVersion">
                        V1: Release
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
                            V1: Release
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                <li>Added easy difficulty</li>
                                <li>Added medium difficulty</li>
                                <li>Added hard difficulty</li>
                                <li>Added custom difficulty</li>
                                <li>Added settings</li>
                                <li>Added awful balancing</li>
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
                <div class="gameMainMenu">
                    <div class="gameDifficultySelect">
                        <div class="gameDifficultySelectTitle">
                            Select Difficulty
                        </div>
                        <div class="difficulties">
                            <svg height="75" width="200" xmlns="http://www.w3.org/2000/svg" id="easyDifficulty" class="interactable difficulty">
                                <path d="M5 60 L15 0 L190 0  L180 60 Z" style="fill:none;stroke:green;stroke-width:3" />
                                <text x="50" y="45" fill="green" font-size="45">Easy</text>
                                Sorry, your browser does not support inline SVG.
                            </svg>
                            <svg height="75" width="200" xmlns="http://www.w3.org/2000/svg" id="mediumDifficulty" class="interactable difficulty">
                                <path d="M5 60 L15 0 L190 0  L180 60 Z" style="fill:none;stroke:orange;stroke-width:3" />
                                <text x="22" y="45" fill="orange" font-size="45">Medium</text>
                                Sorry, your browser does not support inline SVG.
                            </svg>
                            <svg height="75" width="200" xmlns="http://www.w3.org/2000/svg" id="hardDifficulty" class="interactable difficulty">
                                <path d="M5 60 L15 0 L190 0  L180 60 Z" style="fill:none;stroke:red;stroke-width:3" />
                                <text x="50" y="45" fill="red" font-size="45">Hard</text>
                                Sorry, your browser does not support inline SVG.
                            </svg>
                            <svg height="75" width="200" xmlns="http://www.w3.org/2000/svg" id="customDifficulty" class="interactable difficulty">
                                <path d="M5 60 L15 0 L190 0  L180 60 Z" style="fill:none;stroke:gray;stroke-width:3" />
                                <text x="25" y="45" fill="gray" font-size="45">Custom</text>
                                Sorry, your browser does not support inline SVG.
                            </svg>
                        </div>
                    </div>
                    <div id="currentdifficulty">
                        <div class="currentDifficultyInfo">
                            <div class="difficultyInfoLeftSide currentDifficultyInfoTitle"> 
                                No difficulty selected
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        `)
        AddGameMenuUIEvents()  
    }
    //#endregion
    //#region  AddGameMenuUIEvents
    const AddGameMenuUIEvents = ()=>{
        $("#easyDifficulty").on("click", ()=>{
            ShowDifficultyStats("Easy")
        })
        $("#mediumDifficulty").on("click", ()=>{
            ShowDifficultyStats("Medium")
        })
        $("#hardDifficulty").on("click", ()=>{
            ShowDifficultyStats("Hard")
        })
        $("#customDifficulty").on("click", ()=>{
            ShowCustomDifficultySetup()
        })
    }
    //#endregion
    //#region ShowDifficultyStats
    const ShowDifficultyStats = (difficulty)=>{
        currentGame.difficulty=difficulty

        if(currentGame.difficulty=="Easy"){
          currentGame.cardPairs=4
          currentGame.luckMultiplier=3
          currentGame.personalBestInMs=player.personalBests.easy
          currentGame.medalTimes.bronze=medalTimes.easy.bronze
          currentGame.medalTimes.silver=medalTimes.easy.silver
          currentGame.medalTimes.gold=medalTimes.easy.gold
          currentGame.medalTimes.champion=medalTimes.easy.champion
        }
        else if(currentGame.difficulty=="Medium"){
          currentGame.cardPairs=5
          currentGame.luckMultiplier=1
          currentGame.personalBestInMs=player.personalBests.medium
          currentGame.medalTimes.bronze=medalTimes.medium.bronze
          currentGame.medalTimes.silver=medalTimes.medium.silver
          currentGame.medalTimes.gold=medalTimes.medium.gold
          currentGame.medalTimes.champion=medalTimes.medium.champion
        }
        else if(currentGame.difficulty=="Hard"){
          currentGame.cardPairs=6
          currentGame.luckMultiplier=0.5
          currentGame.personalBestInMs=player.personalBests.hard
          currentGame.medalTimes.bronze=medalTimes.hard.bronze
          currentGame.medalTimes.silver=medalTimes.hard.silver
          currentGame.medalTimes.gold=medalTimes.hard.gold
          currentGame.medalTimes.champion=medalTimes.hard.champion
        }

        $("#currentdifficulty").html(`
            <div class="currentDifficultyInfo">
                <div class="difficultyInfoLeftSide">
                    <div class="currentDifficultyInfoTitle">
                        ${difficulty} Difficulty
                    </div>
                    <div class="currentDifficultyInfoPersonalBest">
                       
                        ${player.personalBests[difficulty.toLowerCase()].timeInMs == 0 
                            ? " No personal best yet"
                            : ` Personal Best: ${FormatTime(player.personalBests[difficulty.toLowerCase()].timeInMs)}`
                        }
                    </div>
                    <div id="playGame" class="interactable">
                        Play Game
                    </div>
                </div>
                <div class="currentDifficultyMedal">
                    ${
                        playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 4
                        ? `<img src="../Images/CardsOfInfinity/championMedal.png" alt="Champion Medal" class="currentDifficultyMedalImage">`
                        : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 3
                        ? `<img src="../Images/CardsOfInfinity/goldMedal.png" alt="Gold Medal" class="currentDifficultyMedalImage">`
                        : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 2
                        ? `<img src="../Images/CardsOfInfinity/silverMedal.png" alt="Silver Medal" class="currentDifficultyMedalImage">`
                        : playerStatsCalculated.medals[difficulty.toLowerCase()+"Medals"] == 1
                        ? `<img src="../Images/CardsOfInfinity/bronzeMedal.png" alt="Bronze Medal" class="currentDifficultyMedalImage">`
                        : `<div class="noMedal"></div>`
                    }
                </div>
                
            </div>
        `)
        $("#playGame").on("click", ()=>{
          EnterGame(currentGame.cardPairs,currentGame.luckMultiplier, currentGame.difficulty)
        })
    }
    //#endregion
    //#region ShowCustomDifficultySetup
    const ShowCustomDifficultySetup = ()=>{
        $("#currentdifficulty").html(`
            <div class="currentDifficultyInfo">
                <div class="difficultyInfoLeftSide">
                    <div class="currentDifficultyInfoTitle">
                        Custom Difficulty
                    </div>
                    <div class="customDifficultySetupInfo">
                        <label for="customDifficultyCardCountInput">Number of Card pairs (2-20): </label>
                        <input type="number" id="customDifficultyCardCountInput" class="customDifficultyInput" min="2" max="20" value="5"> <br>
                        <label for="customLuckMultiplierInput">Luck multiplier (2-20): </label>
                        <input type="number" id="customLuckMultiplierInput" class="customDifficultyInput" min="0.01" max="20" value="1" step=".01">
                    </div>
                    <div id="playGame" class="interactable">
                        Play Game
                    </div>
                </div>
            </div>
        `)
    }
    //#endregion
    //#region EnterGame
    const EnterGame = (cardPairs, luckMultiplier, difficulty) =>{
      currentGame.cardPairs=cardPairs
      currentGame.luckMultiplier=luckMultiplier
      currentGame.difficulty=difficulty

      view.html(`
          <div id="subMenuInView">
              <div class="subMenuItem selectedSubMenuItem gameStats">
                  <div >
                    Points: <span id="points">1</span>
                  </div>
                  <div >
                    Picks left: <span id="picksLeft">0 / 0</span>
                  </div>
              </div>
          </div>
          <div class="mainView">
            <div id="game">
              <div class="preGameMenu">
                <div class="currentDifficultyInfo">
                  <div class="difficultyInfoLeftSide">
                      <div class="currentDifficultyInfoTitle">
                          ${difficulty} Difficulty
                      </div>
                      ${
                        currentGame.difficulty!="Custom"
                        ? `
                          <div class="currentDifficultyInfoPersonalBest">
                              ${player.personalBests[difficulty.toLowerCase()].timeInMs == 0 
                                  ? " No personal best yet"
                                  : ` Personal Best: ${FormatTime(player.personalBests[difficulty.toLowerCase()].timeInMs)}`
                              }
                          </div>
                          <div class="medalInfo">
                            <div class="currentDifficultyInfoTitle">
                                Medal times
                            </div>
                            <div class="medalTime">
                              bronze: ${ FormatTime(currentGame.medalTimes.bronze)}
                            </div>
                            <div class="medalTime">
                              silver: ${ FormatTime(currentGame.medalTimes.silver)}
                            </div>
                            <div class="medalTime">
                              gold: ${ FormatTime(currentGame.medalTimes.gold)}
                            </div>
                            ${playerStatsCalculated.totalMedals>=9
                              ?`
                                <div class="medalTime">
                                  champion: ${ FormatTime(currentGame.medalTimes.champion)}
                                </div>
                              `
                              :``
                            }
                          </div>
                        `
                        :``
                      }
                  </div>
                  <div class="currentDifficultyMedal">
                      ${
                          playerStatsCalculated.medals[currentGame.difficulty.toLowerCase()+"Medals"] == 4
                          ? `<img src="../Images/CardsOfInfinity/championMedal.png" alt="Champion Medal" class="currentDifficultyMedalImage">`
                          : playerStatsCalculated.medals[currentGame.difficulty.toLowerCase()+"Medals"] == 3
                          ? `<img src="../Images/CardsOfInfinity/goldMedal.png" alt="Gold Medal" class="currentDifficultyMedalImage">`
                          : playerStatsCalculated.medals[currentGame.difficulty.toLowerCase()+"Medals"] == 2
                          ? `<img src="../Images/CardsOfInfinity/silverMedal.png" alt="Silver Medal" class="currentDifficultyMedalImage">`
                          : playerStatsCalculated.medals[currentGame.difficulty.toLowerCase()+"Medals"] == 1
                          ? `<img src="../Images/CardsOfInfinity/bronzeMedal.png" alt="Bronze Medal" class="currentDifficultyMedalImage">`
                          : `<div class="noMedal"></div>`
                      }
                  </div>
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
                    ${ playerStatsCalculated.totalMedals>=9 
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
      AddEnterGameUIEvents()
    }
    //#endregion
    //#region AddEnterGameUIEvents
    const AddEnterGameUIEvents=()=>{
        $("#startOptionBronze").on("click", ()=>{
            currentGame.targetTimeInMs=currentGame.medalTimes.bronze
            CountDown()
            setTimeout(StartGame, 3000)
        })
        $("#startOptionSilver").on("click", ()=>{
            currentGame.targetTimeInMs=currentGame.medalTimes.silver
            CountDown()
            setTimeout(StartGame, 3000)
        })
        $("#startOptionGold").on("click", ()=>{
            currentGame.targetTimeInMs=currentGame.medalTimes.gold
            CountDown()
            setTimeout(StartGame, 3000)
        })

        if(playerStatsCalculated.totalMedals>=9 ){
            $("#startOptionChampion").on("click", ()=>{
                currentGame.targetTimeInMs=currentGame.medalTimes.champion
                CountDown()
                setTimeout(StartGame, 3000)
            })
        }

        $("#startOptionPB").on("click", ()=>{
            currentGame.targetTimeInMs=currentGame.personalBestInMs
            CountDown()
            setTimeout(StartGame, 3000)
        })
        
        $("#startOptionClose").on("click", ()=>{
            GoToGameMenu()
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
    const StartGame = ()=>{
        
    }
    //#endregion
    //#region Card stuff
    /* 
        
            <div class="mainView cardsContainer">
                <div class="card type-redOuter">
                    <div class="theme-light cardInnerCircle type-redInner">
                        x2
                    </div>
                    <div class="cardCornerPieces">
                        <div class="cardCornerPieceTopLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceTopRight">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomRight">
                            x2
                        </div>
                    </div>
                </div>
                <div class="card type-blueOuter">
                    <div class="theme-light cardInnerCircle type-blueInner">
                        x2
                    </div>
                    <div class="cardCornerPieces">
                        <div class="cardCornerPieceTopLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceTopRight">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomRight">
                            x2
                        </div>
                    </div>
                </div>
                <div class="card type-greenOuter">
                    <div class="theme-light cardInnerCircle type-greenInner">
                        x2
                    </div>
                    <div class="cardCornerPieces">
                        <div class="cardCornerPieceTopLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceTopRight">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomRight">
                            x2
                        </div>
                    </div>
                </div>
                <div class="card type-yellowOuter">
                    <div class="theme-light cardInnerCircle type-yellowInner">
                        x2
                    </div>
                    <div class="cardCornerPieces">
                        <div class="cardCornerPieceTopLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceTopRight">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomLeft">
                            x2
                        </div>
                        <div class="cardCornerPieceBottomRight">
                            x2
                        </div>
                    </div>
                </div>
                <div class="card">
                    <img src="../Images/CardsOfInfinity/CoICardBackside.png" alt="Cards Of Infinity Card Backside" class="cardBackside">
                </div>
            </div>
    
    */
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
        if(minutes>=60){
            let hours=String(Math.floor(minutes/60))
            minutes=String(minutes%60)
            return `${hours}:${minutes<10?"0"+minutes : minutes}:${seconds<10? "0"+seconds : seconds}:${ 
                milliseconds<10 ? "00"+milliseconds 
                : milliseconds<100 ? "0"+milliseconds 
                : milliseconds
            }`
        }
        return `${minutes}:${seconds<10? "0"+seconds : seconds}:${ 
                milliseconds<10 ? "00"+milliseconds 
                : milliseconds<100 ? "0"+milliseconds 
                : milliseconds
            }`
    }
    //#endregion
    //#region CheckForAchievedMedals
    const CheckForAchievedMedals = ()=>{
        if(player.personalBests.easy.timeInMs>0){
            if(player.personalBests.easy.timeInMs <= medalTimes.easy.champion){
                playerStatsCalculated.medals.easyMedals=4
            }
            else if(player.personalBests.easy.timeInMs <= medalTimes.easy.gold){
                playerStatsCalculated.medals.easyMedals=3
            }
            else if(player.personalBests.easy.timeInMs <= medalTimes.easy.silver){
                playerStatsCalculated.medals.easyMedals=2
            }
            else if(player.personalBests.easy.timeInMs <= medalTimes.easy.bronze){
                playerStatsCalculated.medals.easyMedals=1
            }
        }

        if(player.personalBests.medium.timeInMs>0){
            if(player.personalBests.medium.timeInMs <= medalTimes.medium.champion){
                playerStatsCalculated.medals.mediumMedals=4
            }
            else if(player.personalBests.medium.timeInMs <= medalTimes.medium.gold){
                playerStatsCalculated.medals.mediumMedals=3
            }
            else if(player.personalBests.medium.timeInMs <= medalTimes.medium.silver){
                playerStatsCalculated.medals.mediumMedals=2
            }
            else if(player.personalBests.medium.timeInMs <= medalTimes.medium.bronze){
                playerStatsCalculated.medals.mediumMedals=1
            }
        }

        if(player.personalBests.hard.timeInMs>0){
            if(player.personalBests.hard.timeInMs <= medalTimes.hard.champion){
                playerStatsCalculated.medals.hardMedals=4
            }
            else if(player.personalBests.hard.timeInMs <= medalTimes.hard.gold){
                playerStatsCalculated.medals.hardMedals=3
            }
            else if(player.personalBests.hard.timeInMs <= medalTimes.hard.silver){
                playerStatsCalculated.medals.hardMedals=2
            }
            else if(player.personalBests.hard.timeInMs <= medalTimes.hard.bronze){
                playerStatsCalculated.medals.hardMedals=1
            }
        }

        playerStatsCalculated.totalMedals= playerStatsCalculated.medals.easyMedals
            + playerStatsCalculated.medals.mediumMedals
            + playerStatsCalculated.medals.hardMedals
    }
    //#endregion
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("cardsOfInfinitySave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("cardsOfInfinitySave");
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

            CheckForAchievedMedals();

            SetTheme(player.options.ui.theme);
        
        }
        catch (e) {
            console.log(e);
        }
    };
    
    const CheckForMissingData = () => {
        
    };

    const HardReset = () => {
        localStorage.removeItem("cardsOfInfinitySave");
        location.reload();
    };
    
    //#endregion
    //#region Import save
    const ImportSave = ()=>{
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("cardsOfInfinitySave", saveText)
        location.reload()
    }

    const ImportSaveFromText= (text)=>{
        localStorage.setItem("cardsOfInfinitySave", text)
        location.reload()
    }
    //#endregion
    mainMenuCallbacks=[GoToSettings, GoToInformation, GoToGameMenu] 
    AddGameMenuUIEvents()
    Load()

    if(window.innerWidth<500){
        ShowDialogBox("Warning", "This game is not optimized for small screens. <br> Please use a device with a larger screen for the best experience. <br> or use landscape orientation", "Warning")
    }
})