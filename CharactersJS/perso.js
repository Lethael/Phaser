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
			chest: undefined,
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
    if(obj.type !== "gold"){
        if(!changeEquipments){
            if(this.inventory.bag.length <= 10){
              this.inventory.bag.push(obj);
                console.log("J'ajoute : " + obj.name);
           }  
        }else{
            this.inventory.bag.push(obj);
        }
    }else{
        this.inventory.gold += obj.amount;
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

Personnage.prototype.equipArmor = function(armor){
    if(this.inventory.bag.length > 0){
        if(this.equipments.chest === undefined){
            this.equipments.chest = armor;
        }else{
            this.attribute.armorClass -= this.equipments.armor.bonusCA;
            this.addToInv(this.equipments.chest, true);
            this.equipments.chest = armor;
        }
        this.attribute.armorClass += armor.bonusCA;
    }
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
                if(this.equipments.leftHand.type === "Weapon"){
                    this.equipments.rightHand.durability -= 1;
                    this.equipments.rightHand.durability -= 1;
                }else{
                    this.equipments.rightHand.durability -= 1;
                }
                if(this.equipments.rightHand.durability % 10 === 0){
                    this.equipments.rightHand.calcCAByDurability();
                }
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

Personnage.prototype.openInv = function(){
    if(this.inventory.bag.length){
        for(var i = 0; i < this.inventory.bag.length; i++){
            console.log(this.inventory.bag[i].name);
        }
    }
    console.log(this.inventory.gold);
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