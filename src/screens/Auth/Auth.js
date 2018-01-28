import React, { Component } from 'react';
import {View,
        StyleSheet, 
        ImageBackground, 
        Dimensions,
        KeyboardAvoidingView,
        Keyboard,
        TouchableWithoutFeedback
} from 'react-native';
import  {connect} from 'react-redux';

import startMainTabs from './../MainTabs/startMainTabs';
import DefaultAppInput from '../../components/UI/DefaultAppInput/DefaultAppInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MaintText/MainText';
import NonBackgroundButton from '../../components/UI/NonBackgroundButton/NonBackgroundButton';
import validate from '../../utilities/validation';
import {tryAuth} from '../../store/actions/index';

class AuthScreen extends Component {
    DIMANTIONS_ENUM = {
        landscape: 'landscape',
        portrait: 'portrait'
    };

    state = {
        viewMode: Dimensions.get('window').height > 500 ? this.DIMANTIONS_ENUM.portrait : this.DIMANTIONS_ENUM.landscape,
        authMode: 'login',
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false
            }
        }  
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
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value,
        };
        this.props.onLogin(authData);
        startMainTabs();
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login' ? 'signup' : 'login'
            }
        })
    };

    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;
            
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            };
        }

        if (key === 'password') {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            };
        }

        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid: key === 'password' ? validate(
                                                        prevState.controls.password.value, 
                                                        prevState.controls.confirmPassword.validationRules, 
                                                        connectedValue
                                                    ) 
                                                    : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, 
                                        prevState.controls[key].validationRules, 
                                        connectedValue),
                        touched: true
                    }
                }
            };
        });
    };

    render() {
        let headingText = null;
        let confirmPasswordControl = null;

        if(this.state.viewMode === this.DIMANTIONS_ENUM.portrait) {
            headingText = (
                <MainText>
                    <HeadingText>{this.state.authMode === 'signup' ? 'Sign Up' : 'Login'}</HeadingText>
                </MainText>
            );
        }

        if (this.state.authMode === 'signup') {
            confirmPasswordControl = (
                <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ?
                    styles.portraitPasswordWrapper :
                    styles.landscapePasswordWrapper}>
                    <DefaultAppInput placeholderTextColor='rgba(189, 195, 199,1.0)'
                                     placeholder='Confirm password'
                                     style={styles.input}
                                     value={this.state.controls.confirmPassword.value}
                                     onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                                     valid={this.state.controls.confirmPassword.valid}
                                     touched={this.state.controls.confirmPassword.touched}
                                     secureTExtEntry
                                     autoCorrect={false}
                    />
                </View>
            );
        }

        return (
            // <ImageBackground source={forestImg} style={styles.bgImage}>
                <KeyboardAvoidingView style={styles.container} behavior='padding'>
                    {headingText}
                    <NonBackgroundButton 
                        border='white' 
                        onPress={this.switchAuthModeHandler}
                    >Switch to {this.state.authMode === 'login' ? 'Sign Up' : 'Login'}
                    </NonBackgroundButton>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>
                            <DefaultAppInput placeholderTextColor='rgba(189, 195, 199,1.0)'
                                             placeholder='Your e-mail address'
                                             style={styles.input}
                                             value={this.state.controls.email.value}
                                             onChangeText={(val) => this.updateInputState('email', val)}
                                             valid={this.state.controls.email.valid}
                                             touched={this.state.controls.email.touched}
                                             autoCapitalize='none'
                                             autoCorrect={false}
                                             keyboardType='email-address'
                            />
                            <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ||
                                         this.state.authMode === 'login' ?
                                         styles.portraitPasswordContainer :
                                         styles.landscapePasswordContainer}>
                                <View style={this.state.viewMode === this.DIMANTIONS_ENUM.portrait ||
                                             this.state.authMode === 'login' ?
                                             styles.portraitPasswordWrapper :
                                             styles.landscapePasswordWrapper}>
                                <DefaultAppInput placeholderTextColor='rgba(189, 195, 199,1.0)'
                                                 placeholder='Password'
                                                 style={styles.input}
                                                 value={this.state.controls.password.value}
                                                 onChangeText={(val) => this.updateInputState('password', val)}
                                                 valid={this.state.controls.password.valid}
                                                 touched={this.state.controls.password.touched}
                                                 secureTextEntry
                                                 autoCorrect={false}
                                />
                                </View>
                                {confirmPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <NonBackgroundButton 
                        border='white' 
                        onPress={this.loginHandler}
                        disabled={
                            !this.state.controls.email.valid ||
                            !this.state.controls.password.valid ||
                            !this.state.controls.confirmPassword.valid && this.state.authMode === 'signup'
                        }
                    >{this.state.authMode === 'signup' ? 'Submit' : 'Enter'}</NonBackgroundButton>
                </KeyboardAvoidingView>
            // </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3498db'
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
});

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (authData) => dispatch(tryAuth(authData))
    }
};

export default connect(null, mapDispatchToProps)(AuthScreen);