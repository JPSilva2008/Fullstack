const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

// ================= CPU =================
const cpu = {
    x: 400,
    y: 200,
    tamanho: 50,
    velocidade: 5,
    direcaoX: 1,
    direcaoY: 1
};

// ================= JOGADOR =================
const jogador = {
    x: 100,
    y: 100,
    tamanho: 50,
    velocidade: 10,
    vivo: true
};

// ================= TIROS =================
let tiros = [];

// variável da fase
let faseAcabou = false;

const somTiro = new Audio("./tiro.mp3");

// cria tiros
document.addEventListener("click", () => {

    somTiro.play();
    somTiro.pause();
    somTiro.currentTime = 0;

}, { once: true });
function criarTiro(){

    if(faseAcabou) return;

    tiros.push({
        x: cpu.x + cpu.tamanho / 2,
        y: cpu.y + cpu.tamanho / 2,

        tamanho: 15,

        velocidadeX: (Math.random() * 10) - 5,
        velocidadeY: (Math.random() * 10) - 5
    });

    // cria nova instância do som
    somTiro.currentTime = 0;
    somTiro.play();
}


// muda direção aleatória
function mudarDirecao(){

    // se a fase acabou CPU para
    if(faseAcabou) return;

    cpu.direcaoX = (Math.random() * 2 - 1);
    cpu.direcaoY = (Math.random() * 2 - 1);
}

// colisão
function colisao(a, b){

    return (
        a.x < b.x + b.tamanho &&
        a.x + a.tamanho > b.x &&
        a.y < b.y + b.tamanho &&
        a.y + a.tamanho > b.y
    );
}

// ================= CONTROLE JOGADOR =================

document.addEventListener("keydown", (evento) => {

    // não move morto
    if(!jogador.vivo) return;

    // direita
    if(evento.key === "ArrowRight"){
        jogador.x += jogador.velocidade;
    }

    // esquerda
    if(evento.key === "ArrowLeft"){
        jogador.x -= jogador.velocidade;
    }

    // cima
    if(evento.key === "ArrowUp"){
        jogador.y -= jogador.velocidade;
    }

    // baixo
    if(evento.key === "ArrowDown"){
        jogador.y += jogador.velocidade;
    }

    // limites do canvas
    if(jogador.x < 0){
        jogador.x = 0;
    }

    if(jogador.x + jogador.tamanho > canvas.width){
        jogador.x = canvas.width - jogador.tamanho;
    }

    if(jogador.y < 0){
        jogador.y = 0;
    }

    if(jogador.y + jogador.tamanho > canvas.height){
        jogador.y = canvas.height - jogador.tamanho;
    }
});

// ================= DESENHAR =================

function desenhar(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // movimenta CPU somente se fase ativa
    if(!faseAcabou){

        cpu.x += cpu.direcaoX * cpu.velocidade;
        cpu.y += cpu.direcaoY * cpu.velocidade;

        // limites
        if(cpu.x <= 0){
            cpu.x = 0;
            cpu.direcaoX *= -1;
        }

        if(cpu.x + cpu.tamanho >= canvas.width){
            cpu.x = canvas.width - cpu.tamanho;
            cpu.direcaoX *= -1;
        }

        if(cpu.y <= 0){
            cpu.y = 0;
            cpu.direcaoY *= -1;
        }

        if(cpu.y + cpu.tamanho >= canvas.height){
            cpu.y = canvas.height - cpu.tamanho;
            cpu.direcaoY *= -1;
        }
    }

    // CPU
    ctx.fillStyle = "red";
    ctx.fillRect(cpu.x, cpu.y, cpu.tamanho, cpu.tamanho);

    // jogador
    if(jogador.vivo){

        ctx.fillStyle = "green";
        ctx.fillRect(
            jogador.x,
            jogador.y,
            jogador.tamanho,
            jogador.tamanho
        );
    }

    // tiros
    ctx.fillStyle = "blue";

    for(let i = 0; i < tiros.length; i++){

        let tiro = tiros[i];

        // tiros param quando fase acaba
        if(!faseAcabou){
            tiro.x += tiro.velocidadeX;
            tiro.y += tiro.velocidadeY;
        }

        ctx.fillRect(
            tiro.x,
            tiro.y,
            tiro.tamanho,
            tiro.tamanho
        );

        // hit kill
        if(jogador.vivo && colisao(tiro, jogador)){

            jogador.vivo = false;
            faseAcabou = true;
        }
    }

    // mensagem de morte
    if(faseAcabou){

        ctx.fillStyle = "black";
        ctx.font = "60px Arial";
        ctx.fillText("You Died!", 230, 300);
    }

    requestAnimationFrame(desenhar);
}

// muda direção
setInterval(mudarDirecao, 1000);

// cria tiros
setInterval(criarTiro, 150);

// inicia jogo
desenhar();