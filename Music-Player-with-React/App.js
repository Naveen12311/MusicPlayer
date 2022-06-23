import React, { useState } from 'react';
import { Dimensions, View, StyleSheet, TouchableWithoutFeedback, BackHandler } from 'react-native';

import Playlist from './client/Playlist.js';

import routes from './client/routes/index.js';
import SideMenu from './client/SideMenu.js';
import settings from './server/settings.json';
import UserMessage from './client/UserMessage.js';
import { url } from './server/config.json';
import { palette, messages } from './client/SharedUtilities.js';
const { black } = palette;


export default function App() {
  const [open, setOpen] = useState('first open');// first open -> in order to show it hasn't been opened yet
  const [currentPage, setCurrentPage] = useState('');// '' -> to detect the first rendering (must be falsy)
  const [userMessage, setUserMessage] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState(['Home']);

  const [windowH, setH] = useState(Dimensions.get('window').height);
  Dimensions.addEventListener('change', (change) => setH(change.window.height));
  let unit = windowH / 8;


  const changePage = page => {
    setCurrentPage(page);
    let arr = navigationHistory;
    if (page !== arr[arr.length - 1]) {// to prevent going back to the same page
      arr.push(page);
    }
    setNavigationHistory(arr);
  }
 

  BackHandler.addEventListener('hardwareBackPress', () => {
    setOpen(2)// prevent weird animation when renedering
    if (navigationHistory.length === 0) return false;
    
    let lastPage = navigationHistory.pop();
    if (lastPage === currentPage) lastPage = navigationHistory.pop();
    setCurrentPage(lastPage);
    setNavigationHistory(navigationHistory);

    return true;
  });
  

  if (currentPage === '' && settings.promptUserToDownloadSongs) {

    setCurrentPage('Player');
    
    const data = require('./server/musicData.json') 
    Playlist.init(Object.keys(data));

    fetch(`${url}/promptToDownload`).then(res => res.json()).then(async res => {
      if (res.length) {// res contains the songs as an array of [{title:..., url:...},...]
        return new Promise((resolve, reject) => {

          setUserMessage({// open user prompt
            ...messages.promptToDownload,
            arr: res.map(el => '· ' + el.title),
            callback: ans => {
              setUserMessage(null);// close user prompt
              resolve(ans);
            }
          });

        }).then(ans => {
          if (ans === 'No') return;

          res = JSON.stringify(res);
          fetch(`${url}/downloadAll`, {
            method: 'POST',
            body: res
          });
        
        });
        //prompt user to download all songs which aren't downloaded on the current device, but are in the database
      }
    }).catch(() => {});
  }
  const Body = routes[currentPage || 'Player'];

  // try Aha! by ptx (the ! is a problem )
  // have the last song load when opened for the first time

  return (
    <View style={style.app}>
        <SideMenu unit={unit} open={open} setOpen={setOpen} setPage={changePage}/>
        {userMessage && <UserMessage body={userMessage}/>}
        <TouchableWithoutFeedback onPress={() => open !== 'first open' && setOpen(false)}>
            <View style={style.body}>
              <Body Playlist={Playlist} setUserMessage={setUserMessage}/>
            </View>
        </TouchableWithoutFeedback>
    </View>
  );
}


const style = StyleSheet.create({
  app: {
    display: 'flex',
    flexDirection: 'row',
  },
  body: { 
    overflow: 'hidden',
    position: 'absolute',
    width:'100vw', 
    height:'100vh', 
    display: 'flex',
    alignItems: 'center',
    backgroundColor: black,
    zIndex: -1,
  }
})