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
        this.actorsList = new Array();
        
        this.listMobs = new Array();
        this.listMobs.push(new Monsters("Witch1", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch2", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch3", "witch", 1, 1, 1, 0));
        this.listMobs.push(new Monsters("Witch4", "witch", 1, 1, 1, 0));
        this.posXMonster = 800 / this.listMobs.length - 40;
        this.posYMonster = 150;
		this.add.image(0, 0, 'background').setOrigin(0, 0);
        for(var i = 0; i < this.listMobs.length; i++){
            this.add.image(this.posXMonster, this.posYMonster, 'witch');   
            this.posXMonster += 800 / this.listMobs.length - 40;
        }
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
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.actorsList = calculInit(this.herotest, this.listMobs);
        
	}
	
	update(){
        /* Only to test */
		if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
            //this.herotest[0].attackMonster(this.listMobs[0]);
            this.listMobs[0].attackHero(this.herotest[0]);
			/*this.herotest[0].attribute.life -= 1;
			this.lifeText[0].setText("HP :" + this.herotest[0].attribute.life + ' / ' + this.herotest[0].attribute.maxLife);*/
            for(var i = 0; i < this.sizeTab; i++){
                this.lifeText[i].setText("HP :" + this.herotest[i].attribute.life + ' / ' + this.herotest[i].attribute.maxLife).setColor('0x000000');
                this.rectX += 205;
            }
		}
		if(this.herotest[0].attribute.life <= 0){
            this.herotest[0].attribute.life = this.herotest[0].attribute.maxLife
            this.scene.start('MapTest', {heros: this.herotest});
        }
	}
    
}
function calculInit(herotest, listMobs){
    var newInit = new Array();
    for(var i = 0; i < herotest.length; i++){
        herotest[i].initiative =  Math.ceil(Math.random() * Math.floor(20));
        newInit.push(herotest[i]);
    }

    for(var i = 0; i < listMobs.length; i++){
        listMobs[i].initiative =  Math.ceil(Math.random() * Math.floor(20));
        newInit.push(listMobs[i]);
    }
    
    newInit.sort(function(a, b){
           return a.initiative - b.initiative;       
        });
        
    newInit.reverse();
    return newInit;
}