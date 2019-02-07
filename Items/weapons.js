class Weapon extends Items{
    constructor(type, name, description, diceDamage, bonusDamage, size, durability){
        super(type, name, description);
        this.diceDamage = diceDamage;
        this.bonusDamage = bonusDamage;
        this.baseBonusDamage = bonusDamage;
        this.size = size;
        this.durability = durability;
    }
}

Weapon.prototype.calculBonusByDurability = function(){
    
}