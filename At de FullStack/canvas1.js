// canvas2.js

let canvas = document.getElementById("tela");
let ctx = canvas.getContext("2d");

/* FUNÇÕES */

function desenhar_quadrado(x, y, largura, altura, cor){
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, largura, altura);
}

function desenhar_arco(x, y, raio, inicio, fim, cor){
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.arc(x, y, raio, inicio, fim);
    ctx.fill();
}

function desenhar_triangulo(x1,y1,x2,y2,x3,y3,cor){
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();
    ctx.fill();
}

/* FUNDO */
desenhar_quadrado(0,0,300,300,"#82e6c3");

/* SOL */
desenhar_arco(230,70,35,0,2*Math.PI,"yellow");

/* CHÃO */
desenhar_quadrado(0,225,300,75,"gray");

/* RIO */
desenhar_arco(0,225,55,Math.PI,0,"#4a86e8");
desenhar_quadrado(0,225,55,75,"#4a86e8");

desenhar_quadrado(55,260,70,40,"#4a86e8");
desenhar_arco(125,300,35,Math.PI,0,"#4a86e8");

/* CASA */
desenhar_quadrado(120,155,70,70,"saddlebrown");

/* porta */
desenhar_quadrado(148,185,15,40,"#6b4423");

/* janelas */
desenhar_quadrado(128,170,20,20,"skyblue");
desenhar_quadrado(165,170,20,20,"skyblue");

/* telhado */
desenhar_triangulo(120,155,155,120,190,155,"tomato");

/* árvore esquerda */
desenhar_quadrado(55,190,15,35,"saddlebrown");
desenhar_arco(62,175,22,0,2*Math.PI,"forestgreen");

/* árvore direita */
desenhar_quadrado(265,210,15,45,"saddlebrown");
desenhar_arco(272,195,22,0,2*Math.PI,"forestgreen");