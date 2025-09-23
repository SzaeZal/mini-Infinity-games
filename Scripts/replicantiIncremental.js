$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })

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
})