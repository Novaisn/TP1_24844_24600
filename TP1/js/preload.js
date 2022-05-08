var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('tile', 'assets/plat.png');
		this.game.load.image('box', 'assets/box.png');
		this.game.load.image('fundo', 'assets/mundo2.png')
		this.game.load.spritesheet('player', 'assets/run.png', 23.55,22, 8, -2);
		

	},

	create: function(){
		this.game.state.start("Main");
	}
}