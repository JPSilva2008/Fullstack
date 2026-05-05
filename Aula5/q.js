let canvas = document.getElementById("meuCanvas");
let ctx = canvas.getContext("2d");

let bola = {
    x: 0,
    y: 100,
    raio: 50,
    img: new Image(),
    desenha: function(){
        this.img.src = 'purper.jpg';
        ctx.beginPath();
        ctx.drawImage(this.img, this.x - this.raio, this.y - this.raio , 2*this.raio, 2*this.raio);
        ctx.closePath();
    }
}



let retangulo = {
    x: 0,
    y: 0,
    altura: 50,
    largura: 50,
    cor: "red",
    desenha: function(){
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x,this.y,this.largura,this.altura);
        ctx.closePath();
    }
}

let retangulo2 = {
    x: 0,
    y: 0,
    altura: 50,
    largura: 50,
    cor: "blue",
    desenha: function(){
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x,this.y,this.largura,this.altura);
        ctx.closePath();
    }
}

let direcao=1 
function animacao(){
    ctx.clearRect(0,0,400,400)

    if(retangulo.x == 200){
        direcao = -20
    }

    if(retangulo.x == 0){
        direcao = 20
    }

    retangulo.x = retangulo.x + direcao*1;
    retangulo.desenha();

    retangulo2.y = retangulo2.y + direcao*1;
    retangulo2.desenha();
    requestAnimationFrame(animacao)

    bola.desenha();

}
animacao();

let ganho = 10;
document.addEventListener('keydown',function(evento){
    tecla = evento.key;
    console.log(tecla);
    if(tecla == 'ArrowUp')   {retangulo.y = retangulo.y-1}  
    if(tecla == 'ArrowDown') {retangulo.y = retangulo.y+1}  
    if(tecla == 'ArrowLeft') {retangulo.x = retangulo.x-1}  
    if(tecla == 'ArrowRight'){retangulo.x = retangulo.x+1}  
})

document.addEventListener('mousemove',function(evento){
    let rect = canvas.getBoundingClientRect();
    let x_mouse = evento.clientX - rect.left;
    let y_mouse = evento.clientY - rect.top;
    console.log(x_mouse,y_mouse);

    if(x_mouse>0 && x_mouse<300 && y_mouse>0 && y_mouse<300){
    bola.x = x_mouse;
    bola.y = y_mouse;
    }
    else{
        bola.x = bola.x
        bola.y = bola.y
    }
});

