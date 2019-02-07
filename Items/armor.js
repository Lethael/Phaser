class Armor extends Items{
    constructor(type, name, description, wear, bonusCA, price, durability){
        super(type, name, description);
        this.wear = wear;
        this.bonusCA = bonusCA;
        this.price = price;
        this.durability = durability;
    }
    
}