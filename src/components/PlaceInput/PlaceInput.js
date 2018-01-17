import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

import DefaultInput from '../UI/DefaultAppInput/DefaultAppInput';

const placeInput = props => {
  return (
    <DefaultInput placeholder='Place name'
      value={props.placeName}
      onChangeText={props.onChangeText} />
  );
}

export default placeInput;
