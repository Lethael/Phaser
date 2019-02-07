class MapTest extends Phaser.Scene{

	constructor(){
		super({key: 'MapTest'});
	}
	
	init(data){
        if(data != undefined){
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
        this.load.image('chest', '../assets/items/chests/chest.png');
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //Json load
        this.load.json('itemsOnMap', 'assets/maps/itemsByMap/map1.json');
        this.load.json('mobs', 'assets/maps/monstersMap1.json');
        
        this.player;
    }
    create ()
    {
        this.listItems = this.cache.json.get('itemsOnMap');
        this.testMobs = this.cache.json.get('mobs');
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
                
        const map = this.make.tilemap({key: "map", tileWidth: 32, tileHeight: 32});
        // basique is the name of the tileset in the json file
        const tileset = map.addTilesetImage('basique', 'tiles');
        const axe = map.addTilesetImage('axe', 'axe');
        const layer1 = map.createStaticLayer(0, tileset, 0, 0);
        const layer2 = map.createStaticLayer(1, tileset);
        
        // spawnPLayer is the name of the OBJECT LAYER
        const spawnPoint = map.findObject("spawnPlayer", obj => obj.name === "spawn");
        
        this.itemsLayer = map.getObjectLayer('chests')['objects'];
        this.items = this.physics.add.staticGroup();
        this.itemsLayer.forEach(object => {
        let obj = this.items.create(object.x, object.y, "chest"); 
           obj.setOrigin(0); 
           obj.body.width = object.width; 
           obj.body.height = object.height; 
    });

        
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'heroTest');
        
        // collide is the property that we set in tiled map editor
        layer2.setCollisionByProperty({collide: true});        
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        // all frames are on the same line it's not a array[i][j]
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
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, this.items, this.checkCollideWithChests, false, this);
    }

    update (time, delta){

        this.player.body.setVelocity(0);
        
        /*Every seconds when buttons are push
        generate random number 0.1 -> 100
        if this <= rateMobs -> Battle
        else
        rateMob+=0.1
        */
        if(Phaser.Input.Keyboard.JustDown(this.key)){
            this.tabPlayer[0].openInv();
            
        }
        
        /*if(Phaser.Input.Keyboard.JustDown(this.keyU)){
            let isPotion = false;
            let indexPotion = 0;
            for(let i = 0; i < this.tabPlayer[0].inventory.bag.length; i++){
                if(this.tabPlayer[0].inventory.bag[i].type === "Consommable"){
                    isPotion = true;
                    indexPotion = i;
                }
            }
            if(isPotion){
                let boolRestoreHP = this.tabPlayer[0].usePotion(this.tabPlayer[0].inventory.bag[indexPotion]);
                if(boolRestoreHP){
                    this.tabPlayer[0].inventory.bag.splice(indexPotion, 1);
                }
                
            }   
        }*/
        
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
            let rndMobs = Math.floor(Phaser.Math.FloatBetween(1, 5));
            let mobsBattle = new Array();
            for(var i = 0; i < rndMobs; i ++){
                let indexMob = Math.floor(Phaser.Math.FloatBetween(0, this.testMobs.length));
                mobsBattle.push(this.testMobs[indexMob]);
            }
            this.scene.start("BattleScene", {hero: this.tabPlayer, sizeTab: this.tabPlayer.length, monsters: mobsBattle}); 
        }
	}

}


/*
    Random item number
    loop
    add item to inventory if random <= rate item
    destroy sprite
*/
MapTest.prototype.checkCollideWithChests = function(test, item){
    if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
        let numItems =  Math.floor(Phaser.Math.FloatBetween(0, 3));
        if(numItems > 0){
            for(var i = 0; i < numItems; i++){
                let rndObject = Math.floor(Phaser.Math.FloatBetween(0, this.listItems.length));
                let randomByRate = Math.floor(Phaser.Math.FloatBetween(0, 100));
                if(randomByRate <= this.listItems[rndObject].rate){
                    if(this.listItems[rndObject].type === "Weapon"){
                        let durability = Math.ceil(Phaser.Math.FloatBetween(0, 100));
                        let newItem = new Weapon(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].diceDamage, this.listItems[rndObject].bonusDamage, this.listItems[rndObject].size, durability);
                        this.tabPlayer[0].addToInv(newItem, false);
                    }else if(this.listItems[rndObject].type === "Consommable"){
                        let newItem = new Consommable(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].gainValue, this.listItems[rndObject].price);
                        this.tabPlayer[0].addToInv(newItem, false);
                    }else if(this.listItems[rndObject].type === "Armor"){
                        let durability = Math.ceil(Phaser.Math.FloatBetween(0, 100));
                        let newItem = new Armor(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].wear, this.listItems[rndObject].bonusCA, this.listItems[rndObject].price, durability);
                        this.tabPlayer[0].addToInv(newItem, false);         
                    }
                }
            }
        }else{
            console.log("No item...");
        }
        let rndGold = Math.ceil(Phaser.Math.FloatBetween(0, 100));
        if(rndGold < 20){
            let gold = {
                type: "gold",
                amount: Math.ceil(Phaser.Math.FloatBetween(0, 20))
            };
            console.log("You found " + gold.amount + " gold");
            this.tabPlayer[0].addToInv(gold, false);
        }
        item.destroy();
        
    }
}