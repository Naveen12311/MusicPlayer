import React from "react";
import { View, Text } from "react-native";
import { palette } from '../SharedUtilities';
const { blue, darkgray, gray, white } = palette;


export default function Artists() {
    return (
        <View style={{backgroundColor: 'white',width: '10vh',height: '10vh',}}>
            <Text>Artists</Text>
        </View>
    );    
}