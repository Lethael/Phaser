class Consommable extends Items{
    constructor(name, description, gainValue, price){
        super(name, description);
        this.gainValue = gainValue;
        this.price = price;
    }
}