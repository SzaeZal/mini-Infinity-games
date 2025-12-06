$(()=>{
    $("#goBackToHub").on("click", ()=>{
        window.location.href="../index.html"
    })
    //#region player
    let player={
        options:{
            ui:{
                theme: "Dark",
                subMenuShown: true,
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
                        mini-Infinity-games
                    </div>
                    <div class="gameVersion">
                        V0.9: The Experiments
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
                            V0.9: The Experiments
                        </div>
                        <div class="changelogChanges">
                            <ul>
                                <li>Initial release</li>
                                <li>Added Replicanti Incremental</li>
                                <li>Added Cards of Infinity</li>
                                <li>Added Board of Inflation</li>
                                <li>Added Infinite Gates</li>
                                <li>Added ...</li>  
                                <li>Wrote over 15k lines of code</li>
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
    //#region games
    const games=[
        `
            <div class="game" id="game0">
                <h2 class="gameTitle">
                    Hub of Infinities
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        Welcome to the Hub of Infinities! This is the lobby for all 5 minigames that I've made as a university project
                        I call mini - Infinity - games. Every single minigame and this hub were made with the Integer limit (2<sup>1024</sup>)
                        having some sort of role, mostly it being the goal, while also making the gameplays different. This hub and the 5 minigames
                        were made in 2.5 months with progress every / every-other day being made. In this time I've done many experimental features
                        - that I hope to reuse in my future larger scale projects - that you will see in all 5 games. I hope you like the minigames
                        and most importantly, have fun. 
                    </p>
                </div>
            </div>
        `,
        `
            <div class="game" id="game1">
                <h2 class="gameTitle">
                    Replicanti Incremental
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        The first minigame in the project. Every second your replicanti doubles that can be spent on 2 buyables:
                        speeding up replicanti gain or higher replicanti multiplier. When your replicanti reaches infinity the 2 
                        buyables reset and your replicanti is set to 1, but you gain a new currency that can be spent on new buyables
                        and upgrades. There is one more layer with new challenges that I won't spoil<br>
                        Endgame: 1e10 eternity
                        <a href="Views/replicantiIncremental.html">Play game</a>
                    </p>
                    <div class="gameImages">
                        <img src="./Images/HubOfInfinities/replicantiIncrementalInfinityTabImage.png" alt="replicanti incremental infinity layer" class="gameImage">
                    </div>
                </div>
            </div>
        `,
        `
            <div class="game" id="game2">
                <h2 class="gameTitle">
                    Cards of Infinity
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        The second minigame in the project. A memory card game where the cards multiply, divide or raise your points
                        the goal being reaching infinity the fastest. Every time cards appear you can only choose a part of those pairs so be strategic about the choices.
                        Currently there are 3 main difficulties each with 3 medals that are revealed from the beginning 
                        (there could be more medals), and a custom difficulty so you can have a harder experience.
                        <a href="Views/cardsOfInfinity.html">Play game</a>
                    </p>
                    <div class="gameImages">
                        <img src="./Images/HubOfInfinities/cardsOfInfinityMain.png" alt="cards of infinity game" class="gameImage">
                    </div>
                </div>
            </div>
        `,
        `
            <div class="game" id="game3">
                <h2 class="gameTitle">
                    Board of Inflation
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        The third minigame in the project. A single player board game where the goal being landing on the infinity marked tile. 
                        The normal tiles multiply or divide your points, and there are a couple of special tiles: shop and super shop allows you 
                        to purchase permanent and temporary upgrades, bet rolls your dice and multiplies your points by the rolled amount divided by 4,
                        star shop allows you to purchase another currency called stars that are used for powerful upgrades.
                        <a href="Views/boardOfInflation.html">Play game</a>
                    </p>
                    <div class="gameImages">
                        <img src="./Images/HubOfInfinities/boardOfInflationMain.png" alt="board of Inflation board" class="gameImage">
                    </div>
                </div>
            </div>
        `,
        `
            <div class="game" id="game4">
                <h2 class="gameTitle">
                    Infinite gates
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        The fourth minigame in the project. Remember the phone game ads where gates come towards the player and you have to beat the enemies at the end?
                        I made a game with that idea and made it insanely hard. As in Cards of Infinity the goal is to reach Infinity in the least amount of gates
                        with 3 difficulties and 1 more planned to be added later. Each difficulty adds harder math problems with the last difficulty having 
                        trigonometric methods appearing on the gates. Good luck with this you'll need it
                        <a href="Views/infiniteGates.html">Play game</a>
                    </p>
                    <div class="gameImages">
                        <img src="./Images/HubOfInfinities/infiniteGatesMain.png" alt="Infinite gates game" class="gameImage">
                    </div>
                </div>
            </div>
        `,
        `
            <div class="game" id="game5">
                <h2 class="gameTitle">
                    Tower of Infinite enemies (currently under development)
                </h2>
                <div class="gameContent">        
                    <p class="gameDescription">
                        The fifth and last minigame in the project. Every floor there are infinite enemies.
                        The floors have a boss that unlocks the next floor. The game has a very complex stat system with different damage types, elements, absolute and 
                        relative defense, elemental defense, along with accuracy and evasion, regeneration, critical chance and critical damage multiplier. There are 9
                        upgrades that you can purchase with gold you get from killing enemies. This project didn't come out as I expected with far too many ideas I had for it
                        that I couldn't create in the 2 weeks that were left before the deadline. I will probably come back and make a remake of this.
                        <a href="Views/towerOfInfiniteEnemies.html">Play game</a>
                    </p>
                    <div class="gameImages">
                        <img src="./Images/HubOfInfinities/towerOfInfiniteEnemiesMain.png" alt="Tower of Infinite Infinite enemies fight" class="gameImage">
                    </div>
                </div>
            </div>
        `
    ]
    //#endregion
    //#region games menu
    $("#gameMenuItem").on("click", ()=>{
        mainMenuIndex=2
        GoToGamesMenu()
    })
    let currentGame=0
    const GoToGamesMenu=()=>{
        view.html(`
            <div id="subMenuInView">
                <div class="subMenuItem selectedSubMenuItem">
                    Main
                </div>
            </div>
            <div class="mainView gamesContainer">
                <div class="gameBox" id="games">
                    ${games[currentGame]}
                </div>
                <div class="scrollBar">
                    <div class="scrollBarItem interactable" id="scrollUpOnce">
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#e3e3e3"><path d="M480-525 291-336l-51-51 240-240 240 240-51 51-189-189Z"/></svg>
                    </div>
                    <div class="scrollBarItem currentScrollItem interactable" id="scrollBarItemGame0">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollBarItemGame1">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollBarItemGame2">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollBarItemGame3">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollBarItemGame4">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollBarItemGame5">
                    </div>
                    <div class="scrollBarItem interactable" id="scrollDownOnce">
                        <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#e3e3e3"><path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z"/></svg>                        
                    </div>
                </div>
            </div>
        `)
        AddGamesMenuUIEvents()  
        $(`#game${currentGame}`).addClass("currentGame")
    }
    //#endregion
    //#region  AddGamesMenuUIEvents
    const AddGamesMenuUIEvents = ()=>{
        $("#scrollUpOnce").on("click", ScrollUpOnce)
        $("#scrollDownOnce").on("click", ScrollDownOnce)

        for (let i=0 ; i<games.length; i++){
            $(`#scrollBarItemGame${i}`).on("click", ()=>{ScrollBarItemGameClick(i)})
        }
    }
    //#endregion
    //#region ScrollBarItemGameClick
    const ScrollBarItemGameClick = (index)=>{
        let previous=currentGame
        currentGame=index
        ShowNextGame(previous, currentGame)
    }
    //#endregion
    //#region ScrollUpOnce
    const ScrollUpOnce = ()=>{
        let previous=currentGame
        currentGame--
        if(currentGame<0){
            currentGame=games.length-1
        }
        ShowNextGame(previous, currentGame)
    }
    //#endregion
    //#region ScrollDownOnce
    const ScrollDownOnce = ()=>{
        let previous=currentGame
        currentGame++
        if(currentGame>=games.length){
            currentGame=0
        }
        ShowNextGame(previous, currentGame)
    }
    //#endregion
    //#region ShowNextGame
    const ShowNextGame=(prev, next)=>{
        $(`#games`).html(games[prev]+games[next])
        $(`#game${prev}`).addClass("previousGame")
        $(`#game${next}`).addClass("nextGame")
        $(`#scrollBarItemGame${prev}`).removeClass("currentScrollItem")
        $(`#scrollBarItemGame${next}`).addClass("currentScrollItem")
    }
    //#endregion
    //#region  saving and loading 
    const Save = () => {
        const playerParsedToJson = JSON.stringify(player);
        let jwt = CreatePartialJWT(playerParsedToJson);
        localStorage.setItem("hubOfInfinitiesSave", jwt);
    };

    const CreatePartialJWT = (payloadInJson) => {
        let payloadInBase64 = btoa(payloadInJson);
        let signatureInBase64 = btoa(JSON.stringify("LeastObviousSignature"));
        let jwt = payloadInBase64 + "." + signatureInBase64;
        return jwt;
    };

    const DecodePartialJwt = () => {
        let jwt = localStorage.getItem("hubOfInfinitiesSave");
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

            SetTheme(player.options.ui.theme);
        
        }
        catch (e) {
            console.log(e);
        }
    };
    
    //#endregion
    mainMenuCallbacks=[GoToSettings, GoToInformation, GoToGamesMenu] 
    GoToGamesMenu()
    Load()
    //setTimeout(()=>{debugger;} , 15000)
})