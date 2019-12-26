import document from "document";
import clock from "clock";
import display from "display";
import { preferences } from "user-settings";
import { me as device } from "device";

var screenCenterX = 0;
var screenCenterY = 0;
var screenWidth = 0;
var screenHeight = 0;
var updateStarsInterval = 0;

let clockText = document.getElementById( "clockText" );
let ampmText = document.getElementById( "ampmText" );

let starsList = [
    { dx: 0, dy: 0, elem: document.getElementById( "star1" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star2" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star3" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star4" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star5" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star6" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star7" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star8" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star9" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star10" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star11" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star12" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star13" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star14" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star15" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star16" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star17" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star18" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star19" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star20" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star21" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star22" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star23" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star24" ) },
    { dx: 0, dy: 0, elem: document.getElementById( "star25" ) }
];

function randomRange( min, max ) {
    return Math.random( ) * ( max - min + 1 ) + min;
}

function birthNewStar( ) {
    var starDistX = 0;
    var starDistY = 0;
    var starSize = 0;
    var starX = 0;
    var starY = 0;
    var dx = 0;
    var dy = 0;

    starX = randomRange( 0, screenWidth );
    starY = randomRange( 0, screenHeight );

    starDistX = Math.abs( screenCenterX - starX );
    starDistY = Math.abs( screenCenterY - starY );

    dx = ( starX < screenCenterX ) ? -1 : 1;
    dy = ( starY < screenCenterY ) ? -1 : 1;

    if ( dx == 0 && dy == 0 ) {
        dx++;
        dy++;
    }

    starSize = 1;

    return { starX: starX, starY: starY, starSize: starSize, dx: dx, dy: dy };
}

function initStars( ) {
    var newStar;
    var starDistX;
    var starDistY;
    var starSize;
    var starX;
    var starY;
    
    starsList.forEach( ( item, index ) => { 
        newStar = birthNewStar( );

        item.dx = newStar.dx;
        item.dy = newStar.dy;

        item.elem.cx = newStar.starX;
        item.elem.cy = newStar.starY;

        item.elem.r = newStar.starSize;
    
        item.elem.style.visibility = "visible";
        item.elem.style.fill = 0xFFFFFFFF;
    } ); 
}

function updateStars( ) {
    var newStar;
    var starX = 0;
    var starY = 0;
    var starSize = 0;
    var starDistX = 0;
    var starDistY = 0;
    var dx = 0;
    var dy = 0;

    starsList.forEach( ( item, index ) => {
        starX = item.elem.cx;
        starY = item.elem.cy;

        if ( starX < 0 || starX >= screenWidth || starY < 0 || starY >= screenHeight ) {
            newStar = birthNewStar( );

            starX = newStar.starX;
            starY = newStar.starY;
            starSize = newStar.starSize;

            item.dx = newStar.dx;
            item.dy = newStar.dy;
        }

        starX+= item.dx;
        starY+= item.dy;
            
        starDistX = Math.abs( screenCenterX - starX );
        starDistY = Math.abs( screenCenterY - starY );
        
        starSize = ( starDistX > starDistY ) ? Math.floor( starDistX * 0.025 ) : Math.floor( starDistY * 0.025 );
        starSize = ( starSize <= 0 ) ? 1 : starSize;

        item.elem.cx = starX;
        item.elem.cy = starY;
        item.elem.r = starSize;
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

initStars( );

clock.granularity = "seconds";
clock.ontick = ( evt ) => {
    var hoursIs24 = ( preferences.clockDisplay === "12h" ) ? false : true;
    var hours = evt.date.getHours( );
    var mins = evt.date.getMinutes( );
    var hoursText;
    var minsText;

    minsText = ( mins > 10 ) ? mins.toString( ) : ( "0" + mins.toString( ) );

    if ( hoursIs24 == true ) {
        hoursText = ( hours <= 9 ) ? ( "0" + hours.toString( ) ) : hours.toString( );
        ampmText.text = "";
    } else {
        hoursText = ( ( hours > 12 ) ? ( hours - 12 ) : hours ).toString( );
        ampmText.text = ( hours >= 12 ) ? "pm" : "am";
    }

    clockText.text = hoursText + ":" + minsText;
};

display.addEventListener( "change", ( evt ) => {
    if ( display.on ) {

        if ( ! updateStarsInterval ) {
            updateStarsInterval = setInterval( updateStars, 100 );
        }
    } else {
        clearInterval( updateStarsInterval );
    }
});

updateStarsInterval = setInterval( updateStars, 100 );
