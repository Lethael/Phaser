class Personnage{
	constructor(name, typeHero){
        initiative: 0,
		this.attribute = {
			name: name,
			typeHero: typeHero,
			level: 1,
			maxLife: 0,
			life: 0,
			armorClass: 0,
			xp: 0,
			xpNextLevel: 0,
			str:  Math.ceil(Math.random() * Math.floor(15)) + 3,
			cons: Math.ceil(Math.random() * Math.floor(15)) + 3,
			power: Math.ceil(Math.random() * Math.floor(15)) + 3,
			piety: Math.ceil(Math.random() * Math.floor(15)) + 3,
			bonStr: 0,
			bonCons: 0,
			bonPow: 0,
			bonPie: 0,
            bonWait: 0
		}
		this.inventory = {
			gold: 0,
			bag: new Array()
		}
		this.equipments = {
			rightHand: undefined,
			leftHand: undefined,
			head: undefined,
			armor: undefined,
            arms: undefined,
			legs: undefined		
		}
		
		this.attribute.bonStr = this.calcBonus(this.attribute.str);
		this.attribute.bonCons = this.calcBonus(this.attribute.cons);
		this.attribute.bonPow = this.calcBonus(this.attribute.power);
		this.attribute.bonPie = this.calcBonus(this.attribute.piety);
		
		this.attribute.maxLife = 6 + this.attribute.bonCons;
		this.attribute.life = this.attribute.maxLife;
		this.attribute.armorClass = 10 + this.attribute.bonCons;

	}
}

Personnage.prototype.calcBonus = function(value){
	var bonus = 0;
	if(value > 13 && value <= 15)
		bonus = 1;
	else if(value > 15 && value <= 16)
		bonus = 2;
	else if(value > 16 && value <= 18)
		bonus = 3;
	
	return bonus;
}

Personnage.prototype.addToInv = function(obj, changeEquipments){
    if(!changeEquipments){
        if(this.inventory.bag.length <= 10){
		  this.inventory.bag.push(obj);
            console.log("J'ajoute : " + obj.name);
	   }  
    }else{
        this.inventory.bag.push(obj);
    }
	
}

Personnage.prototype.equipWeapon = function(weapon){
	if(this.inventory.bag.length > 0){
		if(this.equipments.rightHand === undefined){
			if(weapon.size === 1){
				this.equipments.rightHand = weapon;
                for(var i = 0; i < this.inventory.bag.length; i++){
                    if(this.inventory.bag[i] === weapon){
                        this.inventory.bag.splice(i, 1);
                    }
                }
			}
			else{
				this.equipments.rightHand = weapon;
				this.equipments.leftHand = weapon;
			}
		}else{
            this.addToInv(this.equipments.rightHand, true);
            this.equipments.rightHand = weapon;
        }
	}
}

Personnage.prototype.attackMonster = function(monster){
    var toHit = Phaser.Math.FloatBetween(1, 20) + 20;
    if(toHit >= monster.armorClass){
        var damage = 0;
        if(this.equipments.rightHand !== undefined){
            for(var i = 0; i < this.equipments.rightHand.diceDamage; i++)
                damage += Math.floor(Phaser.Math.FloatBetween(1, 7)) + this.equipments.rightHand.bonusDamage + this.attribute.bonStr;   
        }
        else
          damage += Math.floor(Phaser.Math.FloatBetween(1, 7)) - 2 + this.attribute.bonStr;
        
        if(damage <= 0)
            damage = 1;
        
        monster.life -= damage;
        return damage;
    }
    else
        return 'Miss';
}

Personnage.prototype.waiting = function(){
    if(this.attribute.bonWait < 2){
        this.attribute.bonWait += 1;
    }
}

Personnage.prototype.openInv = function(){
    if(this.inventory.bag.length){
        for(var i = 0; i < this.inventory.bag.length; i++){
            console.log(this.inventory.bag[i].name);
        }
    }
}

Personnage.prototype.usePotion = function(item){
    if(this.attribute.maxLife === this.attribute.life){
        console.log("Your life is full");
        return false;
    }else{
        this.attribute.life += item.gainValue;
        if(this.attribute.life > this.attribute.maxLife){
            this.attribute.life = this.attribute.maxLife;
        }
        return true;
    }
}