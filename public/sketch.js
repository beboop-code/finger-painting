let socket = io();
let shouldPlay = false;

let video;
let handpos;
let hands=[];
let imagess=[];
let drawings=[];
let six=[];
let yChart=0;
let pastHandsX=[];
let pastHandsY=[];
let pastHandsX2=[];
let pastHandsY2=[];
let frameCount=-1;
let meToken=0;

//IDEA: This becomes movement tracking/edge detection instead of drawing and then 
// it can track two plants growing in different parts of the world on top of each other

function preload() {
    //img = loadImage('holdinghands.png');
    handpos=ml5.handPose({flipped:true});
}

function drawPrevHands(data){
    sentPastHandsX=data[0];
    sentPastHandsY=data[1];
    sentPastHandsX2=data[2];
    sentPastHandsY2=data[3];
    idToken=data[4];
    noStroke();
    if(idToken!=meToken){
        for (let i=0;i<sentPastHandsX.length;i++){
                    //let currKey=currHand.keypoints[i];
                    fill(45, 138, 266,4);
                    circle(sentPastHandsX[i],sentPastHandsY[i],22);
        }
        for (let i=0;i<sentPastHandsX2.length;i++){
            //let currKey=currHand.keypoints[i];
            fill(45, 138, 266,4);
            circle(sentPastHandsX2[i],sentPastHandsY2[i],22);
                
        }
    }
}

function sendFreq(){
    const data = [pastHandsX,pastHandsY,pastHandsX2,pastHandsY2,meToken];//[nameField.value(), freqInput.value()]
    socket.emit("frequency", data);
    console.log(data);
}

socket.on('freqResponse', (data) => {
    console.log(data);
    //UNCOMMENT FOR ROLLING LOG OF COORDINATES
    //freqState.html(data[0] + " changed the frequency to " + data[1]);
    drawPrevHands(data);
    //oscillator.freq(data[1], 0.250);
});

//log new users as they come into the room
socket.on('response', (data) => {
    console.log(data);
    freqState.html(data + " joined the room");
});

socket.on('trigger', (data) => {
    console.log(data[0]);
    console.log(data[1]); 
});

function submit() {
    socket.emit("name", nameField.value());
    freqState.html('idle...');
    //oscillator.start();
    shouldPlay = true;
}

async function setup() {
    createCanvas(1200,800);
    meToken=random(0,10000);
    video=createCapture(VIDEO,{flipped:true});
    video.hide();
    handpos.detectStart(video,gotHands);
    //background(250,228,131,77);
    background(255);
    pixelDensity(1);

    /* Tommy's
    createCanvas(400, 400);
    background(255, 255, 255, 0);
    imageMode(CENTER);
    image(img, width / 2, height / 2, 400, 400);
    noStroke();
    */
    //create name field and button
    //create instruction text
    instruction = createP('enter your nickname to begin');
    instruction.id('instruction');
    instruction.position(10, 170);
    nameField = createInput();
    nameField.id('name');
    nameField.attribute('placeholder', 'enter your nickname');
    nameField.position(10, 10);
    submitButton = createButton('Start Drawing!');
    submitButton.id('submit');
    submitButton.position(nameField.x + nameField.width + 10, 10);
    //submitButton.width=400;
    submitButton.mousePressed(submit);

    //create inputStuff section
    inputStuff = createDiv();
    inputStuff.id('inputStuff');
    inputStuff.position(10, 250);
    //create frequency input and button
    
    freqInput = createInput();
    freqInput.id('frequency');
    freqInput.attribute('placeholder', 'enter a frequency');
    freqInput.position(10, 50);
    
    sendButton = createButton('send');
    sendButton.id('send');
    sendButton.position(freqInput.x + freqInput.width + 10, 50);
    sendButton.mousePressed(sendFreq);
    
    //create play button
    buttonEl = createButton('stop');
    buttonEl.mousePressed(play);
    buttonEl.id('buttonText');
    buttonEl.position(10, 90);
    //create frequency state text
    freqState = createP('idle...');
    freqState.class('freqState');
    freqState.style('width', '400px');
    freqState.position(10, 130);

    //create name stuff section
    nameStuff = createDiv();
    nameStuff.id('nameStuff');
    nameStuff.position(10, 210);
    nameStuff.child(nameField);
    nameStuff.child(submitButton);
    //create input stuff section
    inputStuff.child(buttonEl);
    inputStuff.child(freqState);
    inputStuff.child(freqInput);
    inputStuff.child(sendButton);
    //create title
    title = createElement('h1', 'frequency links');
    title.position(10, -10);
    title.class('title');
    //create subtitle
    subtitle = createElement('p', 'a multi-person audio work');
    subtitle.position(10, 25);
    subtitle.class('subtitle');
    //attribution
    attribution = createElement('p', 'by Tommy (2023)');
    attribution.position(10, 35);
    attribution.class('attribution');
    //create a p5 sound oscillator
    oscillator = new p5.Oscillator(440, "square");
    oscillator.amp(0.33);
    del = new p5.Delay(0.210, 0.66);
    oscillator.disconnect();
    oscillator.connect(del);
}
function draw(){
    if(shouldPlay){
        frameCount++;
        if (frameCount%2==0 && !pastHandsX.length ==0){
            sendFreq();
            //this feels controversial - maybe delete later:
            pastHandsX=[];
            pastHandsY=[];
            pastHandsX2=[];
            pastHandsY2=[];

        }
        noStroke();
        if(hands.length>0){
            let currHand=hands[0];
            for (let i=0;i<currHand.keypoints.length;i++){
                let currKey=currHand.keypoints[i];
                fill(237, 177, 81,4);
                circle(currKey.x,currKey.y,22);
                pastHandsX.push(currKey.x);
                pastHandsY.push(currKey.y);
                
            }
            if(hands.length>1){
            let currHand=hands[1];
            for (let i=0;i<currHand.keypoints.length;i++){
                let currKey=currHand.keypoints[i];
                fill(245, 138, 66,4);
                circle(currKey.x,currKey.y,22);
                pastHandsX2.push(currKey.x);
                pastHandsY2.push(currKey.y);
                
            }
            
            }
    }
}
}


function play() {
    if (!shouldPlay) {
        //oscillator.start();
        //runDrawLoop();
        shouldPlay = true;
        buttonEl.html('stop');
    } else {
        //oscillator.stop();
        //exitDrawLoop();
        shouldPlay = false;
        buttonEl.html('play');
    }
}

function gotHands(results){ hands=results;}