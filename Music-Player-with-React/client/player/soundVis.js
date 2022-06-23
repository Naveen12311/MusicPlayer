let temp

const container = document.getElementById('container');
const file = document.getElementById('fileUpload');
let bufferLength;
let dataArray;
let barWidth;
let barHeight;
let x = 0;
function animation(){};
let numOfBars;
let flag = 1;


const canvas = document.getElementById('canvas1');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
const audio1 = document.getElementById('audio1');
    audio1.src = '../HTML/W.mp3';
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audio.crossOrigin="anonymous"
const selector = document.querySelector('select');
    let type = selector.options[selector.selectedIndex].value;
        
let audioSource = audioContext.createMediaElementSource(audio1);
let analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    
audio1.addEventListener('playing',function (){
    function animate() {
        size();
        x = 0;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        animation();
        requestAnimationFrame(animate);
    }
    animate();
});

    function size() {
        analyser.fftSize = 32 * Math.pow(2,numOfBars);
        // number & width of bars
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
    }
    
    function select() {
        flag *= -1;
        if (flag > 0) return
        type = selector.options[selector.selectedIndex].value;
        numOfBars = (type[0] == 'c' ? 4 : type == 'm' ? 1 : 2);
        switch (type) {
            case 'm':
                animation = middle;
                break;
            case 'c1':
                animation = circle1;
                break;
            case 'c2':
                animation = circle2;
                break;
            case 'c3':
                animation = circle3;
                break;      
            default:
                animation = normal;
                break;
        };
        size();
    }
    select();
    function normal() {
        barWidth = canvas.width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
                //   bufferLength      0      i--
                barHeight = (dataArray[i] * 1.2 || 1);
                //
                // ctx.fillStyle = 'white';
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                ctx.fillRect(x,canvas.height - barHeight - 30, barWidth, 15);
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                //
                ctx.fillRect(x,canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
                // console.log(x);
            }
    }
    function middle() {
        barWidth = canvas.width / 2 / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 1.2;
                //
                // ctx.fillStyle = 'white';
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                ctx.fillRect(canvas.width / 2 - x,canvas.height - barHeight - 30, barWidth, 15);
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                //
                ctx.fillRect(canvas.width / 2 - x,canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
            }
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 1.2;
                //
                // ctx.fillStyle = 'white';
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                ctx.fillRect(x,canvas.height - barHeight - 30, barWidth, 15);
                ctx.fillStyle = 'rgb('+ i * barHeight/20 +','+ i * 4 +','+ barHeight/2 +')';
                //
                ctx.fillRect(x,canvas.height - barHeight, barWidth, barHeight);
                x += barWidth;
            }
        }
    function circle1() {
        barWidth = canvas.width / bufferLength;
        let hue = 0;
        let num = 0;
        let interval = 30;
        let time = 1;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 1.5;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(i * Math.PI * 8 / bufferLength)
            //                       2
            // hue = (i * audio1.currentTime / 3)
            time = Math.trunc(audio1.currentTime / interval) % 2 == 0 ? (audio1.currentTime % interval) : interval - (audio1.currentTime % interval);
            hue = i * time / 2
            //             speed
            ctx.fillStyle = 'hsl(' + hue + ',100%,50%)';
            //                                light
            ctx.fillRect(0,0, barWidth, barHeight);
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0, barWidth, 5);
            x += barWidth;
            ctx.restore();
        }
    }
    function circle2() {
        barWidth = canvas.width / bufferLength;
        let hue = 0;
        let interval = 4
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 1.5;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(i * Math.PI * 2 / bufferLength)
            time = Math.trunc(audio1.currentTime / interval) % 2 == 0 ? (audio1.currentTime % interval) : interval - (audio1.currentTime % interval);
            hue = i * time / 2
            ctx.fillStyle = 'hsl(' + hue + ',100%,50%)';
            ctx.fillRect(0,0, barWidth, barHeight);
            x += barWidth;
            ctx.restore();
        }
    }
    function circle3() {
        barWidth = canvas.width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 1.5;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            const hue = i;
            // ctx.rotate(Math.atan(Math.sin(x)/Math.cos(x)) * Math.PI)
            ctx.fillStyle = 'hsl(' + hue + ',100%,50%)';
            ctx.fillRect(Math.cos(x)*200,Math.sin(x)*200, barWidth, barHeight);
            x += barWidth;
            ctx.restore();
        }
    }

window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
file.addEventListener('change',function(e){
    audio1.src = URL.createObjectURL(this.files[0]);
});
