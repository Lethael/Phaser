class Weapon extends Items{
    constructor(type, name, description, diceDamage, bonusDamage, size, durability){
        super(type, name, description);
        this.diceDamage = diceDamage;
        this.bonusDamage = bonusDamage;
        this.size = size;
        this.durability = durability;
    }
}