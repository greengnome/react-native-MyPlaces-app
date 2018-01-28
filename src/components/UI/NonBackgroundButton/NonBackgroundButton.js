import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Text, StyleSheet, View, Platform } from 'react-native';

const nonBackgroundedButton = props => {
    const content = (
        <View style={[styles.button, { borderColor: props.border }, props.disabled ? styles.disabled : null]}>
            <Text style={[{ color: props.border, fontWeight: 'bold', fontSize: 22 }, props.disabled ? styles.disabledText : null]}>{props.children}</Text>
        </View>
    );
    if(props.disabled) {
        return content;
    }
    if (Platform.OS === 'android') {
        return (
            <TouchableNativeFeedback onPress={props.onPress}>
                {content}
            </TouchableNativeFeedback>
        );
    }

    return (
        <TouchableOpacity onPress={props.onPress}>
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        margin: 5,
        backgroundColor: 'transparent',
        borderBottomWidth: 0
    },
    disabled: {
        // backgroundColor: '#7f8c8dff'
    },
    disabledText: {
        color: '#bdc3c7'
    }
});

export default nonBackgroundedButton;