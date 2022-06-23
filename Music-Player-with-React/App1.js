import React, { useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, BackHandler, Text } from 'react-native';
import Player from './client/routes/Player.js';
import Playlist from './client/Playlist.js';
import UserMessage from './client/UserMessage.js';


import { palette, messages } from './client/SharedUtilities.js';
const { black } = palette;


export default function App() {
  const [windowW, setW] = useState(Dimensions.get('window').width);
  const [windowH, setH] = useState(Dimensions.get('window').height);

  
  Dimensions.addEventListener('change', change => {
    setW(change.window.width);
    setH(change.window.height);
  });

  const [userMessage, setUserMessage] = useState(null);

  Object.keys(require('./server/musicData.json')).forEach(({title}) => Playlist.add(title))

  return (
    <Player window={{width: windowW, height: windowH}} Playlist={Playlist} setUserMessage={setUserMessage}/>
  );
}