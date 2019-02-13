class Text{
    constructor(scene){
        scene.load.bitmapFont('myfont', 'fonts/font/font.png', 'fonts/font/font.fnt');
        this.text;
        this.arrayText = new Array();
    }
}

Text.prototype.setText = function(scene, x, y, message){
    // x, y, font, message, font size
    this.text = scene.add.dynamicBitmapText(x, y, 'myfont', message, 24);
    return this.text;
}

/*Text.prototype.setArrayText = function(scene, x, y, message){
    let newArray = new Array();
    let oldIndex = 0;
    for(let i = 0; i < message.length; i++){
        if(i% 34 === 0 && i !== 0){
            newArray.push(message.substring(oldIndex, i));
            oldIndex = i;
        }
            
    }
    console.log(newArray);
    // x, y, font, message, font size
    for(let i = 0; i < newArray.length; i++){
        this.arrayText[i] = scene.add.dynamicBitmapText(x, y, 'myfont', newArray[i], 24);
        //this.arrayText.push(this.text);
        if(i >= 2)
            this.arrayText[i].setVisible(false);
        y += 30;
    }
        
    return this.arrayText;
}

Text.prototype.nextMessage = function(arrayMess){
    console.log(this.arrayText);
    for(let i = 0; i < this.arrayText.length; i+2){        
        if(this.arrayText[i].visible){
            this.arrayText[i].destroy()
            this.arrayText[i + 1].destroy();
        }else{
            if(i !== this.arrayText.length){
                this.arrayText[i].y = 520;
                this.arrayText[i+1].y = 550;
                this.arrayText[i].setVisible(true);
                this.arrayText[i+1].setVisible(true);
            }else{
                this.arrayText[i].y = this.arrayText[i - 2].y;
                this.arrayText[i].setVisible(true);
            }

        }   
    }
}*/