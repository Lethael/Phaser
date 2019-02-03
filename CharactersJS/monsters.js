class Monsters{
    
    constructor(name, typeMob, level, bonus){
        this.name = name;
        this.typeMonster = typeMob;
        this.str = Phaser.Math.FloatBetween(1, 18);
        this.level = level;
        this.armorClass = 12;
        this.bonus = bonus;
        this.maxLife = Math.floor(Phaser.Math.FloatBetween(1, 7));
        this.life = this.maxLife;
        this.initiative = 0;
        
        this.xp = this.maxLife;
    }
}