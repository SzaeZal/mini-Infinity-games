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
                theme: "dark",
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
                    cost: 100,
                    replicantiReplicationTimeDivider: 1 // 1.25
                },
                buyable2:{
                    cost: 1000,
                    replicantiReplicationMultiMultiplier: 1 // +0.5 per
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
                    replicantiReplicationTimeDivider:1  // 2 if bought
                },
                upgrade12:{
                    replicantiReplicationMultiMultiplier:1 // 1.5 if bought
                },
                upgrade13:{
                    replicantiReplicationMultiMultiplier:1 // based on infinities (sqrt maybe)
                },                                      //upgrade 14 keeps replicanti buyables
                upgrade15:{
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
                    intinityReplicationMultiMultiplier: 1 // +0.1 per
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
                    replicantiReplicationMultiMultiplier:1  // 10 if bought
                },                                          
                upgrade12:{
                    infinityReplicationChancePercentAdder:1  // 10 if bought
                }, 
                upgrade13:{
                    replicantiReplicationMultiMultiplier: 1, // based on eternities (cbrt maybe)
                    intinityReplicationMultiMultiplier:1 // based on eternities (cbrt maybe)
                },
                upgrade14:{
                    infinityReplicationMultiMultiplier:1 // 2 if bought
                },                                      // upgrade 15 keeps infinity upgrades
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

    let SaveInterval = setInterval(Save, 5000);

    const Load = () => {
        let playerJson = DecodePartialJwt();
        if (playerJson != null) {
            let playerParsed = JSON.parse(playerJson);
            player = Object.assign({}, player, playerParsed);

            CheckForMissingData();

            if (player.options.save.autoSaveInterval == null) {
                clearInterval(SaveInterval);
            } 
            else {
                clearInterval(SaveInterval);
                SaveInterval = setInterval(Save, player.options.save.autoSaveInterval);
            }
        }
    };

    const CheckForMissingData = () => {
        // use if I change player object
    };

    const HardReset = () => {
        localStorage.removeItem("replicantiIncSave");
        location.reload();
    };
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
                    fill="#e3e3e3">
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
                    fill="#e3e3e3">
                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </svg>
            `)
        }
        isSidebarOpen=!isSidebarOpen
    })
    //#endregion
    //#region menu navigation
    const view = $("#view")
    let mainMenuIndex=2
    let subMenuIndexes=[0, 0, 0]
    let subMenuLimits=[1, 1, 0]
    $(document).keydown((e)=>{
        if(e.originalEvent.code == "KeyW" || e.originalEvent.code == "ArrowUp"){
            mainMenuIndex= mainMenuIndex == subMenuLimits.length-1 ? 0 : mainMenuIndex+1
            mainMenuCallbacks[mainMenuIndex]()
        }
        else if(e.originalEvent.code == "KeyS" || e.originalEvent.code == "ArrowDown"){
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
            default:
                console.log("Settings sub navigation broke")
                break;
        }
    }


    const GoToUISettings = () =>{
        view.html(`
            FISH    
        `)
    }

    const GoToSaveSettings = () =>{
        view.html(`
            FISH    
        `)
    }
    //#endregion
    //#region Information nav
    $("#information").on("click", ()=>{
        mainMenuIndex=1
        GoToInformation()
    })

    const GoToInformation = () =>{
        switch(subMenuIndexes[0]){
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

    const GoToMainInformation = () =>{
        view.html(`
            FISH    
        `)
    }

    const GoToChangelogInformation = () =>{
        view.html(`
            FISH    
        `)
    }
    //#endregion
    //#region Replicanti nav
    $("#replicanti").on("click", ()=>{
        mainMenuIndex=2
        GoToReplicanti()
    })

    const GoToReplicanti = () =>{
        view.html(`
            Rep
        `)
    }
    //#endregion
    //#region replicanti replication
    const DoReplicantiReplication = ()=>{
        player.stats.replicanti.currentAmount*=playerStatsCalculated.replicanti.replicationMulti
        if(mainMenuIndex==2){
            UpdateReplicantiView()
        }
    }
    //#endregion
    //#region Replicanti UI update
    const UpdateReplicantiView= ()=>{
        $("#currencyBar").text(`${FormatNumber(player.stats.replicanti.currentAmount)} / 1.79e308 replicanti`)
        $("#currencyBar").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent ${(Math.log10(player.stats.replicanti.currentAmount)/Math.log10(1.79e308))*100}%,
            transparent
        )`)
    }
    //#endregion
    //#region Infinity nav
    /*$("#infinity").on("click", ()=>{
        mainMenuIndex=3
        GoToInfinity()
    })*/

    const GoToInfinity = () =>{
        view.html(`
            Rep
        `)
    }
    //#endregion

    //#region infinity replication
    const DoInfinityReset = ()=>{
        player.stats.infinity.currentAmount++
        let rng = 1+Math.round(Math.random()*100)
        if(rng<=playerStatsCalculated.infinity.replication.replicationChancePercent){
            player.stats.infinity.currentAmount*=playerStatsCalculated.infinity.replication.replicationMulti
        }
        if(mainMenuIndex==3){
            UpdateInfinityView()
        }
    }
    //#endregion
    //#region infinity UI update
    const UpdateInfinityView= ()=>{
        console.log("here")
    }
    //#endregion
    //#region Eternity nav
    /*$("#eternity").on("click", ()=>{
        mainMenuIndex=4
        GoToEternity()
    })*/

    const GoToEternity = () =>{
        view.html(`
            Rep
        `)
    }
    //#endregion
    //#region Eternity replication
    const DoEternityReset = ()=>{
        player.stats.eternity.currentAmount+=playerStatsCalculated.eternity.static.gain
        let rng = Math.round(Math.random()*1010)/10
        if(rng<=playerStatsCalculated.eternity.replication.replicationChancePercent){
            player.stats.eternity.currentAmount*=playerStatsCalculated.eternity.replication.replicationMulti
        }
        if(mainMenuIndex==4){
            UpdateEternityView()
        }
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
        if(totalTimeSinceReplicationInMs>=playerStatsCalculated.replicanti.replicationTimeInMs){
            totalTimeSinceReplicationInMs-=playerStatsCalculated.replicanti.replicationTimeInMs
            DoReplicantiReplication()
        }

        if(player.stats.replicanti.currentAmount==Infinity){
            DoInfinityReset(1)
        }

        if(player.stats.infinity.currentAmount==Infinity){
            DoEternityReset(2)
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
    
})