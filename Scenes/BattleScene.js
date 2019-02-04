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
        // When selecting monster
        this.targetMonster = 0;
        //To know which actor can makes an action
        this.indexArray = 0;
        this.timeUntilNextAction = 2000;
        
        //Contains all battlers
        this.actorsList = new Array();
        
        //Init Mobs
        this.listMobs = new Array();
        this.listMobs.push(new Monsters("Witch1", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch2", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch3", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch4", "witch", 1, 1, 1, 0));
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
        
        //Display Player's value
        this.rectX = 0;
        this.rectY = 500;

		this.rec = new Array();
        this.lifeText = new Array();
        for(var i = 0; i < this.sizeTab; i++){
            this.rec[i] = this.add.graphics({fillStyle: {color: 0xffffff}});
            this.rec[i].fillRect(this.rectX, this.rectY, 200, 200);
            this.nameText = this.add.text(this.rectX + 5, this.rectY, this.herotest[i].attribute.name).setColor('0x000000');
            this.lifeText[i] = this.add.text(this.rectX + 5, this.rectY + 20, "HP :" + this.herotest[i].attribute.life + ' / ' + this.herotest[i].attribute.maxLife).setColor('0x000000');
            this.rectX += 205;
        }
        this.rectX = 0;
        // end
        
        this.actorsList = this.calculInit();
        
        this.boolEnd = false;
        
        // Rectangle to select target Monster
        this.graphics = this.add.graphics({lineStyle: {width: 2, color: 0xffffff}});
        this.rects = new Phaser.Geom.Rectangle(this.listImg[0].x - 40, 75, 80, 140);
        
	}
	
	update(time, delta){
        /* Only to test */
		/*
		if(this.herotest[0].attribute.life <= 0){
            this.herotest[0].attribute.life = this.herotest[0].attribute.maxLife
            this.scene.start('MapTest', {heros: this.herotest});
        }*/
        for(var i = 0; i < this.sizeTab; i++){
                this.lifeText[i].setText("HP :" + this.herotest[i].attribute.life + ' / ' + this.herotest[i].attribute.maxLife).setColor('0x000000');
                this.rectX += 205;
        }
        
        if(!this.boolEnd){
            if(this.actorsList[this.indexArray].constructor.name === "Monsters"){
                this.timeUntilNextAction -= delta;
            }else{
                this.graphics.strokeRectShape(this.rects);
                if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
                    this.graphics.clear();
                    this.actorsList[this.indexArray].attackMonster(this.listMobs[this.targetMonster]);
                    this.indexArray += 1;
                    if(this.listMobs[this.targetMonster].life <= 0){
                        for(var j = 0; j < this.actorsList.length; j++){
                            if(this.listMobs[this.targetMonster] === this.actorsList[j]){
                                this.actorsList.splice(j, 1);
                            }
                        }
                        this.listImg[this.targetMonster].destroy();
                        this.listMobs.splice(this.targetMonster, 1);
                        this.listImg.splice(this.targetMonster, 1);
                        this.targetMonster = 0;
                    }
                }else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                    this.test();
                    console.log(this.rects.x)
                    this.targetMonster += 1;
                    this.graphics.clear();
                    if(this.rects.x >= this.listImg[this.listMobs.length - 1].x - 40){
                        this.targetMonster = 0;
                        this.rects.x = this.listImg[0] - 40;
                    }
                    this.rects.x = this.listImg[this.targetMonster].x - 40;
                }
            }
            if(this.timeUntilNextAction <= 0){
                this.monsterTurn(this.actorsList[this.indexArray]);
                this.indexArray += 1;
                this.timeUntilNextAction = 2000;
            }
            
            if(this.indexArray >= this.actorsList.length)
                this.boolEnd = true;
        }
	}
    
}

BattleScene.prototype.test = function(){
    console.log("je suis dans proto");
    console.log(this.targetMonster);
}
    
/*function displayMonster(imgs, monsters, imgMob, battle){
    battle.posXMonster = 800 / monsters.length - 40;
    battle.posYMonster = 150;
    for(var i = 0; i < monsters.length; i++){
        imgs[i] = battle.add.sprite(battle.posXMonster, battle.posYMonster, imgMob);   
        battle.posXMonster += 800 / monsters.length - 40;
        }
    battle.posXMonster = 800 / battle.listMobs.length - 40;
}*/

/*
    @params Heros list
    @params Monsters list
    
    return list of all of them sort by intiative
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
    console.log(monster.name + " attack !");
    //catch random hero
    var rndHero = Math.ceil(Math.random() * Math.floor(this.herotest.length)) - 1;
    monster.attackHero(this.herotest[rndHero]);
}