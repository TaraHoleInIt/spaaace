import document from "document";
import clock, { TickEvent } from "clock";
import { display } from "display";
import { preferences } from "user-settings";
import { me as device } from "device";
import * as fs from "fs";

var simpleDate: boolean = false;
var shouldShowDate: boolean = true;

var animationSpeed: number = 1000;
var starsCount: number = 25;
var warpSpeed: number = 1;
var clockColor: string = "skyblue";

var screenCenterX: number = 0;
var screenCenterY: number = 0;
var screenWidth: number = 0;
var screenHeight: number = 0;
var updateStarsInterval = 0;

let dateText = document.getElementById( "dateText" ) as TextElement;
let clockText = document.getElementById( "clockText" ) as TextElement;
let ampmText = document.getElementById( "ampmText" ) as TextElement;

interface star {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
    elem: CircleElement;
}

var starsList = [
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star1" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star2" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star3" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star4" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star5" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star6" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star7" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star8" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star9" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star10" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star11" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star12" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star13" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star14" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star15" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star16" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star17" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star18" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star19" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star20" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star21" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star22" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star23" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star24" ) } as star,
    { x: 0, y: 0, dx: 0, dy: 0, size: 1, elem: document.getElementById( "star25" ) } as star
];

function randomRange( min: number, max: number ) {
    return Math.random( ) * ( max - min + 1 ) + min;
}

function birthNewStar( elem_in: CircleElement ) {
    var starDistX: number = 0;
    var starDistY: number = 0;
    var starSize: number = 0;
    var starX: number = 0;
    var starY: number = 0;
    var dx: number = 0;
    var dy: number = 0;

    starX = randomRange( 0, screenWidth );
    starY = randomRange( 0, screenHeight );

    starDistX = Math.abs( screenCenterX - starX );
    starDistY = Math.abs( screenCenterY - starY );

    dx = ( starX < screenCenterX ) ? -1 + -Math.random( ) : 1 + Math.random( );
    dy = ( starY < screenCenterY ) ? -1 + -Math.random( ) : 1 + Math.random( );

    if ( dx == 0 && dy == 0 ) {
        dx++;
        dy++;
    }

    return { x: starX, y: starY, dx: dx, dy: dy, size: 1, elem: elem_in } as star;
}

function initStars( ) {
    var newStar: star;
    
    starsList.forEach( ( item: star, index: number ) => { 
        newStar = birthNewStar( item.elem );

        item.x = newStar.x;
        item.y = newStar.y;

        item.dx = newStar.dx;
        item.dy = newStar.dy;

        item.elem.cx = newStar.x
        item.elem.cy = newStar.y;

        item.elem.r = 1;
    
        item.elem.style.visibility = "hidden";
        item.elem.style.fill = "white";
    } ); 

    for ( var i: number = 0; i < starsCount; i++ ) {
        starsList[ i ].elem.style.visibility = "visible";
    }
}

function updateStars( ) {
    var newStar: star;
    var starX: number = 0;
    var starY: number = 0;
    var starSize: number = 0;
    var starDistX: number = 0;
    var starDistY: number = 0;

    starsList.forEach( ( item: star, index: number ) => {
        starX = item.x;
        starY = item.y;

        if ( item.elem.style.visibility == "visible" ) {
            if ( starX < 0 || starX >= screenWidth || starY < 0 || starY >= screenHeight ) {
                newStar = birthNewStar( item.elem );

                starX = newStar.x;
                starY = newStar.y;
                starSize = newStar.size;

                item.dx = newStar.dx;
                item.dy = newStar.dy;
            }

            starX+= ( item.dx * warpSpeed );
            starY+= ( item.dy * warpSpeed );
                
            starDistX = Math.abs( screenCenterX - starX );
            starDistY = Math.abs( screenCenterY - starY );
            
            starSize = ( starDistX > starDistY ) ? Math.floor( starDistX * 0.025 ) : Math.floor( starDistY * 0.025 );
            starSize = ( starSize <= 0 ) ? 1 : starSize;

            item.x = starX;
            item.y = starY;

            item.elem.cx = starX;
            item.elem.cy = starY;
            item.elem.r = starSize;
        }
    });
}

if ( device.screen ) {
    screenWidth = device.screen.width;
    screenHeight = device.screen.height;
} else {
    screenWidth = 348;
    screenHeight = 250;
}

screenCenterX = ( screenWidth / 2 );
screenCenterY = ( screenHeight / 2 );

let weekdayNames: string[ ] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let monthNames: string[ ] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// solution from https://stackoverflow.com/questions/2050805/getting-day-suffix-when-using-datetime-tostring
function getSuffixFromDay( dayNumber: number ) {
    switch ( dayNumber ) {
        case 1:
        case 21:
        case 31: return "st";
        case 2:
        case 22: return "nd";
        case 3:
        case 23: return "rd";
        default: break;
    }

    return "th";
}

clock.granularity = "seconds";
clock.ontick = ( evt: TickEvent ) => {
    var hoursIs24: boolean = ( preferences.clockDisplay === "12h" ) ? false : true;
    var hours: number = evt.date.getHours( );
    var mins: number = evt.date.getMinutes( );
    var date: number = evt.date.getDate( );
    var hoursText: string;
    var minsText: string;

    minsText = ( mins > 9 ) ? mins.toString( ) : ( "0" + mins.toString( ) );

    if ( hoursIs24 == true ) {
        hoursText = ( hours <= 9 ) ? ( "0" + hours.toString( ) ) : hours.toString( );
        ampmText.text = "";
    } else {
        ampmText.text = ( hours >= 12 ) ? "pm" : "am";

        // hackhackhack
        hours = ( hours > 12 ) ? ( hours - 12 ) : hours;
        hours = ( hours == 0 ) ? 12 : hours;

        hoursText = hours.toString( );
    }

    clockText.text = hoursText + ":" + minsText;
    dateText.text = "";

    if ( showDayButton.value == 1 ) {
        dateText.text += weekdayNames[ evt.date.getDay( ) ];
    }

    if ( showMonthButton.value == 1 ) {
        dateText.text += " " + monthNames[ evt.date.getMonth( ) ];
    }

    if ( showDateButton.value == 1 ) {
        dateText.text += " " + evt.date.getDate( );
    }
};

display.addEventListener( "change", ( ) => {
    if ( display.on ) {
        if ( ! updateStarsInterval ) {
            updateStarsInterval = setInterval( updateStars, animationSpeed );
        }
    } else {
        clearInterval( updateStarsInterval );
        updateStarsInterval = 0;
    }
});

initStars( );
updateStars( );

clockText.style.fill = clockColor;
ampmText.style.fill = clockColor;
dateText.style.fill = clockColor;

updateStarsInterval = setInterval( updateStars, animationSpeed );

interface saveRestore {
    key: string;
    value: string;
}

let settingsPage: GraphicsElement = document.getElementById( "settingsPage" ) as GraphicsElement;
let mainButton: GraphicsElement = document.getElementById( "mainButton" ) as GraphicsElement;

let settingsClockColorText: GraphicsElement = document.getElementById( "settingsClockColorText" ) as GraphicsElement;
let settingsClockColor: string = "fb-cyan";

let hideDayButton: Element = document.getElementById( "hideDayButton" ) as Element;
let showDayButton: Element = document.getElementById( "showDayButton" ) as Element;

let hideDateButton: Element = document.getElementById( "hideDateButton" ) as Element;
let showDateButton: Element = document.getElementById( "showDateButton" ) as Element;

let hideMonthButton: Element = document.getElementById( "hideMonthButton" ) as Element;
let showMonthButton: Element = document.getElementById( "showMonthButton" ) as Element;

let slowAnimationSpeedButton: Element = document.getElementById( "slowAnimationSpeedButton" ) as Element;
let medAnimationSpeedButton: Element = document.getElementById( "medAnimationSpeedButton" ) as Element;
let fastAnimationSpeedButton: Element = document.getElementById( "fastAnimationSpeedButton" ) as Element;

let warp1Button: Element = document.getElementById( "warp1Button" ) as Element;
let warp2Button: Element = document.getElementById( "warp2Button" ) as Element;
let warp3Button: Element = document.getElementById( "warp3Button" ) as Element;
let warp4Button: Element = document.getElementById( "warp4Button" ) as Element;
let warp5Button: Element = document.getElementById( "warp5Button" ) as Element;

let saveSettingsButton: Element = document.getElementById( "saveSettingsButton" ) as Element;
let discardSettingsButton: Element = document.getElementById( "discardSettingsButton" ) as Element;

let colorButtons: GraphicsElement[ ] = [
    document.getElementById( "chooseRedButton" ) as GraphicsElement,
    document.getElementById( "chooseGreenButton" ) as GraphicsElement,
    document.getElementById( "chooseBlueButton" ) as GraphicsElement,
    document.getElementById( "chooseWhiteButton" ) as GraphicsElement,

    document.getElementById( "chooseMagentaButton" ) as GraphicsElement,
    document.getElementById( "chooseMintButton" ) as GraphicsElement,
    document.getElementById( "chooseCyanButton" ) as GraphicsElement,
    document.getElementById( "chooseGrayButton" ) as GraphicsElement,

    document.getElementById( "choosePurpleButton" ) as GraphicsElement,
    document.getElementById( "chooseLimeButton" ) as GraphicsElement,
    document.getElementById( "chooseAquaButton" ) as GraphicsElement,
    document.getElementById( "chooseSlateButton" ) as GraphicsElement,
];

function getAnimationSpeed( ) {
    if ( fastAnimationSpeedButton.value == 1 ) {
        return "fast";
    }
    else if ( medAnimationSpeedButton.value == 1 ) {
        return "med";
    }

    return "slow";
}

function getWarpSpeed( ) {
    if ( warp5Button.value == 1 ) {
        return 5;
    }
    else if ( warp4Button.value == 1 ) {
        return 4;
    }
    else if ( warp3Button.value == 1 ) {
        return 3;
    }
    else if ( warp2Button.value == 1 ) {
        return 2;
    }

    return 1;
}

function settingsSetDefaults( ) {
    settingsClockColor = "fb-cyan";
    settingsClockColorText.style.fill = "fb-cyan";

    hideDayButton.value = 0;
    showDayButton.value = 1;

    hideDateButton.value = 0;
    showDateButton.value = 1;

    hideMonthButton.value = 0;
    showMonthButton.value = 1;

    slowAnimationSpeedButton.value = 1;
    medAnimationSpeedButton.value = 0;
    fastAnimationSpeedButton.value = 0;

    warp1Button.value = 1;
    warp2Button.value = 0;
    warp3Button.value = 0;
    warp4Button.value = 0;
    warp5Button.value = 0;
}

function saveRestore_Save( ) {
    let settings: saveRestore[ ] = [
        { key: "clockColor", value: settingsClockColor },
        { key: "showDay", value: showDayButton.value ? "1" : "0" },
        { key: "showDate", value: showDateButton.value ? "1" : "0" },
        { key: "showMonth", value: showMonthButton.value ? "1" : "0" },
        { key: "animationSpeed", value: getAnimationSpeed( ) },
        { key: "warpSpeed", value: getWarpSpeed( ).toString( ) }
    ];

    fs.writeFileSync( "space.set", JSON.stringify( settings ), "json" );
}

function saveRestore_Restore( ) {
    let settings: saveRestore[ ];

    if ( fs.existsSync( "space.set" ) ) {
        settings = JSON.parse( fs.readFileSync( "space.set", "json" ) );

        settingsClockColor = settings[ 0 ].value;
        settingsClockColorText.style.fill = settingsClockColor;

        clockColor = settingsClockColor;
        clockText.style.fill = clockColor;
        ampmText.style.fill = clockColor;
        dateText.style.fill = clockColor;

        hideDayButton.value = Number( settings[ 1 ].value ) ? 0 : 1;
        showDayButton.value = Number( settings[ 1 ].value ) ? 1 : 0;

        hideDateButton.value = Number( settings[ 2 ].value ) ? 0 : 1;
        showDateButton.value = Number( settings[ 2 ].value ) ? 1 : 0;

        hideMonthButton.value = Number( settings[ 3 ].value ) ? 0 : 1;
        showMonthButton.value = Number( settings[ 3 ].value ) ? 1 : 0;

        fastAnimationSpeedButton.value = settings[ 4 ].value == "fast" ? 1 : 0;
        medAnimationSpeedButton.value = settings[ 4 ].value == "med" ? 1 : 0;
        slowAnimationSpeedButton.value = settings[ 4 ].value == "slow" ? 1 : 0;

        warp1Button.value = settings[ 5 ].value == "1" ? 1 : 0;
        warp2Button.value = settings[ 5 ].value == "2" ? 1 : 0;
        warp3Button.value = settings[ 5 ].value == "3" ? 1 : 0;
        warp4Button.value = settings[ 5 ].value == "4" ? 1 : 0;
        warp5Button.value = settings[ 5 ].value == "5" ? 1 : 0;

        switch ( getAnimationSpeed( ) ) {
            case "fast": {
                animationSpeed = 20;
                break;
            }
            case "med": {
                animationSpeed = 50;
                break;
            }
            case "slow":
            default: {
                animationSpeed = 100;
                break;
            }
        }

        if ( updateStarsInterval ) {
            clearInterval( updateStarsInterval );
            updateStarsInterval = setInterval( updateStars, animationSpeed );
        }
        
        warpSpeed = getWarpSpeed( );
    } else {
        settingsSetDefaults( );
        saveRestore_Save( );
    }
}

saveRestore_Restore( );

colorButtons.forEach( ( item: GraphicsElement, index: number ) => {
    item.onactivate = ( evt: Event ) => {
        // BUG?
        // emulator vs hw difference
        settingsClockColor = item.style.fill as string; //item.style.fill.substring( 0, item.style.fill.length - 2 );
        settingsClockColorText.style.fill = settingsClockColor;
    };
});

saveSettingsButton.onactivate = ( evt: Event ) => {
    saveRestore_Save( );
    saveRestore_Restore( );

    settingsPage.style.visibility = "hidden";
    mainButton.style.visibility = "visible";
};

discardSettingsButton.onactivate = ( evt: Event ) => {
    saveRestore_Restore( );

    settingsPage.style.visibility = "hidden";
    mainButton.style.visibility = "visible";
};

var clickCheckHandle: number = 0;
var clickCount: number = 0;

mainButton.addEventListener( "activate", ( evt: Event ) => {
    clickCount++;

    if ( ! clickCheckHandle ) {
        clickCheckHandle = setTimeout( ( ) => {
            if ( clickCount >= 2 ) {
                settingsPage.style.visibility = "visible";
                mainButton.style.visibility = "hidden";
            }

            clickCount = 0;
            clickCheckHandle = 0;
        }, 300 );
    }
});
