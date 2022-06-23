import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { palette } from './SharedUtilities';
const { blue, darkgray, gray, black, lightgray } = palette;

export default function UserMessage({ body }) {
    let arr = body.arr || [];

    if (arr.length > 4) {
        arr = arr.slice(0,3);
        arr.push('. . .');
    };
    if (arr.length !== 0) arr = ['\n', ...arr].join('\n');

    const text = body.text + arr; 

    function Btn({ children, i }) {
        return (
            <Pressable onPress={() => body.callback(children)} style={i === 0 ? styles.btnFirst : styles.btn}>
                <Text style={styles.btnText}>{children}</Text>
            </Pressable>
        )
    }

    return (
        <>
            <View style={styles.background}>
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
                <View style={styles.btnContainer}>
                    {body.buttons && body.buttons.map((el, i) => 
                        <Btn key={i} i={i}>{el}</Btn>
                    )}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        opacity: .7,
        backgroundColor: black,
        zIndex: 0,
    },  
    container: {
        position: 'absolute',
        // top: '50vh',
        // left: '50vw',
      transform: [{translateX: '50%'}],

        marginTop: '20vh',
        width: '50vw',
        backgroundColor: gray,

        borderRadius: 20,
        borderWidth: 2,
        borderColor: lightgray
    },
    text: {
        margin: '1em',
        color: blue,
    },
    btnText: {
        color: blue, 
        fontSize: 20
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexBasis: 'auto',
        marginTop: '2em',
        width: '100%',
        textAlign: 'center',
        backgroundColor: darkgray,
        borderTopColor: lightgray,
        borderTopWidth: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    btnFirst: {
        padding: '1em',
        width: 'auto',
        flexGrow: 1
    },
    btn: {
        padding: '1em',
        width: 'auto',

        borderColor: black,
        borderLeftWidth: 2,

        flexGrow: 1
    }
})
