//Create variables here
var dog, happyDog, database, foodS, foodStock,foodCount,database;
var fedTime,lastfed;
var foodObj;
var changeState,readState;
var bedroom, garden,washroom;
function preload(){
  //load images here
  dogimg=loadImage("images/Dog.png");
  dog2img=loadImage("images/happydog.png");
  bedroom=loadImage("virtual pet images/Bed Room.png");
  garden=loadImage("virtual pet images/Garden.png");
  washroom=loadImage(" virtual pet images/Wash Room.png");
}

function setup(){
  database = firebase.database();
  createCanvas(1000,500);
  
  dog=createSprite(800,250);
  dog.addImage(dogimg);
  dog.scale=0.2;

  foodObj=new Food();
  foodStock=database.ref('Food');
  foodStock.on("value",readstock);

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastfed=data.val();
  })

  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
}
function draw(){  
  background(46,139,87);
  currentTime=hour();
  if(currentTime==(lastfed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastfed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastfed+2&&currentTime<=(lastfed+4))){
    update("bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dog2img);
  }
  fill(255,255,254);
  textSize(15);
  if(lastfed>=12){
    text("last Feed : "+lastfed+"PM",200,40)
  }
  else if(lastfed==0){
    text("Last Feed : 12 AM",200,40)
  }
  else{
    fill("blue")
    text("Last Feed : "+lastfed+"AM",200,40)
  }
  textSize(30);
  fill("black");
  stroke("black");
  text("FoodRemaining:"+foodS,100,100);
  
  drawSprites();
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function feedDog(){
  dog.addImage(dog2img);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState : "Hungry"
  })
}
//Fuction to read values from db
function readstock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
//Fuction to write values from db
// function writeStock(x){
//   if (x<=0){
//     x=0
//   }else{
//     x-=1
//   }
//   database.ref('/').update({
//     Food:x
//   })
// }
function update(state){
  database.ref('/').update({
    gameState:state
  });
}