class Monsters{
    
    constructor(name){
        this.name = name;
        this.str = Phaser.Math.FloatBetween(1, 18);
        this.armorClass = 12;
        this.maxLife = Math.floor(Phaser.Math.FloatBetween(1, 7));
        this.life = this.maxLife;
        this.initiative = 0;
    }
}