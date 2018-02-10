import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import PlaceDetailsScreen from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';
import configureStore from './src/store/store_config';

const store = configureStore()

// Register screens
Navigation.registerComponent(
  "places-app.AuthScreen",
  () => AuthScreen, 
        store, 
        Provider
);
Navigation.registerComponent(
  "places-app.SharePlaceScreen",
  () => SharePlaceScreen, 
        store, 
        Provider
);
Navigation.registerComponent(
  "places-app.FindPlaceScreen",
  () => FindPlaceScreen, 
        store, 
        Provider
);
Navigation.registerComponent(
  "places-app.PlaceDetailsScreen",
  () => PlaceDetailsScreen, 
        store, 
        Provider
);

Navigation.registerComponent(
  "places-app.SideDrawerScreen",
  () => SideDrawer,
        store,
        Provider
)

// Start app
export default () => Navigation.startSingleScreenApp({
  screen: {
    screen: "places-app.AuthScreen",
    title: "Login"
  }
});
