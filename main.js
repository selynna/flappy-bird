//initialize game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

//create main state?
var mainState = {};

mainState.preload = function() {
	game.load.image('ground', 'assets/ground.png');
	game.load.image('background', 'assets/background.png');
	game.load.image('title', 'assets/title.png');
	game.load.image('start-button', 'assets/start-button.png');
	game.load.image('bird', 'assets/flappybird.png');
	game.load.image('pipe', 'assets/pipe.png');
	game.load.audio('jump', 'assets/jump.wav');

};

mainState.create = function() {

	//set physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.bird = this.game.add.sprite(100, 245, 'bird');
	//add gravity
	game.physics.arcade.enable(this.bird);
	this.bird.body.gravity.y = 1000;


	//jump when spacekey hit
	var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	spaceKey.onDown.add(this.jump, this);

	this.pipes = game.add.group();
	this.pipes.enableBody = true;
	this.pipes.createMultiple(20, 'pipe');

	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

	this.score = 0;
	this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff"});

	this.bird.anchor.setTo(-0.2, 0.5);
	this.jumpSound = game.add.audio('jump');
};

mainState.update = function() {
	if(this.bird.inWorld == false) {
		this.restartGame();

	}
	game.physics.arcade.overlap(this.bird, this.pipes, 
		this.hitPipe, null, this);
	if (this.bird.angle < 20) {
		this.bird.angle += 1;
	}
};

mainState.jump = function() {
	if (this.bird.alive == false) {
		return;
	}
	this.bird.body.velocity.y = -350;

	//create animation on bird
	var animation = game.add.tween(this.bird);
	animation.to({angle: -20}, 100);
	animation.start();

	//above three lines can be written as:
	//game.add.tween(this.bird).to({angle: -20}, 100).start();  

	this.jumpSound.play();

};

mainState.restartGame = function() {
		game.state.start('main');
};

mainState.addOnePipe = function(x, y) {
	var pipe = this.pipes.getFirstDead();
	pipe.reset(x, y);
	pipe.body.velocity.x = -200;
	pipe.checkWorldBounds = true;
	pipe.outOfBoundsKill = true;
};

mainState.addRowOfPipes = function() {
	var hole = Math.floor(Math.random() * 5) + 1;
	for (var i = 0; i < 8; i++) {
		if (i != hole && i != hole + 1) {
			this.addOnePipe(400, i * 60 + 10);
		}
	}
	this.score += 1;
	this.labelScore.text = this.score;
};




mainState.hitPipe = function() {
	if(this.bird.alive == false) {
		return;
	}
	//bird is dead?
	this.bird.alive = false;
	//prevent new pipes from appearing
	game.time.events.remove(this.timer);
	//go through all pipes and stop movement
	this.pipes.forEachAlive(function(p) {
		p.body.velocity.x = 0;
	}, this);
};



game.state.add('main', mainState);
game.state.start('main');




