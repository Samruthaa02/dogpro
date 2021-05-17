var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed,lastFed=0;
var foodLeft;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(400,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  feed=createButton("Feed The Dog");
  feed.position(800,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(400,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  var feedtimeRef=database.ref("FeedTime")
  feedtimeRef.on("value",function(data){
    lastFed=data.val();
    foodObj.getFedTime(lastFed)
    console.log(lastFed)
  })
  
 
  //write code to display text lastFed time here
  //var title=createElement("h3");
  textSize(20);
  fill("blue")
  text("LastFed = "+lastFed,400,75);
  //title.position(600,95)

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  foodLeft=foodObj.getFoodStock();
  if(foodLeft<=0){
    foodObj.updateFoodStock(foodLeft*0);
  }
  else{
    foodObj.updateFoodStock(foodLeft-1)
  }
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
  });
  

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
