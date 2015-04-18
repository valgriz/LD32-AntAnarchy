var game = new Phaser.Game(820, 560, Phaser.AUTO, '',{preload: preload, create: create, update: update});

this.game.stage.scape.pageAlignHorizontally = true;
this.game.stage.scale.pageAlighVertically = true;
this.game.stage.scale.refresh();

var sprite;
var cursors;

function preload(){
	game.load.image('ant', 'assets/images/ant.png');
	game.load.image('bkg', 'assets/images/bkg.png');
}

function create(){

	game.add.image(0, 0, 'bkg');

	//Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

	game.stage.backgroundColor = '#123333';

	//Add sprite
	sprite = game.add.sprite(200,200, 'ant');

	//Gravity
	game.physics.p2.gravity.y = 100;

	//Enable ant physics, default rectangular body
	game.physics.p2.enable(sprite);

	//Body properties
	sprite.body.setZeroDamping();
	sprite.body.fixedRotation = true;

	//Movement with keyboard
	cursors = game.input.keyboard.createCursorKeys();
	

}

function update(){

    sprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
	sprite.body.moveLeft(100);
    }
    else if (cursors.right.isDown)
    {
	sprite.body.moveRight(100);
    }

    if (cursors.up.isDown && sprite.body.velocity.y>=-10 && sprite.body.velocity.y<=10)
    {
	sprite.body.moveUp(90);
    }
    else if (cursors.down.isDown)
    {
	sprite.body.moveDown(400);
    }
}
