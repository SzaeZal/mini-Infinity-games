$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    const inventoryLimit=36
    //#region player
    let player={
        stats:{
            coins:0,
            orbs:0,
            currentFloor:1,
            floorStats:[
                {
                    EnemiesKilled: 0,
                    BossKilled:false,
                    autoDeletes: [false, false, false, false, false, false, false, false, false, false, false]
                },
            ],
            gear:{
                weapon:{
                    name:"stick",
                    itemType:"Weapons/Swords",
                    rarity:"Common",
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
                    special: undefined
                },
                offhand:{

                },
                armor:{
                    helmet:{

                    },
                    chestplate:{

                    },
                    leggings:{

                    },
                    boots:{

                    }
                }
            },
            inventory:[
                {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
            ],
            upgradesBought:{
                offensive:[false, false, false],
                defensive:[false, false, false],
                misc:[false, false, false]
            }
        },
        options:{
            ui:{
                theme: "Dark",
                subMenuShown: true,
                uiUpdateRateInMs: 25, 
                hideBoughtUpgrades:false
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
            hitChance: 0,
            reflectChance:0,
            criticalChance:0,
            criticalDamageMult: 2
        }
    }
    //#endregion
    //#region upgradeStats
    let upgradeStats ={
        offensive:[
            {
                upgradeName: "Damage doubler (physical)",
                upgradeDescription: "Doubles your physical damage",
                upgradeCost: 100,
            },
            {
                upgradeName: "Damage doubler (magic)",
                upgradeDescription: "Doubles your magic damage",
                upgradeCost: 1000
            },
            {
                upgradeName: "Damage doubler (elemental)",
                upgradeDescription: "Doubles all your elemental damage",
                upgradeCost: 1500
            }
        ],
        defensive:[
            {
                upgradeName: "Max health doubler",
                upgradeDescription: "Doubles your max health",
                upgradeCost: 100,
            },
            {
                upgradeName: "Starter regen",
                upgradeDescription: "Gain +5 regeneration",
                upgradeCost: 250
            },
            {
                upgradeName: "Starter defense",
                upgradeDescription: "Gain +10 physical defense",
                upgradeCost: 500
            }
        ],
        misc:[
            {
                upgradeName: "Starter attack speed",
                upgradeDescription: "Gain +0.1 attack speed",
                upgradeCost: 300,
            },
            {
                upgradeName: "Beginner attack speed",
                upgradeDescription: "Gain +0.25 attack speed",
                upgradeCost: 1e5
            },
            {
                upgradeName: "Intermediate attack speed",
                upgradeDescription: "Gain +0.5 attack speed",
                upgradeCost: 1e10
            }
        ]
    }
    //#endregion
    //#region enemyStats 
    let enemyStats = {
        name: "",
        isBoss:false,
        health: 100,
        maxHealth: 100,
        goldReward: 0,
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
            hitChance: 0,
            reflectChance:0,
            criticalChance:0,
            criticalDamageMult: 2
        }
    }
    //#endregion
    //#region floorStuff
    const floorStuff={
        floor1:{
            enemyStats:{
                name: "Wolf",
                isBoss: false,
                health: 15,
                maxHealth: 15,
                goldReward: 1,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                goldReward: 100,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {
                    dropChance: 0.0001,
                    name:"crimsonBlade",
                    itemType:"Weapons/Swords",
                    rarity:"Mythic",
                    attack:{
                        type:{
                            physical:1000,
                            magic:0
                        },
                        element:{
                            fire:10000,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    special: undefined
                },
                {
                    dropChance: 0.0005,
                    name:"woB",
                    itemType:"Weapons/Bows",
                    rarity:"Legendary",
                    attack:{
                        type:{
                            physical:500,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    misc:{
                        accuracyMult:1e100
                    },
                    special: undefined
                },
                {
                    dropChance: 0.005,
                    name:"Spiked shield",
                    itemType:"OffHand/Shields",
                    rarity:"Legendary",
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
                        reflectChance:100
                    },
                    special: undefined
                },
                {
                    dropChance: 0.01,
                    name:"Wolf hat",
                    itemType:"Armor/Helmets",
                    rarity:"Legendary",
                    weight: 1,
                    defense:{
                        type:{
                            absolute:100,
                            relative:2
                        },
                        element:{
                            fire:{
                                absolute:0,
                                relative:0
                            },
                            earth:{
                                absolute:100,
                                relative:10
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
                        accuracyMult:1.5,
                        criticalDamageMult:2,
                        criticalChance:5,
                        evasionMult: 2
                    },
                    special: undefined
                },
                {
                    dropChance: 0.07,
                    name:"Wolf boots",
                    itemType:"Armor/Boots",
                    rarity:"Legendary",
                    weight: 1,
                    defense:{
                        type:{
                            absolute:100,
                            relative:2
                        },
                        element:{
                            fire:{
                                absolute:0,
                                relative:0
                            },
                            earth:{
                                absolute:100,
                                relative:10
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
                        accuracyMult:1.5,
                        criticalDamageMult:2,
                        criticalChance:5,
                        evasionMult: 2
                    },
                    special: undefined
                },
                {
                    dropChance: 0.25,
                    name:"Wolf chestplate",
                    itemType:"Armor/Chestplates",
                    rarity:"Legendary",
                    weight: 3,
                    defense:{
                        type:{
                            absolute:100,
                            relative:2
                        },
                        element:{
                            fire:{
                                absolute:0,
                                relative:0
                            },
                            earth:{
                                absolute:100,
                                relative:10
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
                        accuracyMult:1.5,
                        criticalDamageMult:2,
                        criticalChance:5,
                        evasionMult: 2
                    },
                    special: undefined
                },
                {
                    dropChance: 1,
                    name:"Wolf leggings",
                    itemType:"Armor/Leggings",
                    rarity:"Legendary",
                    weight: 2,
                    defense:{
                        type:{
                            absolute:100,
                            relative:2
                        },
                        element:{
                            fire:{
                                absolute:0,
                                relative:0
                            },
                            earth:{
                                absolute:100,
                                relative:10
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
                        criticalDamageMult:2,
                        criticalChance:5,
                        evasionMult: 2
                    },
                    special: undefined
                },
                {
                    dropChance: 15,
                    name:"knuckles",
                    itemType:"Weapons/HandGears",
                    rarity:"Rare",
                    attack:{
                        type:{
                            physical:15,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:5,
                            water:0,
                            air:0
                        }
                    },
                    misc:{
                        attackSpeed:1
                    },
                    special: undefined
                },
                {
                    dropChance: 30,
                    name:"Iron sword",
                    itemType:"Weapons/Swords",
                    rarity:"Rare",
                    attack:{
                        type:{
                            physical:15,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    misc:{
                        attackSpeed:1
                    },
                    special: undefined
                },
                {
                    dropChance: 65,
                    name:"Wood bow",
                    itemType:"Weapons/Bows",
                    rarity:"Uncommon",
                    attack:{
                        type:{
                            physical:5,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    special: undefined
                },
                {
                    dropChance: 100,
                    name:"Wood sword",
                    itemType:"Weapons/Swords",
                    rarity:"Common",
                    attack:{
                        type:{
                            physical:3,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    special: undefined
                },
            ]
        },
        floor2:{
            enemyStats:{
                name: "forest troll",
                isBoss: false,
                health: 650,
                maxHealth: 650,
                goldReward: 150,
                attack:{
                    type:{ physical:60, magic:25 },
                    element:{ fire:0, earth:50, water:0, air:0 }
                },
                defense:{
                    type:{ absolute:10, relative:5 },
                    element:{
                        fire:{ absolute:-50, relative:0 },
                        earth:{ absolute:100, relative:50 },
                        water:{ absolute:0, relative:0 },
                        air:{ absolute:0, relative:0 }
                    }
                },
                misc:{
                    attackSpeed:0.8,
                    regeneration:10,
                    accuracy:250,
                    evasion:100,
                    hitChance:0,
                    reflectChance:10,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "forest saint",
                isBoss:true,
                health: 100000,
                maxHealth: 1e5,
                goldReward: 2e5,
                attack:{
                    type:{
                        physical:15,
                        magic:1000
                    },
                    element:{
                        fire:0,
                        earth:250,
                        water:0,
                        air:10000
                    }
                },
                defense:{
                    type:{
                        absolute:100,
                        relative:10
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:-100
                        },
                        earth:{
                            absolute:100,
                            relative:10
                        },
                        water:{
                            absolute:0,
                            relative:20
                        },
                        air:{
                            absolute:0,
                            relative:100
                        }
                    }
                },
                misc:{
                    attackSpeed:2,
                    regeneration:2500,
                    accuracy:10000,
                    evasion: 5000,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor3:{
            enemyStats:{
                name: "undead",
                isBoss: false,
                health: 2e4,
                maxHealth: 2e4,
                goldReward: 5e5,
                attack:{
                    type:{
                        physical:1e4,
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
                    regeneration:1e3,
                    accuracy:1e5,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:50,
                    criticalDamageMult: 5
                }
            },
            bossStats:{
                name: "necromancer",
                isBoss:true,
                health: 2e8,
                maxHealth: 2e8,
                goldReward: 1e8,
                attack:{
                    type:{
                        physical:1e4,
                        magic:1e5
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
                        absolute:1e3,
                        relative:25
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:25
                        },
                        water:{
                            absolute:0,
                            relative: 25
                        },
                        air:{
                            absolute:0,
                            relative:25
                        }
                    }
                },
                misc:{
                    attackSpeed:1.25,
                    regeneration:5e6,
                    accuracy:5e6,
                    evasion: 5e6,
                    hitChance: 0,
                    reflectChance:15,
                    criticalChance:25,
                    criticalDamageMult: 3
                }
            },
            items:[
                {}
            ]
        },
        floor4:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor5:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor6:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor7:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor8:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor9:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
        },
        floor10:{
            enemyStats:{
                name: "wolf",
                isBoss: false,
                health: 50,
                maxHealth: 50,
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
                    accuracy:50,
                    evasion: 0,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:0,
                    criticalDamageMult: 2
                }
            },
            bossStats:{
                name: "alpha wolf",
                isBoss:true,
                health: 1000,
                maxHealth: 1000,
                attack:{
                    type:{
                        physical:15,
                        magic:0
                    },
                    element:{
                        fire:0,
                        earth:10,
                        water:0,
                        air:0
                    }
                },
                defense:{
                    type:{
                        absolute:10,
                        relative:0
                    },
                    element:{
                        fire:{
                            absolute:0,
                            relative:0
                        },
                        earth:{
                            absolute:100,
                            relative:10
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
                    attackSpeed:1.1,
                    regeneration:1,
                    accuracy:1000,
                    evasion: 50,
                    hitChance: 0,
                    reflectChance:0,
                    criticalChance:5,
                    criticalDamageMult: 2
                }
            },
            items:[
                {}
            ]
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
    let subMenuIndexes=[0, 0, 0, 0, 0]
    let subMenuLimits=[2, 1, 0, 0, 0]
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
                        V0.0: Hollow shell
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
                            V0.0: Hollow shell 
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
        ChangeFloor(player.stats.currentFloor, false)
    }
    //#endregion
    //#region ChangeFloor
    const ChangeFloor = (floor, isBoss)=>{
        enemyStats=isBoss ? floorStuff[`floor${floor}`].bossStats : floorStuff[`floor${floor}`].enemyStats
        CalculateHitChances()
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
                        <li>Damage: ${FormatNumber(playerStatsCalculated.attack.type.physical)} physical, ${FormatNumber(playerStatsCalculated.attack.type.magic)} magic</li>
                        <li>Defense: ${FormatNumber(playerStatsCalculated.defense.type.relative)}% + ${FormatNumber(playerStatsCalculated.defense.type.absolute)} </li>
                        <li>Elemental Damage: ${FormatNumber(playerStatsCalculated.attack.element.fire)} fire, ${FormatNumber(playerStatsCalculated.attack.element.water)} water, 
                            ${FormatNumber(playerStatsCalculated.attack.element.air)} air, ${FormatNumber(playerStatsCalculated.attack.element.earth)} earth</li>
                        <li>Elemental Defense: 
                            ${FormatNumber(playerStatsCalculated.defense.element.fire.relative)}% + ${FormatNumber(playerStatsCalculated.defense.element.fire.absolute)} fire,
                            ${FormatNumber(playerStatsCalculated.defense.element.water.relative)}% + ${FormatNumber(playerStatsCalculated.defense.element.water.absolute)} water, 
                            ${FormatNumber(playerStatsCalculated.defense.element.air.relative)}% + ${FormatNumber(playerStatsCalculated.defense.element.air.absolute)} air, 
                            ${FormatNumber(playerStatsCalculated.defense.element.earth.relative)}% + ${FormatNumber(playerStatsCalculated.defense.element.earth.absolute)} earth
                        </li>
                        <li>Regeneration: ${playerStatsCalculated.misc.regeneration} / s</li>
                        <li>Hit chance: ${FormatNumber(playerStatsCalculated.misc.hitChance*100)}%</li>
                        <li>Reflect chance: ${FormatNumber(playerStatsCalculated.misc.reflectChance)}%</li>
                        <li>Critical chance: ${FormatNumber(playerStatsCalculated.misc.criticalChance)}%</li>
                        <li>Critical multiplier: x${FormatNumber(playerStatsCalculated.misc.criticalDamageMult)}</li>
                    </ul>
                </div>
                <div class="fightSide">
                    <div class="fightSideTitle">
                        ${enemyStats.name}
                    </div>
                    ` /*Maybe add enemy Image*/+ `
                    <div class="progressBar" id="enemyHealthBar">
                        x / x Hp
                    </div>
                    <div class="progressBar" id="enemyAttackBar">
                        x / x ms
                    </div>
                    <div class="goldReward">
                        Kill reward: ${FormatNumber(enemyStats.goldReward)} Gold + 1 drop (see below)
                    </div>
                    <ul id="enemyStats">
                        <li>Damage: ${FormatNumber(enemyStats.attack.type.physical)} physical, ${FormatNumber(enemyStats.attack.type.magic)} magic</li>
                        <li>Defense: ${FormatNumber(enemyStats.defense.type.relative)}% + ${FormatNumber(enemyStats.defense.type.absolute)} </li>
                        <li>Elemental Damage: ${FormatNumber(enemyStats.attack.element.fire)} fire, ${FormatNumber(enemyStats.attack.element.water)} water, 
                            ${FormatNumber(enemyStats.attack.element.air)} air, ${FormatNumber(enemyStats.attack.element.earth)} earth</li>
                        <li>Elemental Defense: 
                            ${FormatNumber(enemyStats.defense.element.fire.relative)}% + ${FormatNumber(enemyStats.defense.element.fire.absolute)} fire,
                            ${FormatNumber(enemyStats.defense.element.water.relative)}% + ${FormatNumber(enemyStats.defense.element.water.absolute)} water, 
                            ${FormatNumber(enemyStats.defense.element.air.relative)}% + ${FormatNumber(enemyStats.defense.element.air.absolute)} air, 
                            ${FormatNumber(enemyStats.defense.element.earth.relative)}% + ${FormatNumber(enemyStats.defense.element.earth.absolute)} earth
                        </li>
                        <li>Regeneration: ${enemyStats.misc.regeneration} / s</li>
                        <li>Hit chance: ${FormatNumber(enemyStats.misc.hitChance*100)}%</li>
                        <li>Reflect chance: ${FormatNumber(enemyStats.misc.reflectChance)}%</li>
                        <li>Critical chance: ${FormatNumber(enemyStats.misc.criticalChance)}%</li>
                        <li>Critical multiplier: x${FormatNumber(enemyStats.misc.criticalDamageMult)}</li>
                    </ul>
                </div>
            </div>
            <table id="dropChances">
                <caption>
                    Floor drops
                </caption>
                <thead>
                    <tr>
                        <th id="itemName">
                            Item name
                        </th>
                        <th id="itemType">
                            Item type
                        </th>
                        <th id="itemBaseRarity">
                            Base rarity
                        </th>
                        <th id="autoDelete">
                            Auto delete
                        </th>
                    </tr>
                </thead>
                ${ShowDropChances(floor)}
            </table>    
        `)
        AddTowerUIEvents()
    }
    //#endregion
    //#region ShowDropChances
    const ShowDropChances=(floor)=>{
        let items=floorStuff[`floor${floor}`].items
        let floorAutoDeletes=player.stats.floorStats[floor-1].autoDeletes
        let dropChancesUI=``
        for(let i=0; i<items.length; i++){
            let item=items[i]
            dropChancesUI+=`
                <tr>
                    <td headers="itemName">
                        ${item.name}
                    </td>
                    <td headers="itemType">
                        ${item.itemType}
                    </td>
                    <td headers="itemBaseChance">
                        ${items[i].dropChance}%
                    </td>
                    <td id="autoDeleteItem${i}" class="interactable ${floorAutoDeletes[i] ? "activeAutoDelete" : "inactiveAutoDelete"}" headers="autoDelete">
                        <svg id="autoDeleteItem${i}Svg" xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#888"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>
                    </td>
                </tr>
            `
        }
        return dropChancesUI
    }
    //#endregion
    //#region tower ui events
    const AddTowerUIEvents=()=>{
        if(player.stats.currentFloor!=1){
            $("#floorSelectFirst").on("click", ()=>{
                player.stats.currentFloor=1
                ChangeFloor(1, false)
            })
            $("#floorSelectBack").on("click", ()=>{
                player.stats.currentFloor--
                ChangeFloor(player.stats.currentFloor, false)
            })
        }

        if(player.stats.currentFloor!=player.stats.floorStats.length){
            $("#floorSelectForward").on("click", ()=>{
                player.stats.currentFloor++
                ChangeFloor(player.stats.currentFloor, false)
            })
            $("#floorSelectLast").on("click", ()=>{
                player.stats.currentFloor=player.stats.floorStats.length
                ChangeFloor(player.stats.currentFloor, false)
            })
        }

        if(playerStatsCalculated.attacking==false){
            $("#attackToggle").text("Start fight")
            $("#attackToggle").on("click", ()=>{ToggleAttack()})
        }
        else{
            $("#attackToggle").text("Stop fight")
            $("#attackToggle").on("click", ()=>{ToggleAttack()})
        }

        for(let i=0; i<player.stats.floorStats[player.stats.currentFloor-1].autoDeletes.length; i++){
            $(`#autoDeleteItem${i}`).on("click", ()=>{ToggleAutoDelete(i)})
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

        $("#enemyAttackBar").text(`${FormatNumber(totalTimeSinceEnemyAttackInMs)} / ${FormatNumber(1000 / enemyStats.misc.attackSpeed)} ms`)
        $("#enemyAttackBar").css("background-image", `linear-gradient(
            to right, 
            blue,
            blue ${totalTimeSinceEnemyAttackInMs/ (1000 / enemyStats.misc.attackSpeed) *100}%,
            transparent ${totalTimeSinceEnemyAttackInMs/ (1000 / enemyStats.misc.attackSpeed)*100}%,
            transparent
        )`)

        if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false 
            && player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled<10){
            $("#floorEnemiesKilledToBoss").text(`${FormatNumber(player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled)} / 10 enemies to boss`)
            $("#floorEnemiesKilledToBoss").css("background-image", `linear-gradient(
                to right, 
                yellow,
                yellow ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent ${player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled *10}%,
                transparent
            )`)
        }
        else if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false 
            && enemyStats.isBoss==true){
            $("#floorEnemiesKilledToBoss").text(`Exit boss lair`)
            $("#floorEnemiesKilledToBoss").css("background-color", `orange`)
            $("#floorEnemiesKilledToBoss").on("click", ()=>{ChangeFloor(player.stats.currentFloor, false)})
        }
        else if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false){
            $("#floorEnemiesKilledToBoss").text(`Enter boss lair`)
            $("#floorEnemiesKilledToBoss").css("background-color", `orange`)
            $("#floorEnemiesKilledToBoss").on("click", ()=>{ChangeFloor(player.stats.currentFloor, true)})
        }
        else{
            $("#floorEnemiesKilledToBoss").text(`Boss killed. Unlocked next floor, and multi killing on this floor`)
            $("#floorEnemiesKilledToBoss").css("background-color", `green`)
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
        else{
            $("#gameSpeed").text(``)
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
            <div class="mainView inventoryView">
                <div class="equippedItems">
                    <img src="../Images/TowerOfInfiniteEnemies/graystickfigure.png" alt="player image">
                    <div class="armorItems">
                        <div class="storedItem" id="itemSlotHelmet">
                            ${GetItemUI(player.stats.gear.armor.helmet, "Helmet")}
                        </div>
                        <div class="storedItem" id="itemSlotChestplate">
                            ${GetItemUI(player.stats.gear.armor.chestplate, "Chestplate")}
                        </div>
                        <div class="storedItem" id="itemSlotLeggings">
                            ${GetItemUI(player.stats.gear.armor.leggings, "Leggings")}
                        </div>
                        <div class="storedItem" id="itemSlotBoots">
                            ${GetItemUI(player.stats.gear.armor.boots, "Boots")}
                        </div>
                    </div>
                    <div class="handHeldItems">
                        <div class="storedItem" id="itemSlotWeapon">
                            ${GetItemUI(player.stats.gear.weapon, "Weapon")}
                        </div>
                        <div class="storedItem" id="itemSlotOffHand">
                            ${GetItemUI(player.stats.gear.offhand, "offHand")}
                        </div>
                    </div>
                </div>
                <div class="storedItems">
                    ${ShowStoredItems()}
                </div>
            </div>
        `)

        AddInventoryUIEvents()
    }
    //#endregion
    //#region ShowStoredItems
    const ShowStoredItems = ()=>{
        let storedItemsUI=``
        let itemUI=``
        for (let i=0; i<36; i++){
            try{                
                itemUI=GetItemUI(player.stats.inventory[i], i)
            }
            catch(error){                
                itemUI=``
            }                        
            storedItemsUI+=`
                <div class="storedItem" id="itemSlot${i}">
                    ${itemUI}
                </div>
            `
        }   
        return storedItemsUI
    }
    //#endregion
    //#region GetItemUI
    const GetItemUI = (item, idIndex)=>{
        if(item.name==undefined){
            return ``
        }
        
        return `<img src="../Images/TowerOfInfiniteEnemies/${item.itemType}/${item.name}.png" onerror="this.onerror=null; this.src='../Images/TowerOfInfiniteEnemies/questionMark.png'" 
            alt="inventory item ${item.itemType} ${item.name}" class="rarity${item.rarity}" id="storedItem${idIndex}">
            <div class="hiddenPart itemDescription ${player.options.ui.theme=="Dark" ? "theme-dark" : "theme-light"}" id="storedItem${idIndex}Description">
                ${GetItemDetails(item, idIndex)}
            </div>`
    }
    //#endregion
    //#region AddInventoryUIEvents
    const AddInventoryUIEvents = ()=>{
        for(let i=0; i<player.stats.inventory.length; i++){
            try{
                $(`#storedItem${i}`).on("click", ()=>{                    
                    if("hiddenPart" == $(`#storedItem${i}Description`)[0].classList[0] || "hiddenPart" == $(`#storedItem${i}Description`)[0].classList[2]){                        
                        $(`#storedItem${i}Description`).removeClass("hiddenPart")
                    }
                    else{                        
                        $(`#storedItem${i}Description`).addClass("hiddenPart")
                    }
                })

                $(`#item${i}Equip`).on("click", ()=>{EquipItem(i)})
                $(`#item${i}Delete`).on("click", ()=>{DeleteItem(i)})
            }
            catch{

            }
            
        }
    }
    //#endregion
    //#region GetItemDetails
    const GetItemDetails = (item, index)=>{
        let itemStats=``
        if(item.itemType.split("/")[0]=="Weapons"){
            itemStats+= item.attack.type.physical>0 ? `<p class="itemStat">Physical damage: ${FormatNumber(item.attack.type.physical)}</p>` :""
            itemStats+= item.attack.type.magic>0 ? `<p class="itemStat">Magic damage: ${FormatNumber(item.attack.type.magic)}</p>` :""
            itemStats+= item.attack.element.fire>0 ? `<p class="itemStat">Fire damage: ${FormatNumber(item.attackelement.fire)}</p>` :""
            itemStats+= item.attack.element.water>0 ? `<p class="itemStat">Water damage: ${FormatNumber(item.attack.element.water)}</p>` :""
            itemStats+= item.attack.element.air>0 ? `<p class="itemStat">Air damage ${FormatNumber(item.attack.element.air)}</p>` :""
            itemStats+= item.attack.element.earth>0 ? `<p class="itemStat">Earth damage ${FormatNumber(item.attack.element.earth)}</p>` :""
        }
        return `    
            <span class="itemMain">
                <p class="itemName ">${item.name}</p>
                <p class="itemType">${item.itemType}</p>
            </span>
            ${itemStats}
            <div class="itemActions">
                <div class="interactable itemAction" id="item${index}Equip">Equip</div>
                <div class="interactable itemAction" id="item${index}Delete">Delete</div>
            </div>
        `
    }
    //#endregion
    //#region EquipItem
    const EquipItem = (index)=>{
        let item=player.stats.inventory[index]
        let itemTypes=item.itemType.split("/")
        if(itemTypes[0]=="Weapons"){
            $(`#storedItem${index}Description`).addClass("hiddenPart")
            let htmltemp=$(`#itemSlotWeapon`).html()            
            $(`#itemSlotWeapon`).html($(`#itemSlot${index}`).html())
            $(`#itemSlot${index}`).html(htmltemp)
            let itemTemp=item
            player.stats.inventory[index]=player.stats.gear.weapon
            player.stats.gear.weapon=itemTemp
        }
        CalculatePlayerStats()
    }
    //#endregion
    //#region DeleteItem
    const DeleteItem = (index)=>{
        $(`#itemSlot${index}`).html(``)
        player.stats.inventory[index]={}
        CalculatePlayerStats()
    }
    //#endregion
    //#region ToggleAutoDelete
    const ToggleAutoDelete = (index)=>{
        player.stats.floorStats[player.stats.currentFloor-1].autoDeletes[index] = !player.stats.floorStats[player.stats.currentFloor-1].autoDeletes[index]
        if(player.stats.floorStats[player.stats.currentFloor-1].autoDeletes[index]){
            $(`#autoDeleteItem${index}`).removeClass("inactiveAutoDelete")
            $(`#autoDeleteItem${index}`).addClass("activeAutoDelete")
        }
        else{
            $(`#autoDeleteItem${index}`).addClass("inactiveAutoDelete")
            $(`#autoDeleteItem${index}`).removeClass("activeAutoDelete")
        }
        
    }
    //#endregion
    //#region UpdateInventoryView
    const UpdateInventoryView=()=>{

    }
    //#endregion
    //#region CalculatePlayerStats
    const CalculatePlayerStats=()=>{
        CalculatePlayerDamages()
        CalculatePlayerDefenses()
        CalculatePlayerMisc()
    }
    //#endregion
    //#region CalculatePlayerDamages
    const CalculatePlayerDamages=()=>{
        playerStatsCalculated.attack.type.physical= 
            player.stats.gear.weapon.attack.type.physical
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.type.physical)
        
        playerStatsCalculated.attack.type.magic= 
            player.stats.gear.weapon.attack.type.magic
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.type.magic)
        
        playerStatsCalculated.attack.element.fire= 
            player.stats.gear.weapon.attack.element.fire
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.element.fire)
        
        playerStatsCalculated.attack.element.water= 
            player.stats.gear.weapon.attack.element.water
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.element.water)
            
        playerStatsCalculated.attack.element.air= 
            player.stats.gear.weapon.attack.element.air
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.element.air)
            
        playerStatsCalculated.attack.element.earth= 
            player.stats.gear.weapon.attack.element.earth
            + (player.stats.gear.offhand.attack == undefined ? 0 : player.stats.gear.offhand.attack.element.earth)
    }
    //#endregion
    //#region CalculatePlayerDefenses
    const CalculatePlayerDefenses=()=>{
        playerStatsCalculated.defense.type.absolute=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.type.absolute)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.type.absolute)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.type.absolute)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.type.absolute)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.type.absolute)
        
        playerStatsCalculated.defense.type.relative=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.type.relative)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.type.relative)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.type.relative)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.type.relative)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.type.relative)
    
        playerStatsCalculated.defense.element.fire.absolute=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.fire.absolute)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.fire.absolute)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.fire.absolute)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.fire.absolute)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.fire.absolute)
        
        playerStatsCalculated.defense.element.fire.relative=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.fire.relative)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.fire.relative)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.fire.relative)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.fire.relative)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.fire.relative)
            
        playerStatsCalculated.defense.element.water.absolute=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.water.absolute)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.water.absolute)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.water.absolute)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.water.absolute)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.water.absolute)
        
        playerStatsCalculated.defense.element.water.relative=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.water.relative)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.water.relative)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.water.relative)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.water.relative)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.water.relative)
            
        playerStatsCalculated.defense.element.air.absolute=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.air.absolute)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.air.absolute)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.air.absolute)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.air.absolute)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.air.absolute)
        
        playerStatsCalculated.defense.element.air.relative=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.air.relative)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.air.relative)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.air.relative)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.air.relative)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.air.relative)
            
        playerStatsCalculated.defense.element.earth.absolute=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.earth.absolute)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.earth.absolute)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.earth.absolute)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.earth.absolute)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.earth.absolute)
        
        playerStatsCalculated.defense.element.earth.relative=
            (player.stats.gear.armor.helmet.type == undefined ? 0 : player.stats.gear.armor.helmet.element.earth.relative)
            +(player.stats.gear.armor.chestplate.type == undefined ? 0 : player.stats.gear.armor.chestplate.element.earth.relative)
            +(player.stats.gear.armor.leggings.type == undefined ? 0 : player.stats.gear.armor.leggings.element.earth.relative)
            +(player.stats.gear.armor.boots.type == undefined ? 0 : player.stats.gear.armor.boots.element.earth.relative)
            +(player.stats.gear.offhand.defense == undefined ? 0 : player.stats.gear.offhand.defense.element.earth.relative)
    }
    //#endregion
    //#region CalculatePlayerMisc
    const CalculatePlayerMisc = ()=>{
        playerStatsCalculated.maxHealth = 100
            *(player.stats.gear.armor.helmet.misc == undefined ? 1 : player.stats.gear.armor.helmet.misc.maxHealthMultiplier)
            *(player.stats.gear.armor.chestplate.misc == undefined ? 1 : player.stats.gear.armor.chestplate.misc.maxHealthMultiplier)
            *(player.stats.gear.armor.leggings.misc == undefined ? 1 : player.stats.gear.armor.leggings.misc.maxHealthMultiplier)
            *(player.stats.gear.armor.boots.misc == undefined ? 1 : player.stats.gear.armor.boots.misc.maxHealthMultiplier)
            *(player.stats.gear.offhand.misc == undefined ? 1 : player.stats.gear.offhand.misc.maxHealthMultiplier)
            
        playerStatsCalculated.misc.attackSpeed = 1
            +(player.stats.gear.weapon.misc == undefined ? 0 : player.stats.gear.weapon.misc.attackSpeed)
            +(player.stats.gear.offhand.misc == undefined ? 0 : player.stats.gear.offhand.misc.attackSpeed)

        playerStatsCalculated.misc.criticalChance = 0
            +(player.stats.gear.weapon.misc == undefined || player.stats.gear.weapon.misc.criticalChance==undefined ? 0 : player.stats.gear.weapon.misc.criticalChance)
            +(player.stats.gear.offhand.misc == undefined ? 0 : player.stats.gear.offhand.misc.criticalChance)

        
        
        playerStatsCalculated.misc.criticalDamageMult = 2
            +(player.stats.gear.weapon.misc == undefined || player.stats.gear.weapon.misc.criticalDamageMult==undefined ? 0 : player.stats.gear.weapon.misc.criticalDamageMult)
            +(player.stats.gear.offhand.misc == undefined ? 0 : player.stats.gear.offhand.misc.criticalDamageMult)

        playerStatsCalculated.misc.accuracy = 100 //TODO: change based on weapon type
        playerStatsCalculated.misc.evasion= 0 //TODO: change based on armor weight

        playerStatsCalculated.misc.reflectChance = 0
            +(player.stats.gear.armor.helmet.misc == undefined ? 0 : player.stats.gear.armor.helmet.misc.reflectChance)
            +(player.stats.gear.armor.chestplate.misc == undefined ? 0 : player.stats.gear.armor.chestplate.misc.reflectChance)
            +(player.stats.gear.armor.leggings.misc == undefined ? 0 : player.stats.gear.armor.leggings.misc.reflectChance)
            +(player.stats.gear.armor.boots.misc == undefined ? 0 : player.stats.gear.armor.boots.misc.reflectChance)
            +(player.stats.gear.offhand.misc == undefined ? 0 : player.stats.gear.offhand.misc.reflectChance)

        playerStatsCalculated.misc.regeneration = 0
            +(player.stats.gear.armor.helmet.misc == undefined ? 0 : player.stats.gear.armor.helmet.misc.regeneration)
            +(player.stats.gear.armor.chestplate.misc == undefined ? 0 : player.stats.gear.armor.chestplate.misc.regeneration)
            +(player.stats.gear.armor.leggings.misc == undefined ? 0 : player.stats.gear.armor.leggings.misc.regeneration)
            +(player.stats.gear.armor.boots.misc == undefined ? 0 : player.stats.gear.armor.boots.misc.regeneration)
            +(player.stats.gear.offhand.misc == undefined ? 0 : player.stats.gear.offhand.misc.regeneration)
    }
    //#endregion
    //#region CalculateHitChances
    const CalculateHitChances = ()=>{
        if(playerStatsCalculated.misc.accuracy>=enemyStats.misc.evasion){
            playerStatsCalculated.misc.hitChance=1
        }
        else{
            playerStatsCalculated.misc.hitChance=1 / Math.log2(enemyStats.misc.evasion - playerStatsCalculated.misc.accuracy)
        }

        if(enemyStats.misc.accuracy>=playerStatsCalculated.misc.evasion){
            enemyStats.misc.hitChance=1
        }
        else{
            enemyStats.misc.hitChance=1 / Math.log2(playerStatsCalculated.misc.evasion - enemyStats.misc.accuracy)
        }
    }
    //#endregion
    let canToggleAttack=true
    //#region ToggleAttack
    const ToggleAttack = ()=>{
        if(canToggleAttack){
            playerStatsCalculated.attacking=!playerStatsCalculated.attacking
            totalTimeSincePlayerAttackInMs=0
            totalTimeSinceEnemyAttackInMs=0
            if(playerStatsCalculated.attacking){
                $("#attackToggle").text("Stop fight")
            }
            else{
                $("#attackToggle").text("Start fight")
            }
        }
    }
    //#endregion
    //#region PlayerAttack
    const PlayerAttack = ()=>{
        let SuccessfulHit=Math.random()<=playerStatsCalculated.misc.hitChance
        if(SuccessfulHit){
            let criticalRng=Math.random() <= (playerStatsCalculated.misc.criticalChance/100)
            let critMult=criticalRng ? playerStatsCalculated.misc.criticalDamageMult : 1
            let physicalDamage=(playerStatsCalculated.attack.type.physical * critMult - enemyStats.defense.type.absolute) * (1 - (enemyStats.defense.type.relative / 100))
            let magicDamage=playerStatsCalculated.attack.type.magic * critMult
            let elementalDamage=GetHighestElementalDamage(playerStatsCalculated.attack.element, critMult, enemyStats.defense.element) 
            let enemyReflectRng=Math.random()<=(enemyStats.misc.reflectChance/100)
            if(enemyReflectRng){
                playerStatsCalculated.health -= (physicalDamage + magicDamage + elementalDamage) * 0.8
                enemyStats.health -= (physicalDamage + magicDamage + elementalDamage) * 0.2
            }
            else{
                enemyStats.health -= (physicalDamage + magicDamage + elementalDamage)
            }
        }
    }
    //#endregion
    //#region EnemyAttack
    const EnemyAttack = ()=>{
        let SuccessfulHit=Math.random()<=enemyStats.misc.hitChance
        if(SuccessfulHit){
            let criticalRng=Math.random() <= (enemyStats.misc.criticalChance/100)
            let critMult=criticalRng ? enemyStats.misc.criticalDamageMult : 1
            let physicalDamage=(enemyStats.attack.type.physical * critMult - playerStatsCalculated.defense.type.absolute) * (1 - (playerStatsCalculated.defense.type.relative / 100))
            let magicDamage=enemyStats.attack.type.magic * critMult
            let elementalDamage=GetHighestElementalDamage(enemyStats.attack.element, critMult, playerStatsCalculated.defense.element)
            let enemyReflectRng=Math.random()<=(playerStatsCalculated.misc.reflectChance/100)
            if(enemyReflectRng){
                playerStatsCalculated.health -= (physicalDamage + magicDamage + elementalDamage) * 0.2
                enemyStats.health -= (physicalDamage + magicDamage + elementalDamage) * 0.8
            }
            else{
                playerStatsCalculated.health -= (physicalDamage + magicDamage + elementalDamage)
            }
        }
    }
    //#endregion
    //#region KillEnemy
    const KillEnemy = ()=>{
        if(player.stats.floorStats[player.stats.currentFloor-1].BossKilled==false){
            player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled++
            player.stats.coins+=enemyStats.goldReward
            enemyStats.health=enemyStats.maxHealth
            if(enemyStats.isBoss && player.stats.currentFloor==player.stats.floorStats.length){
                UnlockNextFloor()
            }
            else{
                GainDrop(1)
            }
        }
        else{
            let overKill=(Math.abs(enemyStats.health) / enemyStats.maxHealth)
            player.stats.floorStats[player.stats.currentFloor-1].EnemiesKilled+=1 + overKill
            player.stats.coins+=enemyStats.goldReward * (1 + overKill)
            enemyStats.health=enemyStats.maxHealth
            GainDrop((1+overKill))
        }
    }
    //#endregion
    
    
    //#region UnlockNextFloor
    const UnlockNextFloor = ()=>{
        player.stats.floorStats[player.stats.currentFloor-1].BossKilled=true
        let autoDeletes=[]
        let nextFloorItems=floorStuff[`floor${player.stats.currentFloor}`].items
        for (let item in nextFloorItems){
            autoDeletes.push(false)
        }
        player.stats.floorStats.push({
            EnemiesKilled:0,
            BossKilled:false,
            autoDeletes: autoDeletes
        })
        ChangeFloor(player.stats.currentFloor, false)
    }
    //#endregion
    //#region GainDrop
    const GainDrop = (luckMulti)=>{
        let rng=Math.random()*100
        let floorItems=floorStuff[`floor${player.stats.currentFloor}`].items
        let possibbleDrops=[]
        for(let i in floorItems){
            if(floorItems[i].dropChance * luckMulti>=rng){
                possibbleDrops.push(floorItems[i])
            }
        }
        
        if(possibbleDrops.length>0){
            let dropIndex=Math.floor(Math.random()*possibbleDrops.length)
            let floorItemIndex=floorItems.indexOf(possibbleDrops[dropIndex])
            if(!player.stats.floorStats[player.stats.currentFloor-1].autoDeletes[floorItemIndex]){
                AddItemToInventory(possibbleDrops[dropIndex])
            }
        }
        else{
            AddItemToInventory({
                    name:"null",
                    itemType:"null",
                    rarity:"Common",
                    attack:{
                        type:{
                            physical:0,
                            magic:0
                        },
                        element:{
                            fire:0,
                            earth:0,
                            water:0,
                            air:0
                        }
                    },
                    special: "Something broke"
                })
        }
    }
    //#endregion
    //#region AddItemToInventory
    const AddItemToInventory=(item)=>{
        for(let i=0; i<player.stats.inventory.length; i++){
            if(player.stats.inventory[i].name==undefined){
                player.stats.inventory[i]=item
                break;
            }
        }
    }
    //#endregion
    //#region GetHighestElementalDamage
    const GetHighestElementalDamage = (elements, critMult, otherDefense) =>{
        let trueFireDamage=(elements.fire * critMult - otherDefense.fire.absolute) * (1 - (otherDefense.fire.relative / 100))
        let trueWaterDamage=(elements.water * critMult - otherDefense.water.absolute) * (1 - (otherDefense.water.relative / 100))
        let trueAirDamage=(elements.air * critMult - otherDefense.air.absolute) * (1 - (otherDefense.air.relative / 100))
        let trueEarthDamage=(elements.earth * critMult - otherDefense.earth.absolute) * (1 - (otherDefense.earth.relative / 100))
        if(trueFireDamage<=0 && trueWaterDamage<=0 && trueAirDamage<=0 && trueEarthDamage<=0){
            return 0
        }
        if(trueFireDamage>=trueWaterDamage && trueFireDamage>=trueAirDamage && trueFireDamage>=trueEarthDamage){
            return trueFireDamage
        }
        else if(trueWaterDamage>=trueAirDamage && trueWaterDamage>=trueEarthDamage){
            return trueWaterDamage
        }
        else if(trueAirDamage>=trueEarthDamage){
            return trueAirDamage
        }
        return trueEarthDamage
    }
    //#endregion
    //#region Upgrades nav
    $("#upgrades").on("click", ()=>{
        mainMenuIndex=4
        GoToUpgrades()
    })

    const GoToUpgrades = ()=>{
        view.html(`
            <div id="subMenuInView" ${player.options.ui.subMenuShown==false ? 'class="subMenuHidden"' : ""}>
                <div class="subMenuItem selectedSubMenuItem">
                    Upgrades
                </div>
            </div>
            <div class="mainView upgradesView">
                <div id="playerGold">
                    Gold: 1
                </div>
                <div id="hideBoughtUpgrades">
                    ${player.options.ui.hideBoughtUpgrades==false ? "Hide bought upgrades" : "Show bought upgrades"}
                </div>
                <div id="upgradeBoards">
                    <div class="upgradeBoard" id="offensiveUpgrades">
                        <div class="upgradeBoardTitle">
                            Offensive
                        </div>
                        ${ShowOffensiveUpgrades()}
                    </div>
                    <div class="upgradeBoard" id="defensiveUpgrades">
                        <div class="upgradeBoardTitle">
                            Defensive
                        </div>
                        ${ShowDefensiveUpgrades()}
                    </div>
                    <div class="upgradeBoard" id="miscUpgrades">
                        <div class="upgradeBoardTitle">
                            Miscellaneous
                        </div>
                        ${ShowMiscUpgrades()}
                    </div>
                </div>
            </div>
        `)
        AddUpgradesUIEvents()
    }
    //#endregion
    //#region AddUpgradesUIEvents
    const AddUpgradesUIEvents=()=>{
        $("#hideBoughtUpgrades").on("click", ToggleBoughtUpgrades)
        for(let i=0;i<player.stats.upgradesBought.offensive.length; i++){          
            if(player.stats.upgradesBought.offensive[i]==false){
                $(`#offensiveUpgrade${i}`).on("click", ()=>{TryBuyOffensiveUpgrade(i)})
            }
        }
        for(let i=0;i<player.stats.upgradesBought.defensive.length; i++){          
            if(player.stats.upgradesBought.defensive[i]==false){
                $(`#defensiveUpgrade${i}`).on("click", ()=>{TryBuyDefensiveUpgrade(i)})
            }
        }
        for(let i=0;i<player.stats.upgradesBought.misc.length; i++){          
            if(player.stats.upgradesBought.misc[i]==false){
                $(`#miscUpgrade${i}`).on("click", ()=>{TryBuyMiscUpgrade(i)})
            }
        }
    }
    //#region ShowOffensiveUpgrades
    const ShowOffensiveUpgrades = ()=>{
        let upgradesUI=``
        for(let i=0;i<player.stats.upgradesBought.offensive.length; i++){          
            upgrade=upgradeStats.offensive[i]
            if(!(player.stats.upgradesBought.offensive[i]==true && player.options.ui.hideBoughtUpgrades==true)){
                upgradesUI+=`
                    <div class="upgrade interactable ${player.stats.upgradesBought.offensive[i]==true ? "boughtUpgrade" :""}" id="offensiveUpgrade${i}">
                        <div class="upgradeText">    
                            <div class="upgradeTitle">
                                ${upgrade.upgradeName}
                            </div>
                            <div class="upgradeDescription">
                                ${upgrade.upgradeDescription}
                            </div>
                        </div>
                        <div class="upgradeCost" id="offensiveUpgrade${i}Buy">
                            ${FormatNumber(upgrade.upgradeCost)} Gold
                        </div>
                    </div>
                `
            }
        }
        return upgradesUI
    }
    //#endregion
    //#region ShowDefensiveUpgrades
    const ShowDefensiveUpgrades = ()=>{
        let upgradesUI=``
        let upgrade
        for(let i=0;i<player.stats.upgradesBought.defensive.length; i++){
            upgrade=upgradeStats.defensive[i]
            if(!(player.stats.upgradesBought.defensive[i]==true && player.options.ui.hideBoughtUpgrades==true)){
                upgradesUI+=`
                    <div class="upgrade interactable ${player.stats.upgradesBought.defensive[i]==true ? "boughtUpgrade" :""}" id="defensiveUpgrade${i}">
                        <div class="upgradeText">    
                            <div class="upgradeTitle">
                                ${upgrade.upgradeName}
                            </div>
                            <div class="upgradeDescription">
                                ${upgrade.upgradeDescription}
                            </div>
                        </div>
                        <div class="upgradeCost" id="defensiveUpgrade${i}Buy">
                            ${FormatNumber(upgrade.upgradeCost)} Gold
                        </div>
                    </div>
                `
            }
        }
        return upgradesUI
    }
    //#endregion
    //#region ShowMiscUpgrades
    const ShowMiscUpgrades = ()=>{
        let upgradesUI=``
        let upgrade
        for(let i=0;i<player.stats.upgradesBought.misc.length; i++){
            upgrade=upgradeStats.misc[i]            
            if(!(player.stats.upgradesBought.misc[i]==true && player.options.ui.hideBoughtUpgrades==true)){
                upgradesUI+=`
                    <div class="upgrade interactable ${player.stats.upgradesBought.misc[i]==true ? "boughtUpgrade" :""}" id="defensiveUpgrade${i}">
                        <div class="upgradeText">    
                            <div class="upgradeTitle">
                                ${upgrade.upgradeName}
                            </div>
                            <div class="upgradeDescription">
                                ${upgrade.upgradeDescription}
                            </div>
                        </div>
                        <div class="upgradeCost" id="miscUpgrade${i}Buy">
                            ${FormatNumber(upgrade.upgradeCost)} Gold
                        </div>
                    </div>
                `
            }
        }
        return upgradesUI
    }
    //#endregion
    //#region ToggleBoughtUpgrades
    const ToggleBoughtUpgrades = ()=>{
        player.options.ui.hideBoughtUpgrades=!player.options.ui.hideBoughtUpgrades
        GoToUpgrades()
    }
    //#endregion
    //#region TryBuyOffensiveUpgrade
    const TryBuyOffensiveUpgrade=(index)=>{

    }
    //#endregion
    //#region TryBuyDefensiveUpgrade
    const TryBuyDefensiveUpgrade=(index)=>{

    }
    //#endregion
    //#region TryBuyMiscUpgrade
    const TryBuyMiscUpgrade=(index)=>{
        
    }
    //#endregion
    //#region UpdateUpgradesView
    const UpdateUpgradesView = ()=>{
        $("#playerGold").text(`Gold: ${FormatNumber(player.stats.coins)}`)
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

            if(playerStatsCalculated.health<=0){
                ToggleAttack()
                canToggleAttack=false
                setTimeout(() => {
                    canToggleAttack=true   
                }, (10000 / gameSpeed));
            }

            if(enemyStats.health<=0){
                KillEnemy()
            }
        }
        else{
            if(playerStatsCalculated.health<playerStatsCalculated.maxHealth)
                playerStatsCalculated.health+=playerStatsCalculated.maxHealth/500 * gameSpeed
            if(enemyStats.health<enemyStats.maxHealth)
                enemyStats.health+=enemyStats.maxHealth / 250 * gameSpeed 
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
        if(mainMenuIndex==4){
            UpdateUpgradesView()
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
    let mainMenuCallbacks=[GoToSettings, GoToInformation, GoToTower, GoToInventory, GoToUpgrades]
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

            CalculatePlayerStats()

        }
        catch (e) {
            console.log(e);
        }
    };

    const CheckForMissingData = () => {
        if(player.stats.upgradesBought==undefined){
            player.stats.upgradesBought={
                offensive:[false, false, false],
                defensive:[false, false, false],
                misc:[false, false, false]
            }
        }
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
    if(window.innerWidth<600){
        ShowDialogBox("Warning", "This game is not optimized for small screens. <br> Please use a device with a larger screen for the best experience. <br> or use landscape orientation", "Warning")
    }
    GoToTower()    
})