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
            bonWait: 0  //bonus when waiting one turn. Set them values for toHit for damage for armorClass
    
		}
        this.newInventory = new Inventory();
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
    let ckeckFullInv = false;
    if(obj.type !== "gold"){
        if(!changeEquipments){
            checkFullInv = this.newInventory.addToInv(obj, false);
        }else{
            this.newInventory.addToInv(obj, true);
        }
    }else{
        this.newInventory.gold += obj.amount;
    }
    return checkFullInv;
        
	
}

Personnage.prototype.equipWeapon = function(weapon){
    if(this.equipments.rightHand === undefined){
        if(weapon.size === 1){
            this.equipments.rightHand = weapon;
        }
        else{
            this.equipments.rightHand = weapon;
            this.equipments.leftHand = weapon;
        }
    }else{
        this.newInventory.addToInv(this.equipments.rightHand, true);
        this.equipments.rightHand = weapon;
    }
    this.newInventory.deleteItemOnBag(weapon);
}

Personnage.prototype.equipArmor = function(armor){
    if(this.inventory.bag.length > 0){
        if(this.equipments.armor === undefined){
            this.equipments.armor = armor;
        }else{
            this.attribute.armorClass -= this.equipments.armor.bonusCA;
            this.newInventory.addToInv(this.equipments.armor, true);
            this.equipments.armor = armor;
        }
        this.attribute.armorClass += armor.bonusCA;
    }
    this.newInventory.deleteItemOnBag(armor);
}

Personnage.prototype.equipHelmet = function(helmet){
    if(this.inventory.bag.length > 0){
        if(this.equipments.helmet === undefined){
            this.equipments.helmet = helmet;
        }else{
            this.attribute.armorClass -= this.equipments.helmet.bonusCA;
            this.addToInv(this.equipments.helmet, true);
            this.equipments.helmet = helmet;
        }
        this.attribute.armorClass += helmet.bonusCA;
    }
    this.newInventory.deleteItemOnBag(helmet);
}

Personnage.prototype.equipLegs = function(legs){
    if(this.inventory.bag.length > 0){
        if(this.equipments.legs === undefined){
            this.equipments.legs = legs;
        }else{
            this.attribute.armorClass -= this.equipments.legs.bonusCA;
            this.addToInv(this.equipments.legs, true);
            this.equipments.legs = legs;
        }
        this.attribute.armorClass += legs.bonusCA;
    }
    this.newInventory.deleteItemOnBag(legs);
}

Personnage.prototype.equipArms = function(arms){
    if(this.inventory.bag.length > 0){
        if(this.equipments.arms === undefined){
            this.equipments.arms = arms;
        }else{
            this.attribute.armorClass -= this.equipments.arms.bonusCA;
            this.addToInv(this.equipments.arms, true);
            this.equipments.arms = arms;
        }
        this.attribute.armorClass += arms.bonusCA;
    }
    this.newInventory.deleteItemOnBag(arms);
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
    else{
        let chanceToLooseDurability = Math.floor(Phaser.Math.FloatBetween(1, 100));
        if(chanceToLooseDurability < 20){
            if(this.equipments.rightHand !== undefined){
                // Actually don't testing if the second weapons can be another weapon than the right hand
                // if two handed weapon, there are the same instance between right and left hand
                this.equipments.rightHand.looseDurability();
            }           
        }
        return 'Miss';   
    }
}

Personnage.prototype.waiting = function(){
    if(this.attribute.bonWait < 2){
        this.attribute.bonWait += 1;
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