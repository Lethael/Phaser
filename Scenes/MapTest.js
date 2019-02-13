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
        this.load.bitmapFont('myfont', '../assets/UI/fonts/font/font.png', '../assets/UI/fonts/font/font.fnt');
        //Load tile set
		this.load.spritesheet('heroTest', '../assets/characters/char.png', { frameWidth: 32, frameHeight: 48 });
        
        this.load.image("tiles", "../assets/tilesets/basique.png");
        this.load.tilemapTiledJSON("map", "../assets/maps/test2.json");
        
        this.load.image('axe', '../assets/items/weapons/axes/axe.png');
        this.load.image('chest', '../assets/items/chests/chest.png');
        this.load.image('sword', '../assets/items/weapons/swords/orcish_short_sword.png');
        this.load.image('potion', '../assets/items/potions/ruby_old.png');
        this.load.image('armor', '../assets/items/armors/chest/ring_mail_1_new.png');
        
        
        this.load.image('inv', "../assets/UI/Inventory/BankStash.png");
        this.load.image('cursor', '../assets/UI/Inventory/cursors/cursor.png');
        this.load.image('glove', '../assets/UI/Inventory/cursors/glove3.png');
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
        
        
        /*
            ###################### MENU WINDOW ######################
        */
        this.myNewBestMenu = new Menu(this);
        /*
            ###################### END MENU WINDOW ######################
        */
        
        this.key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);

        this.physics.add.collider(this.player, layer2);
        this.physics.add.collider(this.player, this.items, this.checkCollideWithChests, false, this);
        
    }

    update (time, delta){
        this.player.body.setVelocity(0);
        if(Phaser.Input.Keyboard.JustDown(this.key)){
            this.boolBattle = true;   
        }
        
        /*
            Open Menu
            if Menu is not visible
                set to visible menu and string menu
            else
                set to not visible menu and string  
        */
        if(!Inventory.isOpen && !this.myNewBestMenu.herosWindow.visible){
            if(Phaser.Input.Keyboard.JustDown(this.escapeKey)){
                this.myNewBestMenu.openMenu(this);

            }
        }
            
        if(this.myNewBestMenu.menuWindow.visible && !this.myNewBestMenu.herosWindow.visible){
            if(Phaser.Input.Keyboard.JustDown(this.cursors.down))
                this.myNewBestMenu.moveCursor();
            if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                this.myNewBestMenu.validateOnMenu(this.tabPlayer, this);
            }
        }
        
        if(this.myNewBestMenu.herosWindow.visible && !Inventory.isOpen){
            if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                this.myNewBestMenu.openInventory(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu], this);
            }
            if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
                this.myNewBestMenu.moveCursor();
            }
        }
            

        if(Inventory.isOpen){
            this.moveOnBag();
            if(Phaser.Input.Keyboard.JustDown(this.escapeKey)){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.closeInv();
            }
        }
        if(!Inventory.isOpen && this.myNewBestMenu.herosWindow.visible && this.myNewBestMenu.menuWindow.visible){
            console.log("isOpen == false && heroWindow == true")
           if(Phaser.Input.Keyboard.JustDown(this.escapeKey)){
                this.myNewBestMenu.closeListHero();
               console.log("close dude?");
            } 
        }
        
        /*Every seconds when movment key is push
        generate random number 0.1 -> 100
        if this <= rateMobs -> Battle
        else
        rateMob+=0.1
        */
        if(!Inventory.isOpen && !this.myNewBestMenu.menuWindow.visible){
            if (this.cursors.left.isDown)
            {
                this.moveXAndGenerateBattle('left', -80, delta);
            }else if (this.cursors.right.isDown)
            {
                this.moveXAndGenerateBattle('right', 80, delta);
            }

            else if (this.cursors.up.isDown)
            {
                this.moveYAndGenerateBattle('up', -80, delta);
            }
            else if (this.cursors.down.isDown)
            {
                this.moveYAndGenerateBattle('down', 80, delta);
            }
            else
            {
                this.player.anims.play('stop');
            }   
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
        let numItems =  Math.floor(Phaser.Math.FloatBetween(0, 30));
        if(numItems > 0){
            for(var i = 0; i < numItems; i++){
                let rndObject = Math.floor(Phaser.Math.FloatBetween(0, this.listItems.length));
                let randomByRate = Math.floor(Phaser.Math.FloatBetween(0, 100));
                if(randomByRate <= this.listItems[rndObject].rate){
                    if(this.listItems[rndObject].type === "sword" || this.listItems[rndObject].type === "axe"){
                        let durability = Math.ceil(Phaser.Math.FloatBetween(0, 100));
                        let newItem = new Weapon(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].diceDamage, this.listItems[rndObject].bonusDamage, this.listItems[rndObject].size, durability);
                        let tryAddToInv = this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].addToInv(newItem, false);
                        if(!tryAddToInv){
                            console.log('test to add item to : ' + tryAddToInv);
                            this.tabPlayer[1].addToInv(newItem, false);
                        }
                    }else if(this.listItems[rndObject].type === "consommable"){
                        let newItem = new Consommable(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].gainValue, this.listItems[rndObject].price);
                        if(!this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].addToInv(newItem, false)){
                            console.log('test to add item to : ' + this.tabPlayer[1].attribute.name);
                            this.tabPlayer[1].addToInv(newItem, false);
                        }
                    }else if(this.listItems[rndObject].type === "Armor"){
                        let durability = Math.ceil(Phaser.Math.FloatBetween(0, 100));
                        let newItem = new Armor(this.listItems[rndObject].type, this.listItems[rndObject].name, this.listItems[rndObject].description, this.listItems[rndObject].wear, this.listItems[rndObject].bonusCA, this.listItems[rndObject].price, durability);
                        if(!this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].addToInv(newItem, false)){
                            console.log('test to add item to : ' + this.tabPlayer[1].attribute.name);
                            this.tabPlayer[1].addToInv(newItem, false);
                        }         
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
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].addToInv(gold, false);
        }
        item.destroy();
        
    }
}

/*
    ########################### MOVE HERO ###########################
*/
MapTest.prototype.moveXAndGenerateBattle = function(direction, vel, delta){
    this.player.body.setVelocityX(vel);
    this.player.anims.play(direction, true);

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
}

MapTest.prototype.moveYAndGenerateBattle = function(direction, vel, delta){
    this.player.body.setVelocityY(vel);
    this.player.anims.play(direction, true);
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
/*
    ########################### END MOVE HERO ###########################
*/

/*
    ########################### MOVE CURSOR ON BAG ###########################
*/
MapTest.prototype.moveOnBag = function(){
    console.log("Move on bag MF");
    if(Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag < this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag.length - 1){
        let isDown = false;
        if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag > 0 && this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag % 7 === 0){
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.downOneLine(this, 0, 284);
            isDown = true;
        }
        if(!isDown){
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.moveCursor(this, 32, 1);
        }
        this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag += 1;
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.left)){
        let isDown = false;
        if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag > 0){
            if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag === 0){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.upOneLine(this, 7, 508);
                isDown = true;
            }
            if(!isDown){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.moveCursor(this, -32, -1);
            }
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag -= 1;
        }
            
    }
    
    /*
        Check if cursors will go on item.
        if not 
            find the position of the last column item
            cursor goes on it
        else
            cursor goes on the nextLine, at the same column
    */
    if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
        /*
            Get the current line
        */
        let nbLine = Math.ceil(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag / 8);
        
        if(nbLine < Math.ceil(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag.length / 7)){
           if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag + 8 > this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag.length - 1){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag = this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag.length - 1;
                //508 is the last x position
                let newPosX = (508 - this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.xPosCursor) / 32;
                let posXUntilEndLine = 8 - newPosX;
                newPosX = this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag - newPosX;
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag = newPosX - posXUntilEndLine;
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.downOneLine(this, newPosX - posXUntilEndLine, 284 + newPosX * 32 - posXUntilEndLine * 32);

            }
            else{
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag += 8;
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.downOneLine(this, this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag, this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.xPosCursor);
            } 
        }

    }
    
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        /*
            Get the current line
        */
        let nbLine = Math.floor(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag / 8);
        
        if(nbLine > 0){
           if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag - 8 < 0){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag = 0;
            }
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag -= 8;
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.upOneLine(this, this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnBag, this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.xPosCursor);
        }

    }
    
            
    if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
        if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag].type === 'axe' || this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag].type === 'sword'){
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].equipWeapon(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag])
        }
        else if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag].type === 'armor'){
            this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].equipArmor(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag])
        }
        else if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag].type === 'consommable'){
            if(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].usePotion(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag])){
                this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.deleteItemOnBag(this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.bag[this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.posOnArrayBag]);
            }
        }
        this.tabPlayer[this.myNewBestMenu.posCursorOnMenu].newInventory.refreshBag(this);
    }
}

/*
    ########################### END MOVE CURSOR ON BAG ###########################
*/

/*
    ########################### MOVE CURSOR ON MENU ###########################
*/