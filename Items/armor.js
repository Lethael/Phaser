class Armor extends Items{
    constructor(type, name, description, wear, bonusCA, price, durability){
        super(type, name, description);
        this.wear = wear;
        this.baseBonusCA = bonusCA;
        this.bonusCA = bonusCA;
        this.price = price;
        this.durability = durability;
        this.calcCAByDurability();
    }
    
}

Armor.prototype.calcCAByDurability = function(){
    if(this.durability <= 50){
        let looseBonus = Math.floor((50 - this.durability) / 10);
        this.bonusCA -= looseBonus;
        console.log("loose bonus : " + this.bonusCA);
    }
    else if(this.durability > 50 && this.durability <= 79){
        this.bonusCA = this.baseBonusCA;
    }
    else if(this.durability > 79){
        let winBonus = Math.floor((this.durability - 50) / 10);
        this.bonusCA += winBonus;
        console.log("win bonus : " + this.bonusCA);
    }
}