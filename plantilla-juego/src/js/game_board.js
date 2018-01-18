'use strict'
//'none' 'blue' 'yellow' 'red'
var cellWidth, cellHeight;
var game;
var colors = ['blue', 'yellow', 'red'];
var destroyablePills = [];//Array con las posiciones de las píldoras a destruir
var cont=0;//Contador del array
var color;
var destroySound;
function gameBoard(Game,xOffset,yOffset){

  game =Game;
  destroySound = game.add.audio('misc4');
  this.pillBroken=false;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
  this.halfPills=[];
  this.cellWidth =  16;//Medidas de las celdas
  this.cellHeight = 16;
  this.virus =0;
  this.yellowVirus=0;
  this.blueVirus=0;
  this.redVirus=0;
  this.score=0;
  this.maxY=0;//Altura máxima a la que puede aparecer un virus

  this.createBoard=function(level){//Creación de la matriz del tablero
    this.cells = [];
    for(var i=0; i<17;i++){//Crea array vacío
        this.cells[i]=[];
      for(var j=0; j<8;j++){
        this.cells[i][j]= new cell(Game, 'none', j , i,this.xOffset,this.yOffset);//Crea una celda en cada posición
      }
    }
    if(level>=15){//Se ponen los virus a una altura distinta según el nivel
      this.maxY=4;
    }
    else if(level>=10){
      this.maxY=7;
    }
    else this.maxY=10;
    this.createVirus(level*4+4,this.maxY);
  }
  this.clearBoard=function(){//Vacía la matriz de celdas
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        this.getCell(j,i).sprite.destroy();
        this.cells[i][j]=undefined;
      }
    }
  }
  this.createVirus = function(number, maxY){//maxY es la altura maxima donde puede aparecer un virus
    this.yellowVirus=0;
    this.redVirus=0;
    this.blueVirus=0;
    this.virus=0;
    for(this.virus=0;this.virus<number;this.virus++){//Crea virus en posiciones aleatorias
        var rndY=game.rnd.integerInRange(maxY, 16);
        var rndX=game.rnd.integerInRange(0, 7);
        var color=colors[game.rnd.integerInRange(0, 2)];
      while(this.isVirus(rndX,rndY)){//Prueba posiciones distintas si hay un virus en la casilla
          rndY=game.rnd.integerInRange(maxY, 16);
          rndX=game.rnd.integerInRange(0, 7);
          color=colors[game.rnd.integerInRange(0, 2)];
      }//Si no hay ya 3 virus adyacentes crea uno
      this.getCell(rndX,rndY).changeCell(color, 'Virus', 0,false);
      this.addVirus(color);
      this.checkAdjacentVirus(color, rndX, rndY);//Comprueba si se han juntado 4 virus
    }
  }
  this.addVirus = function(color){
    if(color=='yellow'){
      this.yellowVirus++;
    }
    else if(color=='blue'){
      this.blueVirus++;
    }
    else if(color=='red'){
      this.redVirus++;
    }
  }
  this.checkGameOver = function(){//Comprueba si hay alguna píldora obstruyendo la entrada
    if(this.getCell(3,1).kind=='Pill' || this.getCell(4,1).kind=='Pill'){
      return true;
    }
    else return false;
  }
  this.checkAdjacentVirus = function(color, posX, posY){//Comprueba si hay colores 4 colores adyacentes
    destroyablePills = [];//Este método se usa solo en la creación de virus para que no aparezcan 4 juntos
    cont = 0;
      if(this.checkHorizontal(color,posX,posY) || this.checkVertical(color,posX,posY)){
        this.destroyAdjacentVirus();
        destroyablePills = [];//Vacía el arrayHalfPills
        cont = 0;
        return true;
      }
      else false;
  }
  this.checkAdjacentColors = function(color, posX, posY){//Comprueba si hay colores 4 colores adyacentes
    destroyablePills = [];//Vacía el arrayHalfPills
    cont = 0;
      if(this.checkHorizontal(color,posX,posY) || this.checkVertical(color,posX,posY)){
        this.destroyAdjacentCells();
        this.pillBroken=true;
        destroyablePills = [];//Vacía el arrayHalfPills
        cont = 0;
        return true;
      }
      else false;
  }
  this.getColor=function(x,y){
    return this.getCell(x,y).color;
  }
  this.isEntirePill = function(x,y){//Devuelve si es una píldora entera o no
    if(this.isPill(x,y)&&this.getBrotherX(x,y)!=-1&&this.getColor(x,y)!='none'){
      return true;
    }
    else return false;
  }
  this.isHalfPill = function(x,y){//Devuelve si es una píldora entera o no
    if(this.isPill(x,y)&&this.getBrotherX(x,y)==-1&&this.getColor(x,y)!='none'){
      return true;
    }
    else return false;
  }
  this.isPill = function(x,y){
    if(this.getKind(x,y)=='Pill'){
      return true;
    }
    else return false;
  }
  this.getKind=function(x,y){
    return this.cells[y][x].kind;
  }
  this.isVirus = function(x,y){
    if(this.getKind(x,y) == 'Virus'){
      return true;
    }
    else false;
  }
  this.checkHorizontal = function(color, posX, posY){//Comprueba si hay 4 colores adyacentes en horizontal
    var auxX=posX;
    var auxY=posY;
    while(this.sameColor(auxX,posY,color)){
      destroyablePills[cont]=[auxX, posY];//Almacena la posición
      auxX--;//La auxiliar recorre X a la izquierda
      cont++;//El contador aumenta
    }
    auxX=posX+1;
    while(this.sameColor(auxX,posY,color)){
      destroyablePills[cont]=[auxX, posY];
      auxX++;//Ahora el auxiliar recorre a la derecha
      cont++;
    }
    if(cont>=4){
      return true;
    }
    else {
      destroyablePills=[];
      cont=0;
      return false;
    }
  }
  this.checkVertical = function(color, posX, posY){
    //Vertical
    var auxY=posY;
    var auxX=posX;
//    var auxY=posY;
    while( this.sameColor(posX,auxY,color)){
      destroyablePills[cont]=[posX,auxY];//Almacena la posición
      auxY--;//La auxiliar recorre Y hacia arriba
      cont++;//El contador aumenta
    }
    auxY=posY+1;
    while( this.sameColor(posX,auxY,color)){
      destroyablePills[cont]=[posX,auxY];
      auxY++;//Ahora el auxiliar recorre hacia abajo
      cont++;
    }
    if(cont>=4){
      return true;
    }
    else {
      destroyablePills=[];
      cont=0;
      return false;
    }
  }
  this.sameColor = function(x,y,color){
    if(this.availableCell(x, y) && this.getColor(x,y)==color){
      return true;
    }
    else false;
  }
  this.destroyFX = function(){
    destroySound.play();
  }
  this.destroyAdjacentCells = function(){//Destruye las celdas que están adyacentes
    for(var i =0;i<cont;i++){
      var auxX = destroyablePills[i][0];
      var auxY = destroyablePills[i][1];
      if(this.isEntirePill(auxX,auxY)){//Si era una píldora entera la deja sin hermanos
        this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).setBrother(-1,-1);//Deja sin hermano a la otra píldora
        this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).changeCell(this.getColor(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)), 'Pill',this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).rotationState,this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).attached);
      }
      else if(this.isVirus(auxX,auxY)){
        this.substractVirus(auxX,auxY);
      }
      this.getCell(auxX,auxY).destroyAnim();
      this.addScore(25);
    }
    this.destroyFX();
  }
  this.destroyAdjacentVirus = function(){//Este método solo se usa para destruir virus en la creación del tablero
    for(var i =0;i<cont;i++){
      var auxX = destroyablePills[i][0];
      var auxY = destroyablePills[i][1];
      this.substractVirus(auxX,auxY);
      this.getCell(auxX,auxY).destroyCell();//A diferencia del método anterior este no tiene animaciones
    }
  }
  this.substractVirus = function(auxX,auxY){
    this.virus--;
    if(this.getColor(auxX,auxY)=='yellow'){
        this.yellowVirus--;
    }
    else if(this.getColor(auxX,auxY)=='blue'){
        this.blueVirus--;
      }
    else if(this.getColor(auxX,auxY)=='red'){
        this.redVirus--;
      }
  }
  this.countColoredVirus = function(){//Método que cuenta los virus de cada color que hay en el tablero
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        if(this.getColor(j,i)=='yellow' && this.isVirus(j,i)){
          this.yellowVirus++;
        }
        else if(this.getColor(j,i)=='blue' && this.isVirus(j,i)){
          this.blueVirus++;
        }
        else if(this.getColor(j,i)=='red' && this.isVirus(j,i)){
          this.redVirus++;
        }
      }
    }

  }
  this.zeroYellowVirus = function(){
    if(this.yellowVirus==0){
      this.yellowVirus--;
      return true;
    }
    else return false;
  }
  this.zeroBlueVirus = function(){
    if(this.blueVirus==0){
      this.blueVirus--;
      return true;
    }
    else return false;
  }
  this.zeroRedVirus = function(){
    if(this.redVirus==0){
      this.redVirus--;
      return true;
    }
    else return false;
  }
  this.getCell = function(x,y){
    return this.cells[y][x];
  }
  this.getBrotherX = function(x,y){
    return this.getCell(x,y).brotherX;
  }
  this.getBrotherY = function(x,y){
    return this.getCell(x,y).brotherY;
  }
  this.addScore = function(score){//Añade puntuación
    this.score+=score;
  }
  this.checkAdjacentInBoard = function(){//Comprueba si hay colores adyacentes en el tablero, se usa cuando varias píldoras se han movido o cuando se crean virus
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        if(this.getColor(j,i)!='none')
          this.checkAdjacentColors(this.getColor(j,i), j,i);
      }
    }
  }
  this.setHalfPills = function(index, posY,posX,color,brotherY,brotherX,rotationState,attached){
    this.halfPills[index]=[];
    this.halfPills[index][0]=posY
    this.halfPills[index][1]=posX;
    this.halfPills[index][2]=color;
    this.halfPills[index][3]=brotherY;
    this.halfPills[index][4]=brotherX;
    this.halfPills[index][5]=rotationState;
    this.halfPills[index][6]=attached;
  }
this.checkBrothers = function()//Busca y guarda la posición de todas las píldoras que se han roto
  {
    this.halfPills =[];//Array que contiene la información de las píldoras que van a caer
    var z=0;
    for(var i=16; i>=0;i--){//Crea array vacío
      for(var j=7; j>=0;j--){//Las recorre de abajo hacia arriba para que no haya conflicto
        if(this.isHalfPill(j,i)){//Si la píldora está sola
            if(this.availableVoidCell(j,i+1)){//La celda de abajo tiene que estar libre
              this.pillBroken=true;
              this.setHalfPills(z,this.getCell(j,i).posY,this.getCell(j,i).posX,this.getColor(j,i),this.getBrotherY(j,i),this.getBrotherX(j,i),this.getCell(j,i).rotationState,this.getCell(j,i).attached);
              z++;
            }
        }
        //Comprueba si hay píldoras enteras flotando
        else  if(this.verticalPillFloating(j,i) || this.horizontalPillFloating(j,i)) {//Attached arriba
              this.pillBroken=true;
              this.setHalfPills(z,this.getCell(j,i).posY,this.getCell(j,i).posX,this.getColor(j,i),this.getBrotherY(j,i),this.getBrotherX(j,i),this.getCell(j,i).rotationState,this.getCell(j,i).attached);
              z++;
              this.setHalfPills(z,this.getBrotherY(j,i),this.getBrotherX(j,i),this.getColor(this.getBrotherX(j,i),this.getBrotherY(j,i)),this.getCell(j,i).posY,
              this.getCell(j,i).posX,this.getCell(this.getBrotherX(j,i),this.getBrotherY(j,i)).rotationState,this.getCell(this.getBrotherX(j,i),this.getBrotherY(j,i)).attached);
              z++;
            }
          }
    }
    return this.halfPills;
  }

  this.horizontalPillFloating = function(x,y){//Comprueba si es una píldora horizontal sin apoyo debajo
    if(this.isEntirePill(x,y)){
      if(this.availableVoidCell(x,y+1) && this.availableVoidCell(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)){
        return true;
      }
    }
    else return false;
  }
  this.verticalPillFloating = function(x,y){//Comprueba si es una píldora vertical sin apoyo debajo
    if(this.isEntirePill(x,y)){
      if(this.availableCell(x,y+1) && this.availableCell(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)){
        if((this.getBrotherY(x,y)>y) && (this.getColor(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)=='none')//Attached abajo
        || (this.getBrotherY(x,y)<y && (this.getColor(x,y+1)=='none')))
        {
          return true;
        }
      }
    }
    else return false;
  }
  this.moveEntirePill=function(i){
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).setBrother(this.halfPills[i][4], this.halfPills[i][3]+1);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]).destroyCell();
  }
  this.moveHalfPill=function(i){
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]).destroyCell();
  }
 this.collapsePills = function(){//Junta todas las píldoras que puedan haber quedado sueltas
    for(var i=0; i<this.halfPills.length;i++){
      if(this.halfPills[i][3]!=-1){//Aquí entran las píldoras enteras
        if(this.availableVoidCell(this.halfPills[i][1], this.halfPills[i][0]+1) && this.availableVoidCell(this.halfPills[i+1][4], this.halfPills[i+1][3]+1))
          {//Comprueba si la celda de abajo de su 'brother' está libre
          if(i+1<this.halfPills.length){
              this.moveEntirePill(i);
              i++;
              this.moveEntirePill(i);
          }
        }
      }
      else if(this.availableVoidCell(this.halfPills[i][1], this.halfPills[i][0]+1)){//Comprueba si pueden caer
        this.moveHalfPill(i);
      }
    }
  }

  this.availableCell = function(x,y){
    if(x>=8 || y>=17 || x<0 || y<0){
      return false;
    }
    else{
      return true;
    }
  }
  this.availableVoidCell = function(x,y){
    if(this.availableCell(x,y) && this.getColor(x,y)=='none'){
      return true;
    }
    else return false;
  }
}
function cell (game, color, posX, posY , xOffset, yOffset){//Celdas que componen la matriz
    this.kind = 'none';//Puede ser Virus o Pill
    this.posX = posX;
    this.posY = posY;
    this.brother= false;
    this.brotherX= -1;
    this.brotherY = -1;
    this.color = color;
    this.sprite = game.add.sprite(16*posX+xOffset,16*posY+yOffset,'' ,2);
    this.sprite.anchor.setTo(0.5,0.5);
    this.sprite.scale.setTo(1,1);
    this.attached = false;
    this.rotationState=0;
    this.changeCell = function(color, kind, rotState, at){//Cambia una celda determinada
        this.rotationState=rotState;
        this.attached=at;
        this.sprite.angle = this.rotationState*90;//Rota el sprite
        this.kind = kind;
        this.color = color;
        if(this.attached){//Booleano que indica si es la píldora auxiliar
          this.sprite.scale.setTo(-1,1);//La píldora auxiliar está girada
        }
        else {
          this.sprite.scale.setTo(1,1);
        }
        if(this.kind!='none'){//Si no está vacía pinta el sprite correspondiente
          this.sprite.loadTexture(color + kind);
          if(this.kind=='Virus'){//Si es un virus ejecuta la animación
            this.anim = this.sprite.animations.add('idle');
            this.anim.play(6,true);

          }
        }
        if(this.kind=='Pill' && (this.brotherX==-1) && this.color!='none'){//Si la píldora está sola el sprite es distinto
          this.sprite.loadTexture(color);
        }
    }
    this.setBrother = function(x, y)//Asigna una píldora hermana
    {
      this.brother=true;
      this.brotherX=x;
      this.brotherY=y;
    }
    this.clearCell = function(){//Reinicia los valores de una celda
      this.attached=false;
      this.kind='none';
      this.color ='none';
      this.brother =false;
      this.brotherX=-1;
      this.brotherY=-1;
    }
    this.destroyAnim = function(){//Hace la animación de destrucción y hace clear
      this.sprite.loadTexture(this.color + 'Explosion');
      this.anim = this.sprite.animations.add('destroy');
      this.anim.play(5,false);
      this.clearCell();
    }
    this.destroyCell = function(){//Además de reiniciar los valores destruye el sprite
      this.sprite.loadTexture();
      this.clearCell();
    }
}
module.exports = {
  gameBoard : gameBoard,
  cell : cell,
}
