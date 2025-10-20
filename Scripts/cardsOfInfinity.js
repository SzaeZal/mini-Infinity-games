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
    //#region Medals
    let medalTimes={
        easy:{ //TODO: change times
            bronze: 60000,
            silver: 45000,
            gold: 30000,
            author: 15000
        },
        medium:{
            bronze: 120000,
            silver: 90000,
            gold: 60000,
            author: 30000
        },
        hard:{
            bronze: 180000,
            silver: 135000,
            gold: 90000,
            author: 45000
        }

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
        clearInterval(autoSaveInterval)
        let saveText=$("#dialogBoxTextarea").val()
        localStorage.setItem("cardsOfInfinitySave", saveText)
        location.reload()
    }

    const ImportSaveFromText= (text)=>{
        clearInterval(autoSaveInterval)
        localStorage.setItem("cardsOfInfinitySave", text)
        location.reload()
    }
    //#endregion
    Load()
})