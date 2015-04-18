var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

var sprite;
var cursors;
var ground;
var ant;
var platforms;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;


function preload(){
	game.load.image('backgroundA1','assets/images/backgroundA1.png');
	game.load.image('grounda1', 'assets/images/grounda3.png');
	game.load.spritesheet('ant', 'assets/images/anta5.png', 44, 24, 5);
	game.load.image('platforma1', 'assets/images/platforma1.png');
}


function create(){

	game.add.image(0, 0, 'backgroundA1');

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#123333';

	ground = game.add.sprite(0, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');
	ant = game.add.sprite(50, 350, 'ant');
	ant.animations.add('walk', [0,1,2,3,4], 15, true);

	game.physics.enable([ant, ground], Phaser.Physics.ARCADE);
	
	//Loads first level
	platforms = new Phaser.Group(game);
	loadLevel1();

	ant.body.gravity.y = 400;
	ant.anchor.setTo(.5, .5);

	//Enables physics for all loaded platforms
	ground.body.immovable = true;
	platforms.forEach(function(item){
	    game.physics.enable([ant, item], Phaser.Physics.ARCADE);
	    item.body.immovable = true;
	}, this);

	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

}

function update(){
 	game.physics.arcade.collide(ant, ground);
	
	platforms.forEach(function(item){
	    game.physics.arcade.collide(ant,item);
	}, this);

 	if(leftKey.isDown || aKey.isDown){
 		ant.body.velocity.x = -270;
 		ant.scale.x = -1;
 		ant.play('walk');
 	} else if(rightKey.isDown || dKey.isDown){
 		ant.body.velocity.x = 270;
 		ant.scale.x = 1;
 		ant.play('walk');
 	} else {
 		ant.body.velocity.x = 0;
 		ant.animations.stop();
 	}

 	if((upKey.isDown || wKey.isDown) && ant.body.velocity.y ==0){
 		ant.body.velocity.y = -290;
 	}
 	//Handles input

}


function loadLevel1(){
	var read = new XMLHttpRequest();
	read.open('GET', 'assets/levels/level1.txt', false);
	read.send();
	var platformInfo = read.responseText.split(',');
	for(i = 0; i < platformInfo.length; i+=2){
		platforms.add(game.add.sprite(parseInt(platformInfo[i]), parseInt(platformInfo[i+1]), 'platforma1'));	
	}
}


