class GameOver extends Phaser.Scene{
	constructor(){
		super('GameOver');
	}
	
	init(data){
		this.score = data.sc;
	}
	
	preload(){
		this.load.image('sky', 'assets/sky.png');
	}
	
	create(){
		this.GameOverText = this.add.text(400, 300, "Game Over\n" + this.score);
	}
	
	update(){}
	
}