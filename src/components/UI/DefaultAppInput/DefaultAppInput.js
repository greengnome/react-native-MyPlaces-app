import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const defaultAppInput = (props) => {
    return (
        <TextInput  {...props} 
                    style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]} 
                    underlineColorAndroid='transparent'/>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#eee',
        padding: 5,
        marginTop: 8,
        marginBottom: 8
    },
    invalid: {
        borderColor: 'red',
    }
});

export default defaultAppInput;
