class Menu{
    constructor(scene){
        scene.load.image('glove', '../assets/UI/Inventory/cursors/glove3.png');
        this.cursorMenu = scene.physics.add.image(120, 105 + 32, 'glove').setScale(0.5);
        this.cursorMenu.setVisible(false);
        
        this.enumMenu = new Array();
        this.enumMenu.push('Inventory');
        this.enumMenu.push('Stats');
        this.enumMenu.push('Quit Game');

        
        this.menuWindow = scene.add.graphics({fillStyle: {color: 0xfffffff}});
        this.menuWindow.fillRect(0, 100, 100, 400);     
        this.menuWindow.setVisible(false);
        this.arrayMenuString = new Array();
        let yText = 110;
        for(let i = 0; i < this.enumMenu.length; i++){
            this.arrayMenuString[i] = scene.add.text(10, yText, this.enumMenu[i]).setColor('0x000000');
            yText += 50;
            this.arrayMenuString[i].setVisible(false);
        } 
    }
    
}

Menu.prototype.openMenu = function(scene){
    console.log(this.cursorMenu);
    if(this.menuWindow.visible){
        this.cursorMenu.y = 105 + 32;
        this.cursorMenu.setVisible(false);
        this.menuWindow.setVisible(false);
        for(let i = 0; i < this.enumMenu.length; i++){
            this.arrayMenuString[i].setVisible(false);
        } 

    }else{
        this.cursorMenu.setVisible(true);
        this.menuWindow.setVisible(true);
        for(let i = 0; i < this.enumMenu.length; i++){
            this.arrayMenuString[i].setVisible(true);
        } 

    }
}

Menu.prototype.moveCursor = function(){
    this.cursorMenu.y += 50;
}