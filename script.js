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

	//Apply gravity
	//game.physics.p2.applyGravity = true;

	//Add sprite
	sprite = game.add.sprite(200,200, 'ant');

	//Enable ant physics, default rectangular body
	game.physics.p2.enable(sprite);

	//Body properties
	sprite.body.setZeroDamping();
	sprite.body.fixedRotation = true;

	//Movement with keyboard
	cursors = game.input.keyboard.createCursorKeys();
}

function update(){
    sprite.body.setZeroVelocity();
    if (cursors.left.isDown)
    {
	sprite.body.moveLeft(300);
    }
    else if (cursors.right.isDown)
    {
	sprite.body.moveRight(300);
    }

    if (cursors.up.isDown)
    {
	sprite.body.moveUp(300);
    }
    else if (cursors.down.isDown)
    {
	sprite.body.moveDown(400);
    }
}
