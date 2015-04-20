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
var spikes;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;
var spaceBar;
var landing;
var onGround;

var pillar;
var pillars;
var pillarBase;
var backDrops;

var lTimer;

var backgroundX;
var backTrack;
var backMove;


var shouldGenerate;
var backgroundGenPos;
var cobblestoneGroup;

var nextColumnXPosition;
var isDead;
var deadTimer;

var originXPosition;
var explosion;

function preload(){
	game.load.image('backgroundA1','assets/images/backgroundA2.png');
	game.load.image('grounda1', 'assets/images/grounda4.png');
	game.load.spritesheet('ant', 'assets/images/anta12.png', 44, 24, 23);
	game.load.spritesheet('explosion', 'assets/images/explosiona1.png', 71, 100, 18);
	game.load.image('platforma1', 'assets/images/platformb1.png');
	game.load.image('spikes', 'assets/images/spikes.png');
	game.load.image('pi1', 'assets/images/pi_1.png');
	game.load.image('pi2', 'assets/images/pi_2.png');
	game.load.image('pi3', 'assets/images/pit_3.png');
	game.load.image('pi4', 'assets/images/pit_4.png');
	game.load.image('pi5', 'assets/images/pit_5.png');
	game.load.image('pi6', 'assets/images/pi_6.png');
	game.load.image('pi7', 'assets/images/pi_7.png');
}


function create(){
	onGround = false;

    game.world.setBounds(0, 0, 1640, 560);
	backDrops = game.add.group();

	shouldGenerate = 0;
	backgroundGenPos = 0;

	backDrops.create(backgroundGenPos,0, 'backgroundA1');

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#123333';

	//Loads first level
	platforms = new Phaser.Group(game);
	loadLevel1();
	deadTimer = 0;

	cobblestoneGroup = new Phaser.Group(game);
	cobblestoneGroup.create(0, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');

	pillar = game.add.group();
	pillars = game.add.group();
	pillarBase = game.add.group();

	isDead = false;

	generatePillar(460,0);
	nextColumnXPosition = 1180;
	generatePillar(nextColumnXPosition, 8);



	originXPosition = 620;

	ant = game.add.sprite(originXPosition, -50, 'ant');

	

	/////////////////////////////
	//Spawn spikes
	////////////////////////////
	spikes = new Phaser.Group(game);
	for(i = 0; i < 10; i++){
	    //spikes.add(game.add.sprite((400+80*i), 510, 'spikes'));
	}

	ant.animations.add('idle', [0,1,2,3,4,5,6], 10, true);
	ant.animations.add('run', [7,8,9,10,11,12,13], 10, true);
	ant.animations.add('land', [14,15,16,17,18,19,20], 15, false);
	ant.animations.add('jump', 21, 10, true);
	ant.animations.add('dead', [22], 10, true);


	explosion = game.add.sprite(900, 100, 'explosion');
	explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,12,13,14,15,16,17], 20, false);
	explosion.animations.add('stop', [17], 20, true);

	game.physics.enable([ant, backDrops], Phaser.Physics.ARCADE);

	ant.body.gravity.y = 800;
	ant.body.collideWorldBounds = true;
	ant.anchor.setTo(.5, .5);
	lTimer = 0;

	explosion.animations.play('stop');

	cobblestoneGroup.forEach(function(item){
			game.physics.enable([ant, item], Phaser.Physics.ARCADE);
			item.body.immovable = true;
	}, this);

	platforms.forEach(function(item){
	    game.physics.enable([ant, item], Phaser.Physics.ARCADE);
	    item.body.checkCollision.down = false;
	    item.body.checkCollision.left = false;
	    item.body.checkCollision.right = false;
	    item.body.immovable = true;
	}, this);
	spikes.forEach(function(sp){
	    game.physics.enable([ant, sp], Phaser.Physics.ARCADE);
	    sp.body.immovable = true;
	}, this);

	generateMorePlatforms(10);

	//Defines input keys
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
	spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	game.camera.follow(ant);

}

function explode(xPos, yPos){
	if(!isDead){
		explosion.x = xPos - 10;
		explosion.y = yPos - 75;
		explosion.scale.x = 2;
		explosion.scale.y = 2;
		explosion.play('explode');
		isDead = true;
	}
}

function generatePillar(xPos, crackPos){
	for(var i = 0; i < 14; i++){
		var pil;
		if(i == 0){
			pil = pillarBase.create(xPos, 40 * i, 'pi7');
		} else if (i==1){
			pil = pillarBase.create(xPos, 40 * i, 'pi6');
		} else if (i==12){
			pil = pillarBase.create(xPos, 40 * i, 'pi2');
		} else if (i==13){
			pil = pillarBase.create(xPos, 40 * i, 'pi1');
		} else if (((i == crackPos+1) || (i==crackPos+2))&&crackPos!=0){
			if(i == crackPos+1){
			pil = pillar.create(xPos + 15, 40*(crackPos + 2), 'pi4')
			} else if(i == crackPos+2){
			pil = pillar.create(xPos + 15, 40*(crackPos + 1), 'pi5');
			}
		} else {
			pil = pillar.create(xPos + 15, 40 * i, 'pi3');
		}
		pil.enableBody = true;
		game.physics.arcade.enable(pil);
		pil.body.immovable = true;
	}

	shouldGenerate++;
	if(shouldGenerate%2==0){
		backgroundGenPos+=1640;
		backDrops.create(backgroundGenPos, 0, 'backgroundA1');
		//ground = game.add.sprite(backgroundGenPos, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');
		//ground.immovable = true;
		var cob = cobblestoneGroup.create(backgroundGenPos, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');
		cob.enableBody = true;
		game.physics.arcade.enable(cob);
		cob.body.immovable = true;
	}
}

function update(){
	if(!isDead){
		game.physics.arcade.collide(ant, pillar, pillCollide, null, this);
		game.physics.arcade.collide(ant, pillarBase, pillCollide, null, this);
		//////////////////////////////////////////////
		// EDIT FOR SPIKE DEATH
		// ///////////////////////////////////////////
		spikes.forEach(function(item){
		    game.physics.arcade.collide(ant, item, function(){theDeadMethod();}, null, this);
		}, this);
    } else {
    	ant.animations.play('dead');
    	if(ant.body.velocity > 0){
    		ant.body.velocity = -ant.body.velocity;
    	}
    }
    if(!onGround){
		platforms.forEach(function(item){
		    game.physics.arcade.collide(ant, item, onSurface, null, this);
		}, this);
		cobblestoneGroup.forEach(function(item){
			game.physics.arcade.collide(ant, item, onSurface, null, this);
		}, this);
	} else {
		platforms.forEach(function(item){
		    game.physics.arcade.collide(ant, item);
		}, this);
		cobblestoneGroup.forEach(function(item){
			game.physics.arcade.collide(ant, item);
		}, this);
	}

	if(Math.abs(ant.body.velocity.y > 0)){
		onGround = false;
	}

 	lTimer++;

 	if(!isDead){
	 	if(leftKey.isDown || aKey.isDown){
	 		ant.body.velocity.x = -270;
	 		ant.scale.x = -1;
	 		if(lTimer > 30){
	 			ant.animations.play('run');
	 		}
	 		//backTrack.body.velocity.x = 20;

	 	} else if(rightKey.isDown || dKey.isDown){
	 		ant.body.velocity.x = 270;
	 		ant.scale.x = 1;
	 		if(lTimer > 30){
	 			ant.animations.play('run');
	 		}
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
 	}
	///////////////////////////////
	//Explosion
	///////////////////////////////
	if(!isDead && deadTimer!=0){
		deadTimer = 0;
	}
	if(isDead){
		deadTimer++;
		if(deadTimer > 100){
			ant.body.velocity.x = -400;
			ant.body.gravity.y = 0;
			ant.enableBody = false;		
		} else {
			ant.body.velocity.x = 0;
		}
	}

	if(spaceBar.isDown){
	   explode(ant.body.x, ant.body.y);
	    isDead = true;
	    ant.animations.stop();
	   	ant.animations.play('dead');
		ant.body.gravity.y = 0;
		ant.enableBody = false;	

	}

 	if(backMove==true){
 		//backTrack.body.velocity.x = -ant.body.velocity.x;
 	}

 	 if(isDead && (ant.body.x < originXPosition)){
		ant.body.x = originXPosition;
 		ant.body.y = -50;
 		ant.body.gravity.y = 800;
 		isDead = false;
 	}

}

function theDeadMethod(){

}

function pillCollide(ant, pilC){
	if((pilC.key == 'pi4' || pilC.key == 'pi5') && spaceBar.isDown){
	    pilC.kill();
	    game.world.setBounds(0,0, game.world.getBounds().width + 820 ,560)
	    nextColumnXPosition+=720;
	    var cYPos = Math.floor((Math.random() * 9) + 1);
	    generatePillar(nextColumnXPosition, cYPos);
	   	generateMorePlatforms(10);

	   	console.log('cYpos: ' + cYPos);
	}
}

function generateMorePlatforms(howMany){
	//THIS NEEDS WORK
	for(var f = 0; f < howMany; f++){
		platforms.add(game.add.sprite(nextColumnXPosition + 100 + (Math.random() * 720), (Math.random() * 560), 'platforma1'));
	}
	platforms.forEach(function(item){
	    game.physics.enable([ant, item], Phaser.Physics.ARCADE);
	    item.body.checkCollision.down = false;
	    item.body.checkCollision.left = false;
	    item.body.checkCollision.right = false;
	    item.body.immovable = true;
	}, this);
}


function loadLevel1(){
	// var read = new XMLHttpRequest();
	// read.open('GET', 'assets/levels/level1.txt', false);
	// read.send();
	// var platformInfo = read.responseText.split(',');
	// for(i = 0; i < platformInfo.length; i+=2){
	// 	platforms.add(game.add.sprite(parseInt(platformInfo[i]), parseInt(platformInfo[i+1]), 'platforma1'));	
	// }
	//JOSH I COMMENTED THIS OUT SO I COULD TRY RANDOM PLATFORM GENERATION
}


function onSurface(){
	onGround = true;
	lTimer = 0;
	ant.animations.play('land');
}
