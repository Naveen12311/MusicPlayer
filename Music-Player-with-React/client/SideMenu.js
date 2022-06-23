import React from 'react';
import { Text, View, Image, StyleSheet, Animated, Pressable, Dimensions } from 'react-native'
import { palette } from './SharedUtilities';
const { blue, darkgray, gray, black } = palette;

function Icon({ setOpen, unit }) {
  const styles = StyleSheet.create({
    SideMenuIconCenter: {
      position: 'absolute',
      backgroundColor: darkgray,
      width: unit,
      height: unit,
      borderBottomRightRadius: '50%'
    },
    SideMenuIconRight: {
      position: 'absolute',
      left: unit,
      backgroundColor: darkgray,
      width: unit,
      height: unit / 2,
      borderBottomRightRadius: '100%',
    },
    SideMenuIconRightCover: {
      position: 'absolute',
      left: unit,
      backgroundColor: black,
      width: unit,
      height: unit / 2,
      borderTopLeftRadius: '100%',
      borderBottomRightRadius: '90%',
    },
    SideMenuIconDown: {
      position: 'absolute',
      top: unit,
      backgroundColor: darkgray,
      width: unit / 2,
      height: unit,
      borderBottomRightRadius: '100%',
    },
    SideMenuIconDownCover: {
      position: 'absolute',
      top: unit,
      backgroundColor: black,
      width: unit / 2,
      height: unit,
      borderTopLeftRadius: '100%',
      borderBottomRightRadius: '90%',
    },
    image: {
      position: 'absolute',
      top: - unit / 6,
      left: - unit / 6,
      width: unit,
      height: unit,
      borderRadius: 70,
    },
  })
  return (
  <>
    <Pressable onPress={() => setOpen(true)} style={styles.SideMenuIconCenter}>
      <Image style={styles.image} source={require('../assets/music logo.jpg')}/>
      <View style={styles.SideMenuIconDown}></View>
      <View style={styles.SideMenuIconRight}></View>
    </Pressable>
      <View style={styles.SideMenuIconDownCover}></View>
      <View style={styles.SideMenuIconRightCover}></View>
  </>
  );// the last 2 Views are outside of the Pressable, so that they don't activate the touch
}

function SideBar({ setOpen, setPage, unit }) {
  unit = unit / 2;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: gray,
    },  
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      maxHeight: 30,
      overflow: 'hidden',
      
  
      borderColor: black,
      borderBottomWidth: 2,
      backgroundColor: gray,
    },
    buttonText: {
      color: blue,
      padding: 4,
      paddingLeft: 8,
      maxHeight: 30,
    },
    begin: {
      width: 4,
      height: '100%',
      backgroundColor: blue
    },
    end: {
      width: '2.5%',
      height: '100%',
      left: '100%',
      transform: [{translateX: '-200%'}],
      
      backgroundColor: darkgray,
    },
    curve: {
      display: 'flex',
      width: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
      backgroundColor: black,
    },

    CurveLeft: {
      height: 2 * unit,
      width:'50%',
      backgroundColor: darkgray,
    },
    CurveLeftCover: {
      height: unit,
      width: '50%',
      marginTop: - unit,
      backgroundColor: black,
      borderTopLeftRadius: '100%',
    },
    CurveRight: {
      height: unit,
      width: '50%',
      backgroundColor: darkgray,
      borderBottomRightRadius: '100%'
    },
    CurveRightCover: {
      height: unit,
      width: '50%',
      zIndex: 20,
      backgroundColor: black,
      borderBottomRightRadius: '100%'
    },
  });

  function OptionsText({children, route}) {
      return (
          <Pressable onPress={() => {setOpen(false);setPage(route)}} style={styles.buttonContainer}>
            <View style={styles.begin}/>
            <View style={styles.end}/>
            <Text numberOfLines={1} style={styles.buttonText}>
              {children}
            </Text>
          </Pressable>
      )
  }


  return (
    <View style={styles.container}>
        <OptionsText route={'Player'}>Home</OptionsText>
        <OptionsText route={'Download'}>Add song</OptionsText>
        <OptionsText route={'CurrentPlaylist'}>Current Playlist</OptionsText>
        <OptionsText route={'Playlists'}>Playlists</OptionsText>
        <OptionsText route={'Artists'}>Artists</OptionsText>
        <OptionsText route={'Tags'}>Tags</OptionsText>
        <OptionsText route={'Settings'}>Settings</OptionsText>
        <View style={styles.curve}>
          <View style={styles.CurveLeft}/>
          <View style={styles.CurveRight}/>
          <View style={styles.CurveLeftCover}/>
        </View>
    </View>
  )
}
export default function SideMenu({ open, setOpen, setPage, unit }) {
  let iconAnim, optionsAnim, width = 3 * unit;

  
  if (open === true) {
    iconAnim = new Animated.Value(0);
    optionsAnim = new Animated.Value(0);
    Animated.timing(
      iconAnim,
      {
        toValue: - width,
        duration: 500,
        useNativeDriver: false
      }
    ).start();    
    Animated.timing(
      optionsAnim,
      {
        toValue: width,
        delay: 250,
        duration: 400,
        useNativeDriver: false
      }
    ).start();
  } else if (open === false) {
    iconAnim = new Animated.Value(- width);
    optionsAnim = new Animated.Value(width);
    Animated.timing(
      optionsAnim,
      {
        toValue: 0,
        duration: 250,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      iconAnim,
      {
        toValue: 0,
        delay: 100,
        duration: 500,
        useNativeDriver: false
      }
    ).start()
  } else {
    iconAnim = 0;
    optionsAnim = 0;
  }
  return (<>
    <Animated.View style={{width: optionsAnim}}>
      <SideBar unit={unit} setOpen={setOpen} setPage={setPage}/>
    </Animated.View>
    <Animated.View style={{top: iconAnim, left: iconAnim}}>
      <Icon unit={unit} setOpen={setOpen}/>
    </Animated.View>
  </>)
}