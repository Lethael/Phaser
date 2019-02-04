class Monsters{
    
    constructor(name, typeMob, level, lifeDice, damageDice, bonus){
        this.name = name;
        this.typeMonster = typeMob;
        this.str = Phaser.Math.FloatBetween(1, 18);
        this.level = level;
        this.armorClass = 12;
        this.lifeDice = lifeDice;
        this.damageDice = damageDice;
        this.bonus = bonus;
        this.maxLife = 0;
        for(var i = 0; i < this.lifeDice; i++)
           this.maxLife += Math.floor(Phaser.Math.FloatBetween(1, 7));
        
        this.life = this.maxLife;
        this.initiative = 0;
        
        this.xp = this.maxLife;
    }
}

Monsters.prototype.attackHero = function(hero){
    var toHit = Math.floor(Phaser.Math.FloatBetween(1, 21));
    if(toHit >= hero.attribute.armorClass){
        var damage = 0;
        for(var i = 0; i < this.damageDice; i++){
                damage += Math.floor(Phaser.Math.FloatBetween(1, 7));
            }
        hero.attribute.life -= damage + this.bonus;
    }
}