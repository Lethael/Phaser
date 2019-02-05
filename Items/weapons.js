class Weapon extends Items{
    constructor(name, description, diceDamage, bonusDamage, size){
        super(name, description);
        this.diceDamage = diceDamage;
        this.bonusDamage = bonusDamage;
        this.size = size;
    }
}