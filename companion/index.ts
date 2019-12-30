import { settingsStorage } from "settings";
import { peerSocket } from "messaging";

function sendSettingToApp( key: string, value: string ) {
    if ( peerSocket.readyState === peerSocket.OPEN ) {
        peerSocket.send( { key: key, value: value } );
    } else {
        console.warn( "peerSocket not open!" );
    }
}

settingsStorage.addEventListener( "change", ( evt: StorageChangeEvent ) => {
    sendSettingToApp( evt.key as string, evt.newValue as string );
});

function checkAndSetDefaults( key: string, defaultValue: string ) {
    if ( ! settingsStorage.getItem( key ) ) {
        settingsStorage.setItem( key, defaultValue );
    }

    sendSettingToApp( key, settingsStorage.getItem( key ) as string );
}

peerSocket.addEventListener( "open", ( evt: Event ) => {
    checkAndSetDefaults( "clockColor", "\"skyblue\"" );
    checkAndSetDefaults( "showDate", "true" );
    checkAndSetDefaults( "simpleDate", "false" );
    checkAndSetDefaults( "starsCount", "10" );
    checkAndSetDefaults( "animationSpeed", "100" );
    checkAndSetDefaults( "warpSpeed", "1" );
} );

