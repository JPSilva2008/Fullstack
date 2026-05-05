let canvas = document.getElementById("tela");
let ctx = canvas.getContext("2d");

function desenhar_quadrado(x, y, largura, altura, cor) {
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.fillRect(x, y, largura, altura, cor);
    ctx.closePath();
};
function desenhar_linha(x1, y1, x2, y2, cor) {
    ctx.beginPath();
    ctx.strokeStyle = cor;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.linewidth();
    ctx.closePath();

};
function desenhar_arco(x, y, raio, cor) {
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.arc(x, y, raio,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

};
function escrever(texto, x, y, cor) {
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.font = "16px Arial";
    ctx.fillText(texto, x, y);
    ctx.closePath();

};


function pinta(){
    

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(120, 230);
    ctx.lineTo(150, 190);
    ctx.lineTo(180 , 230);
    ctx.fill();
    desenhar_quadrado(20, 300, 400, 100, "gray");
    desenhar_quadrado(120, 230, 60, 70, "brown");
    desenhar_arco(310, 100, 40,'yellow');
    

    desenhar_quadrado(140, 260, 20, 40, "pink");
    desenhar_quadrado(125, 250, 15, 20, "blue");
    desenhar_quadrado(160, 250 , 15, 20, "blue");
    desenhar_quadrado(50, 260, 15, 40, "brown");
    desenhar_quadrado(350, 310, 15, 40, "brown");
    desenhar_arco(57, 241, 20, "green");
    desenhar_arco(357, 290, 20, "green");
    desenhar_arco(0, 300, 40,'blue');
    desenhar_quadrado(0, 350, 33, 60,"blue");
    desenhar_quadrado(0, 330, 33, 60, "blue");
    
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(40, 300, 80, Math.PI * 2 * Math.PI);
    ctx.fill();

    escrever("Canvas", 120, 20, "#000" );



};


function desenhar() {
    pinta();

    



};

// desenhar_quadrado(0, 0, 300, 300, "white");




desenhar();


