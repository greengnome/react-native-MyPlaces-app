import React, {Component} from 'react';
import {View, Text, Button, TextInput, StyleSheet, ImageBackground} from 'react-native';

import startMainTabs from './../MainTabs/startMainTabs';
import DefaultAppInput from '../../components/UI/DefaultAppInput/DefaultAppInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MaintText/MainText';
import BackgroundedButton from '../../components/UI/BackgroundedButton/BackgroundedButton';
import NonBackgroundedButton from '../../components/UI/NonBackgroundButton/NonBackgroundButton';

import forestImg from '../../assets/forest.jpg';
import NonBackgroundButton from '../../components/UI/NonBackgroundButton/NonBackgroundButton';

class AuthScreen extends Component {
    loginHandler = () => {
        startMainTabs();
    }

    render() {
        return (
            <ImageBackground source={forestImg} style={styles.bgImage}>
                <View style={styles.container}>
                    <MainText>
                        <HeadingText>Please Log In</HeadingText>
                    </MainText>
                    {/* <BackgroundedButton color='#29aaf4'>Switch to login</BackgroundedButton> */}
                    <NonBackgroundButton border='white' onPress={() => alert('Switch')}>Switch to login</NonBackgroundButton>
                    <View style={styles.inputContainer}>
                        <DefaultAppInput placeholderTextColor='white' placeholder='Your e-mail address' style={styles.input} />
                        <DefaultAppInput placeholderTextColor='white' placeholder='Password' style={styles.input} />
                        <DefaultAppInput placeholderTextColor='white' placeholder='Confirm password' style={styles.input} />
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
    }
})

export default AuthScreen;