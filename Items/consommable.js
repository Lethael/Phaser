class Consommable extends Items{
    constructor(name, description, gainValue, price, rate){
        super(name, description);
        this.gainValue = gainValue;
        this.price = price;
        this.rate = rate;
    }
}