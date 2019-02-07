class Consommable extends Items{
    constructor(type, name, description, gainValue, price){
        super(type, name, description);
        this.gainValue = gainValue;
        this.price = price;
    }
}