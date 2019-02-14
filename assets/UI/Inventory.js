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
            if(i != 0 && i % 8 === 0){
                yPos += 32;
                xPos = 288;
            }
            if(this.bag[i].type === 'sword')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'sword'));
            else if(this.bag[i].type === 'axe')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'axe'));
            else if(this.bag[i].type === 'armor')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'armor'));
            else if(this.bag[i].type === 'consommable')
                this.imgItem.push(scene.physics.add.image(xPos, yPos, 'potion'));
            xPos += 32;
                
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
        if(this.bag.length < 100){
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
    posCursor = 0 if down 1 line after right push
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

/*
    Only Right and Left
*/
Inventory.prototype.moveOnBag = function(direction){
    if(direction === 'right'){
        if(this.posOnArrayBag < this.bag.length - 1){
            let isDown = false;
            if(this.posOnBag > 0 && this.posOnBag % 7 === 0){
                this.downOneLine(this, 0, 284);
                isDown = true;
            }
            if(!isDown){
                this.moveCursor(this, 32, 1);
            }
            this.posOnArrayBag += 1;
        }
        
    }else if(direction === 'left'){
        let isUp = false;
        if(this.posOnArrayBag > 0){
            if(this.posOnBag === 0){
                this.upOneLine(this, 7, 508);
                isUp = true;
            }
            if(!isUp){
                this.moveCursor(this, -32, -1);
            }
            this.posOnArrayBag -= 1;
        }
    }
        
}

/*
    Only up and Down
*/
Inventory.prototype.moveUpAndDown = function(direction){
    if(direction === 'down'){
       let nbLine = Math.ceil(this.posOnArrayBag / 8);
        console.log("nbLine : " + nbLine);
        if(nbLine < Math.ceil(this.bag.length / 8) - 1){
            console.log("nbLine : " + Math.ceil(this.bag.length / 8));
           if(this.posOnArrayBag + 8 > this.bag.length - 1){
                this.posOnArrayBag = this.bag.length - 1;
                //508 is the last x position
                let newPosX = (508 - this.xPosCursor) / 32;
                let posXUntilEndLine = 8 - newPosX;
                newPosX = this.posOnArrayBag - newPosX;
                this.posOnBag = newPosX - posXUntilEndLine;
                this.downOneLine(this, newPosX - posXUntilEndLine, 284 + newPosX * 32 - posXUntilEndLine * 32);

            }
            else{
                this.posOnArrayBag += 8;
                this.downOneLine(this, this.posOnBag, this.xPosCursor);
            } 
        } 
    }else{
        let nbLine = Math.ceil(this.posOnArrayBag / 8);
        
        if(nbLine > 0){
           if(this.posOnArrayBag === 8){
                this.posOnArrayBag = 0;
            }else{
                this.posOnArrayBag -= 8;
            }
            this.upOneLine(this, this.posOnBag, this.xPosCursor);
        }

    }
        
}
