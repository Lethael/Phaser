class Text{
    constructor(scene){
        scene.load.bitmapFont('myfont', 'fonts/font/font.png', 'fonts/font/font.fnt');
        this.text;
    }
}

Text.prototype.setText = function(scene, x, y, message){
    // x, y, font, message, font size
    this.text = scene.add.bitmapText(x, y, 'myfont', message, 24);
    return this.text;
}