var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

var sprite;
var cursors;
var ground;
var ant;
var platforms;
var levelSize;
var currentPosition;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;


var landing;
var onGround;

var pillar;
var pillars;

var lTimer;

function preload(){
	game.load.image('backgroundA1','assets/images/backgroundA1.png');
	game.load.image('grounda1', 'assets/images/grounda3.png');
	game.load.spritesheet('ant', 'assets/images/anta8.png', 44, 24, 21);
	game.load.image('platforma1', 'assets/images/platforma1.png');

	game.load.image('pi1', 'assets/images/pi_1.png');
	game.load.image('pi2', 'assets/images/pi_2.png');
	game.load.image('pi3', 'assets/images/pi_3.png');
	game.load.image('pi4', 'assets/images/pi_4.png');
	game.load.image('pi5', 'assets/images/pi_5.png');
	game.load.image('pi6', 'assets/images/pi_6.png');
	game.load.image('pi7', 'assets/images/pi_7.png');

}


function create(){


	onGround = false;

    game.world.setBounds(0, 0, 3000, 560);
	game.add.image(0, 0, 'backgroundA1');

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#123333';

	//Loads first level
	platforms = new Phaser.Group(game);
	loadLevel1();

	ground = game.add.sprite(0, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');

	pillar = game.add.group();
	pillars = game.add.group();


	generatePillar(0,0);
	

	
	ant = game.add.sprite(170, 350, 'ant');

	ant.animations.add('idle', [0,1,2,3,4,5,6], 10, true);
	ant.animations.add('run', [7,8,9,10,11,12,13], 10, true);
	ant.animations.add('land', [14,15,16,17,18,19,20], 15, false);
	ant.animations.add('jump', 21, 10, true);

	game.physics.enable([ant, ground], Phaser.Physics.ARCADE);
	
	ant.body.gravity.y = 800;
	ant.body.collideWorldBounds = true;
	ant.anchor.setTo(.5, .5);
	lTimer = 0;

	//Enables physics for all loaded platforms

	ground.body.immovable = true;

	platforms.forEach(function(item){
	    game.physics.enable([ant, item], Phaser.Physics.ARCADE);
	    item.body.checkCollision.down = false;
	    item.body.checkCollision.left = false;
	    item.body.checkCollision.right = false;
	    item.body.immovable = true;
	}, this);

	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

	game.camera.follow(ant);

}



function generatePillar(xPos, crackPos){


	for(var i = 0; i < 14; i++){
		var pil;
		if(i == 0){
			pil = pillar.create(xPos, 40 * i, 'pi7');
		} else if (i==1){
			pil = pillar.create(xPos, 40 * i, 'pi6');
		} else if (i==12){
			pil = pillar.create(xPos, 40 * i, 'pi2');
		} else if (i==13){
			pil = pillar.create(xPos, 40 * i, 'pi1');
		} else {
			pil = pillar.create(xPos, 40 * i, 'pi3');
		}
		pil.enableBody = true;
		game.physics.arcade.enable(pil);
		pil.body.immovable = true;
	}

	if(crackPos>1 && crackPos<10){
		crackPos += 2;
		var temp = pillar.getAt(crackPos);

		temp = pillar.create(xPos, 40*crackPos, 'pi4')
		var temp2 = pillar.getAt(crackPos+1);
		temp2 = pillar.create(xPos, 40*(crackPos-1), 'pi5');
	}

}


function update(){

	game.physics.arcade.collide(ant, pillar, pillCollide, null, this);
    
    if(!onGround){
		platforms.forEach(function(item){
		    game.physics.arcade.collide(ant, item, onSurface, null, this);
		}, this);
	} else {
		platforms.forEach(function(item){
		    game.physics.arcade.collide(ant, item);
		}, this);
	}

	if(!onGround){
		game.physics.arcade.collide(ant, ground, onSurface, null, this);
		
	} else {
		game.physics.arcade.collide(ant, ground);
	}

	if(Math.abs(ant.body.velocity.y > 0)){
		onGround = false;
	}

	//ant.animations.isFinished(cod());

 	
 	//ant.play('idle');
 	lTimer++;

 	if(leftKey.isDown || aKey.isDown){

 		ant.body.velocity.x = -270;
 		ant.scale.x = -1;
 		if(lTimer > 30){
 			ant.animations.play('run');
 		}
 	} else if(rightKey.isDown || dKey.isDown){
 		ant.body.velocity.x = 270;
 		ant.scale.x = 1;
 		ant.animations.play('run');
 	} else {
 		//ant.body.velocity.x = 0;
 		if(lTimer > 30){
 			ant.animations.play('idle');
 		}
 		ant.body.acceleration.x = -5 * ant.body.velocity.x;
 	}

 	if(ant.body.velocity.y!=0){
 		ant.animations.play('idle');
 	}
 	if((upKey.isDown || wKey.isDown) && ant.body.velocity.y ==0){
 		ant.body.velocity.y = -500;
 	}
 	//Handles input

}

function pillCollide(ant, pilC){
	pilC.kill();
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


function onSurface(){
	onGround = true;
	lTimer = 0;
	ant.animations.play('land');

}
