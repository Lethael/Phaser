class Inventory {
    constructor(){
        this.x = 800;
        this.imgInv;
        this.imgItem = new Array();
        this.cursor;
        this.xPosCursor = 0;
        this.yPosCursor = 0;
        this.posOnBag = 0;
        this.isOpen = false;
        this.bag = new Array();
        this.gold = 0;
    }
    
    
}

Inventory.prototype.openInv = function(scene){
    this.imgInv = scene.physics.add.image(400, 300, 'inv').setScale(0.5);
    this.isOpen = true;
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
    //this.moveOnBag(scene);
}

Inventory.prototype.closeInv = function(){
    this.imgInv.destroy();
    for(let i = 0; i < this.imgItem.length; i++)
        this.imgItem[i].destroy();
    this.isOpen = false;
}

Inventory.prototype.addToInv = function(obj, changeEquip){
    if(!changeEquip){
        if(this.bag.length <= 10){
              this.bag.push(obj);
                console.log("J'ajoute : " + obj.name);
           }   
    }else{
        this.bag.push(obj);
    }
}

Inventory.prototype.deleteItemOnBag = function(item){
    for(var i = 0; i < this.bag.length; i++){
        if(this.bag[i] === item){
            this.bag.splice(i, 1);
        }
    }
}

/*Inventory.prototype.moveOnBag = function(scene){
    console.log(this.cursors);
    let xPos = 288;
    let yPos = 192;
    //this.cursor = scene.physics.add.image(xPos, yPos, 'cursor');
    if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
        xPos += 32;
        console.log("je passe");
    }
    this.cursor = scene.physics.add.image(xPos, yPos, 'cursor');
}*/
