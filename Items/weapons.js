class Weapon extends Items{
    constructor(type, name, description, diceDamage, bonusDamage, size, durability){
        super(type, name, description);
        this.diceDamage = diceDamage;
        this.bonusDamage = bonusDamage;
        this.baseBonusDamage = bonusDamage;
        this.size = size;
        this.durability = durability;
        this.calculBonusByDurability();
    }
}

Weapon.prototype.calculBonusByDurability = function(){
    if(this.durability <= 50){
        let looseBonus = Math.floor((50 - this.durability) / 10);
        this.bonusDamage -= looseBonus;
        console.log("loose bonus : " + this.bonusDamage);
    }
    else if(this.durability > 50 && this.durability <= 79){
        this.bonusDamage = this.baseBonusDamage;
        console.log("Between 51 & 79");
    }
    else if(this.durability > 79){
        let winBonus = Math.floor((this.durability - 50) / 10);
        this.bonusDamage += winBonus;
        console.log("win bonus : " + this.bonusDamage);
    }
    
}