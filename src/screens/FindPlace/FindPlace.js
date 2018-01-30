import React, { Component } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';

class FindPlaceScreen extends Component {

    state = {
        placesLoaded: false,
        removeAnimation: new Animated.Value(1),
        placeListAnimation: new Animated.Value(0) 
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if(event.type === 'NavBarButtonPress') {
            if(event.id === 'sideDrawerToggle') {
                this.props.navigator.toggleDrawer({
                    side: "left"
                })
            }
        }
    }

    placesLoadedHandler = () => {
        Animated.timing(this.state.placeListAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
            console.log(this.props.selectedPlace);
        });
    }

    itemSelectedHandler = (key) => {
        const selectedPlace = this.props.places.find(place => {
            return place.key === key;
        });

        this.props.navigator.push({
            screen: "places-app.PlaceDetailsScreen",
            title: selectedPlace.name,
            passProps: {
                selectedPlace
            }
        })
    }; 

    render() {
        let content = (
            <Animated.View style={{
                opacity: this.state.removeAnimation,
                transform: [
                    {
                        scale: this.state.removeAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, 1]
                        })
                    }
                ]
            }}>
                <TouchableOpacity onPress={this.placesSearchHandler}>
                    <View style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Find Places</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );

        if(this.state.placesLoaded) {
            content = (
                <Animated.View style={{
                    opacity: this.state.placeListAnimation
                }}>
                    <PlaceList  places={this.props.places} onItemSelected={this.itemSelectedHandler}/>
                </Animated.View>
            );
        }
        
        return (
            <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchButton: {
        borderColor: '#3498db',
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText: {
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: 26
    }
});

const mapStateToProps = state => {

    return {
        places: state.places.places
    }
}

export default connect(mapStateToProps)(FindPlaceScreen);