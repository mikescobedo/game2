/*const $app = document.getElementById('app');

class Gato{
    constructor(){
        this.color='Cafe';
        window.addEventListener('keydown', e=>{
            setTimeout(()=>{
                $app.innerHTML +=  `<h5>${this.color}</h5>`;
            },1);
            
        });
    }
}

const gato =  new Gato();*/


//Se crea un evento en el cual se le pasan el tamaño al canvas
window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1'); //Se obtine el elemento por medio del id asignado
    const ctx = canvas.getContext("2d") 
    canvas.width = 1000; // Se asigna la medida para el ancho
    canvas.height = 500; //Se asigna la medida para altura 

    // Se crea la  clase para poder manipular cuando se oprima una tecla
    class InputHandler{
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e =>{  // Se crea el Listener  cuando se aprime una tecla
                if(( (e.key==='ArrowUp') ||  // Si la tecla felcha arriba se presiona
                     (e.key==='ArrowDown')  // Si la  tecla flecha abajo de suelta
                ) && this.game.keys.indexOf(e.key) === -1){ // Esta recorrera el arreglo
                    this.game.keys.push(e.key);   
                }else if(e.key === ' '){ //Si la tecla barra espaceadora se activa 
                    this.game.player.shootTop() // Esta llamara la funcion para disparar
                }else if(e.key  === 'd'){ // Si se presiona la tecla d 
                    this.game.debug = !this.game.debug //entrara un modo debug en el cual se podra visualizar  un recuadro
                }
            });

            window.addEventListener("keyup",  e=> {
                if(this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1)
                }
                //console.log(this.game.keys);
            })
        }
    }
    // Se crea la clase projectile
    class Projectile{
        constructor(game, x, y ){
            this.game = game; // se manda a llamar la clase game
            this.x = x; // se declara la variable x 
            this.y = y; // Se declara la variable y
            this.width = 10; // Se le asigna la medida de ancho
            this.height = 3; // se asgina la medidad de alto
            this.speed = 6; // se le asigna la velocidad
            this.markedForDeletion = false // Se crea la vairable para eliminar. Inicializando en false
            
        }

        update(){
            this.x += this.speed; 
            if(this.x > this.game.width * 0.8){
                this.markedForDeletion = true
            }
        }
        // se pintan los  projectiles de color rojo 
        draw(context){
            context.fillStyle = 'red'; 
            context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    //se crea la  clase player
    class Player {
        constructor(game){
            this.game = game; // se declara la  vairable
            this.width = 120; // se declara la  medida de alto
            this.height = 190; // Se declara la  medida de ancho 
            this.x = 20; // Se delcara la variable x Con un valor de 20
            this.y = 100; // Se declara y con un valor  inicial de 100 
            this.frameX = 0; // Se declara el frameX 
            this.frameY = 1; // Se declara el frameY
            this.speedY = 0; // Se declara la variable para controlar la velocidad
            this.maxSpeed = 1; // Se declara una  velocidad  maxima
            this.projectiles = []; // Se crea un arreglo para los  projectiles
            this.image = document.getElementById('player'); // Se agina una imagen para el jugador
            this.maxFrame = 37; // Se asigna un valor  maximo para el maxFrame  
        }
        //Se actualiza cuando se oprimen las teclas  arriba, abajo 
        update(){
            if(this.game.keys.includes('ArrowUp')){
                this.speedY = -this.maxSpeed;
            }else if(this.game.keys.includes('ArrowDown')){
                this.speedY = this.maxSpeed;
            }else{
                this.speedY = 0;
            }

            this.y += this.speedY;

            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
            if(this.frameX < this.maxFrame){
                this.frameX++;

            }else{
                this.frameX = 0;
            }
        }
            //Se pinta el jugador
        draw(context){
            if(this.game.debug)context.strokeRect(this.x,this.y, this.width,this.height);  
            context.drawImage(this.image, //Se toma la  imagen asignada
                this.frameX*this.width, // se multiplican los valores que  tiene cada vairiable
                this.frameY*this.height,// se multiplican los valores que  tiene cada vairiable
                this.width, this.height,// se multiplican los valores que  tiene cada vairiable
                this.x,this.y,
                this.width,this.height
                )      
            this.projectiles.forEach(projectile => { // Se pintan el uso de los  projectiles 
                projectile.draw(context); // Se pinta el projectile
            });          
        }

        
        // Se crea la funcion en la  cual creamos las balas para el juego
        shootTop(){
            if(this.game.ammo >0){
                this.projectiles.push(new Projectile(this.game, this.x+80, this.y+30));
                this.game.ammo--;
             }
        }
    }

    // Se crea la clase Enemy
    class Enemy{
        constructor(game){
            this.game = game; // se llama la  clase game
            this.x = this.game.width; // se crea la variable x que va  ser  igual a las medidas del with de la clase game
            this.speedX = Math.random()*-1.5-0.5; // Se crea una valocidad variable para los  enemigos
            this.markedForDeletion = false; // Se declara la variable para eliminarlos inicializandola en false
            this.lives = 10; // Se crea la variable de vidas con las que cuenta cada enemigo
            this.score = this.lives; // Se declara la  variable  score las cuales seran tomadas de los puntos de vida de los  enemigos 
            this.frameX = 0; // se declara la vairable
            this.frameY = 0; // se declara la vairable
            this.maxFrame = 37; // Se declara un maximo
        }

        // se crea la funcion update la cual nos servira para ir  acutualizando a nuestros enemigos. 
        update(){
            this.x += this.speedX;
            if(this.x + this.width < 0){
                this.markedForDeletion = true;
            }  
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }else{
                this.frameX=0
            }
        }
        // Se crea la funcion en  la cual estaremos  pintando nuestros elementos requeridos
        draw(context){
            if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                this.frameX*this.width,
                this.frameY*this.height,
                this.width,this.height,
                 this.x, this.y,
                 this.width, this.height

                );
            context.font = '20px Helvetica'; // Se le asigna una  tipografia y un tamaño a la fuente
            context.fillText(this.lives, this.x, this.y);
        }
    }
   
    // Se crea la  clase Layer
    class Layer {
        constructor(game, image, speedModifier){
            this.game = game; // se manda a llamar a la clase game
            this.image = image; // se declara la vairable con la  cual podremos hacer uso de la  imagen
            this.speedModifier = speedModifier; // // se declara la vairable con la cual podremos modificar la  velocidad
            this.width = 1768; // se declara la vairable para la medida de altura
            this.height = 500; // se declara la vairable para la  variable  de ancho
            this.x = 0;// se declara la vairable x
            this.y = 0;// se declara la vairable y
        }

        update(){
            if(this.x <= -this.width) this.x = 0;
             this.x -= this.game.speed*this.speedModifier;
        }

        //Se crea la funcion para piintar los elementos creados en esta clase 
        draw(context){
            context.drawImage(this.image,this.x,this.y);
            context.drawImage(this.image,this.x + this.width, this.y);
        }

    }

    // Se crea la clase background en la cual podremos definir el fondo de nuestro jeugo
    class Background{
        constructor(game){
            this.game = game; // se declara la vairable game con la cual mandamos a llamar a esa clase
            this.image1 = document.getElementById('layer1'); // se declara la vairable image1 con la cual asignamos la  imagen
            this.image2 = document.getElementById('layer2'); // se declara la vairable image2 con la cual asignamos la  imagen
            this.image3 = document.getElementById('layer3'); // se declara la vairable image3 con la cual asignamos la  imagen
            this.image4 = document.getElementById('layer4'); // se declara la vairable image con la cual asignamos la  imagen
            this.layer1 = new Layer(this.game, this.image1, 0.2);  // Se crea un layer en la cual se le  asigna la velocidad de cada imagen
            this.layer2 = new Layer(this.game, this.image2, 0.4);  // Se crea un layer en la cual se le  asigna la velocidad de cada imagen
            this.layer3 = new Layer(this.game, this.image3, 1.2);  // Se crea un layer en la cual se le  asigna la velocidad de cada imagen
            this.layer4 = new Layer(this.game, this.image4, 1.7);  // Se crea un layer en la cual se le  asigna la velocidad de cada imagen

            this.layers = [this.layer1, this.layer2, this.layer3]; // se crea el arreglo de nuestras imagenes
        }
        // Se crea la clase update para los layers
        update(){
            this.layers.forEach(layer => layer.update());
        }
        // Se pintan lo componentes creados en esta clase 
        draw(context){
            this.layers.forEach(layer => layer.draw(context));
        }
    }
        // Clase para crear la interfaz
    class UI{
        constructor(game){
            this.game = game; // Se manda a llamar la clase game 
            this.fontSize = 30; //Se asigna un tamaño de fuente
            this.fontFamily= 'Helvetica'; // Se asigna una tipografia
            this.color = 'yellow' // se asgina el color al contador de balas y tiempo
        }
        
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'blue';
            context.font = this.fontSize + ' px '+this.fontFamily;
            context.fillText('Score: '+this.game.score,20,40);
            
            for(let i=0;i<this.game.ammo;i++){
                context.fillRect(20+5*i,50,3,20);
            }

            const formattedTime = (this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer: '+formattedTime, 20,100)

            if(this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if(this.game.score > this.game.winningScore){
                    message1 = 'You win!';
                    message2 = 'Well done';
                }else{
                    message1 = 'You lose';
                    message2 = 'Try again!'
                }
            
                context.font = '60px '+this.fontFamily;
                context.fillText(message1, this.game.width*0.5,this.game.height*0.5-20);

                context.font = '30px '+this.fontFamily;
                context.fillText(message2, this.game.width*0.5, this.game.height*0.5+20);

            }
            context.restore();
        }
    }

    class Angler1 extends Enemy{
        constructor(game){
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random()*(this.game.height*0.9-this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random()*3);
        }
    }
    

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.background =  new Background(this);
            this.keys =  [];            
            this.ammo = 20;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.maxAmmo = 90;
            this.enemies= [];
            this.enemyTimer = 0;
            this.enmyInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 15;
            this.gameTime= 0;
            this.timeLimit = 25000;
            this.speed = 1;
            this.debug = false;
        }

        update(deltaTime){
            if(!this.gameOver) this.gameTime += deltaTime;
            if(this.gameTime >  this.timeLimit) this.gameOver = true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime);
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo){
                    this.ammo++;
                    this.ammoTimer = 0;
                }
            }else{
                this.ammoTimer += deltaTime
            }

            this.enemies.forEach(enemy=>{
                enemy.update();
                if( this.checkCollision( this.player, enemy)){
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile => {
                    if(this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if( enemy.lives <= 0){
                            enemy.markedForDeletion = true;
                            if(!this.gameOver){
                                this.score += enemy.score
                            }
                            if(this.score > this.winningScore) this.gameOver = true;
                        }
                    }
                });
            });

            this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);

            if(this.enemyTimer > this.enmyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }

        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
            });
            this.background.layer4.draw(context);
        }

        addEnemy(){
            this.enemies.push(new Angler1(this));
        }

        checkCollision(rect1, rect2){
            return(  rect1.x < rect2.x + rect2.width 
                     && rect1.x + rect1.width > rect2.x                   
                     && rect1.y < rect2.y + rect2.height
                     && rect1.height + rect1.y > rect2.y 
                );
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);        
        requestAnimationFrame(animate);
    }

    animate(0);
});


