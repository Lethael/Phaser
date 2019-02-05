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
		this.load.spritesheet('heroTest', '../assets/characters/char.png', { frameWidth: 32, frameHeight: 48 });
        
        this.load.image("tiles", "../assets/tilesets/basique.png");
        this.load.tilemapTiledJSON("map", "../assets/maps/test2.json");
        
        this.load.image('axe', '../assets/items/weapons/axes/axe.png');
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.player;
    }
    create ()
    {
        this.boolBattle = false;
        this.rndMob = 0;
        this.timeToRandomMob = 1000;
        this.rateMob = 0;
        
        if(this.tabPlayer === undefined){
            this.tabPlayer = new Array();
            this.testPlayer = new Personnage('HeroTest');
            this.testPlayer2 = new Personnage('HeroineTest');
            this.testPlayer3 = new Personnage('Gimli');
            this.tabPlayer.push(this.testPlayer);
            this.tabPlayer.push(this.testPlayer2);
            this.tabPlayer.push(this.testPlayer3);
        }
        

		//this.cursors;
        
        const map = this.make.tilemap({key: "map", tileWidth: 32, tileHeight: 32});
        // basique is the name of the tileset in the json file
        const tileset = map.addTilesetImage('basique', 'tiles');
        const axe = map.addTilesetImage('axe', 'axe');
        const layer1 = map.createStaticLayer(0, tileset, 0, 0);
        const layer2 = map.createStaticLayer(1, tileset);
        const layer3 = map.createStaticLayer(2, axe);
        
        // spawnPLayer is the name of the OBJECT LAYER
        const spawnPoint = map.findObject("spawnPlayer", obj => obj.name === "spawn");
        this.itemsLayer = map.getObjectLayer('items')['objects'];
        
        this.items = this.physics.add.staticGroup();
        this.itemsLayer.forEach(object => {
        let obj = this.items.create(object.x, object.y, "axe"); 
           //obj.setScale(object.width/16, object.height/16); 
           obj.setOrigin(0); 
           obj.body.width = object.width; 
           obj.body.height = object.height; 
    });
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'heroTest');
        
        // collide is the property that we set in tiled map editor
        layer2.setCollisionByProperty({collide: true});        
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
        this.physics.add.collider(this.player, this.items);
        /*this.items.children.iterate(function(child){
            child.setActiveCollision().setAvsB();
            
        });*/
        /*this.physics.world.on('collisionstart', function (event, bodyA, bodyB) {
        console.log("hello");
        bodyA.gameObject.setTint(0xff0000);
        bodyB.gameObject.setTint(0x00ff00);

    });*/

        /*this.physics.add.overlap(this.player, this.items, testOverlap, null, this);*/
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, layer3);
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
/*MapTest.prototype.testOverlap = function(){
    console.log("hiit");
}*/