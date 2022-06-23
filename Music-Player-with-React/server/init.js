const fs = require('fs');
const path = require('path');
const http = require('http');

const ytSearch = require('yt-search');

const download = require('./download');
const musicData = require('./musicData.json');
const { musicFolderPath } = require('./settings.json');

function deleteSong(song) {
    if (fs.existsSync(path.resolve(__dirname, '../images', musicData[song].pathName + '.jpg'))) fs.unlinkSync(path.resolve(__dirname, '../images', musicData[song].pathName + '.jpg'));
    if (fs.existsSync(path.resolve(__dirname, '../music', musicData[song].pathName + '.mp3'))) fs.unlinkSync(path.resolve(__dirname, '../music', musicData[song].pathName + '.mp3'));
    delete musicData[song];
    fs.writeFileSync(path.resolve(__dirname, './musicData.json'), JSON.stringify(musicData));
}

async function routes(req, res) {
    res.setHeader('Access-Control-Allow-Origin' , '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const action = req.url.split('/')[1];
    const query = decodeURI(req.url.replace(/\/\w*\//, ''));// everything after '/search/' or '/download/'
    console.log(action, query);

    if (action === 'search') {
        let vids = await ytSearch(query);
        vids = vids.all.map(el => {return {
            title: el.title,
            url: el.url,
            thumbnail: el.thumbnail
        }});
        
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.write(JSON.stringify(vids));
        return res.end();
    }

    if (action === 'download') {
        await download(query);
        return res.end();
    }

    if (action === 'delete') {
        deleteSong(query);
        return res.end();
    }

    if (action === 'promptToDownload') {
        const downloadedSongs = fs.readdirSync(musicFolderPath);
        let songsToDownload = [];

        for (song in musicData) {
            if (!downloadedSongs.includes(musicData[song].pathName + '.mp3')) {
                songsToDownload.push({
                    title: song,
                    url: musicData[song].url,
                });
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(songsToDownload));

        return res.end();
    }

    if (action === 'downloadAll') {
        const buffers = [];

        for await (const chunk of req) {
            buffers.push(chunk.toString());
        }

        let songs = JSON.parse(buffers.join(''));

        for (let i = 0; i < songs.length; i++) {
            await download(songs[i].url);
        }

        return res.end();
    }

// improve
    if (action === 'checkSongs') {
        for (let i = 0; i < songs.length; i++) {
            let songPath = path.resolve(musicFolderPath, songs[i]);
            if (fs.lstatSync(songPath).size === 0) {
                let song = Object.entries(musicData).find(([key, value]) => value.pathName === songs[i].replace('.mp3', ''))[0];
                deleteSong(song)
            }
        }
    }

    if (action === 'getSong') {
        let songPath = path.resolve(musicFolderPath, query + '.mp3');
        
        if (!fs.existsSync(songPath)) return res.end();

        res.setHeader('Content-Type', 'audio/mpeg');
        res.write(fs.readFileSync(songPath));
        return res.end();
    }

    res.write('');
    res.end();
}

const server = http.createServer(routes);
server.listen(3000);