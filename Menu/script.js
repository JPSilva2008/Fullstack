const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");
const menuPause = document.getElementById("menuPause");
let jogoPausado = false;
function desenhar(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("APERTE ESC PARA PAUSAR", 180, 300);

    requestAnimationFrame(desenhar);
}

// abrir menu com ESC
document.addEventListener("keydown", (evento) => {

    if(evento.key === "Escape"){

        jogoPausado = !jogoPausado;

        if(jogoPausado){
            menuPause.classList.remove("oculto");
        }
        else{
            menuPause.classList.add("oculto");
        }
    }
});

// BOTÕES
function retomarJogo(){

    jogoPausado = false;
    menuPause.classList.add("oculto");
}

function configuracoes(){

    alert("Configurações ainda não adicionadas.");
}

function repetirFase(){

    location.reload();
}

function sairJogo(){

    alert("Saindo do jogo...");
}

// iniciar

desenhar();

