import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native';

const wDim = Dimensions.get('window');
const fixedWidth = Math.round(wDim.width * wDim.scale * 0.8);

const startTabs = () => {
    Promise.all([
        Icon.getImageSource('md-map', 30),
        Icon.getImageSource('ios-share-alt', 30),
        Icon.getImageSource('ios-menu', 30)
    ]).then(images => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: 'places-app.FindPlaceScreen',
                    label: 'Find Place',
                    title: 'Find Place',
                    icon: images[0],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: images[2],
                                title: 'Menu',
                                id: 'sideDrawerToggle'
                            }
                        ]
                    }
                },
                {
                    screen: 'places-app.SharePlaceScreen',
                    label: 'Share Place',
                    title: 'Share Place',
                    icon: images[1],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: images[2],
                                title: 'Menu',
                                id: 'sideDrawerToggle'
                            }
                        ]
                    }
                }
            ],
            drawer: {
                left: {
                    screen: 'places-app.SideDrawerScreen',
                    fixedWidth
                }
            }
        });
    });
}

export default startTabs;
