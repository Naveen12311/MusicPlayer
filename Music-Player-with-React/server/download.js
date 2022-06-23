const https = require('https');
const fs = require('fs');
const path = require('path');
var Stream = require('stream').Transform;

const ytdl = require('ytdl-core');

const musicFolderPath = path.resolve(__dirname, '../assets/music');
const imagesFolderPath = path.resolve(__dirname, '../images');

function validateName(name) {
    if (!name) return false;
	if (name.length > 255) return false;
	if (new RegExp(/[<>:"/\\|?*\u0000-\u001F]/g).test(name) || new RegExp(/^(con|prn|aux|nul|com\d|lpt\d)$/i).test(name)) return false;
	if (name === '.' || name === '..') return false;
    
    return true;
}// taken from https://github.com/sindresorhus/valid-filename

module.exports = async (query) => {
    const vidUrl = query;
    if (!vidUrl.startsWith('https://www.youtube.com/watch?v=') && !vidUrl.startsWith('https://youtube.com/watch?v=')) return false;
    const musicData = require('./musicData.json');
    const excludedTags = require('./excludedTags.json');
    
    const data = (await ytdl.getBasicInfo(vidUrl)).videoDetails;

    const artistName = data.media.artist || data.author.name;
    const vidName = data.media.song ? 
                        `${data.media.song} - ${artistName}` :
                    data.title
    let pathName = data.media.song ? 
                        `${data.media.song.replace(/\s+/g, '_')}-${artistName.replace(/\s+/g, '_')}` :
                    data.title.replace(/\s+/g, '_');
    //path must be appropriate
    
//toDo    if (!validateName(pathName)) pathName = 'uuid?';
                    
    const profile = {
        artist: artistName,
        url: data.video_url,
        pathName: pathName,
        tags: data.keywords?.filter(tag => !excludedTags.includes(tag)),
    }

    if (!(vidName in musicData)) {
        musicData[vidName] = profile;
        fs.writeFileSync(path.resolve(__dirname, './musicData.json'), JSON.stringify(musicData));
    }// if this data doesn't exist, add it
    if (!fs.readdirSync(imagesFolderPath).includes(vidName + '.jpg')) {
        const imageUrl = data.thumbnails.find(el => el.width === 336).url;
        https.request(imageUrl, resImage => {
            let body = new Stream();
            resImage.on('data', chunk => body.push(chunk));
            resImage.on('end', () => {
                let imagePath = path.resolve(imagesFolderPath, pathName + '.jpg');
                fs.writeFileSync(imagePath, body.read());
            });
            resImage.on('error', console.log);
        }).on('error', () => {
            // happens
        }).end();// download thumbnail
    }// if this image doesn't exist, add it
    if (!fs.readdirSync(path.resolve(imagesFolderPath, 'artists')).includes(artistName + '.jpg')) {
//ToDo
    }// if this image doesn't exist, add it
    if (!fs.readdirSync(musicFolderPath).includes(pathName + '.mp3')) {
        const stream = ytdl(vidUrl, { filter: 'audioonly'}).pipe(fs.createWriteStream(path.resolve(musicFolderPath, pathName + '.mp3')));

        stream.on('finish', () => {}); 
        stream.on('error', (err) => console.log(err));
    }// if this video doesn't exist, add it
}