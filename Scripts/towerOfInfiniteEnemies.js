$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        stats:{
            coins:0,
            orbs:0,
            currentFloor:1,
            floorStats:[
                {
                    EnemiesKilled: 0,
                    BossKilled:false
                },
            ],
            gear:{
                weapon:{
                    name:"stick",
                    attack:{
                        type:{
                            physical:1,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    }
                },
                offhand:{

                },
                armor:{

                }
            }
        },
        options:{
            ui:{
                theme: "Dark",
                subMenuShown: true,
                uiUpdateRateInMs: 25 
            },
            save:{
                saveIntervalInMs: 5000
            }
        }
    }
    //#endregion
    //#region playerStatsCalculated 
    let playerStatsCalculated = {
        health: 100,
        maxHealth: 100,
        attacking:false,
        attack:{
            type:{
                physical:1,
                magic:0
            },
            element:{
                fire:0,
                earth:0,
                water:0,
                air:0
            }
        },
        defense:{
            type:{
                absolute:0,
                relative:0
            },
            element:{
                fire:{
                    absolute:0,
                    relative:0
                },
                earth:{
                    absolute:0,
                    relative:0
                },
                water:{
                    absolute:0,
                    relative:0
                },
                air:{
                    absolute:0,
                    relative:0
                }
            }
        },
        misc:{
            attackSpeed:1,
            regeneration:0,
            accuracy:100,
            evasion: 0,
            dodgeChance:0,
            criticalChance:0,
            criticalDamageMult: 2
        }
    }
    //#endregion
    //#region enemyStats 
    let enemyStats = {
        name: "",
        health: 100,
        maxHealth: 100,
        attacking:false,
        attack:{
            type:{
                physical:1,
                magic:0
            },
            element:{
                fire:0,
                earth:0,
                water:0,
                air:0
            }
        },
        defense:{
            type:{
                absolute:0,
                relative:0
            },
            element:{
                fire:{
                    absolute:0,
                    relative:0
                },
                earth:{
                    absolute:0,
                    relative:0
                },
                water:{
                    absolute:0,
                    relative:0
                },
                air:{
                    absolute:0,
                    relative:0
                }
            }
        },
        misc:{
            attackSpeed:1,
            regeneration:0,
            accuracy:100,
            evasion: 0,
            dodgeChance:0,
            criticalChance:0,
            criticalDamageMult: 2
        }
    }
    //#endregion
    gameSpeed=1
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
    let subMenuIndexes=[0, 0, 0, 0]
    let subMenuLimits=[2, 1, 0, 0]
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
    //#region Settings navigation
    $("#options").on("click", ()=>{
        mainMenuIndex=0
        GoToSettings()
    })

    const GoToSettings = () =>{
        switch(subMenuIndexes[0]){
            case 0:
                GoToUISettings();
                break;
            case 1:
                GoToSaveSettings();
                break;
            case 2:
                GoToSaveBank();
                break;
            default:
                console.log("Settings sub navigation broke")
                break;
        }
    }
    //#endregion
    //#region UI settings
    const GoToUISettings = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ''}>
                <div class="subMenuItem selectedSubMenuItem">
                    UI Settings
                </div>
                <div id="saveSettingsSubMenuItem" class="subMenuItem">
                    Save Settings
                </div>
                <div id="saveBankSubMenuItem" class="subMenuItem">
                    Save Bank
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
                            UI update Rate
                        </div>
                        <div class="options">
                            <div id="uiUpdateRate25Option" class="option interactable ${player.options.ui.uiUpdateRateInMs==25 ? "selectedOption" : ""}">
                                25 ms
                            </div>
                            <div id="uiUpdateRate50Option" class="option interactable ${player.options.ui.uiUpdateRateInMs==50 ? "selectedOption" : ""}">
                                50 ms 
                            </div>
                            <div id="uiUpdateRate100Option" class="option interactable ${player.options.ui.uiUpdateRateInMs==100 ? "selectedOption" : ""}">
                                100 ms 
                            </div>
                            <div id="uiUpdateRate150Option" class="option interactable ${player.options.ui.uiUpdateRateInMs==150 ? "selectedOption" : ""}">
                                150 ms 
                            </div>
                            <div id="uiUpdateRate250Option" class="option interactable ${player.options.ui.uiUpdateRateInMs==250 ? "selectedOption" : ""}">
                                250 ms 
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        `)
        AddUISettingsUIEvents()
    }
    //#endregion
    //#region UI settings Events
    const AddUISettingsUIEvents = () =>{
        if(player.options.ui.subMenuShown==true){
            $("#saveSettingsSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=1
                GoToSaveSettings()
            })
            $("#saveBankSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=2
                GoToSaveBank()
            })
            $("#saveSettingsSubMenuItem").addClass("interactable")
            $("#saveBankSubMenuItem").addClass("interactable")
        }

        $("#themeDarkOption").on("click", ()=>SetTheme("Dark"))
        $("#themeLightOption").on("click", ()=>SetTheme("Light"))

        $("#subMenuDisplayShownOption").on("click", ()=>SetSubMenuShown(true))
        $("#subMenuDisplayHiddenOption").on("click", ()=>SetSubMenuShown(false))

        $("#uiUpdateRate25Option").on("click", ()=>SetUIUpdateRate(25))
        $("#uiUpdateRate50Option").on("click", ()=>SetUIUpdateRate(50))
        $("#uiUpdateRate100Option").on("click", ()=>SetUIUpdateRate(100))
        $("#uiUpdateRate150Option").on("click", ()=>SetUIUpdateRate(150))
        $("#uiUpdateRate250Option").on("click", ()=>SetUIUpdateRate(250))
    }
    //#endregion
    //#region Set theme
    const SetTheme = (newTheme)=>{
        $(newTheme=="Dark" ? "#themeLightOption" : "#themeDarkOption").removeClass("selectedOption")
        $("#container").removeClass(`theme-${newTheme == "Light" ? "dark" : "light"}`)
        player.options.ui.theme=newTheme
        $(newTheme=="Dark" ? "#themeDarkOption" : "#themeLightOption").addClass("selectedOption")
        $("#container").addClass(`theme-${newTheme == "Light" ? "light" : "dark"}`)
    }
    //#endregion
    //#region Set subMenuShown
    const SetSubMenuShown = (newDisplay)=>{
        player.options.ui.subMenuShown=newDisplay
        GoToUISettings()
    }
    //#endregion
    //#region Set UI update rate
    const SetUIUpdateRate = (newms)=>{
        $(`#uiUpdateRate${player.options.ui.uiUpdateRateInMs}Option`).removeClass("selectedOption")
        clearInterval(uiUpdateTicker)
        player.options.ui.uiUpdateRateInMs=newms
        uiUpdateTicker=setInterval(UpdateUI, newms)
        $(`#uiUpdateRate${newms}Option`).addClass("selectedOption")
    }
    //#endregion
    //#region Save settings
    const GoToSaveSettings = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div id="UISettingsSubMenuItem" class="subMenuItem interactable">
                    UI Settings
                </div>
                <div class="subMenuItem selectedSubMenuItem">
                    Save Settings
                </div>
                <div id="saveBankSubMenuItem" class="subMenuItem interactable">
                    Save Bank
                </div>
            </div>
            <div class="mainView">
                <div class="settings">
                    <div class="setting">
                        <div class="settingTitle">
                            Save Related
                        </div>
                        <div class="options">
                            <div id="saveGame" class="option interactable">
                                Save
                            </div>
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
                    <div class="setting">
                        <div class="settingTitle">
                            Auto Save Rate
                        </div>
                        <div class="options">
                            <div id="autoSaveRate1000Option" class="option interactable ${player.options.save.saveIntervalInMs==1000 ? "selectedOption" : ""}">
                                1 seconds
                            </div>
                            <div id="autoSaveRate2500Option" class="option interactable ${player.options.save.saveIntervalInMs==2500 ? "selectedOption" : ""}">
                                2.5 seconds
                            </div>
                            <div id="autoSaveRate5000Option" class="option interactable ${player.options.save.saveIntervalInMs==5000 ? "selectedOption" : ""}">
                                5 seconds
                            </div>
                            <div id="autoSaveRate10000Option" class="option interactable ${player.options.save.saveIntervalInMs==10000 ? "selectedOption" : ""}">
                                10 seconds
                            </div>
                            <div id="autoSaveRate0Option" class="option interactable ${player.options.save.saveIntervalInMs==0 ? "selectedOption" : ""}">
                                Disabled
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        `)
        AddSaveSettingsUIEvents()
    }
    //#endregion
    //#region AddSaveSettingsUIEvents
    const AddSaveSettingsUIEvents=()=>{
        if(player.options.ui.subMenuShown==true){
            $("#UISettingsSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=0
                GoToUISettings()
            })
            $("#saveBankSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=2
                GoToSaveBank()
            })
        }
        else{
            $("#UISettingsSubMenuItem").removeClass("interactable")
            $("#saveBankSubMenuItem").removeClass("interactable")
        }

        $("#saveGame").on("click", ()=>Save())
        $("#exportSaveToClipboard").on("click", ()=>ExportSaveToClipboard())
        $("#importSave").on("click", ()=>{ ShowDialogBox("Import Save",
             "Importing a save will overwrite your current save. <br> <input id='dialogBoxTextarea' placeholder='paste your save here'> </input>", "Warning", ImportSave)})
        $("#hardReset").on("click", ()=>{ ShowDialogBox("Hard Reset", "Are you sure you want to hard reset? This action is irreversible.", "Danger", HardReset)})

        $("#autoSaveRate1000Option").on("click", ()=>SetAutoSave(1000))
        $("#autoSaveRate2500Option").on("click", ()=>SetAutoSave(2500))
        $("#autoSaveRate5000Option").on("click", ()=>SetAutoSave(5000))
        $("#autoSaveRate10000Option").on("click", ()=>SetAutoSave(10000))
        $("#autoSaveRate0Option").on("click", ()=>SetAutoSave(0))

    }
    //#endregion
    //#region Export Save to clipboard
    const ExportSaveToClipboard = ()=>{
        let save= localStorage.getItem("replicantiIncSave")
        navigator.clipboard.writeText(save);
        ShowNotification("Success", "Save exported to clipboard", "Success")
    }
    //#endregion
    //#region SetAutoSave
    const SetAutoSave = (newms)=>{
        $(`#autoSaveRate${player.options.save.saveIntervalInMs}Option`).removeClass("selectedOption")
        clearInterval(autoSaveInterval)
        player.options.save.saveIntervalInMs=newms
        if(player.options.save.saveIntervalInMs!=0){
            autoSaveInterval=setInterval(Save, newms)
        }
        $(`#autoSaveRate${newms}Option`).addClass("selectedOption")
    }
    //#endregion
    //#region Save bank
    const GoToSaveBank = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div id="UISettingsSubMenuItem" class="subMenuItem interactable">
                    UI Settings
                </div>
                <div id="saveSettingsSubMenuItem" class="subMenuItem interactable">
                    Save Settings
                </div>
                <div class="subMenuItem selectedSubMenuItem">
                    Save Bank
                </div>
            </div>
            <div class="mainView">
                
            </div>  
        `)
        AddSaveBankUIEvents()
    }
    //#endregion
    //#region AddSaveBankUIEvents
    const AddSaveBankUIEvents=()=>{
        if(player.options.ui.subMenuShown==true){
            $("#UISettingsSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=0
                GoToUISettings()
            })
            $("#saveSettingsSubMenuItem").on("click", ()=>{
                subMenuIndexes[mainMenuIndex]=1
                GoToSaveSettings()
            })
        }
        else{
            $("#UISettingsSubMenuItem").removeClass("interactable")
            $("#saveSettingsSubMenuItem").removeClass("interactable")
        }

    }
    //#endregion
    //#region Save bank functions
    const saveBank={

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
                        mini-Infinity-games <br> Tower of Infinite Enemies
                    </div>
                    <div class="gameVersion">
                        V1: 
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
                            V1: 
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                
                            </ul>
                        </div>
                    </div>
                    <div id="gameSpeedChanger" class="interactable">
                        ${
                            gameSpeed!=1
                            ? "Change game speed back to 1x"
                            : "Change game speed to 10x"
                        }
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

        $("#gameSpeedChanger").on("click", ()=>{
            gameSpeed = gameSpeed != 1 ? 1 : 10
            buttonText= gameSpeed == 1 ? "Change game speed to 10x" : "Change game speed back to 1x"
            $("#gameSpeedChanger").text(buttonText)
        })
    }
    //#endregion
    //#region Tower nav
    $("#tower").on("click", ()=>{
        mainMenuIndex=2
        GoToTower()
    })

    const GoToTower = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Tower
                </div>
            </div>
            <div class="mainView" id="fightView">
                
            </div>
        `)
        ChangeFloor(player.stats.currentFloor)
        AddTowerUIEvents()
    }
    //#endregion
    //#region ChangeFloor
    const ChangeFloor = (floor)=>{
        $("#fightView").html(`
            <div id="gameSpeed">
                 ${gameSpeed!=1 ? "Game speed: x"+gameSpeed :""}
            </div>
            <div class="floorSelect">
                <div class="floorSelectItem ${player.stats.currentFloor==1 ? "inactiveFloorSelectItem" :""}" id="floorSelectFirst">
                    Floor 1
                </div>
                <div class="floorSelectItem ${player.stats.currentFloor==1 ? "inactiveFloorSelectItem" :""}" id="floorSelectBack">
                    Last floor
                </div>
                <div id="currentFloor">
                    Floor ${player.stats.currentFloor}
                </div>
                <div class="floorSelectItem ${player.stats.currentFloor==player.stats.floorStats.length ? "inactiveFloorSelectItem" :""}" id="floorSelectForward">
                    Next floor
                </div>
                <div class="floorSelectItem ${player.stats.currentFloor==player.stats.floorStats.length ? "inactiveFloorSelectItem" :""}" id="floorSelectLast">
                    Floor ${player.stats.floorStats.length}
                </div>
            </div>
            <div class="progressBar" id="floorEnemiesKilledToBoss">
            </div>
            <div class="progressBar" id="floorEnemiesKilledToClear">
            </div>
            <div id="fightSides">
                <div class="fightSide">
                    <div class="fightSideTitle">
                        Player
                    </div>
                    ` /*Maybe add player Image*/+ `
                    <div class="progressBar" id="playerHealthBar">
                        x / x Hp
                    </div>
                    <div class="progressBar" id="playerAttackBar">
                        x / x ms
                    </div>
                    <div id="attackToggle">
                        Start Fight
                    </div>
                    <ul id="playerStats">
                        <li>Damage: 1 physical, 0 magic</li>
                        <li>Defense: 0% + 0 </li>
                        <li>Elemental Damage: None </li>
                        <li>Elemental Defense: None </li>
                        <li>Regeneration: 0 / s</li>
                        <li>Accuracy: x%</li>
                        <li>Dodge chance: x%</li>
                        <li>Critical chance: x%</li>
                        <li>Critical multiplier: x2</li>
                    </ul>
                </div>
                <div class="fightSide">
                    <div class="fightSideTitle">
                        Enemy
                    </div>
                    ` /*Maybe add enemy Image*/+ `
                    <div class="progressBar" id="enemyHealthBar">
                        x / x Hp
                    </div>
                    <div class="progressBar" id="enemyAttackBar">
                        x / x ms
                    </div>
                    <ul id="enemyStats">
                        <li>Damage: 1 physical, 0 magic</li>
                        <li>Defense: 0% + 0 </li>
                        <li>Elemental Damage: None </li>
                        <li>Elemental Defense: None </li>
                        <li>Regeneration: 0 / s</li>
                        <li>Accuracy: x%</li>
                        <li>Dodge chance: x%</li>
                        <li>Critical chance: x%</li>
                        <li>Critical multiplier: x2</li>
                    </ul>
                </div>
            </div>
            <div id="dropChances">
                ${ShowDropChances(floor)}
            </div>    
        `)
    }
    //#endregion
    //#region ShowDropChances
    const ShowDropChances=(floor)=>{
        return "DropChances"
    }
    //#endregion
    //#region replicanti ui events
    const AddTowerUIEvents=()=>{
        if(player.stats.currentFloor!=1){
            $("#floorSelectFirst").on("click", ()=>{
                player.stats.currentFloor=1
                ChangeFloor(1)
            })
            $("#floorSelectBack").on("click", ()=>{
                player.stats.currentFloor--
                ChangeFloor(player.stats.currentFloor)
            })
        }

        if(player.stats.currentFloor!=player.stats.floorStats.length){
            $("#floorSelectForward").on("click", ()=>{
                player.stats.currentFloor++
                ChangeFloor(player.stats.currentFloor)
            })
            $("#floorSelectLast").on("click", ()=>{
                player.stats.currentFloor=player.stats.floorStats.length
                ChangeFloor(player.stats.currentFloor)
            })
        }
    }
    //#endregion
    //#region Tower UI update
    const UpdateTowerView= ()=>{
        $("#playerHealthBar").text(`${FormatNumber(playerStatsCalculated.health)} / ${FormatNumber(playerStatsCalculated.maxHealth)} Hp`)
        $("#playerHealthBar").css("background-image", `linear-gradient(
            to right, 
            red,
            red ${playerStatsCalculated.health/playerStatsCalculated.maxHealth*100}%,
            transparent ${playerStatsCalculated.health/playerStatsCalculated.maxHealth*100}%,
            transparent
        )`)

        $("#playerAttackBar").text(`${FormatNumber(totalTimeSincePlayerAttackInMs)} / ${FormatNumber(1000 / playerStatsCalculated.misc.attackSpeed)} ms`)
        $("#playerAttackBar").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${totalTimeSincePlayerAttackInMs/(1000 / playerStatsCalculated.misc.attackSpeed)*100}%,
            transparent ${totalTimeSincePlayerAttackInMs/(1000 / playerStatsCalculated.misc.attackSpeed)*100}%,
            transparent
        )`)

        $("#enemyHealthBar").text(`${FormatNumber(enemyStats.health)} / ${FormatNumber(enemyStats.maxHealth)} Hp`)
        $("#enemyHealthBar").css("background-image", `linear-gradient(
            to right, 
            red,
            red ${enemyStats.health/enemyStats.maxHealth*100}%,
            transparent ${enemyStats.health/enemyStats.maxHealth*100}%,
            transparent
        )`)

        $("#enemyAttackBar").text(`${FormatNumber(totalTimeSincePlayerAttackInMs)} / ${FormatNumber(1000 / playerStatsCalculated.misc.attackSpeed)} ms`)
        $("#enemyAttackBar").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${totalTimeSincePlayerAttackInMs/ (1000 / playerStatsCalculated.misc.attackSpeed) *100}%,
            transparent ${totalTimeSincePlayerAttackInMs/ (1000 / playerStatsCalculated.misc.attackSpeed)*100}%,
            transparent
        )`)

        if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false && player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled<10){
            $("#floorEnemiesKilledToBoss").text(`${FormatNumber(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled)} / 10 enemies to boss`)
            $("#floorEnemiesKilledToBoss").css("background-image", `linear-gradient(
                to right, 
                yellow,
                yellow ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent
            )`)
        }
        else if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false){
            $("#floorEnemiesKilledToBoss").text(`${FormatNumber(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled)} / 10 enemies to boss`)
            $("#floorEnemiesKilledToBoss").css("background-image", `linear-gradient(
                to right, 
                yellow,
                yellow ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent
            )`)
        }
        else{
            $("#floorEnemiesKilledToBoss").text(`Boss killed. Unlocked next floor, and multi killing on this floor`)
        }
        
        if(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled==Infinity){
            $("#floorEnemiesKilledToClear").text(`Floor cleared`)
            $("#floorEnemiesKilledToClear").css("background-color", `orange`)
        }
        else{
            $("#floorEnemiesKilledToClear").text(`${FormatNumber(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled)} / 1.78e308 enemies`)
            $("#floorEnemiesKilledToClear").css("background-image", `linear-gradient(
                to right, 
                orange,
                orange ${(Math.log10(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled) / Math.log10(1.78e308)) *100}%,
                transparent ${(Math.log10(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled) / Math.log10(1.78e308)) *100}%,
                transparent
            )`)
        }
        
        if(gameSpeed!=1){
            $("#gameSpeed").text(`Game speed: x${FormatNumber(gameSpeed)}`)
        }
    }
    //#endregion
    //#region Inventory nav
    $("#inventory").on("click", ()=>{
        mainMenuIndex=3
        GoToInventory()
    })

    const GoToInventory= ()=>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                
            </div>
        `)

        AddInventoryUIEvents()
    }
    //onerror="this.onerror=null; this.src='Default.jpg'"
    //#endregion
    //#region AddInventoryUIEvents
    const AddInventoryUIEvents = ()=>{

    }
    //#endregion
    //#region UpdateInventoryView
    const UpdateInventoryView= ()=>{

    }
    //#region PlayerAttack
    const PlayerAttack = ()=>{

    }
    //#endregion
    //#region EnemyAttack
    const EnemyAttack = ()=>{

    }
    //#endregion
    //#region tick
    let totalTimeSincePlayerAttackInMs=0
    let totalTimeSinceEnemyAttackInMs=0
    const DoTick = (ms)=>{
        if(gameSpeed>1000 || gameSpeed<0){
            gameSpeed=1
        }

        if(playerStatsCalculated.attacking){
            totalTimeSincePlayerAttackInMs+=ms * gameSpeed
            totalTimeSinceEnemyAttackInMs+=ms * gameSpeed

            while(totalTimeSincePlayerAttackInMs>=(1000 / playerStatsCalculated.misc.attackSpeed)){
                totalTimeSincePlayerAttackInMs-=1000 / playerStatsCalculated.misc.attackSpeed
                PlayerAttack()
            }

            while(totalTimeSinceEnemyAttackInMs>=(1000 / enemyStats.misc.attackSpeed)){
                totalTimeSinceEnemyAttackInMs-=(1000 / enemyStats.misc.attackSpeed)
                EnemyAttack()
            }
        }
        else{
            if(playerStatsCalculated.health<playerStatsCalculated.maxHealth)
                playerStatsCalculated.health+=playerStatsCalculated.maxHealth/100 * gameSpeed
            if(enemyStats.health<enemyStats.maxHealth)
                enemyStats.health+=enemyStats.maxHealth / 50 * gameSpeed 
        }        

        playerStatsCalculated.health+=playerStatsCalculated.misc.regeneration * gameSpeed
        enemyStats.health+=enemyStats.misc.regeneration * gameSpeed

        if(playerStatsCalculated.health>playerStatsCalculated.maxHealth)
            playerStatsCalculated.health=playerStatsCalculated.maxHealth
        if(enemyStats.health>enemyStats.maxHealth)
            enemyStats.health=enemyStats.maxHealth
    }
    //#endregion
    //#region update UI
    const UpdateUI = () =>{
        if(mainMenuIndex==2){
            UpdateTowerView()
        }
        if(mainMenuIndex==3){
            UpdateInventoryView()
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
    let mainMenuCallbacks=[GoToSettings, GoToInformation, GoToTower, GoToInventory]
    let tick=setInterval(DoTick, 25, 25)
    let uiUpdateTicker=setInterval(UpdateUI, 25)
    //#endregion
    //#region blur and focus
    let windowFocused=true
    let timeWhenBlurred=0
    $(document).on("blur", ()=>{
        windowFocused=false
        timeWhenBlurred=Date.now()
        clearInterval(tick)
        clearInterval(uiUpdateTicker)
        clearInterval(autoSaveInterval)
    })
    $(document).on("focus", ()=>{
        if(windowFocused==false){
            windowFocused=true
            let timeWhenFocused=Date.now()
            let timeDiff=timeWhenFocused-timeWhenBlurred
            totalTimeSincePlayerAttackInMs+=timeDiff
            totalTimeSinceEnemyAttackInMs+=timeDiff
            tick=setInterval(DoTick, 25, 25)
            uiUpdateTicker=setInterval(UpdateUI, player.options.ui.uiUpdateRateInMs)
            if(player.options.save.saveIntervalInMs!=0){
                autoSaveInterval=setInterval(Save, player.options.save.saveIntervalInMs)
            }
        }
    })
    //#endregion
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("toieSave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("toieSave");
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
    
    let autoSaveInterval = setInterval(Save, 5000);

    const Load = () => {
        let playerJson = DecodePartialJwt();
        try {
            let playerParsed = JSON.parse(playerJson);
            player = Object.assign({}, player, playerParsed);

            CheckForMissingData();

            if (player.options.save.autoSaveInterval == 0) {
                clearInterval(autoSaveInterval);
            } 
            else {
                clearInterval(autoSaveInterval);
                autoSaveInterval = setInterval(Save, player.options.save.autoSaveInterval);
            }

            SetTheme(player.options.ui.theme);
            SetUIUpdateRate(player.options.ui.uiUpdateRateInMs);

        }
        catch (e) {
            console.log(e);
        }
    };

    const CheckForMissingData = () => {
        
    };

    const HardReset = () => {
        clearInterval(autoSaveInterval)
        localStorage.removeItem("toieSave");
        location.reload();
    };
    //#endregion
    //#region Import save
    const ImportSave = ()=>{
        clearInterval(autoSaveInterval)
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("toieSave", saveText)
        location.reload()
    }

    const ImportSaveFromText= (text)=>{
        clearInterval(autoSaveInterval)
        localStorage.setItem("toieSave", text)
        location.reload()
    }
    //#endregion
    Load()
    //setTimeout(()=>{debugger;} , 1000)
    if(window.innerWidth<400){
        ShowDialogBox("Warning", "This game is not optimized for small screens. <br> Please use a device with a larger screen for the best experience. <br> or use landscape orientation", "Warning")
    }
    GoToTower()    
})