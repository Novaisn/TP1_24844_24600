var Main = function(game){

};

var score = 0;

Main.prototype = {

	create: function() {

		this.tileVelocity = -450;
		this.rate = 1500;
		score = 0;

		this.tileWidth = this.game.cache.getImage('tile').width;
		this.tileHeight = this.game.cache.getImage('tile').height;
		this.boxHeight = this.game.cache.getImage('box').height;

		//this.game.stage.backgroundColor = '479cde';
		this.add.image(1, 1, 'fundo');

		
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.tileWidth), 'tile');

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.createMultiple(20, 'box');
		this.game.world.bringToTop(this.floor);

		this.jumping = false;

		this.addBase();
		this.createScore();
		this.createPlayer();
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.timer = game.time.events.loop(this.rate, this.addObstacles, this);
		this.Scoretimer = game.time.events.loop(100, this.incrementScore, this);

	},

	update: function() {

		this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);

		var onTheGround = this.player.body.touching.down;

		// 3 saltos
		if (onTheGround) {
			this.jumps = 3;
			this.jumping = false;
		}

		// saltar
		if (this.jumps > 0 && this.upInputIsActive(5)) {
			this.player.body.velocity.y = -1000;
			this.jumping = true;
		}

		// reduzir o n de saltos conforme o input
		if (this.jumping && this.upInputReleased()) {
			this.jumps--;
			this.jumping = false;
		}

	},

	addBox: function (x, y) {

		var tile = this.boxes.getFirstDead();

		tile.reset(x, y);
		tile.body.velocity.x = this.tileVelocity;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		
	},

	addObstacles: function () {
		
		var tilesNeeded = Math.floor( Math.random() * (5 - 0));
		
		if (this.rate > 200) {
			this.rate -= 10;
			this.tileVelocity = -(675000 / this.rate);

		}

		for (var i = 0; i < tilesNeeded; i++) {

			this.addBox(this.game.world.width , this.game.world.height -
				this.tileHeight - ((i + 1)* this.boxHeight ));

		}
	},

	addTile: function (x, y) {

		var tile = this.floor.getFirstDead();

		tile.reset(x, y);
		
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		
	},

	addBase: function () {
		var tilesNeeded = Math.ceil(this.game.world.width / this.tileWidth);
		var y = (this.game.world.height - this.tileHeight);

		for (var i = 0; i < tilesNeeded; i++) {

			this.addTile(i * this.tileWidth, y);

		}
	},

	upInputIsActive: function (duration) {
		var isActive = false;

		isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
		isActive |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
			this.game.input.activePointer.x > this.game.width / 4 &&
			this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

		return isActive;
	},

	// Funcao que diz se se esta a clicar na seta
	upInputReleased: function () {
		var released = false;

		released = this.input.keyboard.upDuration(Phaser.Keyboard.UP);
		released |= this.game.input.activePointer.justReleased();

		return released;
	},
	
	createPlayer: function () {
		
		this.player = this.game.add.sprite(this.game.world.width/5, this.game.world.height -
			(this.tileHeight*2), 'player');
		this.player.scale.setTo(2, 2);
		
		this.player.anchor.setTo(0.5, 1.0);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 2200;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0.1;
		this.player.body.drag.x = 150;
		var walk = this.player.animations.add('walk');
		this.player.animations.play('walk', 20, true);

	},

	createScore: function () {

		var scoreFont = "70px Arial";

		this.scoreLabel = this.game.add.text(this.game.world.centerX, 70, "0", { font: scoreFont, fill: "#000" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);


	},

	incrementScore: function () {


		score += 1;
		this.scoreLabel.setText("Score:"+score);
		this.game.world.bringToTop(this.scoreLabel);
		


	},

	gameOver: function(){
		this.game.break;
		
		
		this.physics.pause();
		
	}

};
