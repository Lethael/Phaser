class MapTest extends Phaser.Scene{

	constructor(){
		super({key: 'MapTest'});
	}
	
	init(data){
        if(data != undefined){
          console.log(data.heros);
		  this.tabPlayer = data.heros;  
        }
		
	}

    preload ()
    {
        //Load tile set
        this.load.image("tilesets", "../assets/tilesets/basique.png");
		this.load.spritesheet('heroTest', 'assets/characters/char.png', { frameWidth: 32, frameHeight: 48 });
    }
    create ()
    {
        this.boolBattle = false;
        this.rndMob = 0;
        this.timeToRandomMob = 1000;
        this.rateMob = 10;
        
        if(this.tabPlayer == undefined){
            this.tabPlayer = new Array();
            this.testPlayer = new Personnage('HeroTest');
            this.testPlayer2 = new Personnage('HeroineTest'); 
            this.tabPlayer.push(this.testPlayer);
            this.tabPlayer.push(this.testPlayer2);
        }
		this.player;
        

		this.cursors;
		this.score = 0;
		this.scoreText;
        
        const level = [
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,  10,  10,  10,   0,   0,   0,   0,   0,   0,   0,  10,  10,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   1,  10,  10,  10,  10,   0,   0,   0,   5,   0,  10,  10,  10,  10,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ], 
        [  0,   0,   0,   0,   0,   0,  10,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ]
        
      ];
        const map = this.make.tilemap({ data: level, tileWidth: 32, tileHeight: 32 });
        const tiles = map.addTilesetImage("tilesets");
        // can have more than 1 layer
        const layer = map.createStaticLayer(0, tiles, 0, 0);
		
		// The player and its settings
		this.player = this.physics.add.sprite(100, 450, 'heroTest');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        // all frames are on the same line it's not a tab[i][j]
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('heroTest', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('heroTest', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('heroTest', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('heroTest', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'stop',
            frames: [{key: 'heroTest', frame: 0}],
            frameRate: 10
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update (time, delta){
        this.player.body.setVelocity(0);
		
		if (this.gameOver)
		{
			return;
		}
        
        /*Every seconds when buttons are push
        generate random number 0.1 -> 100
        if this <= rateMobs -> Battle
        else
        rateMob+=0.1
        */

		if (this.cursors.left.isDown)
		{
			this.player.body.setVelocityX(-80);
			this.player.anims.play('left', true);
    
            this.timeToRandomMob -= delta;
            if(this.timeToRandomMob <= 0){
                this.rndMob = Phaser.Math.FloatBetween(0.1, 100);
                if(this.rndMob <= this.rateMob){
                    this.cursors.left.isDown = false;
                    this.rateMob = 1;
                    this.boolBattle = true;
                }else{
                    this.rateMob += 0.1;
                }
                this.timeToRandomMob = 1000;
               }
        }else if (this.cursors.right.isDown)
		{
			this.player.body.setVelocityX(80);
			this.player.anims.play('right', true);
            this.timeToRandomMob -= delta;
            if(this.timeToRandomMob <= 0){
                this.rndMob = Phaser.Math.FloatBetween(0.1, 100);
                if(this.rndMob <= this.rateMob){
                    this.cursors.right.isDown = false;
                    this.rateMob = 1;
                    this.boolBattle = true;
                }else{
                    this.rateMob += 0.1;
                }
                this.timeToRandomMob = 1000;
               }
		}
        
        else if (this.cursors.up.isDown)
		{
			this.player.body.setVelocityY(-80);
            this.player.anims.play('up', true);
            this.timeToRandomMob -= delta;
            if(this.timeToRandomMob <= 0){
                this.rndMob = Phaser.Math.FloatBetween(0.1, 100);
                if(this.rndMob <= this.rateMob){
                    this.cursors.up.isDown = false;
                    this.rateMob = 1;
                    this.boolBattle = true;
                }else{
                    this.rateMob += 0.1;
                }
                this.timeToRandomMob = 1000;
               }
		}
        else if (this.cursors.down.isDown)
		{
			this.player.body.setVelocityY(80);
            this.player.anims.play('down', true);
            this.timeToRandomMob -= delta;
            if(this.timeToRandomMob <= 0){
                this.rndMob = Phaser.Math.FloatBetween(0.1, 100);
                if(this.rndMob <= this.rateMob){
                    this.cursors.down.isDown = false;
                    this.rateMob = 1;
                    this.boolBattle = true;
                }else{
                    this.rateMob += 0.1;
                }
                this.timeToRandomMob = 1000;
               }
		}
		else
		{
            this.player.anims.play('stop');
		}
        
        if(this.boolBattle){
           this.player.body.setVelocity(0);
           this.scene.start("BattleScene", {hero: this.tabPlayer, sizeTab: this.tabPlayer.length}); 
        }
	}

}