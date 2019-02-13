class Menu{
    constructor(scene){
        scene.load.image('glove', '../assets/UI/Inventory/cursors/glove3.png');
        this.message = new Text(scene);
        
        this.cursorMenu = scene.physics.add.image(150, 105 + 16, 'glove').setScale(0.5);
        this.cursorMenu.rotation = -45;
        this.cursorMenu.setVisible(false);
        
        /*
            #################### MENU ####################
        */
        this.enumMenu = new Array();
        this.enumMenu.push('Inventory');
        this.enumMenu.push('Stats');
        this.enumMenu.push('Quit Game');

        
        this.menuWindow = scene.add.graphics({fillStyle: {color: 0x7f7f7f}});
        this.menuWindow.fillRect(0, 100, 150, 400);     
        this.menuWindow.setVisible(false);
        this.arrayMenuString = new Array();
        let yText = 110;
        for(let i = 0; i < this.enumMenu.length; i++){
            let text;
            text = this.message.setText(scene, 10, yText, this.enumMenu[i]);
            yText += 50;
            this.arrayMenuString.push(text);
            this.arrayMenuString[i].setVisible(false);
        }
        
        this.posCursorOnMenu = 0;
        /*
            #################### END MENU ####################
        */
        
        /*
            #################### HEROS MENU ####################
        */
        // To see wich hero can be selected
        this.herosWindow = scene.add.graphics({fillStyle: {color: 0x7f7f7f}});
        this.herosWindow.fillRect(120, 100, 200, 200);
        this.herosWindow.setVisible(false);
        
        this.arrayName = new Array();
        
        /*
            #################### END HEROS MENU ####################
        */
    }
    
}

Menu.prototype.openMenu = function(scene){
    if(this.menuWindow.visible){
        this.cursorMenu.y = 105 + 16;
        this.posCursorOnMenu = 0;
        this.cursorMenu.setVisible(false);
        this.menuWindow.setVisible(false);
        this.hideMenuText(); 

    }else{
        this.menuWindow.setVisible(true);
        this.cursorMenu.setVisible(true).setDepth(1);
        for(let i = 0; i < this.enumMenu.length; i++){
            this.arrayMenuString[i].setVisible(true);
        } 

    }
}

Menu.prototype.moveCursor = function(){
    if(!this.herosWindow.visible){
        this.cursorMenu.y += 50;
        this.posCursorOnMenu += 1;
    }else{
        this.cursorMenu.y += 20;
        this.posCursorOnMenu += 1;
        if(this.posCursorOnMenu >= this.arrayMenuString.length){
            this.cursorMenu.y = 105 + 16;
            this.posCursorOnMenu = 0;
        }
    }
        
}

Menu.prototype.validateOnMenu = function(listHeros, scene){
    switch(this.posCursorOnMenu){
        case 0 :
            this.openListHero(listHeros, scene);
            break;
        case 1 :
            console.log("Stats");
            break;
        case 2 :
            console.log('Do you really want to quit this extraordanary game? Oo');
            break;
    }
}

Menu.prototype.openListHero = function(listHeros, scene){
    if(this.herosWindow.visible){
        this.herosWindow.setVisible(false);
    }else{
        this.posCursorOnMenu = 0;
        this.herosWindow.setVisible(true);
        let yPosName = 110;
        for(let i = 0; i < listHeros.length; i++){
            this.arrayName[i] = this.message.setText(scene, 140, yPosName, listHeros[i].attribute.name);
            yPosName += 20;
        }
        this.cursorMenu.x += 200;
        this.cursorMenu.setDepth(1);
    }
}

Menu.prototype.closeListHero = function(){
    this.herosWindow.setVisible(false);
    this.hideListHeros();
    this.cursorMenu.x = 150;
    this.cursorMenu.y = 105 + 16;
    this.posCursorOnMenu = 0;
}

Menu.prototype.openInventory = function(hero, scene){
    // To hide cursor behind inventory
    this.cursorMenu.setDepth(0);
    hero.newInventory.openInv(scene);
}


Menu.prototype.hideMenuText = function(){
    for(let i = 0; i < this.arrayMenuString.length; i++)
        this.arrayMenuString[i].setVisible(false);
}

Menu.prototype.hideListHeros = function(){
    for(let i = 0; i < this.arrayName.length; i++)
        this.arrayName[i].setVisible(false);
}