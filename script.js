var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

var sprite;
var cursors;
var ground;
var ant;

//controls
var leftKey;
var rightKey;
var upKey;
var aKey;
var dKey;
var wKey;

function preload(){
	game.load.image('backgrounda1','assets/images/backgrounda1.png');
	game.load.image('grounda1', 'assets/images/grounda3.png');
	game.load.spritesheet('ant', 'assets/images/anta5.png', 44, 24, 5);
}

function create(){

	game.add.image(0, 0, 'backgrounda1');

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#123333';

	ground = game.add.sprite(0, game.world.height - game.cache.getImage('grounda1').height, 'grounda1');
	ant = game.add.sprite(50, 350, 'ant');
	ant.animations.add('walk', [0,1,2,3,4], 15, true);


	game.physics.enable([ant, ground], Phaser.Physics.ARCADE);

	ant.body.gravity.y = 400;
	ant.anchor.setTo(.5, .5);

	ground.body.immovable = true;

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


 	if(leftKey.isDown || aKey.isDown){
 		ant.body.velocity.x = -270;
 		ant.scale.x = -1;
 		ant.play('walk');
 	} else if(rightKey.isDown || dKey.isDown){
 		ant.body.velocity.x = 270;
 		ant.scale.x = 1;
 		ant.play('walk');
 	} else {
 		//ant.body.velocity.x = 0;
 		ant.animations.stop();
 		ant.body.acceleration.x = -3 * ant.body.velocity.x;
 	}

 	if(ant.body.velocity.y!=0){
 		ant.animations.stop();
 	}
 	if((upKey.isDown || wKey.isDown) && ant.body.velocity.y ==0){
 		ant.body.velocity.y = -290;
 	}
 	//Handles input

}
