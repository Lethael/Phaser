class BattleScene extends Phaser.Scene{
	constructor(){
		super('BattleScene');
	}

	init(data){
		this.herotest = data.hero;
        this.sizeTab = data.sizeTab;
	}
	
	preload(){
		this.load.image('background', 'assets/environment_forest_evening.png');
		this.load.image('witch', 'assets/characters/death_speaker.png');
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
        var rndMobs = Math.floor(Phaser.Math.FloatBetween(1, 5));
        for(var i = 0; i < rndMobs; i++)
            this.listMobs.push(new Monsters("Witch"+(i+1), "witch", 1, 1, 1, 0));
        
        this.listImg = new Array();
        this.posXMonster = 800 / this.listMobs.length - 40;
        this.posYMonster = 150;
		this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
        for(var i = 0; i < this.listMobs.length; i++){
            this.listImg[i] = this.add.image(this.posXMonster, this.posYMonster, 'witch');   
            this.posXMonster += 800 / this.listMobs.length - 40;
        }
        this.posXMonster = 800 / this.listMobs.length - 40;
        
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
                
                if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
                    //this.cursorsMenuAction.clear();
                    this.moveActionCursor();
                }else if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                    this.selectAction();
                }else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                    this.moveRectTarget();
                }
            }
            if(this.timeUntilNextAction <= 0){
                this.monsterTurn(this.actorsList[this.indexArray]);
                this.indexArray += 1;
                this.timeUntilNextAction = 2000;
                if(!this.herosAlive()){
                    console.log("All of your heros are dead...")
                    this.scene.start('MapTest', {heros: this.herotest});
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
                    this.scene.start('MapTest', {heros: this.herotest});
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

                this.damageText = this.add.text(395, 40, "Not implemented yet...", {fontSize: '20px', fill: '#FFF'});
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