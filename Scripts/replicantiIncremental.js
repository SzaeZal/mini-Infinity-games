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
            <div id="subMenuInView">
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView">
                <div id="currencyBar" class="currencyBar">
                    1 / 1.79e308 replicanti
                </div>
                <div class="buyables">
                    <div class="subTitle">
                        Buyables
                    </div>
                    <div class="row gap-50px">
                        <div id="replicantiBuyable1" class="buyable">
                            <div class="upgradeTitle">
                                Replication Fastener <br> 
                                level <span id="replicantiBuyable1Amount">${player.stats.replicanti.buyables.buyable1Amount}</span> / 4
                            </div>
                            <div class="upgradeDescription">
                                Each level divides replication time by /+1 
                            </div>
                            <div id="replicantibuyable1Effect">
                                Currently: /${playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider}
                            </div>
                            <div id="replicantiBuyable1Cost">
                                Cost: ${
                                    player.stats.replicanti.buyables.buyable1Amount==4 
                                    ? 'Maxed' 
                                    : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable1.cost)+ " replicanti"
                                } 
                            </div>
                            <div class="row">
                                <div id="replicantiBuyable1BuyOne" class="buyableBuy1">Buy 1</div>
                                <div id="replicantiBuyable1BuyMax" class="buyableBuyMax">Buy Max</div>
                            </div>
                        </div>
                        <div id="replicantiBuyable2" class="buyable">
                            <div class="upgradeTitle">
                                Replication Increaser <br> 
                                level <span id="replicantiBuyable2Amount">${player.stats.replicanti.buyables.buyable2Amount}</span> / 4
                            </div>
                            <div class="upgradeDescription">
                                Each level multiplies replication multi by x2
                            </div>
                            <div id="replicantibuyable2Effect">
                                Currently: x${playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier}
                            </div>
                            <div id="replicantiBuyable2Cost">
                                Cost: ${
                                    player.stats.replicanti.buyables.buyable2Amount==4 
                                    ? 'Maxed' 
                                    : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable2.cost)+ " replicanti"
                                } 
                            </div>
                            <div class="row ">
                                <div id="replicantiBuyable2BuyOne" class="buyableBuy1">Buy 1</div>
                                <div id="replicantiBuyable2BuyMax" class="buyableBuyMax">Buy Max</div>
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
                && player.stats.replicanti.buyables.buyable1Amount<4
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
                && player.stats.replicanti.buyables.buyable2Amount < 4
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
        if(player.stats.replicanti.buyables.buyable1Amount<4){
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
        $("#replicantiBuyable1Cost").text(`Cost: ${player.stats.replicanti.currentAmount==4 ? 'Maxed' : FormatNumber(playerStatsCalculated.replicanti.buyables.buyable1.cost)}`)
    }

    const PurchaseReplicantiBuyable2 = ()=>{
        if(player.stats.replicanti.buyables.buyable2Amount<4){
            player.stats.replicanti.buyables.buyable2Amount++
            player.stats.replicanti.currentAmount/=playerStatsCalculated.replicanti.buyables.buyable2.cost
            playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier= 1*
                Math.pow(
                    2,
                    player.stats.replicanti.buyables.buyable1Amount
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
        $("#replicantiBuyable2Cost").text(`Cost: ${FormatNumber(playerStatsCalculated.replicanti.buyables.buyable2.cost)}`)
    }
    //#endregion
    //#region replicanti replication
    const DoReplicantiReplication = ()=>{
        player.stats.replicanti.currentAmount*=playerStatsCalculated.replicanti.replicationMulti
        if(player.stats.replicanti.currentAmount==Infinity){
            DoInfinityReset()
        }
        
        if(mainMenuIndex==2){
            UpdateReplicantiView()
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
            playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider*
            1
        )
    }

    const CalculateReplicantiReplicationMulti = ()=>{
        playerStatsCalculated.replicanti.replicationMulti=2 
        * playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier
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
    //#region Reset Replicanti layer
    const ResetReplicantiLayer = (layerReset) =>{
        player.stats.replicanti.currentAmount=1
        player.stats.replicanti.buyables.buyable1Amount=0
        playerStatsCalculated.replicanti.buyables.buyable1.cost=128
        playerStatsCalculated.replicanti.buyables.buyable1.replicantiReplicationTimeDivider=1
        player.stats.replicanti.buyables.buyable2Amount=0
        playerStatsCalculated.replicanti.buyables.buyable2.cost=1024
        playerStatsCalculated.replicanti.buyables.buyable2.replicantiReplicationMultiMultiplier=1
        CalculateReplicantiBoosts()
        UpdateReplicantiBuyable1UI()
        UpdateReplicantiBuyable2UI()
    }
    //#endregion
    //#region Infinity nav
    const GoToInfinity = () =>{
        view.html(`
            Rep
        `)
    }
    //#endregion
    //#region Unlock Infinity
    const UnlockInfinity = ()=>{
        player.stats.infinity.unlocked=true
        $("#infinity").text("Infinity")

        $("#infinity").on("click", ()=>{
            mainMenuIndex=3
            GoToInfinity()
        })

        $("#mainMenu").append(`
            <div class="sidebarMenuItem" id="eternity">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
                Infinite infinity
            </div>
        `)
    }
    //#endregion
    //#region infinity replication
    const DoInfinityReset = ()=>{
        if(player.stats.infinity.unlocked==false){
            UnlockInfinity()
        }
        ResetReplicantiLayer(1)
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
    //#region Reset Infinity layer
    const ResetInfinityLayer = (layerReset) =>{
        player.stats.infinity.currentAmount=0
        player.stats.replicanti.buyables.buyable1Amount=0
        player.stats.replicanti.buyables.buyable2Amount=0
        player.stats.infinity.upgrades.upgrade11Bought=false
        player.stats.infinity.upgrades.upgrade12Bought=false
        player.stats.infinity.upgrades.upgrade13Bought=false
        player.stats.infinity.upgrades.upgrade14Bought=false
        player.stats.infinity.upgrades.upgrade15Bought=false
        CalculateReplicantiBoosts()
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
        if(mainMenuIndex==2){
            $("#replicationTimer").text(`${FormatNumber(totalTimeSinceReplicationInMs)} / ${FormatNumber(playerStatsCalculated.replicanti.replicationTimeInMs)} ms`)
            $("#replicationTimer").css("background-image", `linear-gradient(
                to right, 
                grey,
                grey ${totalTimeSinceReplicationInMs/playerStatsCalculated.replicanti.replicationTimeInMs*100}%,
                transparent ${totalTimeSinceReplicationInMs/playerStatsCalculated.replicanti.replicationTimeInMs*100}%,
                transparent
            )`)
        }


        while(totalTimeSinceReplicationInMs>=playerStatsCalculated.replicanti.replicationTimeInMs){
            totalTimeSinceReplicationInMs-=playerStatsCalculated.replicanti.replicationTimeInMs
            DoReplicantiReplication()
        }

        if(player.stats.infinity.currentAmount==Infinity){
            DoEternityReset()
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
    AddReplicantiUIEvents()
})