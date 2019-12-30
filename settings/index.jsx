function spaceSettings( props ) {
    return (
        <Page>
            <Section title={<Text bold align="left">Clock color</Text>}>
                <ColorSelect settingsKey="clockColor" colors={
                    [
                        { color: 'crimson' },
                        { color: 'forestgreen' },
                        { color: 'mediumblue' },
                        { color: 'coral' },
                        { color: 'chartreuse' },
                        { color: 'skyblue' },
                        { color: 'orangered' },
                        { color: 'mediumspringgreen' },
                        { color: 'cyan' },
                        { color: 'red' },
                        { color: 'palegreen' },
                        { color: 'slateblue' },
                        { color: 'brown' },
                        { color: 'magenta' },
                        { color: 'aquamarine' },
                        { color: 'white' },
                        { color: 'lightgray' },
                        { color: 'darkgray' }
                    ]
                }
                />
                <Toggle settingsKey="showDate" label="Show date" />
                <Toggle settingsKey="simpleDate" label="Only show weekday" />
            </Section>
            <Section title={<Text bold align="left">Starfield settings</Text>}>
                <Text>Number of stars (1-25): { props.settingsStorage.getItem( "starsCount" ) }</Text>
                <Text>Animation speed (10ms-100ms): { props.settingsStorage.getItem( "animationSpeed" ) }</Text>
                <Text>Warp (1-9): { props.settingsStorage.getItem( "warpSpeed" ) }</Text>
                <Slider label="Stars" settingsKey="starsCount" min="1" max="25" step="1" />
                <Slider label="Animation speed (ms)" settingsKey="animationSpeed" min="10" max="100" step="1" />
                <Slider label="Warp" settingsKey="warpSpeed" min="1" max="9" step="1" />
            </Section>
        </Page>
    );
}

registerSettingsPage( spaceSettings );
