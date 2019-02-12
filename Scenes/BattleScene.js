class BattleScene extends Phaser.Scene{
	constructor(){
		super('BattleScene');
	}

	init(data){
		this.herotest = data.hero;
        this.sizeTab = data.sizeTab;
        this.monsters = data.monsters;
	}
	
	preload(){
		this.load.image('background', 'assets/environment_forest_evening.png');
        for(var i = 0; i < this.monsters.length; i++){
            let pngPath = this.monsters[i].img+'.png';
            this.load.image(this.monsters[i].name, 'assets/characters/'+pngPath);
        }
	}
	
	create(){
        this.cursors = this.input.keyboard.createCursorKeys();
        this.inAction = false;
        // When selecting monster
        this.targetMonster = 0;
        //To know which actor can makes an action
        this.indexArray = 0;
        this.timeUntilNextAction = 2000;
        
        //Contains all battlers
        this.actorsList = new Array();
        
        //Init Mobs
        this.listMobs = new Array();
        for(var i = 0; i < this.monsters.length; i++)
            this.listMobs.push(new Monsters(this.monsters[i].name, this.monsters[i].typeMonster, this.monsters[i].level, 1, 1, 0));
        
        this.listImg = new Array();
        this.posXMonster = 800 / this.listMobs.length - 40;
        this.posYMonster = 150;
		this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
        if(this.listMobs.length > 1){
            for(var i = 0; i < this.listMobs.length; i++){
                this.listImg[i] = this.add.image(this.posXMonster, this.posYMonster, this.monsters[i].name);   
                this.posXMonster += 800 / this.listMobs.length - 40;
            }
            this.posXMonster = 800 / this.listMobs.length - 40;
        }else{
            this.listImg[0] = this.add.image(800/2 - 80, this.posYMonster, this.monsters[0].name);
        }
            
        
        //end Init Mobs
        
        //Display Player's values
        this.rectX = 0;
        this.rectY = 500;

		this.rec = new Array();
        this.lifeText = new Array();
        this.displayWindowHeros();
        // end
        
        this.menuBattle;
        this.stringActionMenu = new Array();
        this.stringActionMenu.push("Attack");
        this.stringActionMenu.push("Defense");
        this.stringActionMenu.push("Skills");
        this.stringActionMenu.push("Items");
        this.stringActionMenu.push("Run");
        
        this.containerStringAction = new Array();
        this.cursorsMenuAction;
        this.rectCursors;
        this.posCursor = 0;
        
        this.damageText;
        
        this.actorsList = this.calculInit();
        
        this.boolEnd = false;
        
        // Rectangle to select target Monster
        this.graphicsRectTargetMonster = this.add.graphics({lineStyle: {width: 2, color: 0xffffff}});
        this.rects = new Phaser.Geom.Rectangle(this.listImg[0].x - 40, 75, 80, 140);
        
        this.graphicsItems = this.add.graphics({fillStyle: {color: 0xffffff}});
        this.listItems = new Array();
        
        //Keys
        this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
	}
	
	update(time, delta){
        for(var i = 0; i < this.sizeTab; i++){
                this.lifeText[i].setText("HP :" + this.herotest[i].attribute.life + ' / ' + this.herotest[i].attribute.maxLife);
                this.rectX += 205;
        }
        
            if(this.actorsList[this.indexArray].constructor.name === "Monsters"){
                this.timeUntilNextAction -= delta;
            }else{
                if(!this.inAction){
                    this.graphicsRectTargetMonster.clear();
                    this.displayRectTarget(0);
                    this.inAction = true;
                    for(var i = 0; i < this.herotest.length; i++)
                        if(this.herotest[i] === this.actorsList[this.indexArray])
                            this.createMenuBattle(i);
                }
                if(!this.actorsList[this.indexArray].newInventory.isOpen){
                    if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
                        //this.cursorsMenuAction.clear();
                        this.moveActionCursor();
                    }else if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                        this.selectAction();
                    }else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                        this.moveRectTarget();
                    }
                }else{
                    if(Phaser.Input.Keyboard.JustDown(this.escape)){
                        this.actorsList[this.indexArray].newInventory.closeInv();
                    }
                }
                    
            }
            if(this.timeUntilNextAction <= 0){
                this.monsterTurn(this.actorsList[this.indexArray]);
                this.indexArray += 1;
                this.timeUntilNextAction = 2000;
                if(!this.herosAlive()){
                    console.log("All of your heros are dead...")
                    this.scene.start('BattleScene', {heros: this.herotest});
                }
            }
            
            if(this.indexArray >= this.actorsList.length){
                this.calculInit();  
                this.indexArray = 0;
            }
            
	}
    
}

BattleScene.prototype.displayWindowHeros = function(){
    for(var i = 0; i < this.sizeTab; i++){
        this.rec[i] = this.add.graphics({fillStyle: {color: 0xffffff}});
        this.rec[i].fillRect(this.rectX, this.rectY, 200, 200);
        this.nameText = this.add.text(this.rectX + 5, this.rectY, this.herotest[i].attribute.name).setColor('0x000000');
        this.lifeText[i] = this.add.text(this.rectX + 5, this.rectY + 20, "HP :" + this.herotest[i].attribute.life + ' / ' + this.herotest[i].attribute.maxLife).setColor('0x000000');
        this.rectX += 205;
    }
    this.rectX = 0;
}

BattleScene.prototype.createMenuBattle = function(indexPlayer){
    this.menuBattle = this.add.graphics({fillStyle: {color: 0xffffff}});
    this.menuBattle.fillRect(indexPlayer * 205, 400, 100, 100 );
    for(var i = 0; i < this.stringActionMenu.length; i++)
        this.containerStringAction[i] = this.add.text(indexPlayer * 205, 405 + i * 20, this.stringActionMenu[i]).setColor('0x000000');
    
    this.cursorsMenuAction = this.add.graphics({lineStyle: {width: 2, color: 0x00000}})
    this.rectCursors = new Phaser.Geom.Rectangle(indexPlayer * 205 - 1, 400, 80, 18);
    this.cursorsMenuAction.strokeRectShape(this.rectCursors);
}

BattleScene.prototype.moveActionCursor = function(){
    this.cursorsMenuAction.clear();
    this.posCursor += 1;
    if(this.posCursor >= this.stringActionMenu.length){
        this.posCursor = 0;
        this.rectCursors.y = 400;
        this.cursorsMenuAction.strokeRectShape(this.rectCursors);
    }else{
        this.rectCursors.y += 21;
        this.cursorsMenuAction.strokeRectShape(this.rectCursors);  
    }
}

BattleScene.prototype.selectAction = function(){
   switch(this.posCursor){
        case 0:
            this.graphicsRectTargetMonster.clear();
            if(this.damageText != undefined)
                this.damageText.destroy();

            this.damageText = this.add.text(395, 40, this.actorsList[this.indexArray].attackMonster(this.listMobs[this.targetMonster]), {fontSize: '20px', fill: '#FFF'});
            this.indexArray += 1;
            if(this.listMobs[this.targetMonster].life <= 0){
                for(var j = 0; j < this.actorsList.length; j++){
                    if(this.listMobs[this.targetMonster] === this.actorsList[j]){
                        this.actorsList.splice(j, 1);
                    }
                }
                this.destroyMobs();
                this.targetMonster = 0;
                if(this.listMobs.length === 0)
                    this.scene.start('BattleScene', {heros: this.herotest});
            }
            this.inAction = false;
            this.destroyMenuBattle();
        break;
        case 1:
            if(this.damageText != undefined)
                    this.damageText.destroy();

                this.damageText = this.add.text(395, 40, "Not implemented yet...", {fontSize: '20px', fill: '#FFF'});
        break;
            case 2:
            if(this.damageText != undefined)
                    this.damageText.destroy();

                this.damageText = this.add.text(395, 40, "Not implemented yet...", {fontSize: '20px', fill: '#FFF'});
        break;
            case 3:
            if(this.damageText != undefined)
                    this.damageText.destroy();
            this.actorsList[this.indexArray].newInventory.openInv(this);
            //this.openInv();
                //this.damageText = this.add.text(395, 40, "Not implemented yet...", {fontSize: '20px', fill: '#FFF'});
        break;
            case 4:
            if(this.damageText != undefined)
                    this.damageText.destroy();

                this.damageText = this.add.text(395, 40, "Not implemented yet...", {fontSize: '20px', fill: '#FFF'});
        break;
    } 
}

BattleScene.prototype.destroyMenuBattle = function(){
    this.menuBattle.destroy();
    for(var i = 0; i < this.containerStringAction.length; i++)
        this.containerStringAction[i].destroy();
    this.posCursor = 0;
    this.cursorsMenuAction.clear();
}

BattleScene.prototype.openInv = function(){
    this.graphicsItems.fillRect(200, 200, 400, 200);
}

/*
    return list of all of them 
    sort by intiative
*/
BattleScene.prototype.calculInit = function(){
    var newInit = new Array();
    for(var i = 0; i < this.herotest.length; i++){
        this.herotest[i].initiative =  Math.ceil(Math.random() * Math.floor(20));
        newInit.push(this.herotest[i]);
    }

    for(var i = 0; i < this.listMobs.length; i++){
        this.listMobs[i].initiative =  Math.ceil(Math.random() * Math.floor(20));
        newInit.push(this.listMobs[i]);
    }
    
    newInit.sort(function(a, b){
           return a.initiative - b.initiative;       
        });
        
    newInit.reverse();
    return newInit;
}


BattleScene.prototype.monsterTurn = function(monster){
    if(this.damageText != undefined)
        this.damageText.destroy();
    console.log(monster.name + " attack !");
    //catch random hero
    var rndHero = Math.ceil(Math.random() * Math.floor(this.herotest.length)) - 1;
    //this.damageText.setText(monster.attackHero(this.herotest[rndHero]));
    this.damageText = this.add.text(205 * rndHero + 95, 480, monster.attackHero(this.herotest[rndHero]), {fontSize: '20px', fill: '#FFF'});
}

/*
    Delete all monster' objects
        Sprite
        object
*/
BattleScene.prototype.destroyMobs = function(){
    this.listImg[this.targetMonster].destroy();
    this.listMobs.splice(this.targetMonster, 1);
    this.listImg.splice(this.targetMonster, 1);
}

BattleScene.prototype.displayRectTarget = function(value){
    this.rects.x = this.listImg[value].x - 40;                
    this.graphicsRectTargetMonster.strokeRectShape(this.rects);
}

BattleScene.prototype.moveRectTarget = function(){
    this.targetMonster += 1;
    this.graphicsRectTargetMonster.clear();
    if(this.rects.x >= this.listImg[this.listMobs.length - 1].x - 40){
        this.targetMonster = 0;
        this.rects.x = this.listImg[0] - 40;
    }
    this.displayRectTarget(this.targetMonster);
}

BattleScene.prototype.herosAlive = function(){
    for(var i = 0; i < this.herotest.length; i++){
        if(this.herotest[i].attribute.life > 0)
            return true;
    }
    return false;
}

/*
    ########################### MOVE CURSOR ON BAG ###########################
*/
BattleScene.prototype.moveOnBag = function(){
        
    if(Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.tabPlayer[0].newInventory.posOnArrayBag < this.tabPlayer[0].newInventory.bag.length - 1){
        let isDown = false;
        if(this.tabPlayer[0].newInventory.posOnBag > 0 && this.tabPlayer[0].newInventory.posOnBag % 7 === 0){
            this.tabPlayer[0].newInventory.downOneLine(this, 0, 284);
            isDown = true;
        }
        if(!isDown){
            this.tabPlayer[0].newInventory.moveCursor(this, 32, 1);
        }
        this.tabPlayer[0].newInventory.posOnArrayBag += 1;
    }

    if(Phaser.Input.Keyboard.JustDown(this.cursors.left)){
        let isDown = false;
        if(this.tabPlayer[0].newInventory.posOnArrayBag > 0){
            if(this.tabPlayer[0].newInventory.posOnBag === 0){
                this.tabPlayer[0].newInventory.upOneLine(this, 7, 508);
                isDown = true;
            }
            if(!isDown){
                this.tabPlayer[0].newInventory.moveCursor(this, -32, -1);
            }
            this.tabPlayer[0].newInventory.posOnArrayBag -= 1;
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
        let nbLine = Math.ceil(this.tabPlayer[0].newInventory.posOnArrayBag / 8);
        
        if(nbLine < Math.ceil(this.tabPlayer[0].newInventory.bag.length / 7)){
           if(this.tabPlayer[0].newInventory.posOnArrayBag + 8 > this.tabPlayer[0].newInventory.bag.length - 1){
                this.tabPlayer[0].newInventory.posOnArrayBag = this.tabPlayer[0].newInventory.bag.length - 1;
                //508 is the last x position
                let newPosX = (508 - this.tabPlayer[0].newInventory.xPosCursor) / 32;
                let posXUntilEndLine = 8 - newPosX;
                newPosX = this.tabPlayer[0].newInventory.posOnArrayBag - newPosX;
                this.tabPlayer[0].newInventory.posOnBag = newPosX - posXUntilEndLine;
                this.tabPlayer[0].newInventory.downOneLine(this, newPosX - posXUntilEndLine, 284 + newPosX * 32 - posXUntilEndLine * 32);

            }
            else{
                this.tabPlayer[0].newInventory.posOnArrayBag += 8;
                this.tabPlayer[0].newInventory.downOneLine(this, this.tabPlayer[0].newInventory.posOnBag, this.tabPlayer[0].newInventory.xPosCursor);
            } 
        }

    }
    
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        /*
            Get the current line
        */
        let nbLine = Math.floor(this.tabPlayer[0].newInventory.posOnArrayBag / 8);
        
        if(nbLine > 0){
           if(this.tabPlayer[0].newInventory.posOnArrayBag - 8 < 0){
                this.tabPlayer[0].newInventory.posOnArrayBag = 0;
            }
            this.tabPlayer[0].newInventory.posOnArrayBag -= 8;
            this.tabPlayer[0].newInventory.upOneLine(this, this.tabPlayer[0].newInventory.posOnBag, this.tabPlayer[0].newInventory.xPosCursor);
        }

    }
    
            
    if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
        if(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag].type === 'axe' || this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag].type === 'sword'){
            this.tabPlayer[0].equipWeapon(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag])
        }
        else if(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag].type === 'armor'){
            this.tabPlayer[0].equipArmor(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag])
        }
        else if(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag].type === 'consommable'){
            if(this.tabPlayer[0].usePotion(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag])){
                this.tabPlayer[0].newInventory.deleteItemOnBag(this.tabPlayer[0].newInventory.bag[this.tabPlayer[0].newInventory.posOnArrayBag]);
            }
        }
        this.tabPlayer[0].newInventory.refreshBag(this);
    }
}

/*
    ########################### END MOVE CURSOR ON BAG ###########################
*/