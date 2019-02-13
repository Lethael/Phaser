class Inventory {
    constructor(){
        this.x = 800;
        this.imgInv;
        this.imgItem = new Array();
        this.cursor;
        this.xPosCursor = 0;
        this.yPosCursor = 0;
        this.posOnBag = 0;
        this.posOnArrayBag = 0;
        this.bag = new Array();
        this.gold = 10;
        this.displayGold;
    }  
}
Inventory.isOpen = false; 

Inventory.prototype.openInv = function(scene, mess){
    if(this.imgInv === undefined)
        this.imgInv = scene.physics.add.image(400, 300, 'inv').setScale(0.5);
    Inventory.isOpen = true;
    this.xPosCursor = 284;
    this.yPosCursor = 188;
    if(this.bag.length > 0){
        let xPos = 288;
        let yPos = 192;
        for(let i = 0; i < this.bag.length; i++){
            if(this.bag[i].type === 'sword')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'sword'));
            else if(this.bag[i].type === 'axe')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'axe'));
            else if(this.bag[i].type === 'armor')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'armor'));
            else if(this.bag[i].type === 'consommable')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'potion'));
            xPos += 32;
            if(i != 0 && i % 7 === 0){
                yPos += 32;
                xPos = 288;
            }
                
        }
    }
    this.imgItem.push(scene.physics.add.image(270, 65, 'gold').setScale(0.5));
    //When font will have numbers
    //this.displayGold = mess.setText(scene, 262, 58, "Gold : " + this.gold.toString()).setScale(0.5);
    this.cursor = scene.physics.add.image(this.xPosCursor, this.yPosCursor, 'cursor'); 
}

Inventory.prototype.refreshBag = function(scene){
    
    this.deleteAllSpriteOnInv();
    this.openInv(scene);
    this.xPosCursor = 284;
    this.yPosCursor = 188;
    this.posOnArrayBag = 0;
    this.posOnBag = 0;
    this.cursor.destroy();
    this.cursor = scene.physics.add.image(this.xPosCursor, this.yPosCursor, 'cursor');
}

Inventory.prototype.deleteAllSpriteOnInv = function(){
    for(let i = 0; i < this.imgItem.length; i++)
        this.imgItem[i].destroy();
    this.cursor.destroy();
}


Inventory.prototype.closeInv = function(){
    this.cursor.destroy();
    this.imgInv.destroy();
    this.imgInv = undefined;
    for(let i = 0; i < this.imgItem.length; i++)
        this.imgItem[i].destroy();
    Inventory.isOpen = false;
    this.xPosCursor = 284;
    this.yPosCursor = 188;
    this.posOnArrayBag = 0;
    this.posOnBag = 0;
}

Inventory.prototype.addToInv = function(obj, changeEquip){
    if(!changeEquip){
        if(this.bag.length < 10){
              this.bag.push(obj);
            return true;
           }else{
               return false;
           }   
    }else{
        this.bag.push(obj);
        return true;
    }
}

Inventory.prototype.deleteItemOnBag = function(item){
    for(var i = 0; i < this.bag.length; i++){
        if(this.bag[i] === item){
            this.bag.splice(i, 1);
        }
    }
}

/*
    down cursor on the first item on the next line or
    on the item on the next line
*/
Inventory.prototype.downOneLine = function(scene, posCursor, x){
    this.cursor.x = x;
    this.cursor.y += 32;
    this.posOnBag = posCursor;
}
/*
    up cursor on the first item on the previews line or
    on the item on the previews line
*/
Inventory.prototype.upOneLine = function(scene, posCursor, x){
    this.cursor.x = x;
    this.cursor.y -= 32;
    this.posOnBag = posCursor;
}

/*
    posCursor can take 1 or -1
    column can take 32 or -32
*/
Inventory.prototype.moveCursor = function(scene, column, posCursor){
    this.cursor.x += column;
    this.posOnBag += posCursor;
}
