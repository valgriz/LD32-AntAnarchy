var game = new Phaser.Game(820, 560, Phaser.AUTO, 'phaser-game',{preload: preload, create: create, update: update});

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

var spikeGroup;

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

var score;
var style;
var scoreDisplay;

var timeLeft;
var timeLeftDisplay;

var isHit;
var simpleTimer;

var gameOver;

var soua;
var soub;
var souc;
var soud;

var muted;

function preload(){
	game.load.image('backgroundA1','assets/images/backgroundA2.png');
	game.load.image('grounda1', 'assets/images/grounda4.png');
	game.load.spritesheet('ant', 'assets/images/anta13.png', 44, 24, 24);
	game.load.spritesheet('explosiona', 'assets/images/explosiona1.png', 71, 100, 18);
	game.load.image('platforma1', 'assets/images/platformb1.png');
	game.load.image('spikeSprite', 'assets/images/spikes2.png');
	game.load.image('pi1', 'assets/images/pi_1.png');
	game.load.image('pi2', 'assets/images/pi_2.png');
	game.load.image('pi3', 'assets/images/pit_3.png');
	game.load.image('pi4', 'assets/images/pit_4.png');
	game.load.image('pi5', 'assets/images/pit_5.png');
	game.load.image('pi6', 'assets/images/pi_6.png');
	game.load.image('pi7', 'assets/images/pi_7.png');
	game.load.audio('sa','assets/sounds/sounda.mp3');
	game.load.audio('sb','assets/sounds/soundb.mp3');
	game.load.audio('sc','assets/sounds/soundc.mp3');
	game.load.audio('sd','assets/sounds/soundd.mp3');
	game.load.audio('se','assets/sounds/sounde.mp3');
}


function create(){

	muted = false;

	soua = game.add.audio('sa');
	soub = game.add.audio('sb');
	souc = game.add.audio('sc');
	soud = game.add.audio('sd');
	soue = game.add.audio('se');

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

	isHit = false;
	gameOver = false;

	cobblestoneGroup = new Phaser.Group(game);
	cobblestoneGroup.create(0, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');

	spikeGroup = new Phaser.Group(game);

	pillar = game.add.group();
	pillars = game.add.group();
	pillarBase = game.add.group();

	isDead = false;

	generatePillar(460,0);
	nextColumnXPosition = 1180;
	generatePillar(nextColumnXPosition, 8);

	simpleTimer = 0;

	originXPosition = 640;

	ant = game.add.sprite(originXPosition, -50, 'ant');
	
	ant.animations.add('idle', [0,1,2,3,4,5,6], 10, true);
	ant.animations.add('run', [7,8,9,10,11,12,13], 10, true);
	ant.animations.add('land', [14,15,16,17,18,19,20], 15, false);
	ant.animations.add('jump', 21, 10, true);
	ant.animations.add('dead', [23], 10, true);

	explosion = game.add.sprite(900, 100, 'explosiona');
	explosion.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,12,13,14,15,16,17], 20, false);
	explosion.animations.add('stop', [17], 20, true);

	game.physics.enable([ant, backDrops, explosion], Phaser.Physics.ARCADE);
	explosion.enableBody = true;

	ant.body.gravity.y = 800;
	ant.body.collideWorldBounds = false;
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

	style = { font: "35px Arial", fill: "#ffffff", align: "center" };
	score = 0;
	scoreDisplay = game.add.text(20,20, "SCORE: " + score, style);
	scoreDisplay.setShadow(2,2, 'rgba(0,0,0,1)',0);
	scoreDisplay.fixedToCamera = true;

	timeLeft = 10;
	timeLeftDisplay = game.add.text(720,20, "TIME: " + timeLeft, style);
	timeLeftDisplay.setShadow(2,2, 'rgba(0,0,0,1)',0);
	timeLeftDisplay.fixedToCamera = true;


	game.input.keyboard.onUpCallback = function( e ){
            if(e.keyCode == Phaser.Keyboard.M){
                theMuteFunction();
            } else if(e.keyCode == Phaser.Keyboard.P){
            	alert('Game paused, click OK to resume.');
            }
    };

}

function theMuteFunction(){

	console.log('muted:' + muted);
	if(muted){
		
		alert('Sounds are on.');
		muted = false;
	} else {
		
		alert('Sounds are off.');
		muted = true;
	}
	console.log('muted:' + muted);
}

function playA(){
	if(!muted){
		if(!soua.isPlaying ){
			soua.play();
		}
	}
}

function playB(){
	if(!muted){
		if(!soub.isPlaying){
			soub.play();
		}
	}
}

function playC(){
	if(!muted){
		if(!souc.isPlaying){
			souc.play();
		}
	}
}

function playD(){
	if(!muted){
		if(!soud.isPlaying){
			soud.play();
		}
	}
}

function playE(){
	if(!muted){
		if(!soue.isPlaying){
			soue.play();
		}
	}
}

function checkExplosionCollision(){
	console.log('x: ' + explosion.x + ", y: " + explosion.y);
	
	pillar.forEach(function(item){
		    //game.physics.arcade.collide(explosion, item, function(){explosionCollided();}, null, this);
		}, this);
}


function explosionCollided(expl, pilC){
	
}

function explode(xPos, yPos){
	if(!isDead){
		explosion.body.x = xPos - 10;
		explosion.body.y = yPos - 75;
		explosion.scale.x = 2;
		explosion.scale.y = 2;
		explosion.play('explode');
		checkExplosionCollision();
		isDead = true;
		playA();
	}
}

function generatePillar(xPos, crackPos){
	for(var i = 0; i < 20; i++){
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
		} else if (i > 14){
			pil = pillar.create(xPos + 15, ((i - 14) * -20), 'pi3');
		} else {
			pil = pillar.create(xPos + 15, 40 * i, 'pi3');
		}
		pil.enableBody = true;
		game.physics.arcade.enable(pil);
		pil.body.immovable = true;
	}
	generateSpikes();
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

function spikeCollision(){
	if(!isDead){
		topScale();
				ant.anchor.setTo(.5,.5);
			   	explode(ant.body.x, ant.body.y);
			    isDead = true;
			    ant.animations.stop();
			   	ant.animations.play('dead');
				ant.body.gravity.y = 0;
				ant.enableBody = true;
				ant.body.y = -100;
				pillar.forEach(function(item){
				game.physics.arcade.overlap(ant, item, pillNC, null, this);
		}, this);
	}
}


function generateSpikes(){
	for(i = 0; i < 5; i++){
	  var spk = spikeGroup.create(1180 + (backgroundGenPos) + Math.floor((Math.random() * 1640) + 1), game.world.height - game.cache.getImage('spikeSprite').height - game.cache.getImage('grounda1').height,'spikeSprite');
	  spk.enableBody = true;
	  game.physics.arcade.enable(spk);
	  spk.body.immovable = true;
	}
}

function update(){
	if(!isDead){
		game.physics.arcade.collide(ant, spikeGroup, spikeCollision, null, this);
		game.physics.arcade.collide(ant, pillar, pillCollide, null, this);
		game.physics.arcade.collide(ant, pillarBase, pillCollide, null, this);
		
		//////////////////////////////////////////////
		// EDIT FOR SPIKE DEATH
		// ///////////////////////////////////////////

    } else {

    	ant.animations.play('dead');
    	if(ant.body.velocity > 0){
    		ant.body.velocity = -ant.body.velocity;
    		resetScale();
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
	 			if(!souc.isPlaying){
	 				//playC();
	 			}
	 		}
	 		//backTrack.body.velocity.x = 20;

	 	} else if(rightKey.isDown || dKey.isDown){
	 		ant.body.velocity.x = 270;
	 		ant.scale.x = 1;
	 		if(lTimer > 30){
	 			ant.animations.play('run');
				if(!souc.isPlaying){
	 				//playC();
	 			} 	
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
	 		playD();
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
			ant.body.gravity.y = 10;
			
			ant.enableBody = false;		
		} else {
			ant.body.velocity.x = 0;
			if(isHit){
				score++;
	   			scoreDisplay.setText('SCORE: ' + score);
				isHit = false;
				timeLeft += 10 + (2 *score);
			}

		}
	}


	if(spaceBar.isDown){
		topScale();
		ant.anchor.setTo(.5,.5);
	   	explode(ant.body.x, ant.body.y);
	    isDead = true;
	    ant.animations.stop();
	   	ant.animations.play('dead');
		ant.body.gravity.y = 0;
		ant.enableBody = true;	
		pillar.forEach(function(item){
		game.physics.arcade.overlap(ant, item, pillNC, null, this);
	}, this);
		ant.enableBody = false;
	}

 	if(backMove==true){
 		//backTrack.body.velocity.x = -ant.body.velocity.x;
 	}

 	 if(isDead && (ant.body.x < originXPosition)){
		ant.body.x = originXPosition;
 		ant.body.y = -50;
 		ant.body.gravity.y = 800;
 		resetScale();
 		isDead = false;
 		playB();
 	}

 	timeLeftDisplay.cameraOffset.y = 20;
 	timeLeftDisplay.cameraOffset.x = (800 - timeLeftDisplay.getBounds().width);

	if(timeLeft < 1){
		if(!gameOver){
			gameOver = true;
			gameOverAction();
		}
	} else {
 		if(!isDead){
 			simpleTimer ++;
 		}
 	}
	if(simpleTimer >= 60){
		simpleTimer = 0;
		timeLeft--;
		timeLeftDisplay.setText('TIME: ' + timeLeft);
	}
}

function gameOverAction(){
	if(confirm('You scored ' + score + ' points.  Press OK to restart.') == true){
		location.reload();
	} else {

	}
}

function resetScale(){
	ant.scale.x = 1;
 	ant.scale.y = 1;
}

function topScale(){
	ant.scale.x = 5;
	ant.scale.y = 5;
}

function pillNC(ant, pilC){
	if((pilC.key == 'pi4' || pilC.key == 'pi5')){
		console.log('STEEEEEEEEEEEVE');
	    pilC.kill();
	    game.world.setBounds(0,0, game.world.getBounds().width + 820 ,560)
	    nextColumnXPosition+=720;
	    var cYPos = Math.floor((Math.random() * 9) + 1);
	    generatePillar(nextColumnXPosition, cYPos);
	   	generateMorePlatforms(10);
	   	isHit = true;
	}
}


function pillCollide(ant, pilC){
	if((pilC.key == 'pi4' || pilC.key == 'pi5') && spaceBar.isDown){
		console.log('inner bounds');
	    pilC.kill();
	    game.world.setBounds(0,0, game.world.getBounds().width + 820 ,560)
	    nextColumnXPosition+=720;
	    var cYPos = Math.floor((Math.random() * 9) + 1);
	    generatePillar(nextColumnXPosition, cYPos);
	   	generateMorePlatforms(10);
	   	isHit = true;
	}
}

function generateMorePlatforms(howMany){
	//THIS NEEDS WORK
	for(var f = 0; f < howMany; f++){
		platforms.add(game.add.sprite(nextColumnXPosition + 100 + (Math.random() * 720), 100 + (Math.random() * 460), 'platforma1'));
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
	playE();
}
