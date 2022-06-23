class Playlist {
    init(songs = []) {
        this.content = songs;
        this.setCurrent(0);
    }
    add(song) {
        return this.content.push(song);
    }
    remove(song) {
        if (!this.exists(song)) return;

        return this.content.splice(this.content.indexOf(song), 1);
    }
    clear() {
        return this.content = [];
    }
    move(title1, title2) {
        if (!this.exists(title1)) return;
        if (!this.exists(title2)) return;

        this.content.splice(this.content.indexOf(title1), 1);

        let i = this.content.find(song => song.title === title2);

        this.content.splice(i, 0, title1);

        return this.content;
    }
    next() {
        const i = this.content.indexOf(this.currentSong);
        
        return this.setCurrent(
            i === this.content.length - 1 ? this.content[0] : this.content[i + 1]
            )
        }
    prev() {
        const i = this.content.indexOf(this.currentSong);

        return this.setCurrent(
            i === 0 ? this.content[this.content.length - 1] : this.content[i - 1]
        )
    }
    setCurrent(song) {
        if (!this.exists(song)) return;
        if (this.content.length < 2) return this.currentSong = this.nextSong = this.prevSong = song;

        const i = this.content.indexOf(song);
        
        this.nextSong = i === this.content.length - 1 ? this.content[0] : this.content[i + 1];
        
        this.prevSong = i === 0 ? this.content[this.content.length - 1] : this.content[i - 1];
        
        return this.currentSong = song;
    }
    exists(song) {
        const data = require('../server/musicData.json')
        return !!song && this.content.includes(song) && 
            (song in data)
    }
}

export default new Playlist()