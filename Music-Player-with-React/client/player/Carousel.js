import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Carousel() {
    return (
        <View style={styles.container}>
            {/* <Text>ko</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100vw',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    }
})
