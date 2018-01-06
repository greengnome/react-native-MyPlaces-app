import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const backgroundedButton = props => (
    <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.button, {backgroundColor: props.color}]}>
            <Text>{props.children}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 5
    }
});

export default backgroundedButton;
