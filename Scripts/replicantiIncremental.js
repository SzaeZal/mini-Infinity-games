$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player variable
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
    //#region playerStatsCalculated variable
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
})