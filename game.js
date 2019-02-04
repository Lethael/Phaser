var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 608,
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