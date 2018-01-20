import React, { Component } from 'react';
import {View, 
        Text, 
        Button, 
        TextInput, 
        StyleSheet, 
        ImageBackground, 
        Dimensions} from 'react-native';

import startMainTabs from './../MainTabs/startMainTabs';
import DefaultAppInput from '../../components/UI/DefaultAppInput/DefaultAppInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MaintText/MainText';
import BackgroundedButton from '../../components/UI/BackgroundedButton/BackgroundedButton';
import NonBackgroundedButton from '../../components/UI/NonBackgroundButton/NonBackgroundButton';

import forestImg from '../../assets/forest.jpg';
import NonBackgroundButton from '../../components/UI/NonBackgroundButton/NonBackgroundButton';

class AuthScreen extends Component {
    DIMANTIONS_ENUM = {
        landscape: 'landscape',
        portrait: 'portrait'
    };

    state = {
        viewMode: Dimensions.get('window').height > 500 ? this.DIMANTIONS_ENUM.portrait : 
                                                          this.DIMANTIONS_ENUM.landscape  
    };

    constructor(props) {
        super(props);

        Dimensions.addEventListener('change', this.updateStyles);
    };

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.updateStyles);
    };

    updateStyles = (dims) => {
        this.setState({
            viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'
        });
    };

    loginHandler = () => {
        startMainTabs();
    };

    render() {
        let headingText = null;
        if(this.state.viewMode === this.DIMANTIONS_ENUM.portrait) {
            headingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            );
        }

        return (
            <ImageBackground source={forestImg} style={styles.bgImage}>
                <View style={styles.container}>
                    {headingText}
                    <NonBackgroundButton border='white' onPress={() => alert('Switch')}>Switch to login</NonBackgroundButton>
                    <View style={styles.inputContainer}>
                        <DefaultAppInput placeholderTextColor='white' placeholder='Your e-mail address' style={styles.input} />
                        <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ? 
                                     styles.portraitPasswordContainer : 
                                     styles.landscapePasswordContainer}>
                            <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ?
                                         styles.portraitPasswordWrapper : 
                                         styles.landscapePasswordWrapper}>
                            <DefaultAppInput placeholderTextColor='white' placeholder='Password' style={styles.input} />
                            </View>
                            <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ?
                                         styles.portraitPasswordWrapper : 
                                         styles.landscapePasswordWrapper}>
                            <DefaultAppInput placeholderTextColor='white' placeholder='Confirm password' style={styles.input} />
                            </View>
                        </View>
                    </View>
                    {/* <BackgroundedButton color='#29aaf4'>Login</BackgroundedButton> */}
                    <NonBackgroundButton border='white' onPress={this.loginHandler}>Login</NonBackgroundButton>
                </View>
            </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        borderColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        color: 'white'
    },
    bgImage: {
        width: '100%',
        flex: 1
    },
    landscapePasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portraitPasswordContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    landscapePasswordWrapper: {
        width: '45%'
    },
    portraitPasswordWrapper: {
        width: '100%'
    }
})

export default AuthScreen;