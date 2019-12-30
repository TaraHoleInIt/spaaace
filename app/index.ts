import document from "document";
import clock, { TickEvent } from "clock";
import { display } from "display";
import { preferences } from "user-settings";
import { me as device } from "device";
import { peerSocket, MessageEvent } from "messaging";
import * as fs from "fs";

var simpleDate: boolean = false;
var shouldShowDate: boolean = true;

var animationSpeed: number = ( 1000 / 20 );
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

interface saveRestore {
    key: string;
    value: string;
}

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

clock.granularity = "minutes";
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

    if ( shouldShowDate == true ) {
        dateText.text = weekdayNames[ evt.date.getDay( ) ];

        if ( simpleDate == false ) {
            dateText.text+= " the " + date.toString( ) + getSuffixFromDay( date );
        }
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

let defaultSettings: saveRestore[ ] = [
    { key: "clockColor", value: `"skyblue"` },
    { key: "simpleDate", value: `false` },
    { key: "shouldShowDate", value: `true` },
    { key: "starsCount", value: `10` },
    { key: "warpSpeed", value: `1` },
    { key: "animationSpeed", value: `100` }
];

function saveRestore_SetDefaults( ) {
    defaultSettings.forEach( ( item: saveRestore, index: number ) => {
        handleSettingsChange( item.key, item.value );
    }
);}

function saveRestore_Save( ) {
    fs.writeFileSync( "space.set", JSON.stringify( [
        { key: "clockColor", value: `"${clockColor}"` },
        { key: "simpleDate", value: simpleDate },
        { key: "shouldShowDate", value: shouldShowDate },
        { key: "starsCount", value: starsCount },
        { key: "warpSpeed", value: warpSpeed },
        { key: "animationSpeed", value: animationSpeed }
    ], ), "json" );
}

function saveRestore_Restore( ) {
    let saveData: saveRestore[ ] = JSON.parse( fs.readFileSync( "space.set", "json" ) );

    console.info( "saveRestore_Restore( ): " );

    saveData.forEach( ( item: saveRestore, index: number ) => {
        console.log( item.key + "/" + item.value );
        handleSettingsChange( item.key, item.value );
    });
}

if ( fs.existsSync( "space.set" ) ) {
    console.info( "Settings found!" );
    saveRestore_Restore( );
} else {
    console.info( "Settings not found, setting defaults" );

    saveRestore_SetDefaults( );
    saveRestore_Save( );
}

function handleSettingsChange( key: string, value: string ) {
    switch ( key ) {
        case "clockColor": {
            clockColor = JSON.parse( value );

            clockText.style.fill = clockColor;
            ampmText.style.fill = clockColor;
            dateText.style.fill = clockColor;

            console.log( "clockColor: " + clockColor );

            break;
        }
        case "starsCount": {
            starsCount = Number( value );

            console.log( "starsCount: " + starsCount );

            initStars( );
            break;
        }
        case "animationSpeed": {
            animationSpeed = Number( value );

            // Clamp animation speed to between 33 and 1000ms
            animationSpeed = ( animationSpeed < 33 ) ? 33 : animationSpeed;
            animationSpeed = ( animationSpeed > 1000 ) ? 1000 : animationSpeed;

            console.log( "animationSpeed: " + animationSpeed );

            if ( updateStarsInterval ) {
                clearInterval( updateStarsInterval );
            }

            if ( display.on ) {
                updateStarsInterval = setInterval( updateStars, animationSpeed );
            }

            break;
        }
        case "warpSpeed": {
            warpSpeed = Number( value );

            // Clamp warp to between 1 and 9
            warpSpeed = ( warpSpeed < 1 ) ? 1 : warpSpeed;
            warpSpeed = ( warpSpeed > 9 ) ? 9 : warpSpeed;

            break;
        }
        case "showDate": {
            dateText.style.visibility = ( value === "true" ) ? "visible" : "hidden";
            shouldShowDate = ( value == "true" ) ? true : false;
            break;
        }
        case "simpleDate": {
            simpleDate = ( value == "true" ) ? true : false;
            break;
        }
        default: break;
    }

    saveRestore_Save( );
}

peerSocket.addEventListener( "message", ( evt: MessageEvent ) => {
    var key: string = evt.data.key as string;
    var value: string = evt.data.value as string;

    handleSettingsChange( key, value );
});

peerSocket.addEventListener( "open", ( evt: Event ) => {
    peerSocket.send( { key: "clockColor", value: `"${clockColor}"`} );
    peerSocket.send( { key: "simpleDate", value: simpleDate } );
    peerSocket.send( { key: "showDate", value: shouldShowDate } );
    peerSocket.send( { key: "starsCount", value: starsCount } );
    peerSocket.send( { key: "warpSpeed", value: warpSpeed } );
    peerSocket.send( { key: "animationSpeed", value: animationSpeed } );
});
