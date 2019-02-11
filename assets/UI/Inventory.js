class Inventory {
    constructor(){
        this.x = 800;
        this.imgInv;
        this.isOpen = false;
        this.bag = new Array();
        this.gold = 0;
    }
    
    
}

Inventory.prototype.openInv = function(scene){
    this.imgInv = scene.physics.add.image(400, 300, 'inv').setScale(0.5);
    this.isOpen = true;
}

Inventory.prototype.closeInv = function(){
    this.imgInv.destroy();
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
