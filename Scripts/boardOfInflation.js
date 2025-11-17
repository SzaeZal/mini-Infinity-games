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
            eyeOfInfinityPosition: -1,
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
    //#region playerStatsCalculated
    let playerStatsCalculated = {
        inTheMiddleOfTurn: false,
        rerolling: false
    }
    //#endregion
    //#region MultiplyPoints
    const MultiplyPoints = (amount) =>{
        if(amount > 1 && amount<10 && player.stats.upgrades.greenBaseDoubler.bought==true){
            player.stats.points *= amount * 2
        }
        else if(!(amount < 1 && player.stats.effects.noRedSquareDivisions.turnsLeft>0)){
            player.stats.points *= amount
        }
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        Save() 
    }
    //#endregion
    //#region OpenShop
    const OpenShop = (uselessParameter) =>{
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
                        ${player.stats.upgrades.greenBaseDoubler.bought==true ? 'Bought' : '1000 points'} 
                    </div>
                </div>
                <div class="shopItem interactable" id="noRedDivisionsOpen">
                    <img class="itemImage" alt="no red divisions icon" src="../Images/BoardOfInflation/noRedDivisionsIcon.png"/>
                    <div class="itemTitle">
                        No red divisions
                    </div>
                    <div id="noRedDivisionsActive">
                        ${player.stats.effects.noRedSquareDivisions.turnsLeft>0 ? `${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left` : '10000 points'} 
                    </div>
                </div>
                <div class="shopItem interactable" id="secondDiceOpen">
                    <img class="itemImage" alt="second dice icon" src="../Images/BoardOfInflation/secondDiceIcon.png"/>
                    <div class="itemTitle">
                        Second dice
                    </div>
                    <div id="secondDiceBought">
                        ${player.stats.upgrades.secondDice.bought==true ? 'Bought' : '100000 points'} 
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
            if(e.button==2 && player.stats.points>=1000){
                PurchaseGreenBaseDoubler()
                $("#greenBaseDoublerBought").text("Bought")
            }
            else{
                ShowGreenBaseDoublerInfo()
            }
        })
        $("#noRedDivisionsOpen").on("mousedown", (e)=>{
            if(e.button==2 && player.stats.points>=10000){
                PurchaseNoRedDivisions()
                $("#noRedDivisionsActive").text("10 turns left")             
            }
            else{
                ShowNoRedDivisionsInfo()
            }
        })
        $("#secondDiceOpen").on("mousedown", (e)=>{
            if(e.button==2 && player.stats.points>=100000){
                PurchaseSecondDice()
                $("#secondDiceBought").text("Bought")             
            }
            else{
                ShowSecondDiceInfo()
            }
        })
    }
    //#endregion
    //#region ShowGreenBaseDoublerInfo
    const ShowGreenBaseDoublerInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Green base doubler
                    </div>
                    <div class="itemDescription">
                        Doubles the base of all green tiles (2 - 4, 4 - 8, 5 - 10)
                    </div>
                    <div id="greenBaseDoublerBought">
                        ${player.stats.upgrades.greenBaseDoubler.bought==true ? 'Bought' : 'Cost: 1000 points'} 
                    </div>
                    <div id="greenBaseDoublerBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenShop)
        $("#greenBaseDoublerBuy").on("click", ()=>{
            if(player.stats.points>=1000 && player.stats.upgrades.greenBaseDoubler.bought==false){
                PurchaseGreenBaseDoubler()
                $("#greenBaseDoublerBought").text("Bought")
            }
        })
    }
    //#endregion
    //#region PurchaseGreenBaseDoubler
    const PurchaseGreenBaseDoubler = ()=>{
        player.stats.points-=1e3
        player.stats.upgrades.greenBaseDoubler.bought=true
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        Save()
    }
    //#endregion
    //#region ShowNoRedDivisionsInfo
    const ShowNoRedDivisionsInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        No red tile divisions
                    </div>
                    <div class="itemDescription">
                        Red tiles don't divide your points for 10 turns
                    </div>
                    <div id="noRedDivisionsActive">
                        ${player.stats.effects.noRedSquareDivisions.turnsLeft>0 ? `${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left<br>Replenish cost: 10000 points` : 'Cost: 10000 points'} 
                    </div>
                    <div id="noRedDivisionsBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenShop)
        $("#noRedDivisionsBuy").on("click", ()=>{
            if(player.stats.points>=10000 && player.stats.effects.noRedSquareDivisions.turnsLeft!=10){
                PurchaseNoRedDivisions()
                $("#noRedDivisionsActive").text("10 turns left")
            }
        })
    }
    //#endregion
    //#region PurchaseNoRedDivisions
    const PurchaseNoRedDivisions = ()=>{
        player.stats.points-=1e4
        player.stats.effects.noRedSquareDivisions.turnsLeft=10
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        $("#noRedSquareDivisions").removeClass("hiddenPart")
        $("#noRedSquareDivisionsDuration").text(`${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left`)
        Save()
    }
    //#endregion
    //#region ShowSecondDiceInfo
    const ShowSecondDiceInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Second Dice
                    </div>
                    <div class="itemDescription">
                        Unlock a second dice, after rolling you can
                        <ul>
                            <li> add the 2 rolled numbers together to move more tiles </li>
                            <li> only use 1 of the 2 rolled numbers (so if you roll a 1 and 6 you can move 1 or 6 or 7 tiles) </li>
                        </ul>
                        BUT a shadow clone of you will appear on the blue tile and will move in the same direction as you are and if it lands on the tile you are on your points will be set to 1. (the blue tile is a safe tile) <br>
                        every turn your dice will roll again and the shadow clone will move the total rolled minus 2 tiles (so if it rolls 2 it won’t move)
                    </div>
                    <div id="secondDiceBought">
                        ${player.stats.upgrades.secondDice.bought==true ? 'Bought' : 'Cost: 100000 points'} 
                    </div>
                    <div id="secondDiceBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenShop)
        $("#secondDiceBuy").on("click", ()=>{
            if(player.stats.points>=1e5 && player.stats.upgrades.secondDice.bought==false){
                PurchaseSecondDice()
                $("#secondDiceBought").text("Bought")
            }
        })
    }
    //#endregion
    //#region PurchaseSecondDice
    const PurchaseSecondDice = ()=>{
        player.stats.points-=1e5
        player.stats.upgrades.secondDice.bought=true
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        Save()
    }
    //#endregion
    //#region  OpenSuperShop
    const OpenSuperShop = (uselessParameter) =>{
        $("#shopBox").html(`
            <div class="shopHeader">
                <div class="shopTitle">
                    Super Shop
                    <div id="closeShop" class="closeDialogBox interactable">&#10005;</div>
                </div>
            </div>
            <div id="shopItems">
                <div class="shopItem interactable" id="lockpickKitOpen">
                    <img class="itemImage" alt="lockpick kit icon" src="../Images/BoardOfInflation/lockpickKitIcon.png"/>
                    <div class="itemTitle">
                        Lockpick kit
                    </div>
                    <div id="lockpickKitActive">
                        ${player.stats.effects.lockpickKit.turnsLeft>0 ? `${player.stats.effects.lockpickKit.turnsLeft} uses left` : '100000 points'} 
                    </div>
                </div>
                <div class="shopItem interactable" id="rerollsOpen">
                    ${
                        player.stats.upgrades.secondDice.bought==true 
                        ? `
                            <img class="itemImage" alt="rerolls icon" src="../Images/BoardOfInflation/rerollsIcon.png"/>
                            <div class="itemTitle">
                                Rerolls
                            </div>
                            <div id="rerollsActive">
                                ${player.stats.effects.rerolls.turnsLeft>0 ? `${player.stats.effects.rerolls.turnsLeft} uses left` : '1 star'} 
                            </div>
                        `
                        :`
                            <img class="itemImage" alt="upgrade locked" src="../Images/BoardOfInflation/lock.png"/>
                            <div class="itemTitle">
                                Locked
                            </div>
                            <div>
                                Buy second dice first 
                            </div>
                        `
                    }
                </div>
                <div class="shopItem interactable" id="antiDiceOpen">
                    ${
                        player.stats.upgrades.secondDice.bought==true 
                        ? `
                            <img class="itemImage" alt="anti dice icon" src="../Images/BoardOfInflation/antiDiceIcon.png"/>
                            <div class="itemTitle">
                                Anti dice
                            </div>
                            <div id="antiDiceBought">
                                ${player.stats.upgrades.antiDice.bought==true ? `Bought` : '3 stars'} 
                            </div>
                        `
                        :`
                            <img class="itemImage" alt="upgrade locked" src="../Images/BoardOfInflation/lock.png"/>
                            <div class="itemTitle">
                                Locked
                            </div>
                            <div>
                                Buy second dice first 
                            </div>
                        `
                    }
                </div>
                <div class="shopItem interactable" id="keyOfInfinityOpen">
                    <img class="itemImage" alt="key of Infinity icon" src="../Images/BoardOfInflation/keyOfInfinityIcon.png"/>
                    <div class="itemTitle">
                        Key of Infinity
                    </div>
                    <div id="keyOfInfinityBought">
                        ${player.stats.effects.keyOfInfinity.turnsLeft>-1 ? 'Escape' : '10 stars'} 
                    </div>
                </div>
            </div>
        `)
        $("#shopBox").removeClass("hiddenPart")
        $("#shopBox").css("border","5px solid gray")
        AddSuperShopUIEvents()
    }
    //#endregion
    //#region AddSuperShopUIEvents
    const AddSuperShopUIEvents = ()=>{
        $("#closeShop").on("click", ()=>{
            $("#shopBox").html(``)
            $("#shopBox").css("border", "none")
        })

        $("#lockpickKitOpen").on("mousedown", (e)=>{
            if(e.button==2 && player.stats.points>=1e5){
                PurchaseLockpickKit()
                $("#lockpickKitActive").text("3 uses left")
            }
            else{
                ShowLockpickKitInfo()
            }
        })

        if(player.stats.upgrades.secondDice.bought==true){
            $("#rerollsOpen").on("mousedown", (e)=>{
                if(e.button==2 && player.stats.stars>=1){
                    PurchaseRerolls()
                    $("#rerollsActive").text("5 uses left")             
                }
                else{
                    ShowRerollsInfo()
                }
            })

            $("#antiDiceOpen").on("mousedown", (e)=>{
                if(e.button==2 && player.stats.stars>=3){
                    PurchaseAntiDice()
                    $("#antiDiceBought").text("Bought")             
                }
                else{
                    ShowAntiDiceInfo()
                }
            })
        }

        $("#keyOfInfinityOpen").on("mousedown", (e)=>{
            if(e.button==2 && player.stats.stars>=10){
                PurchaseKeyOfInfinity()
                $("#keyOfInfinityBought").text("Escape")             
            }
            else{
                ShowKeyOfInfinityInfo()
            }
        })
    }
    //#endregion
    //#region ShowLockpickKitInfo
    const ShowLockpickKitInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Lockpick Kit
                    </div>
                    <div class="itemDescription">
                        you can attempt to lockpick the lock on the board if you are on the star shop tile <br>
                        roll your dice and if you roll a 12 the picking is successful <br>
                        3 uses
                    </div>
                    <div id="lockpickKitActive">
                        ${player.stats.effects.lockpickKit.turnsLeft>0 ? `${player.stats.effects.lockpickKit.turnsLeft} / 3 uses left<br>Replenish cost: 100000 points` : '100000 points'} 
                    </div>
                    <div id="lockpickKitBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenSuperShop)
        $("#lockpickKitBuy").on("click", ()=>{
            if(player.stats.points>=1e5){
                PurchaseLockpickKit()
                $("#lockpickKitActive").html("3 / 3 uses left<br>Replenish cost: 100000 points")
            }
        })
    }
    //#endregion
    //#region PurchaseLockpickKit
    const PurchaseLockpickKit = ()=>{
        player.stats.points-=1e5
        player.stats.effects.lockpickKit.turnsLeft=3
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        $("#lockpickKit").removeClass("hiddenPart")
        $("#lockpickKitDuration").text(`${player.stats.effects.lockpickKit.turnsLeft} uses left`)
        Save()
    }
    //#endregion
    //#region ShowRerollsInfo
    const ShowRerollsInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Rerolls
                    </div>
                    <div class="itemDescription">
                        every turn allows you to reroll a single selected dice <br>
                        if both numbers are selected it will reroll the 1st <br>
                        5 uses
                    </div>
                    <div id="rerollsActive">
                        ${player.stats.effects.rerolls.turnsLeft>0 ? `${player.stats.effects.rerolls.turnsLeft} / 5 uses left<br>Replenish cost: 1 star` : '1 star'} 
                    </div>
                    <div id="rerollsBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenSuperShop)
        $("#rerollsBuy").on("click", ()=>{
            if(player.stats.stars>=1){
                PurchaseRerolls()
                $("#rerollsActive").html("5 / 5 uses left<br>Replenish cost: 1 star")
            }
        })
    }
    //#endregion
    //#region PurchaseRerolls
    const PurchaseRerolls = ()=>{
        player.stats.stars-=1
        player.stats.effects.rerolls.turnsLeft=5
        $("#playerStars").text(`Stars: ${FormatNumber(player.stats.stars)}`)
        $("#rerolls").removeClass("hiddenPart")
        $("#rerollsDuration").text(`${player.stats.effects.rerolls.turnsLeft} uses left`)
        Save()
    }
    //#endregion
    //#region ShowAntiDiceInfo
    const ShowAntiDiceInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Anti dice
                    </div>
                    <div class="itemDescription">
                        if you choose to only use 1 rolled number     
                        move back the shadow clone by the other dice number (if you roll 3 and 5 and only want to move 3 squares the shadow clone will move back 5 squares)
                    </div>
                    <div id="antiDiceBought">
                        ${player.stats.upgrades.antiDice.bought==true ? `Bought` : '3 stars'} 
                    </div>
                    <div id="antiDiceBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenSuperShop)
        $("#antiDiceBuy").on("click", ()=>{
            if(player.stats.stars>=3){
                PurchaseAntiDice()
                $("#antiDiceBought").text("Bought")
            }
        })
    }
    //#endregion
    //#region PurchaseAntiDice
    const PurchaseAntiDice = ()=>{
        player.stats.stars-=3
        player.stats.upgrades.antiDice.bought=true
        $("#playerStars").text(`Stars: ${FormatNumber(player.stats.stars)}`)
        Save()
    }
    //#endregion
    //#region ShowKeyOfInfinityInfo
    const ShowKeyOfInfinityInfo = ()=>{
        $("#shopItems").html(`
            <div class="shopItemDetailed">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" viewBox="0 -960 960 960"  fill="#e3e3e3" id="shopGoBack">
                    <path d="M400-240 160-480l241-241 43 42-169 169h526v60H275l168 168-43 42Z"/>
                </svg>
                <div class="shopItem">
                    <div class="itemTitle">
                        Key of Infinity
                    </div>
                    <div class="itemDescription">
                        unlocks the lock next to the star shop <br>
                        but you have 10 turns to land the tile of infinity before the board destroys itself
                    </div>
                    <div id="keyOfInfinityBought">
                        ${player.stats.effects.keyOfInfinity.turnsLeft>-1 ? `Escape` : '10 stars'} 
                    </div>
                    <div id="keyOfInfinityBuy" class="itemBuy">
                        Buy
                    </div>
                </div>
            </div>
        `)
        $("#shopGoBack").on("click", OpenSuperShop)
        $("#keyOfInfinityBuy").on("click", ()=>{
            if(player.stats.stars>=10 && player.stats.effects.keyOfInfinity.turnsLeft==-1){
                PurchaseKeyOfInfinity()
                $("#keyOfInfinityBought").text("Escape")
            }
        })
    }
    //#endregion
    //#region PurchaseKeyOfInfinity
    const PurchaseKeyOfInfinity = ()=>{
        player.stats.stars-=10
        player.stats.effects.keyOfInfinity.turnsLeft=10
        player.stats.eyeOfInfinityUnlocked=true
        $("#eyeOfInfinityLock").addClass("hiddenPart")
        $("#playerStars").text(`Stars: ${FormatNumber(player.stats.stars)}`)
        $("#keyOfInfinity").removeClass("hiddenPart")
        $("#keyOfInfinityDuration").text(`${player.stats.effects.keyOfInfinity.turnsLeft} turns left`)
        Save()
    }
    //#endregion
    //#region OpenStarShop
    const OpenStarShop = (uselessParameter) =>{
        $("#shopBox").html(`
            <div class="shopHeader">
                <div class="shopTitle">
                    Super Shop
                    <div id="closeShop" class="closeDialogBox interactable">&#10005;</div>
                </div>
            </div>
            <div id="shopItems">
                <div class="shopItem">
                    <div class="itemTitle">
                        Star
                    </div>
                    <div class="itemDescription">
                        requires 10000 points <br>
                        buying a star will divide your points by 50
                    </div>
                    <div class="starShopRow">
                        <div id="starBuy1" class="itemBuy">
                            Buy 1
                        </div>
                        <div id="starBuyMax" class="itemBuy">
                            Buy Max
                        </div>
                    </div>
                </div>
            </div>
        `)
        $("#shopBox").removeClass("hiddenPart")
        $("#shopBox").css("border","5px solid gray")
        AddStarShopUIEvents()
    }
    //#endregion
    //#region AddStarShopUIEvents
    const AddStarShopUIEvents = ()=>{
        $("#closeShop").on("click", ()=>{
            $("#shopBox").html(``)
            $("#shopBox").css("border", "none")
        })

        $("#starBuy1").on("mousedown", (e)=>{
            if(player.stats.points>=1e4){
                PurchaseStar()
            }
        })

        $("#starBuyMax").on("mousedown", (e)=>{
            while(player.stats.points>=1e4){
                PurchaseStar()
            }
        })
    }
    //#endregion
    //#region PurchaseStar
    const PurchaseStar = ()=>{
        player.stats.stars++
        player.stats.points /= 50
        $("#playerPoints").text(`Points: ${FormatNumber(player.stats.points)}`)
        $("#playerStars").text(`Stars: ${FormatNumber(player.stats.stars)}`)
        Save()
    }
    //#endregion
    //#region DoBet
    DoBet = (uselessParameter) =>{
        $("#shopBox").html(`
            <div class="betContainer">
                <div class="diceContainer" id="gamble">
                    <div id="betResults">-</div>
                    <div class="interactable">ROLL DICE</div>
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
    //#region Eye of Infinity Positions
    let eyeOfInfinityPositions = [
        {
            circle:{
                x:1048,
                y:250
            },
            text:{
                x: 1040,
                y: 260
            },
        },
        {
            circle:{
                x:973,
                y:250
            },
            text:{
                x: 965,
                y: 260
            },
        },
        {
            circle:{
                x:958,
                y:305
            },
            text:{
                x: 950,
                y: 315
            },
        },
        {
            circle:{
                x:900,
                y:325
            },
            text:{
                x: 892,
                y: 335
            },
        },
        {
            circle:{
                x:842,
                y:305
            },
            text:{
                x: 834,
                y: 315
            },
        },
        {
            circle:{
                x:825,
                y:250
            },
            text:{
                x: 817,
                y: 260
            },
        },
        {
            circle:{
                x:842,
                y:195
            },
            text:{
                x: 834,
                y: 205
            },
        },
        {
            circle:{
                x:900,
                y:175
            },
            text:{
                x: 892,
                y: 185
            },
        },
        {
            circle:{
                x:958,
                y:195
            },
            text:{
                x: 950,
                y: 205
            },
        }
    ]
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
                                    ${player.stats.effects.noRedSquareDivisions.turnsLeft>0 ? ` <li>No Red Tile Divisions: ${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left </li>` : ""}
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
                    <div class="diceResultsContainer">
                        <div id="diceResults">-</div>
                    </div>
                    <div class="playerInfoContainer">
                        <div id="playerPoints">Points: ${FormatNumber(player.stats.points)}</div>
                        <div id="playerStars">Stars: ${FormatNumber(player.stats.stars)}</div>
                    </div>
                    <div id="rollDice" class="diceContainer interactable">Next Turn</div>
                    <div class="playerEffects hiddenPart" id="playerEffects">
                        <div class="playerEffectsColumn">
                            <div class="effectItem hiddenPart" id="noRedSquareDivisions">
                                <div class="effectName">
                                    No Red Tile Divisions
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
                            ${player.stats.eyeOfInfinityUnlocked==false ? `
                                <image x="1012" y="215" width="72px" height="72px" href="../Images/BoardOfInflation/lock.png" id="eyeOfInfinityLock"/>
                                ` : ``
                            }
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
        if(player.stats.upgrades.secondDice.bought==true){
            $("#shadowPositionIndicator").removeClass("hiddenPart")
            MoveShadowToTile(playerPositions[player.shadowClone.position])
        }
        $("#rollDice").on("click", DoTurn)
        CheckForSpecialTiles()
        CheckForActiveEffects()
    }
    //#endregion
    let rolledNumber0Selected=true
    let rolledNumber1Selected=true
    //#region DoTurn
    const DoTurn = ()=>{
        if(playerStatsCalculated.inTheMiddleOfTurn==false){
            playerStatsCalculated.inTheMiddleOfTurn=true
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
                    SubtractTurnFromActiveEffects()
                    CheckForActiveEffects()
                    Save()
                    playerStatsCalculated.inTheMiddleOfTurn=false
                }, 1000 )
            }
            else{
                RollDoubleDice("dice")
                setTimeout(() => {
                    rolledNumber0Selected=true
                    rolledNumber1Selected=true
                    $(`#diceResults`).html(`
                        <div id="rolledNumber0Results" class="interactable rolledNumberSelect selectedRolledNumber">
                            ${rolledNumbers[0]} 
                        </div>
                        - 
                        <div id="rolledNumber1Results" class="interactable rolledNumberSelect selectedRolledNumber">
                            ${rolledNumbers[1]}
                        </div>
                        <br>
                        <div id="selectNumbers" class="interactable">
                            Select
                        </div>
                        ${player.stats.effects.rerolls.turnsLeft>0
                            ? `
                                <div id="reroll" class="interactable">
                                    Reroll
                                </div>
                            `
                            : ""
                        }
                    `)

                    AddNumberSelectingUIEvents()

                    AddSelectNumbersUIEvent()                    

                    if(player.stats.effects.rerolls.turnsLeft>0){
                        $("#reroll").on("click", ()=>{
                            if(rolledNumber0Selected){
                                player.stats.effects.rerolls.turnsLeft--
                                $("#rerollsDuration").text(`${player.stats.effects.rerolls.turnsLeft} uses left`)
                                playerStatsCalculated.rerolling=true
                                $("#reroll").addClass("hiddenPart")
                                RollSingleDice("rolledNumber0")
                                setTimeout(()=>{playerStatsCalculated.rerolling=false}, 600)
                            }
                            else if (rolledNumber1Selected){
                                player.stats.effects.rerolls.turnsLeft--
                                $("#rerollsDuration").text(`${player.stats.effects.rerolls.turnsLeft} uses left`)
                                playerStatsCalculated.rerolling=true
                                $("#reroll").addClass("hiddenPart")
                                RollOnlySecondDice()
                                setTimeout(()=>{playerStatsCalculated.rerolling=false}, 600)
                            }
                            else{
                                ShowNotification("warning", "Please Select at least 1 number", "Warning")
                            }
                        })
                    }
                }, 600);     
            }
        }
    }
    //#endregion
    //#region AddNumberSelectingUIEvents
    const AddNumberSelectingUIEvents = ()=>{
        $("#rolledNumber0Results").on("click", ()=>{
            if(rolledNumber0Selected == true){
                rolledNumber0Selected = false
                $("#rolledNumber0Results").removeClass("selectedRolledNumber")
            }
            else{
                rolledNumber0Selected = true
                $("#rolledNumber0Results").addClass("selectedRolledNumber")    
            }
        })

        $("#rolledNumber1Results").on("click", ()=>{
            if(rolledNumber1Selected == true){
                rolledNumber1Selected = false
                $("#rolledNumber1Results").removeClass("selectedRolledNumber")
            }
            else{
                rolledNumber1Selected = true
                $("#rolledNumber1Results").addClass("selectedRolledNumber")    
            }
        })
    }
    //#endregion
    //#region AddSelectNumbersUIEvent
    const AddSelectNumbersUIEvent = ()=>{
        $("#selectNumbers").on("click", ()=>{
            if((rolledNumber0Selected || rolledNumber1Selected) && !playerStatsCalculated.rerolling){
                let positionsToMove=0
                let shadowPositionsToMove=0
                positionsToMove += rolledNumber0Selected ? rolledNumbers[0] : 0
                shadowPositionsToMove += rolledNumber0Selected ? 0 : rolledNumbers[0]
                positionsToMove += rolledNumber1Selected ? rolledNumbers[1] : 0
                shadowPositionsToMove += rolledNumber1Selected ? 0 : rolledNumbers[1]
                player.stats.position +=positionsToMove
                if( player.stats.position>=playerPositions.length){
                    player.stats.position -=playerPositions.length
                }
                if(player.stats.upgrades.antiDice.bought==true){
                    player.shadowClone.position-=shadowPositionsToMove
                    if( player.shadowClone.position<0){
                        player.shadowClone.position +=playerPositions.length
                    }
                    MoveShadowToTile(playerPositions[player.shadowClone.position])
                    if(player.stats.position == player.shadowClone.position && player.stats.position != 0 && player.stats.position != 18){
                        player.stats.points=1
                        ShowNotification("Shadow clone", "Shadow clone reset your points", "ShadowClone")
                    }
                }
                MoveToTile(playerPositions[player.stats.position])
                RollDoubleDice("dice")
                setTimeout(() => {
                    player.shadowClone.position += rolledNumbers[0] + rolledNumbers[1] - 2
                    if( player.shadowClone.position>=playerPositions.length){
                        player.shadowClone.position -=playerPositions.length
                    }
                    MoveShadowToTile(playerPositions[player.shadowClone.position])
                    if(player.stats.position == player.shadowClone.position && player.stats.position != 0 && player.stats.position != 18){
                        player.stats.points=1
                        ShowNotification("Shadow clone", "Shadow clone reset your points", "ShadowClone")
                    }
                    playerPositions[player.stats.position].callback.name(playerPositions[player.stats.position].callback.parameter)
                    CheckForSpecialTiles()
                    SubtractTurnFromActiveEffects()
                    CheckForActiveEffects()
                    Save() 
                    playerStatsCalculated.inTheMiddleOfTurn=false
                }, 750);
            }
            else{
                ShowNotification("warning", "Please Select at least 1 number", "Warning")
            }
        })
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

    const RollOnlySecondDice = (divName)=>{
        for(let i=0; i<10; i++){
            setTimeout(()=>{
                rolledNumbers[1]=1 + Math.floor(Math.random() * 6)
                $(`#rolledNumber1Results`).text(`${rolledNumbers[1]}`)
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
        if((player.stats.eyeOfInfinityUnlocked==true && player.stats.position > 27) || player.stats.eyeOfInfinityPosition>=0){
            if(player.stats.eyeOfInfinityPosition==-1){
                player.stats.eyeOfInfinityPosition=player.stats.position - 28
                player.stats.position=0
            }
            else{
                player.stats.eyeOfInfinityPosition += player.stats.position
                player.stats.position=0
            }

            if(player.stats.eyeOfInfinityPosition >= eyeOfInfinityPositions.length){
                player.stats.eyeOfInfinityPosition -= eyeOfInfinityPositions.length -1
            }
            position = eyeOfInfinityPositions[player.stats.eyeOfInfinityPosition]
            $("#playerPositionIndicator").html(`
                <circle r="30" cx="${position.circle.x}" cy="${position.circle.y}" fill="rgba(255, 255, 255, 0.5)" stroke="white"/>
                <text x="${position.text.x}" y="${position.text.y}" font-size="35">p</text>
            `)
            if(player.stats.eyeOfInfinityPosition == 5){
                ShowDialogBox("Eye of Infinity", "You have reached the Eye of Infinity's special tile!", "Warning")
            }
        }
        else{      
            $("#playerPositionIndicator").html(`
                <circle r="30" cx="${position.circle.x}" cy="${position.circle.y}" fill="rgba(255, 255, 255, 0.5)" stroke="white"/>
                <text x="${position.text.x}" y="${position.text.y}" font-size="35">p</text>
            `)
        }
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
    //#region AttemptLockpick
    const AttemptLockpick = ()=>{
        if(player.stats.upgrades.secondDice.bought==true){
            RollDoubleDice("lockpick")
            setTimeout(()=>{
                //temp
                rolledNumbers[0]=6
                rolledNumbers[1]=6
                if(rolledNumbers[0] + rolledNumbers[1] == 12){
                    $("#lockpickResults").text(`Success!`)
                    player.stats.eyeOfInfinityUnlocked=true
                    $("#eyeOfInfinityLock").addClass("hiddenPart")
                    setTimeout(()=>{
                        $("#lockpickAttempt").addClass(`hiddenPart`)
                    }, 2000)
                    Save()
                }
                else{
                    player.stats.effects.lockpickKit.turnsLeft--
                    CheckForActiveEffects()
                    $("#lockpickResults").text(`Failed`)
                    setTimeout(()=>{
                        $("#lockpickAttempt").addClass(`hiddenPart`)
                    }, 1000)
                    Save()
                }   
            }, 1500);
        }
        else{
            player.stats.effects.lockpickKit.turnsLeft--
            CheckForActiveEffects()
            $("#lockpickResults").text(`Critical Fail`)
            setTimeout(()=>{
                $("#lockpickAttempt").addClass(`hiddenPart`)
            }, 1000)
            Save()
        }
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
                <text x="220" y="240" font-size="35" class="interactable">Open super </text>
                <text x="260" y="280" font-size="35" class="interactable">shop</text>
            `)
            $("#openShopButton").on("click", OpenSuperShop)
        }
        else if(player.stats.position == 27){
            $("#openShopButton").removeClass("hiddenPart")
            $("#openShopButton").html(`
                <g id="openStarShopButton" class="interactable">
                    <rect width="200" height="100" x="200" y="175" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)" class="interactable"/>
                    <text x="230" y="215" font-size="35" class="interactable">Open star</text>
                    <text x="260" y="260" font-size="35" class="interactable">shop</text>
                </g>
                ${player.stats.effects.lockpickKit.turnsLeft>0 && player.stats.eyeOfInfinityUnlocked==false
                    ? `
                    <g id="lockpickAttempt" class="interactable">
                        <rect width="200" height="50" x="200" y="285" rx="20" ry="20" stroke="gray" fill="rgba(128, 128, 128, 0.5)" class="interactable"/>
                        <text x="240" y="322" font-size="35" class="interactable" id="lockpickResults">Lockpick</text>
                    </g>
                    `
                    : ""
                }
            `)
            $("#openStarShopButton").on("click", OpenStarShop)
            $("#lockpickAttempt").on("click", AttemptLockpick)
        }
        else{
            $("#openShopButton").addClass("hiddenPart")
        }
    }
    //#endregion
    //#region CheckForActiveEffects
    const CheckForActiveEffects = ()=>{
        if(player.stats.effects.noRedSquareDivisions.turnsLeft>0
            || player.stats.effects.keyOfInfinity.turnsLeft!=-1
            || player.stats.effects.lockpickKit.turnsLeft>0
            ||  player.stats.effects.rerolls.turnsLeft>0 )
        {
            $("#playerEffects").removeClass("hiddenPart")
            if(player.stats.effects.noRedSquareDivisions.turnsLeft>0){
                $("#noRedSquareDivisions").removeClass("hiddenPart")
                $("#noRedSquareDivisionsDuration").text(`${player.stats.effects.noRedSquareDivisions.turnsLeft} turns left`)
            }
            else{
                $("#noRedSquareDivisions").addClass("hiddenPart")
            }

            if(player.stats.effects.keyOfInfinity.turnsLeft!=-1){
                $("#keyOfInfinity").removeClass("hiddenPart")
                $("#keyOfInfinityDuration").text(`${player.stats.effects.keyOfInfinity.turnsLeft} turns left`)
            }

            if(player.stats.effects.lockpickKit.turnsLeft>0){
                $("#lockpickKit").removeClass("hiddenPart")
                $("#lockpickKitDuration").text(`${player.stats.effects.lockpickKit.turnsLeft} uses left`)
            }
            else{
                $("#lockpickKit").addClass("hiddenPart")
            }

            if(player.stats.effects.rerolls.turnsLeft>0){
                $("#rerolls").removeClass("hiddenPart")
                $("#rerollsDuration").text(`${player.stats.effects.rerolls.turnsLeft} uses left`)
            }
            else{
                $("#rerolls").addClass("hiddenPart")
            }
        }
        else{
            $("#playerEffects").addClass("hiddenPart")
        }
    }
    //#endregion
    //#region SubtractTurnFromActiveEffects
    const SubtractTurnFromActiveEffects = ()=>{
        if(player.stats.effects.noRedSquareDivisions.turnsLeft>0){
            player.stats.effects.noRedSquareDivisions.turnsLeft--
        }

        if(player.stats.effects.keyOfInfinity.turnsLeft!=-1){
            player.stats.effects.keyOfInfinity.turnsLeft--
            if(player.stats.effects.keyOfInfinity.turnsLeft==0){
                HardReset()
            }
        }
    }
    //#endregion
    //#region FormatNumber
    const FormatNumber= (numberToFormat)=>{
        let result = Math.floor(numberToFormat).toString();
        if(numberToFormat==Infinity){
            return "Infinity"
        }
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
})