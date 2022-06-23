import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { palette } from '../SharedUtilities';
const { blue, lightgray, gray, white } = palette;
import { url } from "../../server/config.json";

export default function Download() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [textValue, setTextValue] = useState('');
    

    function select(value) {
        setOptions([]);
        setLoading(true);
        fetch(`${url}/download/${value}`)
        .then(res => res.json()).then(res => {
            setLoading(false);
            setTextValue('');
        })
        .catch(err => {
            setLoading(false);
            setTextValue('');
        });
        fetch(`${url}/refreshSongs`);
    }

    function search() {
        setTextValue(textValue.trim());
        if (textValue === '') return setOptions([]);
        if (textValue.startsWith('https://www.youtube.com/watch?v=')) return fetch(`${url}/download/${textValue}`);

        setLoading(true);
        setOptions([]);

        fetch(`${url}/search/${encodeURI(textValue)}`).then(res => res.json()).then(res => {
            setOptions(res.map(el => {try {
                return {...el, title: decodeURI(el.title)}   
            } catch (error) {
                return {...el, title: el.title}
            }}));// sometimes the title might have %20 instead of a ' ' (space)
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    }

    
    return (
        <View style={styles.container}>
            <TextInput 
                onSubmitEditing={search} 
                autoFocus={true}
                onChangeText={setTextValue}
                value={textValue}
                placeholder="Insert a YT search or a link" 
                style={styles.input}
            />
            <ScrollView style={styles.optionsContainer}>
                {options.length !== 0 && options.map((el, i) => 
                    <Pressable key={i} onPress={() => {select(el.url)}}>
                        <View style={styles.option}>
                            <Text style={{color:white}} children={el.title}></Text>
                        </View>
                    </Pressable>
                )}
            </ScrollView>  
            {loading && 
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={blue}/>
                </View>
            }
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',

        width: '80%'
    },
    loaderContainer: {
        width: '100%',
        height: '100%',
        paddingTop: '10%',

        display: 'flex',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        borderColor: white,
        borderRadius: 10,
        borderWidth: 2,
        
        marginTop: '10vh',
        marginBottom: '1vh',
        paddingLeft: '1vh',
        paddingRight: '1vh',
        paddingTop: '0.5vh',
        paddingBottom: '0.5vh',
        

        color: white,
        backgroundColor: gray,
    },
    optionsContainer: {
        width: '100%',
        maxHeight: '80vh',
        borderColor: white,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: lightgray,
    },
    option: {
        borderColor: white,
        borderWidth: 1,
        backgroundColor: lightgray,

        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
    },
});