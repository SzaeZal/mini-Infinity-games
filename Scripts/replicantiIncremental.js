$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        stats:{
            replicanti:{
                currentAmount: 1,
                buyables:{
                    buyable1Amount: 0,
                    buyable2Amount: 0
                }
            },
            infinity:{
                currentAmount: 0,
                unlocked: false,
                upgrades:{
                    upgrade11Bought: false,
                    upgrade12Bought: false,
                    upgrade13Bought: false,
                    upgrade14Bought: false,
                    upgrade15Bought: false,
                },
                buyables:{
                    buyable1Amount: 0,
                    buyable2Amount: 0
                }
            },
            eternity:{
                currentAmount: 0,
                unlocked: false,
                upgrades:{
                    upgrade11Bought: false,
                    upgrade12Bought: false,
                    upgrade13Bought: false,
                    upgrade14Bought: false,
                    upgrade15Bought: false,
                },
                buyables:{
                    buyable1Amount: 0,
                    buyable2Amount: 0
                },
                challenges:{
                    challenge1:{
                        entered: false,
                        completed: false
                    },
                    challenge2:{
                        entered: false,
                        completed: false
                    },
                    challenge3:{
                        entered: false,
                        completed: false
                    },
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
        replicanti:{
            replicationTimeInMs: 1000,
            replicationMulti: 2,
            buyables:{
                buyable1:{
                    cost: 128,
                    replicantiReplicationTimeDivider: 1 // +1 per
                },
                buyable2:{
                    cost: 1024,
                    replicantiReplicationMultiMultiplier: 1 // *2 per
                },
            }
        },
        infinity:{
            static:{
                gain: 1
            },
            replication:{
                replicationChancePercent: 1,
                replicationMulti: 2,
            },
            upgrades:{
                upgrade11:{
                    cost: 1,
                    replicantiReplicationTimeDivider:1  // 2 if bought
                },
                upgrade12:{
                    cost: 1,
                    replicantiReplicationMultiMultiplier:1 // 1.5 if bought
                },
                upgrade13:{
                    cost: 2,
                    replicantiReplicationMultiMultiplier:1 // based on infinities (sqrt maybe)
                },
                upgrade14:{
                    cost: 5 //upgrade 14 keeps replicanti buyables
                },                                      
                upgrade15:{
                    cost: 10,
                    infinityReplicationMultiMultiplier:1 // 2 if bought, also unlock infinity buyables
                },
            },
            buyables:{
                buyable1:{
                    cost: 100,
                    infinityReplicationChancePercentAdder: 0 // +1 per, max 89
                },
                buyable2:{
                    cost: 1000,
                    intinityReplicationMultiMultiplier: 1 // +0.1 per, max 30
                },
            }
        },
        eternity:{
            static:{
                gain: 1
            },
            replication:{
                replicationChancePercent: 0,
                replicationMulti: 2,
            },
            upgrades:{
                upgrade11:{
                    cost: 1,
                    replicantiReplicationMultiMultiplier:1  // 10 if bought
                },                                          
                upgrade12:{
                    cost: 1,
                    infinityReplicationChancePercentAdder:1  // 10 if bought
                }, 
                upgrade13:{
                    cost: 2,
                    replicantiReplicationMultiMultiplier: 1, // based on eternities (cbrt maybe)
                    intinityReplicationMultiMultiplier:1 // based on eternities (cbrt maybe)
                },
                upgrade14:{
                    cost: 5,
                    infinityReplicationMultiMultiplier:1 // 2 if bought
                },
                upgrade15:{
                    cost: 10, // upgrade 15 keeps infinity upgrades
                }                                      
            },
            buyables:{
                buyable1:{
                    cost: 10, // *10 per
                    staticEternityGainMultiplier: 0 // *3 per
                },
                buyable2:{
                    cost: 1e10, // *10 per
                    eternityReplicationChancePercentAdder: 0 // +0.1 per
                },
            },
            challenges:{
                challenge1:{
                    staticEternityGainMultiplier: 1 // 10 if completed
                },                                  // challenge 2 keeps infinity upgrades
                challenge3:{
                    eternityReplicationChancePercentMultiplier: 1 // 2 if completed
                }
            }
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
                    <div id="dialogBoxCancel" class="dialogBoxButton dialogBoxButton${dialogType} interactable">Cancel</div>
                    <div id="dialogBoxYes" class="dialogBoxButton dialogBoxButton${dialogType} interactable">Yes</div>
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
    let subMenuLimits=[2, 1, 0]
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
        console.log(player.options.ui.subMenuShown)
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
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=subMenuHidden" : ""}>
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
             "Importing a save will overwrite your current save. <br> <textarea id='dialogBoxTextarea' placeholder='paste your save here'> </textarea>", "Warning", ImportSave)})
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
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=hiddenSubMenu" : ""}>
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
                <table class="saveBankTable">
                    <tr>
                        <th class="infinity">
                            Infinity
                        </th>
                        <th colspan=2 class="eternity">
                            Eternity
                            </th>
                    </tr>
                    <tr>
                        <td class="infinity">
                            <div class="saveBankOption interactable" id="firstInfinitySaveBank">    
                                1st infinity
                            </div>
                        </td>
                        <td class="eternity">
                            <div class="saveBankOption interactable" id="firstEternitySaveBank">    
                                1st eternity
                            </div>
                        </td>
                        <td class="eternity">
                            <div class="saveBankOption interactable" id="EC1CompletedSaveBank">    
                                EC1 completed
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="infinity">
                            <div class="saveBankOption interactable" id="infinityBuyablesUnlockedSaveBank">    
                                Infinity buyables unlocked
                            </div>
                        </td>
                        <td class="eternity">
                            <div class="saveBankOption interactable" id="EC2CompletedSaveBank">
                                EC2 completed
                            </div>
                        </td>
                        <td class="eternity">
                            <div class="saveBankOption interactable" id="EC3CompletedSaveBank">
                                EC3 completed
                            </div>        
                        </td>
                    </tr>
                </table>
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

        //TODO: add save bank saves
    }
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
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=subMenuHidden" : ""}>
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
                        mini-Infinity-games <br> Replicanti Incremental
                    </div>
                    <div class="gameVersion">
                        V1: This feels familiar
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
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=hiddenSubMenu" : ""}>
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
                            V1: This feels familiar
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                <li>Added replicanti layer</li>
                                <li>Added replicanti buyables</li>
                                <li>Added infinity layer</li>
                                <li>Added infinity upgrades</li>
                                <li>Added infinity buyables</li>
                                <li>Added eternity layer</li>
                                <li>Added eternity upgrades</li>
                                <li>Added eternity buyables</li>
                                <li>Added eternity challenges</li>
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
    //#region Replicanti nav
    $("#replicanti").on("click", ()=>{
        mainMenuIndex=2
        GoToReplicanti()
    })

    const GoToReplicanti = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=subMenuHidden" : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                <div id="currencyBar" class="currencyBar">
                    1 / 1.79e308 replicanti
                </div>
                <div class="currencyStats">
                    <div id="replicantiReplicationTime">
                        Replication time: ${FormatNumber(playerStatsCalculated.replicanti.replicationTimeInMs)} ms
                    </div>
                    <div id="replicantiReplicationMulti">
                        Replication multi: x${FormatNumber(playerStatsCalculated.replicanti.replicationMulti)}
                    </div>
                </div>
                <div class="buyables">
                    <div class="subTitle">
                        Buyables
                    </div>
                    <div class="row gap-50px">
                        <div id="replicantiBuyable1" class="buyable">
                            <div class="upgradeTitle">
                                Replication Fastener <br> 
                                level <span id="replicantiBuyable1Amount">${player.stats.replicanti.buyables.buyable1Amount}</span> / 9
                            </div>
                            <div class="upgradeDescription">
                                Each level divides replication time by /+1 
                            </div>
                            <div id="replicantibuyable1Effect">
                                Currently: /${playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider}
                            </div>
                            <div id="replicantiBuyable1Cost">
                                Cost: ${
                                    player.stats.replicanti.buyables.buyable1Amount==9
                                    ? 'Maxed' 
                                    : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable1.cost)+ " replicanti"
                                } 
                            </div>
                            <div class="row">
                                <div id="replicantiBuyable1BuyOne" class="buyableBuy1 interactable">Buy 1</div>
                                <div id="replicantiBuyable1BuyMax" class="buyableBuyMax interactable">Buy Max</div>
                            </div>
                        </div>
                        <div id="replicantiBuyable2" class="buyable">
                            <div class="upgradeTitle">
                                Replication Increaser <br> 
                                level <span id="replicantiBuyable2Amount">${player.stats.replicanti.buyables.buyable2Amount}</span> / 9
                            </div>
                            <div class="upgradeDescription">
                                Each level multiplies replication multi by x2
                            </div>
                            <div id="replicantibuyable2Effect">
                                Currently: x${playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier}
                            </div>
                            <div id="replicantiBuyable2Cost">
                                Cost: ${
                                    player.stats.replicanti.buyables.buyable2Amount==9
                                    ? 'Maxed' 
                                    : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable2.cost)+ " replicanti"
                                } 
                            </div>
                            <div class="row ">
                                <div id="replicantiBuyable2BuyOne" class="buyableBuy1 interactable">Buy 1</div>
                                <div id="replicantiBuyable2BuyMax" class="buyableBuyMax interactable">Buy Max</div>
                            </div>
                        </div>
                    </div>
                    <div class="disclaimer">
                        *replicanti buyables will divide your replicanti instead of subtracting
                    </div>
                </div>
                <div id="replicationTimer" class="currencyBar">
                    x / 1000 ms
                </div>
            </div>
        `)
        AddReplicantiUIEvents()
    }
    //#endregion
    //#region replicanti ui events
    const AddReplicantiUIEvents=()=>{
        $("#replicantiBuyable1BuyOne").on("click", ()=>{
            if(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable1.cost){
                PurchaseReplicantiBuyable1()
                UpdateReplicantiBuyable1UI()
                UpdateReplicantiView()
            }
        })
        $("#replicantiBuyable1BuyMax").on("click", ()=>{
            while(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable1.cost
                && player.stats.replicanti.buyables.buyable1Amount<10
            ){
                PurchaseReplicantiBuyable1()
                UpdateReplicantiBuyable1UI()
                UpdateReplicantiView()
            }
        })
        $("#replicantiBuyable2BuyOne").on("click", ()=>{
            if(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable2.cost){
                PurchaseReplicantiBuyable2()
                UpdateReplicantiBuyable2UI()
                UpdateReplicantiView()
            }
        })
        $("#replicantiBuyable2BuyMax").on("click", ()=>{
            while(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable2.cost
                && player.stats.replicanti.buyables.buyable2Amount < 10
            ){
                PurchaseReplicantiBuyable2()
                UpdateReplicantiBuyable2UI()
                UpdateReplicantiView()
            }
        })
    }
    //#endregion
    //#region Replicanti Buyables
    const PurchaseReplicantiBuyable1 = ()=>{
        if(player.stats.replicanti.buyables.buyable1Amount<10){
            player.stats.replicanti.buyables.buyable1Amount++
            player.stats.replicanti.currentAmount/=playerStatsCalculated.replicanti.buyables.buyable1.cost
            playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider= 1 + 
                player.stats.replicanti.buyables.buyable1Amount
            playerStatsCalculated.replicanti.buyables.buyable1.cost=Math.pow(
                128,
                Math.pow(
                    player.stats.replicanti.buyables.buyable1Amount+1,
                    2
                )
            )
            CalculateReplicantiReplicationTime()
        }
    }

    const UpdateReplicantiBuyable1UI=()=>{
        $("#replicantiBuyable1Amount").text(`${player.stats.replicanti.buyables.buyable1Amount}`)
        $("#replicantibuyable1Effect").text(`Currently: /${playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider}`)
        $("#replicantiBuyable1Cost").text(`Cost: ${player.stats.replicanti.buyables.buyable1Amount==9 ? 'Maxed' : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable1.cost) + " replicanti"} `)
    }

    const PurchaseReplicantiBuyable2 = ()=>{
        if(player.stats.replicanti.buyables.buyable2Amount<10){
            player.stats.replicanti.buyables.buyable2Amount++
            player.stats.replicanti.currentAmount/=playerStatsCalculated.replicanti.buyables.buyable2.cost
            playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier= 1*
                Math.pow(
                    2,
                    player.stats.replicanti.buyables.buyable2Amount
                ) 
            playerStatsCalculated.replicanti.buyables.buyable2.cost=Math.pow(
                1024,
                Math.pow(
                    player.stats.replicanti.buyables.buyable2Amount+1,
                    2
                )
            )
            CalculateReplicantiReplicationMulti()
        }
    }

    const UpdateReplicantiBuyable2UI=()=>{
        $("#replicantiBuyable2Amount").text(`${player.stats.replicanti.buyables.buyable2Amount}`)
        $("#replicantibuyable2Effect").text(`Currently: x${playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier}`)
        $("#replicantiBuyable2Cost").text(`Cost: ${player.stats.replicanti.buyables.buyable2Amount==9 ? "Maxed" : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable2.cost)+ " replicanti"} `)
    }
    //#endregion
    //#region replicanti replication
    const DoReplicantiReplication = ()=>{
        player.stats.replicanti.currentAmount*=playerStatsCalculated.replicanti.replicationMulti
        if(player.stats.replicanti.currentAmount==Infinity){
            DoInfinityReset()
        }
    }
    //#endregion
    //#region Replicanti Stats Calculation
    const CalculateReplicantiBoosts = ()=>{
        CalculateReplicantiReplicationTime()
        CalculateReplicantiReplicationMulti()
    }

    const CalculateReplicantiReplicationTime = ()=>{
        playerStatsCalculated.replicanti.replicationTimeInMs=1000 / (
            playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider
            * playerStatsCalculated.infinity.upgrades.upgrade11.replicantiReplicationTimeDivider
        )
    }

    const CalculateReplicantiReplicationMulti = ()=>{
        if(player.stats.infinity.upgrades.upgrade13Bought==true){
            playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier= Math.pow(
                1 + player.stats.infinity.currentAmount,
                0.5
            )
        }
        playerStatsCalculated.replicanti.replicationMulti=2 
            * playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier
            * playerStatsCalculated.infinity.upgrades.upgrade12.replicantiReplicationMultiMultiplier
            * playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier
    }
    //#endregion
    //#region Replicanti UI update
    const UpdateReplicantiView= ()=>{
        $("#replicationTimer").text(`${FormatNumber(totalTimeSinceReplicationInMs)} / ${FormatNumber(playerStatsCalculated.replicanti.replicationTimeInMs)} ms`)
        $("#replicationTimer").css("background-image", `linear-gradient(
            to right, 
            grey,
            grey ${totalTimeSinceReplicationInMs/playerStatsCalculated.replicanti.replicationTimeInMs*100}%,
            transparent ${totalTimeSinceReplicationInMs/playerStatsCalculated.replicanti.replicationTimeInMs*100}%,
            transparent
        )`)

        $("#currencyBar").text(`${FormatNumber(player.stats.replicanti.currentAmount)} / 1.79e308 replicanti`)
        $("#currencyBar").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent
        )`)

        $("#replicantiReplicationTime").text(`Replication time: ${FormatNumber(playerStatsCalculated.replicanti.replicationTimeInMs)} ms`)
        $("#replicantiReplicationMulti").text(`Replication multi: x${FormatNumber(playerStatsCalculated.replicanti.replicationMulti)}`)

        if(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable1.cost && player.stats.replicanti.buyables.buyable1Amount<9){
            $("#replicantiBuyable1BuyOne").addClass("buyablePurchaseAble")
            $("#replicantiBuyable1BuyMax").addClass("buyablePurchaseAble")
        }
        else{
            $("#replicantiBuyable1BuyOne").removeClass("buyablePurchaseAble")
            $("#replicantiBuyable1BuyMax").removeClass("buyablePurchaseAble")
        }
        if(player.stats.replicanti.currentAmount>=playerStatsCalculated.replicanti.buyables.buyable2.cost && player.stats.replicanti.buyables.buyable2Amount<9){
            $("#replicantiBuyable2BuyOne").addClass("buyablePurchaseAble")
            $("#replicantiBuyable2BuyMax").addClass("buyablePurchaseAble")
        }
        else{
            $("#replicantiBuyable2BuyOne").removeClass("buyablePurchaseAble")
            $("#replicantiBuyable2BuyMax").removeClass("buyablePurchaseAble")
        }

        UpdateReplicantiBuyable1UI()
        UpdateReplicantiBuyable2UI()
    }
    //#endregion
    //#region updateReplicantiBuyablesAfterLoad
    const UpdateReplicantiBuyablesAfterLoad = ()=>{
        playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider= 1 + player.stats.replicanti.buyables.buyable1Amount
        playerStatsCalculated.replicanti.buyables.buyable1.cost=Math.pow(
            128,
            Math.pow(
                player.stats.replicanti.buyables.buyable1Amount+1,
                2
            )
        )
        playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier= 1* Math.pow(2, player.stats.replicanti.buyables.buyable2Amount)
        playerStatsCalculated.replicanti.buyables.buyable2.cost=Math.pow(
            1024,
            Math.pow(
                player.stats.replicanti.buyables.buyable2Amount+1,
                2
            )
        )
    }
    //#endregion
    //#region Reset Replicanti layer
    const ResetReplicantiLayer = (layerReset) =>{
        player.stats.replicanti.currentAmount=1
        if(!(layerReset == 1 && player.stats.infinity.upgrades.upgrade14Bought==true)){
            player.stats.replicanti.buyables.buyable1Amount=0
            playerStatsCalculated.replicanti.buyables.buyable1.cost=128
            playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider=1
            player.stats.replicanti.buyables.buyable2Amount=0
            playerStatsCalculated.replicanti.buyables.buyable2.cost=1024
            playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier=1
        }
        CalculateReplicantiBoosts()
    }
    //#endregion
    //#region Infinity nav
    const GoToInfinity = () =>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? "class=subMenuHidden" : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                <div id="currencyBar" class="currencyBar">
                    1 / 1.79e308 Infinity
                </div>
                <div class="currencyStats">
                    <div id="infinityReplicationChance">
                        Replication chance: ${playerStatsCalculated.infinity.replication.replicationChancePercent}%
                    </div>
                    <div id="infinityReplicationMulti">
                        Replication multi: x${playerStatsCalculated.infinity.replication.replicationMulti}
                    </div>
                </div>
                ${player.stats.infinity.upgrades.upgrade15Bought ? `
                    <div class="buyables">
                        <div class="subTitle">
                            Buyables
                        </div>
                        <div class="row gap-50px">
                            <div id="infinityBuyable1" class="buyable">
                                <div class="upgradeTitle">
                                    Infinity replication chance adder <br> 
                                    level <span id="infinityBuyable1Amount">${player.stats.infinity.buyables.buyable1Amount}</span> / 79
                                </div>
                                <div class="upgradeDescription">
                                    Each level adds +1% to infintiy replication chance
                                </div>
                                <div id="infinitybuyable1Effect">
                                    Currently: +${playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder}%
                                </div>
                                <div id="infinityBuyable1Cost">
                                    Cost: ${
                                        player.stats.infinity.buyables.buyable1Amount==79
                                        ? 'Maxed' 
                                        : FormatNumber(playerStatsCalculated.infinity.buyables.buyable1.cost)+ " infinity"
                                    } 
                                </div>
                                <div class="row">
                                    <div id="infinityBuyable1BuyOne" class="buyableBuy1 interactable">Buy 1</div>
                                    <div id="infinityBuyable1BuyMax" class="buyableBuyMax interactable">Buy Max</div>
                                </div>
                            </div>
                            <div id="infinityBuyable2" class="buyable">
                                <div class="upgradeTitle">
                                    Infinity Replication Increaser <br> 
                                    level <span id="infinityBuyable2Amount">${player.stats.infinity.buyables.buyable2Amount}</span> / 30
                                </div>
                                <div class="upgradeDescription">
                                    Each level adds +0.1 to infintiy replication multiplier base
                                </div>
                                <div id="infinitybuyable2Effect">
                                    Currently: +x${playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier}
                                </div>
                                <div id="infinityBuyable2Cost">
                                    Cost: ${
                                        player.stats.infinity.buyables.buyable2Amount==30
                                        ? 'Maxed' 
                                        : FormatNumber(playerStatsCalculated.infinity.buyables.buyable2.cost)+ " infinity"
                                    } 
                                </div>
                                <div class="row ">
                                    <div id="infinityBuyable2BuyOne" class="buyableBuy1 interactable">Buy 1</div>
                                    <div id="infinityBuyable2BuyMax" class="buyableBuyMax interactable">Buy Max</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ``}
                <div class="upgrades">
                    <div class="subTitle">
                        Upgrades
                    </div>
                    <div class="upgradeRow">
                        <div id="infinityUpgrade11" class="upgrade ${player.stats.infinity.upgrades.upgrade11Bought ? "boughtInfinityUpgrade" : ""}">
                            <div class="upgradeTitle">
                                Replicanti Infinite speed
                            </div>
                            <div class="upgradeDescription">
                                Replicanti replication time is divided by 2
                            </div>
                            <div class="upgradeCost">
                                Cost: 1 infinity
                            </div>
                        </div>
                        <div id="infinityUpgrade12" class="upgrade ${player.stats.infinity.upgrades.upgrade12Bought ? "boughtInfinityUpgrade" : ""}">
                            <div class="upgradeTitle">
                                Replicanti Infinite multiplier
                            </div>
                            <div class="upgradeDescription">
                                Replicanti replication multiplier is multiplied by 1.5
                            </div>
                            <div class="upgradeCost">
                                Cost: 1 infinity
                            </div>
                        </div>
                        <div id="infinityUpgrade13" class="upgrade ${player.stats.infinity.upgrades.upgrade13Bought ? "boughtInfinityUpgrade" : ""}">
                            <div class="upgradeTitle">
                                Infinity-based Replicanti Multi
                            </div>
                            <div class="upgradeDescription">
                                Replicanti replication multiplier is multiplied by (infinity^0.5)
                            </div>
                            <div id="infinityUpgrade13Effect">
                                Currently: x${FormatNumber(playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier)}
                            </div>
                            <div class="upgradeCost">
                                Cost: 2 infinity
                            </div>
                        </div>
                        <div id="infinityUpgrade14" class="upgrade ${player.stats.infinity.upgrades.upgrade14Bought ? "boughtInfinityUpgrade" : ""}">
                            <div class="upgradeTitle">
                                Replicanti Buyable keeper
                            </div>
                            <div class="upgradeDescription">
                                Replicanti buyables are kept on infinity reset
                            </div>
                            <div class="upgradeCost">
                                Cost: 5 infinity
                            </div>
                        </div>
                        <div id="infinityUpgrade15" class="upgrade ${player.stats.infinity.upgrades.upgrade15Bought ? "boughtInfinityUpgrade" : ""}">
                            <div class="upgradeTitle">
                                Infinity doubler with extras
                            </div>
                            <div class="upgradeDescription">
                                2x infinity replication multiplier <br>
                                Unlocks infinity buyables
                            </div>
                            <div class="upgradeCost">
                                Cost: 10 infinity
                            </div>
                        </div>
                    </div>
                </div>
                <div id="replicantiAmount" class="currencyBar">
                    x / 1.79e308 replicanti
                </div>
            </div>
        `)
        AddInfinityUIEvents()
    }
    //#endregion
    //#region infinity ui events
    const AddInfinityUIEvents=()=>{
        if(player.stats.infinity.upgrades.upgrade11Bought==false){
            $("#infinityUpgrade11").on("click", ()=>{
                TryPurchaseInfinityUpgrade11()
            })
        }
        if(player.stats.infinity.upgrades.upgrade12Bought==false){
            $("#infinityUpgrade12").on("click", ()=>{
                TryPurchaseInfinityUpgrade12()
            })
        }
        if(player.stats.infinity.upgrades.upgrade13Bought==false){
            $("#infinityUpgrade13").on("click", ()=>{
                TryPurchaseInfinityUpgrade13()
            })
        }
        if(player.stats.infinity.upgrades.upgrade14Bought==false){
            $("#infinityUpgrade14").on("click", ()=>{
                TryPurchaseInfinityUpgrade14()
            })
        }
        if(player.stats.infinity.upgrades.upgrade15Bought==false){
            $("#infinityUpgrade15").on("click", ()=>{
                TryPurchaseInfinityUpgrade15()
            })
        }

        if(player.stats.infinity.upgrades.upgrade15Bought==true){
            $("#infinityBuyable1BuyOne").on("click", ()=>{
                if(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable1.cost){
                    PurchaseInfinityBuyable1()
                    UpdateInfinityBuyable1UI()
                    UpdateInfinityView()
                }
            })
            $("#infinityBuyable1BuyMax").on("click", ()=>{
                while(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable1.cost 
                    && player.stats.infinity.buyables.buyable1Amount<79
                ){
                    PurchaseInfinityBuyable1()
                    UpdateInfinityBuyable1UI()
                    UpdateInfinityView()
                }
            })
            $("#infinityBuyable2BuyOne").on("click", ()=>{
                if(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable2.cost){
                    PurchaseInfinityBuyable2()
                    UpdateInfinityBuyable2UI()
                    UpdateInfinityView()
                }
            })
            $("#infinityBuyable2BuyMax").on("click", ()=>{
                while(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable2.cost
                    && player.stats.infinity.buyables.buyable2Amount<30
                ){
                    PurchaseInfinityBuyable2()
                    UpdateInfinityBuyable2UI()
                    UpdateInfinityView()
                }
            })
        }
    }
    //#endregion
    //#region Infinity Buyables
    const PurchaseInfinityBuyable1 = ()=>{
        if(player.stats.infinity.buyables.buyable1Amount<79){
            player.stats.infinity.buyables.buyable1Amount++
            player.stats.infinity.currentAmount-=playerStatsCalculated.infinity.buyables.buyable1.cost
            playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder= 1 * player.stats.infinity.buyables.buyable1Amount
            playerStatsCalculated.infinity.buyables.buyable1.cost= 100*Math.pow(1.15, player.stats.infinity.buyables.buyable1Amount)
            CalculateInfinityBoosts()
        }
    }

    const UpdateInfinityBuyable1UI=()=>{
        $("#infinityBuyable1Amount").text(`${player.stats.infinity.buyables.buyable1Amount}`)
        $("#infinitybuyable1Effect").text(`Currently: +${FormatNumber(playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder)}%`)
        $("#infinityBuyable1Cost").text(`Cost: ${player.stats.infinity.buyables.buyable1Amount==79 ? 'Maxed' : FormatNumber(playerStatsCalculated.infinity.buyables.buyable1.cost) + " infinity"} `)
    }

    const PurchaseInfinityBuyable2 = ()=>{
        if(player.stats.infinity.buyables.buyable2Amount<30){
            player.stats.infinity.buyables.buyable2Amount++
            player.stats.infinity.currentAmount-=playerStatsCalculated.infinity.buyables.buyable2.cost
            playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier= 1 + (0.1 * player.stats.infinity.buyables.buyable2Amount)
            playerStatsCalculated.infinity.buyables.buyable2.cost= 1000*Math.pow(2, player.stats.infinity.buyables.buyable2Amount)
            CalculateInfinityBoosts()
        }
    }

    const UpdateInfinityBuyable2UI=()=>{
        $("#infinityBuyable2Amount").text(`${player.stats.infinity.buyables.buyable2Amount}`)
        $("#infinitybuyable2Effect").text(`Currently: +x${FormatNumber(playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier)}`)
        $("#infinityBuyable2Cost").text(`Cost: ${player.stats.infinity.buyables.buyable2Amount==30 ? "Maxed" : FormatNumber(playerStatsCalculated.infinity.buyables.buyable2.cost)+ " infinity"} `)
    }
    //#endregion
    //#region Infinity Upgrades
    const TryPurchaseInfinityUpgrade11 = ()=>{
        if(player.stats.infinity.currentAmount>=1){
            player.stats.infinity.currentAmount-=1
            player.stats.infinity.upgrades.upgrade11Bought=true
            playerStatsCalculated.infinity.upgrades.upgrade11.replicantiReplicationTimeDivider=2
            CalculateReplicantiReplicationTime()
            $("#infinityUpgrade11").addClass("boughtInfinityUpgrade")
            $("#infinityUpgrade11").off("click")
        }
    }

    const TryPurchaseInfinityUpgrade12 = ()=>{
        if(player.stats.infinity.currentAmount>=1){
            player.stats.infinity.currentAmount-=1
            player.stats.infinity.upgrades.upgrade12Bought=true
            playerStatsCalculated.infinity.upgrades.upgrade12.replicantiReplicationMultiMultiplier=1.5
            CalculateReplicantiReplicationMulti()
            $("#infinityUpgrade12").addClass("boughtInfinityUpgrade")
            $("#infinityUpgrade12").off("click")
        }
    }

    const TryPurchaseInfinityUpgrade13 = ()=>{
        if(player.stats.infinity.currentAmount>=2){
            player.stats.infinity.currentAmount-=2
            player.stats.infinity.upgrades.upgrade13Bought=true
            CalculateReplicantiReplicationMulti()
            $("#infinityUpgrade13").addClass("boughtInfinityUpgrade")
            $("#infinityUpgrade13").off("click")
        }
    }

    const TryPurchaseInfinityUpgrade14 = ()=>{
        if(player.stats.infinity.currentAmount>=5){
            player.stats.infinity.currentAmount-=5
            player.stats.infinity.upgrades.upgrade14Bought=true
            CalculateReplicantiReplicationMulti()
            $("#infinityUpgrade14").addClass("boughtInfinityUpgrade")
            $("#infinityUpgrade14").off("click")
        }
    }

    const TryPurchaseInfinityUpgrade15 = ()=>{
        if(player.stats.infinity.currentAmount>=10){
            player.stats.infinity.currentAmount-=10
            player.stats.infinity.upgrades.upgrade15Bought=true
            playerStatsCalculated.infinity.upgrades.upgrade15.infinityReplicationMultiMultiplier=2
            CalculateReplicantiReplicationMulti()
            CalculateInfinityReplicationMulti()
            GoToInfinity()
        }
    }
    //#endregion
    //#region Calculate Infinity boosts
    const CalculateInfinityBoosts = ()=>{
        CalculateInfinityReplicationChance()
        CalculateInfinityReplicationMulti()
    }

    const CalculateInfinityReplicationChance = ()=>{
        playerStatsCalculated.infinity.replication.replicationChancePercent=10
            + playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder
            + 0
    }

    const CalculateInfinityReplicationMulti = ()=>{
        playerStatsCalculated.infinity.replication.replicationMulti=(2 
            + playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier)
            * playerStatsCalculated.infinity.upgrades.upgrade15.infinityReplicationMultiMultiplier
    }
    //#endregion
    //#region Unlock Infinity
    const UnlockInfinity = ()=>{
        player.stats.infinity.unlocked=true
        $("#infinity").text("Infinity")
        $("#infinity").addClass("interactable")
        $("#infinity").on("click", ()=>{
            mainMenuIndex=3
            GoToInfinity()
        })

        $("#mainMenu").append(`
            <div class="sidebarMenuItem" id="eternity">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#888"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
                Infinite infinity
            </div>
        `)

        mainMenuCallbacks.push(GoToInfinity)
        subMenuIndexes.push(0)
        subMenuLimits.push(0)
    }
    //#endregion
    //#region infinity replication
    const DoInfinityReset = ()=>{
        if(player.stats.infinity.unlocked==false){
            UnlockInfinity()
        }
        player.stats.infinity.currentAmount++
        let rng = 1+Math.round(Math.random()*100)
        if(rng<=playerStatsCalculated.infinity.replication.replicationChancePercent){
            player.stats.infinity.currentAmount*=playerStatsCalculated.infinity.replication.replicationMulti
        }
        ResetReplicantiLayer(1)
    }
    //#endregion
    //#region infinity UI update
    const UpdateInfinityView= ()=>{
        $("#replicantiAmount").text(`${FormatNumber(player.stats.replicanti.currentAmount)} / 1.79e308 replicanti`)
        $("#replicantiAmount").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent
        )`)

        $("#currencyBar").text(`${FormatNumber(player.stats.infinity.currentAmount)} / 1.79e308 Infinity`)
        $("#currencyBar").css("background-image", `linear-gradient(
            to right, 
            orange,
            orange ${(Math.log10(player.stats.infinity.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent ${(Math.log10(player.stats.infinity.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent
        )`)

        $("#infinityReplicationChance").text(`Replication chance: ${playerStatsCalculated.infinity.replication.replicationChancePercent}%`)
        $("#infinityReplicationMulti").text(`Replication multi: x${FormatNumber(playerStatsCalculated.infinity.replication.replicationMulti)}`)
        
        if(player.stats.infinity.currentAmount>=1 && player.stats.infinity.upgrades.upgrade11Bought==false){
            $("#infinityUpgrade11").addClass("purchaseAbleUpgrade interactable")
        }
        if(player.stats.infinity.currentAmount>=1 && player.stats.infinity.upgrades.upgrade12Bought==false){
            $("#infinityUpgrade12").addClass("purchaseAbleUpgrade interactable")
        }
        if(player.stats.infinity.currentAmount>=2 && player.stats.infinity.upgrades.upgrade13Bought==false){
            $("#infinityUpgrade13").addClass("purchaseAbleUpgrade interactable")
        }
        if(player.stats.infinity.currentAmount>=5 && player.stats.infinity.upgrades.upgrade14Bought==false){
            $("#infinityUpgrade14").addClass("purchaseAbleUpgrade interactable")
        }
        if(player.stats.infinity.currentAmount>=10 && player.stats.infinity.upgrades.upgrade15Bought==false){
            $("#infinityUpgrade15").addClass("purchaseAbleUpgrade interactable")
        }

        if(player.stats.infinity.upgrades.upgrade13Bought==true){
            $("#infinityUpgrade13Effect").text(`Currently: x${FormatNumber(playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier)}`)
        }


        if(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable1.cost && player.stats.infinity.buyables.buyable1Amount<79){
            $("#infinityBuyable1BuyOne").addClass("buyablePurchaseAble")
            $("#infinityBuyable1BuyMax").addClass("buyablePurchaseAble")
        }
        else{
            $("#infinityBuyable1BuyOne").removeClass("buyablePurchaseAble")
            $("#infinityBuyable1BuyMax").removeClass("buyablePurchaseAble")
        }
        if(player.stats.infinity.currentAmount>=playerStatsCalculated.infinity.buyables.buyable2.cost && player.stats.infinity.buyables.buyable2Amount<30){
            $("#infinityBuyable2BuyOne").addClass("buyablePurchaseAble")
            $("#infinityBuyable2BuyMax").addClass("buyablePurchaseAble")
        }
        else{
            $("#infinityBuyable2BuyOne").removeClass("buyablePurchaseAble")
            $("#infinityBuyable2BuyMax").removeClass("buyablePurchaseAble")
        }

        UpdateInfinityBuyable1UI()
        UpdateInfinityBuyable2UI()
    }
    //#endregion
    //#region UpdateInfinityBuyablesAfterLoad
    const UpdateInfinityBuyablesAfterLoad = ()=>{
        playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder= 1 * player.stats.infinity.buyables.buyable1Amount
        playerStatsCalculated.infinity.buyables.buyable1.cost= 100*Math.pow(1.15, player.stats.infinity.buyables.buyable1Amount)
        playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier= 1 + (0.1 * player.stats.infinity.buyables.buyable2Amount)
        playerStatsCalculated.infinity.buyables.buyable2.cost= 1000*Math.pow(2, player.stats.infinity.buyables.buyable2Amount)
    }
    //#endregion
    //#region UpdateInfinityUpgradesAfterLoad
    const UpdateInfinityUpgradesAfterLoad = ()=>{
        if(player.stats.infinity.upgrades.upgrade11Bought==true){
            playerStatsCalculated.infinity.upgrades.upgrade11.replicantiReplicationTimeDivider=2
        }
        if(player.stats.infinity.upgrades.upgrade12Bought==true){
            playerStatsCalculated.infinity.upgrades.upgrade12.replicantiReplicationMultiMultiplier=1.5
        }
        if(player.stats.infinity.upgrades.upgrade13Bought==true){
            playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier= Math.pow(
                1 + player.stats.infinity.currentAmount,
                0.5
            )
        }
        if(player.stats.infinity.upgrades.upgrade15Bought==true){
            playerStatsCalculated.infinity.upgrades.upgrade15.infinityReplicationMultiMultiplier=2
        }
    }
    //#endregion
    //#region Reset Infinity layer
    const ResetInfinityLayer = (layerReset) =>{
        player.stats.infinity.currentAmount=0
        player.stats.infinity.buyables.buyable1Amount=0
        playerStatsCalculated.infinity.buyables.buyable1.cost=100
        playerStatsCalculated.infinity.buyables.buyable1.infinityReplicationChancePercentAdder=0
        player.stats.infinity.buyables.buyable2Amount=0
        playerStatsCalculated.infinity.buyables.buyable2.cost=1000
        playerStatsCalculated.infinity.buyables.buyable2.intinityReplicationMultiMultiplier=1
        player.stats.infinity.upgrades.upgrade11Bought=false
        playerStatsCalculated.infinity.upgrades.upgrade11.replicantiReplicationTimeDivider=1
        player.stats.infinity.upgrades.upgrade12Bought=false
        playerStatsCalculated.infinity.upgrades.upgrade12.replicantiReplicationMultiMultiplier=1
        player.stats.infinity.upgrades.upgrade13Bought=false
        playerStatsCalculated.infinity.upgrades.upgrade13.replicantiReplicationMultiMultiplier=1
        player.stats.infinity.upgrades.upgrade14Bought=false
        player.stats.infinity.upgrades.upgrade15Bought=false
        playerStatsCalculated.infinity.upgrades.upgrade15.infinityReplicationMultiMultiplier=1
        CalculateReplicantiBoosts()
        CalculateInfinityBoosts()
    }
    //#region Eternity nav
    const GoToEternity = () =>{
        view.html(`
            Rep
        `)
    }
    //#endregion
    //#region Unlock Eternity
    const UnlockEternity = ()=>{
        player.stats.eternity.unlocked=true
        $("#eternity").text("Eternity")
        $("#eternity").addClass("interactable")
        $("#eternity").on("click", ()=>{
            mainMenuIndex=4
            GoToEternity()
        })
    }
    //#endregion
    //#region Eternity replication
    const DoEternityReset = ()=>{
        if(player.stats.eternity.unlocked==false){
            UnlockEternity()
        }
        ResetInfinityLayer(2)
        ResetReplicantiLayer(2)
        player.stats.eternity.currentAmount+=playerStatsCalculated.eternity.static.gain
        let rng = Math.round(Math.random()*1010)/10
        if(rng<=playerStatsCalculated.eternity.replication.replicationChancePercent){
            player.stats.eternity.currentAmount*=playerStatsCalculated.eternity.replication.replicationMulti
        }
        CalculateReplicantiBoosts()
    }
    //#endregion
    //#region Eternity UI update
    const UpdateEternityView= ()=>{
        console.log("here")
    }
    //#endregion
    //#region tick
    let totalTimeSinceReplicationInMs=0
    const DoTick = (ms)=>{
        totalTimeSinceReplicationInMs+=ms

        while(totalTimeSinceReplicationInMs>=playerStatsCalculated.replicanti.replicationTimeInMs){
            totalTimeSinceReplicationInMs-=playerStatsCalculated.replicanti.replicationTimeInMs
            DoReplicantiReplication()
        }

        if(player.stats.infinity.currentAmount==Infinity){
            DoEternityReset()
        }
    }
    //#endregion
    //#region update UI
    const UpdateUI = () =>{
        if(mainMenuIndex==2){
            UpdateReplicantiView()
        }
        if(mainMenuIndex==3){
            UpdateInfinityView()
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
    let mainMenuCallbacks=[GoToSettings, GoToInformation, GoToReplicanti]
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
            totalTimeSinceReplicationInMs+=timeDiff
            tick=setInterval(DoTick, 25, 25)
            uiUpdateTicker=setInterval(UpdateUI, player.options.ui.uiUpdateRateInMs)
            if(player.options.save.saveIntervalInMs!=0){
                autoSaveInterval=setInterval(Save, player.options.save.saveIntervalInMs)
            }
        }
    })
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("replicantiIncSave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("replicantiIncSave");
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

            UpdateReplicantiBuyablesAfterLoad()
            UpdateInfinityBuyablesAfterLoad()
            UpdateInfinityUpgradesAfterLoad()

            CalculateReplicantiBoosts();
            CalculateInfinityBoosts();
            
            if (player.stats.infinity.unlocked == true) {
                UnlockInfinity();
            }

            if (player.stats.eternity.unlocked == true) {
                UnlockEternity();
            }
        }
        catch (e) {
            console.log(e);
        }
        GoToReplicanti()
    };

    const CheckForMissingData = () => {

    };

    const HardReset = () => {
        localStorage.removeItem("replicantiIncSave");
        location.reload();
    };
    //#endregion
    //#region Import save
    const ImportSave = ()=>{
        clearInterval(autoSaveInterval)
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("replicantiIncSave", saveText)
        location.reload()
    }
    //#endregion
    Load()

})