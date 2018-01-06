import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const nonBackgroundedButton = props => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.button, {borderColor: props.border}]}>
            <Text style={{color: props.border, fontWeight: 'bold', fontSize: 22}}>{props.children}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 25,
        paddingVertical: 10,
        margin: 5,
        backgroundColor: 'transparent',
        borderBottomWidth: 0
    }
});

export default nonBackgroundedButton;