var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			//gravity: {y: 0},
			debug: false
			}
	},
	scene: [ MapTest, BattleScene, GameOver ]
};

var game = new Phaser.Game(config);