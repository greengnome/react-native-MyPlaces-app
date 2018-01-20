import React, { Component } from 'react';
import { View, 
    Image, 
    Text, 
    Button, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Platform, 
    Dimensions } from 'react-native';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import { deletePlace } from '../../store/actions/index';

class PlaceDetail extends Component {
    DIMANTIONS_ENUM = {
        landscape: 'landscape',
        portrait: 'portrait'
    };

    state = {
        viewMode: Dimensions.get('window').height > 500 ? this.DIMANTIONS_ENUM.portrait : 
                                                          this.DIMANTIONS_ENUM.landscape
    }

    constructor(props) {
        super(props);
        Dimensions.addEventListener('change', this.updateStyles);
    }

    updateStyles = dims => {
        this.setState({
            viewMode: Dimensions.get('window').height > 500 ? this.DIMANTIONS_ENUM.portrait : 
                                                              this.DIMANTIONS_ENUM.landscape
        });
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.updateStyles);
    }

    placeDeletedHandler = () => {
        this.props.onDeletePlace(this.props.selectedPlace.key);
        this.props.navigator.pop();
    }

    render() {
        return (
            <View style={[styles.container, this.state.viewMode === this.DIMANTIONS_ENUM.portrait ? 
                                            styles.portraitContainer : 
                                            styles.landscapeContainer]}>
                <View style={styles.subContainer}>
                    <Image source={this.props.selectedPlace.image} style={styles.placeImage} />
                </View>
                <View style={styles.subContainer}>
                    <View>
                        <Text style={styles.placeName} >{this.props.selectedPlace.name}</Text>
                    </View>
                    <View style={styles.detailsButtonContainer}>
                        <TouchableOpacity onPress={this.placeDeletedHandler}>
                            <Icon size={30} name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} color='red' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        margin: 22,
        flex: 1
    },
    portraitContainer: {
        flexDirection: 'column'
    },
    landscapeContainer: {
        flexDirection: 'row' 
    },
    placeImage: {
        width: "100%",
        height: 200
    },
    placeName: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 28
    },
    detailsButtonContainer: {
        alignSelf: 'center'
    },
    modalButton: {
        width: 150
    },
    subContainer: {
        flex: 1
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onDeletePlace: (key) => dispatch(deletePlace(key))
    };
};

export default connect(null, mapDispatchToProps)(PlaceDetail);
