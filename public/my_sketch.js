let video;
let handpos;
let hands=[];
let imagess=[];
let drawings=[];
let six=[];
let yChart=0;

let socket = io();


function preload(){
  handpos=ml5.handPose({flipped:true});
}

function setup() {
  createCanvas(1200,800);
  video=createCapture(VIDEO,{flipped:true});
  video.hide();
  handpos.detectStart(video,gotHands);
  //background(250,228,131,77);
  background(255);
  pixelDensity(1);
}

function draw() {
  //background(220);
  image(video,0,0,60,60);
  //six.push(loadPixels());
//   if(six.length==6){
//     for(let i=0;i<width;i++){
//       for(let j=0;j<height;j++){
//         let sum=0;
//         for(let g=0;g<six.length;g++)
//           sum+=six[g]        
//       }
      
//     }
    
//   }
  noStroke();
  if(hands.length>0){
    let currHand=hands[0];
    for (let i=0;i<currHand.keypoints.length;i++){
      let currKey=currHand.keypoints[i];
      fill(237, 177, 81,4);
      circle(currKey.x,currKey.y,22);
      
    }
    if(hands.length>1){
    let currHand=hands[1];
    for (let i=0;i<currHand.keypoints.length;i++){
      let currKey=currHand.keypoints[i];
      fill(245, 138, 66,4);
      circle(currKey.x,currKey.y,22);
      
    }
    
    }
  }
}

function mousePressed(){
  loadPixels();
  let sqSize=200;
  let scal=width/sqSize;
  let endX=width-sqSize;
  for (let x = 0; x < width-sqSize; x+=scal) { 
    for (let y = 0; y < height; y+=scal) {
      index = 4 * (x + width * y);
     
        indexRight = 4 * ((x/scal+endX) + width * (y/scal+yChart));
          pixels[indexRight ]=pixels[index];
          pixels[indexRight +1] = pixels[index+1];
          pixels[indexRight +2] = pixels[index+2];
          pixels[indexRight +3] = pixels[index+3];
      
    }
  }
  yChart+=sqSize-40;
  if(yChart>height)
    yChart=0;
  updatePixels();
  fill(255);
  rect(0,0,endX,height);
  rect(endX,yChart,endX,height);
  
}

function gotHands(results){ hands=results;}