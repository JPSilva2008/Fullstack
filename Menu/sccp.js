// ========================================================
// CONFIGURAÇÃO INICIAL DO CANVAS
// ========================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menuPause = document.getElementById("menuPause");
// ========================================================
// 1. ASSETS (Dicionário de Imagens do Jogo)
// ========================================================
const assets = {
    player: new Image(), chica: new Image(), bonnie: new Image(),
    freddy: new Image(), endo: new Image(), pizza: new Image(),
    taser: new Image(), moeda: new Image(), batteryItem: new Image(),
    lanternaHUD: new Image(), moedaHUD: new Image()
};

// ========================================================
// 2. CONFIGURAÇÕES GERAIS E EQUILÍBRIO (Balancing)
// ========================================================
const CONFIG = {
    vidaMaximaChica: 25,          
    vidaMaximaFreddy: 90,        
    vidaMaximaBonnie: 20,        // Mantido: 20 cliques de Q
    velocidadeFreddyNormal: 7.5, 
    velocidadeFreddyLento: 2.0,  
    velocidadeFreddyVagar: 1.5,  
    tempoDesacelerado: 90,       
    tempoTontoFreddy: 120,       
    bateriaConsumo: 0.15,       
    raioLuzNormal: 200,                   
    anguloLanternaNormal: 0.8,       
    maxSalas: 8,                
    raioPercepcaoFreddy: 450     
};

// ========================================================
// 3. ESTADOS DINÂMICOS DO JOGO (Variáveis de Controle)
// ========================================================
const player = { 
    x: 475, y: 800,              
    w: 50, h: 50,                
    speedNormal: 5,              
    speed: 5,                    
    moedas: 0,                  
    battery: 100,                
    hasTaser: false,
    
    // Perks normais da loja
    hasPerkLanterna: false,
    hasPerkVelocidade: false,
    hasPerkEscudo: false,

    timerPerkLanterna: 0,
    timerPerkVelocidade: 0,
    timerPerkEscudo: 0,

    // Perks Especiais de Bosses (Perdidos ao morrer)
    temPerkChica: false,
    temPerkBonnie: false 
};




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


const progresso = { salaAtual: 1, vitoria: false, lojaAtiva: false };
const teclas = {};               
const mouse = { x: 0, y: 0 };  
let jogoPausado = false;  

let jogando = true; 

let inimigos = [];               
let moedasNoChao = [];           
let bateriasNoChao = [];         
let pizzas = [];                 
let ondasChoque = []; 
let pulsosCone = []; 
let lanternaAtiva = false;       

// Arrays e objetos para os drops dos Bosses
let itemPerkChicaNoChao = null; 
let itemPerkBonnieNoChao = null; 
let pizzasEspeciaisNoChao = [];

const estadoSalas = {
    chicaDerrotada: false,
    bonnieDerrotado: false,
    freddyDerrotado: false
};

const PRECOS_LOJA = {
    velocidade: 13,
    lanterna: 20,
    escudo: 25
};

const itensLoja = [
    { x: 180, y: 400, w: 100, h: 65, tipo: "lanterna", preco: PRECOS_LOJA.lanterna, texto: "Super Lanterna (20s)" },
    { x: 450, y: 400, w: 100, h: 65, tipo: "velocidade", preco: PRECOS_LOJA.velocidade, texto: "Velocidade (5s)" },
    { x: 720, y: 400, w: 100, h: 65, tipo: "escudo", preco: PRECOS_LOJA.escudo, texto: "Escudo Protetor (4s)" }
];

const chica = { x: 450, y: 200, w: 100, h: 100, vida: CONFIG.vidaMaximaChica, vivo: true, ultimoTiro: 0, direcaoX: undefined, direcaoY: undefined };
const bonnie = { x: 450, y: 200, w: 100, h: 100, vivo: true, atordoado: false, timerAtordoado: 0, cliques: 0, ultimoAtaque: 0 };
const obstaculosBonnie = [
    { x: 250, y: 350, w: 100, h: 100 }, { x: 650, y: 350, w: 100, h: 100 },
    { x: 250, y: 600, w: 100, h: 100 }, { x: 650, y: 600, w: 100, h: 100 }
];

const freddy = { x: 450, y: 100, w: 100, h: 100, vivo: true, vida: CONFIG.vidaMaximaFreddy, timerLento: 0, timerTonto: 0, perseguindo: false, direcaoVagarX: 1, direcaoVagarY: 1, timerMudarDirecao: 0, paradoModoFlash: false, timerEstadoParado: 0 };

const obstaculosFreddy = []; 

function checarEAtivarPerks(numeroSala) {
    const salaTemInimigos = [2, 5, 7].includes(numeroSala) || (numeroSala === 4 && !progresso.lojaAtiva);
    const salaTemBoss = ([3].includes(numeroSala) && !estadoSalas.chicaDerrotada) || 
                         ([6].includes(numeroSala) && !estadoSalas.bonnieDerrotado) || 
                         ([8].includes(numeroSala) && !estadoSalas.freddyDerrotado);

    if (salaTemInimigos || salaTemBoss) {
        if (player.hasPerkLanterna && player.timerPerkLanterna <= 0) {
            player.timerPerkLanterna = 1200; 
            player.hasPerkLanterna = false;
        }
        if (player.hasPerkVelocidade && player.timerPerkVelocidade <= 0) {
            player.timerPerkVelocidade = 300; 
            player.hasPerkVelocidade = false;
        }
        if (player.hasPerkEscudo && player.timerPerkEscudo <= 0) {
            player.timerPerkEscudo = 240; 
            player.hasPerkEscudo = false;
        }
    }
}

// ========================================================
// 4. RESET DE SALAS + CONTROLE DE SPAWN SEGURO
// ========================================================
function carregarSala(numero, vindoDeOnde = "baixo") {
    inimigos = []; moedasNoChao = []; bateriasNoChao = []; pizzas = []; ondasChoque = []; pulsosCone = [];
    pizzasEspeciaisNoChao = []; 
    freddy.perseguiningo = false; freddy.timerTonto = 0; freddy.paradoModoFlash = false; freddy.timerEstadoParado = 0;

    if (estadoSalas.chicaDerrotada) chica.vivo = false;
    if (estadoSalas.bonnieDerrotado) bonnie.vivo = false;
    if (estadoSalas.freddyDerrotado) freddy.vivo = false;

    if (vindoDeOnde === "baixo") { player.x = 475; player.y = 800; } 
    else if (vindoDeOnde === "cima") { player.x = 475; player.y = 80; }  
    else if (vindoDeOnde === "esquerda") { player.x = 850; player.y = 425; } 
    else if (vindoDeOnde === "direita") { player.x = 100; player.y = 425; }   

    if (numero === 3 && chica.vivo) { player.battery = 100; itemPerkChicaNoChao = null; }
    if (numero === 6 && bonnie.vivo) { bonnie.ultimoAtaque = Date.now() + 1500; bonnie.atordoado = false; bonnie.timerAtordoado = 0; itemPerkBonnieNoChao = null; }
    if (numero === 8 && player.battery < 45) { player.battery = 75; }

    const salaComInimigosAtivos = [2, 4, 5, 7].includes(numero) && !progresso.lojaAtiva;

    if (salaComInimigosAtivos && inimigos.length === 0) {
        let quantidadeInimigos = (numero === 4) ? 6 : 3; 
        
        for(let i = 0; i < quantidadeInimigos; i++) {
            let tipoSorteado = Math.floor(Math.random() * 5) + 1; 
            let posicaoValida = false;
            let tentativaX, tentativaY;
            let tentativasMaximas = 50;

            while(!posicaoValida && tentativasMaximas > 0) {
                tentativaX = Math.random() * 800 + 100;
                tentativaY = Math.random() * 500 + 100;
                tentativasMaximas--;

                let distPlayer = Math.hypot(tentativaX - player.x, tentativaY - player.y);
                if (distPlayer < 200) continue;

                let muitoPertoDeOutro = false;
                for(let outro of inimigos) {
                    if (Math.hypot(tentativaX - outro.x, tentativaY - outro.y) < 75) {
                        muitoPertoDeOutro = true;
                        break;
                    }
                }
                
                if(!muitoPertoDeOutro) {
                    posicaoValida = true;
                }
            }

            inimigos.push({
                x: tentativaX, y: tentativaY,
                w: 60, h: 60, vivo: true, jaDropou: false, tipo: tipoSorteado 
            });
        }
    }

    if (player.temPerkChica && (salaComInimigosAtivos || [3, 6, 8].includes(numero))) {
        let qtdPizzas = Math.floor(Math.random() * 2) + 1;
        for(let p = 0; p < qtdPizzas; p++) {
            pizzasEspeciaisNoChao.push({
                x: Math.random() * 750 + 100,
                y: Math.random() * 600 + 150,
                w: 35,
                h: 35,
                tipo: Math.random() < 0.5 ? "velocidade" : "escudo"
            });
        }
    }

    checarEAtivarPerks(numero);
}

// ========================================================
// 5. CÁLCULOS MATEMÁTICOS DE CONE DE LUZ E VISÃO
// ========================================================
function noConeDeLuz(alvo) {
    if (player.battery <= 0) return false;
    let centroPlayerX = player.x + player.w / 2; let centroPlayerY = player.y + player.h / 2;
    let centroAlvoX = alvo.x + alvo.w / 2; let centroAlvoY = alvo.y + alvo.h / 2;

    let raioLuzAtual = CONFIG.raioLuzNormal;
    let anguloAtual = CONFIG.anguloLanternaNormal;

    if (player.temPerkBonnie) {
        raioLuzAtual *= 1.2;
        anguloAtual *= 1.2;
    }

    if (player.timerPerkLanterna > 0) {
        raioLuzAtual = CONFIG.raioLuzNormal * 1.6;
        anguloAtual = CONFIG.anguloLanternaNormal * 1.5;
    }

    let dist = Math.hypot(centroAlvoX - centroPlayerX, centroAlvoY - centroPlayerY);
    if (dist > raioLuzAtual) return false; 

    let anguloMouse = Math.atan2(mouse.y - centroPlayerY, mouse.x - centroPlayerX);
    let anguloAlvo = Math.atan2(centroAlvoY - centroPlayerY, centroAlvoX - centroPlayerX);
    let difAngulo = anguloAlvo - anguloMouse;
    
    while (difAngulo < -Math.PI) difAngulo += Math.PI * 2;
    while (difAngulo > Math.PI) difAngulo -= Math.PI * 2;
    return Math.abs(difAngulo) < anguloAtual / 2;
}

function visaoBloqueadaPorObstaculo(p, entidade, listaObstaculos) {
    let pX = p.x + p.w / 2; let pY = p.y + p.h / 2;
    let eX = entidade.x + entidade.w / 2; let eY = entidade.y + entidade.h / 2;
    for (let obs of listaObstaculos) { if (linhaInterceptaRetangulo(pX, pY, eX, eY, obs)) return true; }
    return false; 
}

function rInter(x1, y1, x2, y2, r) {
    let minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    let minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
    if (maxX < r.x || minX > r.x + r.w || maxY < r.y || minY > r.y + r.h) return false;
    if (lInter(x1, y1, x2, y2, r.x, r.y, r.x + r.w, r.y)) return true;
    if (lInter(x1, y1, x2, y2, r.x, r.y + r.h, r.x + r.w, r.y + r.h)) return true;
    if (lInter(x1, y1, x2, y2, r.x, r.y, r.x, r.y + r.h)) return true;
    if (lInter(x1, y1, x2, y2, r.x + r.w, r.y, r.x + r.w, r.y + r.h)) return true;
    return false;
}

function lInter(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
    let det = (a2x - a1x) * (b2y - b1y) - (b2x - b1x) * (a2y - a1y); if (det === 0) return false; 
    let u = ((b1x - a1x) * (b2y - b1y) - (b2x - b1x) * (b1y - a1y)) / det;
    let v = ((b1x - a1x) * (a2y - a1y) - (a2x - a1x) * (b1y - a1y)) / det;
    return (u >= 0 && u <= 1 && v >= 0 && v <= 1);
}

function pCone(px, py, cx, cy, ang, alc, ab) {
    let dx = px - cx; let dy = py - cy; let dist = Math.hypot(dx, dy); if (dist > alc) return false;
    let angP = Math.atan2(dy, dx); let dif = angP - ang;
    while (dif < -Math.PI) dif += Math.PI * 2; while (dif > Math.PI) dif -= Math.PI * 2;
    return Math.abs(dif) < ab / 2;
}

function distancia(obj1, obj2) { return Math.hypot((obj1.x + obj1.w / 2) - (obj2.x + obj2.w / 2), (obj1.y + obj1.h / 2) - (obj2.y + obj2.h / 2)); }
function colisao(r1, r2) { return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y; }

// ========================================================
// 6. MOTOR DE LÓGICA E PROCESSAMENTO
// ========================================================
function processarDanoOuro() { if (player.timerPerkEscudo > 0) return; morrer(); }

function morrer() { 
    player.temPerkChica = false; 
    player.temPerkBonnie = false;
    jogando = false; 
    location.reload(); 
}

function atualizar() {
    if (!jogando || progresso.vitoria) return; 
    const sala = progresso.salaAtual;

    if (player.timerPerkLanterna > 0) player.timerPerkLanterna--;
    if (player.timerPerkEscudo > 0) player.timerPerkEscudo--;
    if (player.timerPerkVelocidade > 0) { player.timerPerkVelocidade--; player.speed = player.speedNormal * 1.6; } else { player.speed = player.speedNormal; }

    let proxX = player.x; let proxY = player.y; 
    if (teclas['w'] || teclas['arrowup']) proxY -= player.speed;
    if (teclas['s'] || teclas['arrowdown']) proxY += player.speed;
    if (teclas['a'] || teclas['arrowleft']) proxX -= player.speed;
    if (teclas['d'] || teclas['arrowright']) proxX += player.speed;

    let temMortaisVivos = inimigos.some(e => e.vivo && e.tipo !== 4 && e.tipo !== 5);

    if (proxY < 5 && proxX > 440 && proxX < 540) {
        let bloqueadoAvanco = (sala === 2 && temMortaisVivos) || (sala === 3 && chica.vivo) || (sala === 4 && temMortaisVivos) || (sala === 6 && bonnie.vivo) || (sala === 8 && freddy.vivo);
        if (!bloqueadoAvanco) { 
            if (sala < CONFIG.maxSalas) { progresso.salaAtual++; carregarSala(progresso.salaAtual, "baixo"); return; } else { progresso.vitoria = true; return; } 
        } else { proxY = 5; }
    }
    
    if (proxY > 865 && proxX > 440 && proxX < 540 && sala > 1) {
        let bloqueadoVoltar = (sala === 3 && chica.vivo) || (sala === 6 && bonnie.vivo) || (sala === 8 && freddy.vivo);
        if (!bloqueadoVoltar) { progresso.salaAtual--; carregarSala(progresso.salaAtual, "cima"); return; } else { proxY = 865; }
    }

    if (proxX < 0) proxX = 0; if (proxX > 1000 - player.w) proxX = 1000 - player.w;
    if (proxY < 0) proxY = 0; if (proxY > 920 - player.h) proxY = 920 - player.h; 

    if (sala === 6) {
        let colX = false; let colY = false;
        // O PLAYER ainda colide com os blocos, mas o Bonnie vai ignorar nas linhas abaixo
        obstaculosBonnie.forEach(obs => { if (colisao({ x: proxX, y: player.y, w: player.w, h: player.h }, obs)) colX = true; }); if (!colX) player.x = proxX;
        obstaculosBonnie.forEach(obs => { if (colisao({ x: player.x, y: proxY, w: player.w, h: player.h }, obs)) colY = true; }); if (!colY) player.y = proxY;
    } else if (progresso.lojaAtiva) {
        let colX = false; let colY = false;
        itensLoja.forEach(obs => { if (colisao({ x: proxX, y: player.y, w: player.w, h: player.h }, obs)) colX = true; }); if (!colX) player.x = proxX;
        itensLoja.forEach(obs => { if (colisao({ x: player.x, y: proxY, w: player.w, h: player.h }, obs)) colY = true; }); if (!colY) player.y = proxY;
    } else { player.x = proxX; player.y = proxY; }

    if (sala === 4) {
        if (!progresso.lojaAtiva && player.x < 15 && (player.y > 350 && player.y < 550)) { progresso.lojaAtiva = true; carregarSala(4, "esquerda"); }
        else if (progresso.lojaAtiva && player.x > 980 - player.w && (player.y > 350 && player.y < 550)) { progresso.lojaAtiva = false; carregarSala(4, "direita"); }
    }

    if (progresso.lojaAtiva) return; 

    let mirandoNaChica = (sala === 3 && chica.vivo && lanternaAtiva && noConeDeLuz(chica));

    if (lanternaAtiva && player.battery > 0) {
        if (!mirandoNaChica) {
            let consumoFinal = (sala === 3 && chica.vivo) ? CONFIG.bateriaConsumo / 2 : CONFIG.bateriaConsumo;
            player.battery -= consumoFinal; 
            if (player.battery <= 0) { player.battery = 0; lanternaAtiva = false; }
        }
    } else { lanternaAtiva = false; } 

    for (let e of inimigos) {
        if (!e.vivo) continue; let dist = distancia(player, e); let mX = 0; let mY = 0;
        if (e.tipo === 1) { if (e.x < player.x) mX = 2.5; else mX = -2.5; if (e.y < player.y) mY = 2.5; else mY = -2.5; } 
        else if (e.tipo === 2) { if (dist < 350) { if (e.x < player.x) mX = 2; else mX = -2; if (e.y < player.y) mY = 2; else mY = -2; } } 
        else if (e.tipo === 3) { if (lanternaAtiva && noConeDeLuz(e)) { if (!e.jaDropou) { e.vivo = false; e.jaDropou = true; moedasNoChao.push({ x: e.x + 10, y: e.y + 10, w: 25, h: 25 }); } continue; } else { if (e.x < player.x) mX = 1.5; else mX = -1.5; if (e.y < player.y) mY = 1.5; else mY = -1.5; } } 
        else if (e.tipo === 4) { if (lanternaAtiva && noConeDeLuz(e)) { if (e.x < player.x) mX = -3; else mX = 3; if (e.y < player.y) mY = 3; else mY = 3; } else { if (e.x < player.x) mX = 2; else mX = -2; if (e.y < player.y) mY = 2; else mY = -2; } } 
        else if (e.tipo === 5) { if (lanternaAtiva && noConeDeLuz(e)) { mX = 0; mY = 0; } else { if (e.x < player.x) mX = 2.8; else mX = -2.8; if (e.y < player.y) mY = 2.8; else mY = -2.8; } }

        let tentX = e.x + mX; let tentY = e.y + mY; if (tentX > 0 && tentX < 1000 - e.w) e.x = tentX; if (tentY > 0 && tentY < 920 - e.h) e.y = tentY;
        if (e.vivo && dist < 40) { processarDanoOuro(); return; }
    }

    if (lanternaAtiva && [2, 4, 5, 7, 8].includes(sala)) {
        for (let i = 0; i < inimigos.length; i++) {
            let e = inimigos[i];
            if (e.vivo && e.tipo !== 3 && e.tipo !== 4 && e.tipo !== 5) { 
                if (noConeDeLuz(e) && !e.jaDropou) { 
                    e.jaDropou = true; e.vivo = false;    
                    
                    if (sala === 8) {
                        moedasNoChao.push({ x: e.x + 5, y: e.y + 5, w: 25, h: 25 });
                        bateriasNoChao.push({ x: e.x + 25, y: e.y + 25, w: 30, h: 30 });
                    } else {
                        let qtdMoedas = Math.floor(Math.random() * 3) + 1;
                        for(let m = 0; m < qtdMoedas; m++) { moedasNoChao.push({ x: e.x + Math.random()*30, y: e.y + Math.random()*30, w: 25, h: 25 }); }
                        if (Math.random() < 0.40 || player.battery < 50) { bateriasNoChao.push({ x: e.x + 15, y: e.y + 15, w: 30, h: 30 }); }
                    }
                }
            }
        }
    }

    if (sala === 3) {
        if (chica.vivo) {
            if (chica.direcaoX === undefined) { chica.direcaoX = (Math.random() * 2 - 1); chica.direcaoY = (Math.random() * 2 - 1); }
            if (Math.random() < 0.02) { chica.direcaoX = (Math.random() * 2 - 1); chica.direcaoY = (Math.random() * 2 - 1); }
            chica.x += chica.direcaoX * 3; chica.y += chica.direcaoY * 3;
            if (chica.x <= 0 || chica.x + chica.w >= 1000) chica.direcaoX *= -1; if (chica.y <= 0 || chica.y + chica.h >= 920) chica.direcaoY *= -1;

            let intervaloDisparo = 120 + (chica.vida * 2); 
            if (Date.now() - chica.ultimoTiro > Math.max(40, intervaloDisparo)) { 
                pizzas.push({ x: chica.x + chica.w / 2, y: chica.y + chica.h / 2, vx: (Math.random() * 10) - 5, vy: (Math.random() * 10) - 5 }); chica.ultimoTiro = Date.now(); 
            }
            
            for (let i = pizzas.length - 1; i >= 0; i--) {
                let p = pizzas[i]; p.x += p.vx; p.y += p.vy; 
                if (colisao(player, { x: p.x, y: p.y, w: 40, h: 40 })) { processarDanoOuro(); return; }
                if (p.y > 1000 || p.y < 0 || p.x < 0 || p.x > 1000) pizzas.splice(i, 1);
            }
        } else {
            if (itemPerkChicaNoChao && colisao(player, itemPerkChicaNoChao)) {
                player.temPerkChica = true;
                itemPerkChicaNoChao = null;
            }
        }
    }

    for (let i = pizzasEspeciaisNoChao.length - 1; i >= 0; i--) {
        let pEsp = pizzasEspeciaisNoChao[i];
        if (colisao(player, pEsp)) {
            if (pEsp.tipo === "velocidade") { player.timerPerkVelocidade = 300; } 
            else if (pEsp.tipo === "escudo") { player.timerPerkEscudo = 240; }
            pizzasEspeciaisNoChao.splice(i, 1);
        }
    }

    // ========================================================
    // BOSS BONNIE (SALA 6)
    // ========================================================
    if (sala === 6) {
        if (bonnie.vivo) {
            if (!player.hasTaser && colisao(player, {x:150, y:150, w:40, h:40})) player.hasTaser = true;
            if (colisao(player, bonnie)) { processarDanoOuro(); return; }

            let cliquesRestantes = CONFIG.vidaMaximaBonnie - bonnie.cliques;
            let modoFaseFinal = (cliquesRestantes <= 5);

            if (bonnie.atordoado) {
                bonnie.timerAtordoado--; 
                if (bonnie.timerAtordoado <= 0) bonnie.atordoado = false; 
            }

            // [MODIFICADO]: Perseguição direta sem checar colisões com os blocos
            if (!bonnie.atordoado && !modoFaseFinal) {
                let bVel = 3.2; 
                let dX = player.x - bonnie.x; 
                let dY = player.y - bonnie.y; 
                let distP = Math.hypot(dX, dY) || 1;
                
                // Segue o player livremente atravessando tudo
                bonnie.x += (dX / distP) * bVel; 
                bonnie.y += (dY / distP) * bVel;
            }

            if (!bonnie.atordoado) {
                let bCentroX = bonnie.x + bonnie.w / 2; let bCentroY = bonnie.y + bonnie.h / 2;
                
                if (!modoFaseFinal) {
                    let tempoEsperaBase = 3500 - (bonnie.cliques * 150);
                    if (tempoEsperaBase < 1200) tempoEsperaBase = 1200;

                    if (Date.now() - bonnie.ultimoAtaque > tempoEsperaBase) {
                        let pCentroX = player.x + player.w / 2; let pCentroY = player.y + player.h / 2;
                        pulsosCone.push({ x: bCentroX, y: bCentroY, angulo: Math.atan2(pCentroY - bCentroY, pCentroX - bCentroX), alcanceInterno: 0, alcanceMaximo: 340, abertura: 0.9, velocidade: 5.2 });
                        
                        bonnie.atordoado = true;
                        bonnie.timerAtordoado = 240; 
                        bonnie.ultimoAtaque = Date.now();
                    }
                } else { 
                    if (Date.now() - bonnie.ultimoAtaque > 4500) {
                        ondasChoque.push({ x: bCentroX, y: bCentroY, r: 0 }); 
                        
                        bonnie.atordoado = true; 
                        bonnie.timerAtordoado = 240; 
                        bonnie.ultimoAtaque = Date.now();
                    }
                }
            }

            if (teclas['q'] && player.hasTaser && distancia(player, bonnie) < 150) { 
                bonnie.cliques++; 
                teclas['q'] = false; 
                bonnie.atordoado = false;
                bonnie.timerAtordoado = 0;
                if (bonnie.cliques >= CONFIG.vidaMaximaBonnie) { 
                    bonnie.vivo = false; 
                    estadoSalas.bonnieDerrotado = true; 
                    itemPerkBonnieNoChao = { x: bonnie.x + 15, y: bonnie.y + 15, w: 70, h: 45 };
                } 
            }

            for (let i = pulsosCone.length - 1; i >= 0; i--) {
                let pulso = pulsosCone[i]; pulso.x += Math.cos(pulso.angulo) * pulso.velocidade; pulso.y += Math.sin(pulso.angulo) * pulso.velocidade;
                if (pCone(player.x+25, player.y+25, pulso.x, pulso.y, pulso.angulo, pulso.alcanceMaximo, pulso.abertura)) { if (!visaoBloqueadaPorObstaculo(player, bonnie, obstaculosBonnie)) { processarDanoOuro(); return; } }
                if (pulso.x < -300 || pulso.x > 1300) pulsosCone.splice(i, 1);
            }
            
            for (let i = ondasChoque.length - 1; i >= 0; i--) {
                let o = ondasChoque[i]; 
                o.r += 8.5; 
                if (Math.hypot((player.x+25) - o.x, (player.y+25) - o.y) - 25 <= o.r) { if (!visaoBloqueadaPorObstaculo(player, bonnie, obstaculosBonnie)) { processarDanoOuro(); return; } }
                if (o.r > 750) ondasChoque.splice(i, 1); 
            }
        } else {
            if (itemPerkBonnieNoChao && colisao(player, itemPerkBonnieNoChao)) {
                player.temPerkBonnie = true;
                itemPerkBonnieNoChao = null;
            }
        }
    }

    // ========================================================
    // BOSS FREDDY (SALA 8)
    // ========================================================
    if (sala === 8 && freddy.vivo) {
        if (Math.random() < 0.015 && inimigos.filter(inimi => inimi.vivo).length < 6) {
            let spawnX, spawnY; let tentativaSpawnValida = false; let contagemTentativas = 20;
            while(!tentativaSpawnValida && contagemTentativas > 0) {
                spawnX = freddy.x + (Math.random() * 200 - 100); spawnY = freddy.y + (Math.random() * 200 - 100); contagemTentativas--;
                let distP = Math.hypot(spawnX - player.x, spawnY - player.y);
                let muitoPertoDeOutro = inimigos.some(o => o.vivo && Math.hypot(spawnX - o.x, spawnY - o.y) < 65);
                if (distP > 200 && !muitoPertoDeOutro) tentativaSpawnValida = true;
            }
            if(!tentativaSpawnValida) { spawnX = 100; spawnY = 450; }
            inimigos.push({ x: spawnX, y: spawnY, w: 55, h: 55, vivo: true, jaDropou: false, tipo: Math.floor(Math.random() * 2) + 1 });
        }
        
        if (lanternaAtiva && noConeDeLuz(freddy)) {
            freddy.vida -= 0.15;
            if (freddy.vida <= 0) { freddy.vivo = false; estadoSalas.freddyDerrotado = true; }
        }

        let velocidadeAtual = CONFIG.velocidadeFreddyNormal; if (lanternaAtiva && noConeDeLuz(freddy)) { velocidadeAtual = CONFIG.velocidadeFreddyLento; }
        let velX = 0; let velY = 0;
        if (freddy.x < player.x) velX = velocidadeAtual; else if (freddy.x > player.x) velX = -velocidadeAtual;
        if (freddy.y < player.y) velY = velocidadeAtual; else if (freddy.y > player.y) velY = -velocidadeAtual;

        let proxFX = freddy.x + velX; let proxFY = freddy.y + velY;
        if (proxFX >= 0 && proxFX <= 1000 - freddy.w) freddy.x = proxFX;
        if (proxFY >= 0 && proxFY <= 920 - freddy.h) freddy.y = proxFY;

        if (freddy.vivo && colisao(player, freddy)) { processarDanoOuro(); return; }
    }

    for (let i = moedasNoChao.length - 1; i >= 0; i--) { if (colisao(player, moedasNoChao[i])) { player.moedas++; moedasNoChao.splice(i, 1); } }
    for (let i = bateriasNoChao.length - 1; i >= 0; i--) { if (colisao(player, bateriasNoChao[i])) { player.battery = Math.min(100, player.battery + 35); bateriasNoChao.splice(i, 1); } }
}

// ========================================================
// 7. MOTOR DE CONE DE ESCURIDÃO
// ========================================================
function desenharMascaradeLuz() {
    ctx.save(); ctx.fillStyle = "rgba(0, 0, 0, 0.96)"; ctx.fillRect(0, 0, 1000, 1000);
    if (lanternaAtiva && player.battery > 0) {
        ctx.globalCompositeOperation = 'destination-out';
        let centroX = player.x + player.w / 2; let centroY = player.y + player.h / 2;
        let anguloBase = Math.atan2(mouse.y - centroY, mouse.x - centroX);
        
        let raioLuzAtual = CONFIG.raioLuzNormal;
        let anguloAtual = CONFIG.anguloLanternaNormal;

        if (player.temPerkBonnie) {
            raioLuzAtual *= 1.2;
            anguloAtual *= 1.2;
        }

        if (player.timerPerkLanterna > 0) {
            raioLuzAtual = CONFIG.raioLuzNormal * 1.6;
            anguloAtual = CONFIG.anguloLanternaNormal * 1.5;
        }

        let p2x = centroX + Math.cos(anguloBase - anguloAtual / 2) * raioLuzAtual;
        let p2y = centroY + Math.sin(anguloBase - anguloAtual / 2) * raioLuzAtual;
        let p3x = centroX + Math.cos(anguloBase + anguloAtual / 2) * raioLuzAtual;
        let p3y = centroY + Math.sin(anguloBase + anguloAtual / 2) * raioLuzAtual;
        
        const gradiente = ctx.createRadialGradient(centroX, centroY, 0, centroX, centroY, raioLuzAtual);
        gradiente.addColorStop(0, 'rgba(0,0,0,1)'); gradiente.addColorStop(0.8, 'rgba(0,0,0,0.5)'); gradiente.addColorStop(1, 'rgba(0,0,0,0)');     
        ctx.fillStyle = gradiente; ctx.beginPath(); ctx.moveTo(centroX, centroY); ctx.lineTo(p2x, p2y); ctx.lineTo(p3x, p3y); ctx.closePath(); ctx.fill();
    }
    ctx.restore(); 
}

// ========================================================
// 8. LAÇO DE RENDERIZAÇÃO GRÁFICA PRINCIPAL
// ========================================================
function render() {
    if (!jogando) return; atualizar();
    ctx.clearRect(0, 0, 1000, 1000); ctx.fillStyle = "#161616"; ctx.fillRect(0, 0, 1000, 1000);
    desenharMascaradeLuz(); const sala = progresso.salaAtual;

    if (progresso.lojaAtiva) {
        ctx.fillStyle = "purple"; ctx.fillRect(975, 350, 25, 200); ctx.fillStyle = "white"; ctx.font = "bold 16px Arial"; ctx.fillText("VOLTAR", 910, 450);
        itensLoja.forEach(item => {
            let jaTemItem = (item.tipo === "lanterna" && player.hasPerkLanterna) || (item.tipo === "velocidade" && player.hasPerkVelocidade) || (item.tipo === "escudo" && player.hasPerkEscudo);
            ctx.fillStyle = jaTemItem ? "#1a3d24" : "#2e1c3d"; ctx.fillRect(item.x, item.y, item.w, item.h);
            ctx.strokeStyle = jaTemItem ? "#24ff5a" : "#a124ff"; ctx.lineWidth = 3; ctx.strokeRect(item.x, item.y, item.w, item.h);
            ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.fillText(item.texto, item.x - 15, item.y - 25);
            ctx.fillStyle = "gold"; ctx.fillText(item.preco + " Moedas", item.x + 15, item.y - 8);
            ctx.fillStyle = jaTemItem ? "lime" : "#9f9f9f"; ctx.font = "10px Arial"; ctx.fillText(jaTemItem ? "[Guardado]" : "[Clique]", item.x + (jaTemItem ? 20 : 30), item.y + 38);
        });
        ctx.fillStyle = "#a124ff"; ctx.font = "bold 32px Arial"; ctx.fillText("LOJA DE PERKS - SALA 4", 320, 150);
    } 
    else {
        let temMortaisVivos = inimigos.some(e => e.vivo && e.tipo !== 4 && e.tipo !== 5);
        let portaAvancoTrancada = (sala === 2 && temMortaisVivos) || (sala === 3 && chica.vivo) || (sala === 4 && temMortaisVivos) || (sala === 6 && bonnie.vivo) || (sala === 8 && freddy.vivo);
        ctx.fillStyle = portaAvancoTrancada ? "red" : "lime"; ctx.fillRect(470, 0, 60, 20); 

        if (sala === 4) { ctx.fillStyle = "purple"; ctx.fillRect(0, 350, 25, 200); ctx.fillStyle = "white"; ctx.font = "bold 14px Arial"; ctx.fillText("LOJA", 30, 455); }
        let portaVoltarTrancada = (sala === 3 && chica.vivo) || (sala === 6 && bonnie.vivo) || (sala === 8 && freddy.vivo);
        if (sala > 1) { ctx.fillStyle = portaVoltarTrancada ? "red" : "lime"; ctx.fillRect(470, 900, 60, 20); }

        moedasNoChao.forEach(m => desenharSprite(assets.moeda, m.x, m.y, m.w, m.h, "gold", "$"));
        bateriasNoChao.forEach(b => desenharSprite(assets.bateriaItem, b.x, b.y, b.w, b.h, "#00ff66", "B"));
        
        pizzasEspeciaisNoChao.forEach(pEsp => {
            let corPizza = pEsp.tipo === "velocidade" ? "gold" : "blue";
            let txtPizza = pEsp.tipo === "velocidade" ? "P-VEL" : "P-ESC";
            desenharSprite(assets.pizza, pEsp.x, pEsp.y, pEsp.w, pEsp.h, corPizza, txtPizza);
        });

        inimigos.forEach(e => { 
            if(e.vivo) {
                let tagEndo = "ENDO 1"; let corEndo = "red";
                if (e.tipo === 2) { tagEndo = "ENDO 2"; corEndo = "darkred"; }
                else if (e.tipo === 3) { tagEndo = "ENDO 3"; corEndo = "yellow"; }
                else if (e.tipo === 4) { tagEndo = "ENDO 4"; corEndo = "magenta"; }
                else if (e.tipo === 5) { tagEndo = "ENDO 5"; corEndo = "cyan"; }
                desenharSprite(assets.endo, e.x, e.y, e.w, e.h, corEndo, tagEndo); 
            }
        });

        if (sala === 3) {
            if (chica.vivo) {
                desenharSprite(assets.chica, chica.x, chica.y, chica.w, chica.h, "yellow", "CHICA");
                pizzas.forEach(p => desenharSprite(assets.pizza, p.x, p.y, 40, 40, "orange", "PZ"));
                
                ctx.fillStyle = "#222"; ctx.fillRect(300, 40, 400, 15);
                ctx.fillStyle = "yellow"; ctx.fillRect(300, 40, (Math.max(0, chica.vida) / CONFIG.vidaMaximaChica) * 400, 15);
                ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.fillText(`CHICA FLASHES: ${chica.vida} / 25`, 430, 52);
            } else if (itemPerkChicaNoChao) {
                ctx.fillStyle = "#ff00aa"; ctx.fillRect(itemPerkChicaNoChao.x, itemPerkChicaNoChao.y, itemPerkChicaNoChao.w, itemPerkChicaNoChao.h);
                ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.strokeRect(itemPerkChicaNoChao.x, itemPerkChicaNoChao.y, itemPerkChicaNoChao.w, itemPerkChicaNoChao.h);
                ctx.fillStyle = "white"; ctx.font = "bold 10px Arial"; ctx.fillText("PERK CHICA", itemPerkChicaNoChao.x + 2, itemPerkChicaNoChao.y + 22);
            }
        }
        
        if (sala === 6) {
            obstaculosBonnie.forEach(obs => { ctx.fillStyle = "#1c2e3d"; ctx.fillRect(obs.x, obs.y, obs.w, obs.h); ctx.strokeStyle = "#00ffff"; ctx.strokeRect(obs.x, obs.y, obs.w, obs.h); });
            if (bonnie.vivo) {
                if (!player.hasTaser) desenharSprite(assets.taser, 150, 150, 40, 40, "cyan", "TSR");
                
                let textoBonnie = "BONNIE"; let corBonnie = "blue";
                let cliquesRestantes = CONFIG.vidaMaximaBonnie - bonnie.cliques;
                if (cliquesRestantes <= 5) {
                    textoBonnie = bonnie.atordoado ? "FASE FINAL: EXAUSTO (USE TASER!)" : "FASE FINAL: GOLPE AMPLO EM ÁREA!";
                    corBonnie = bonnie.atordoado ? "#442255" : "#aa00ff";
                } else if (bonnie.atordoado) {
                    textoBonnie = "BONNIE ATORDOADO (USE TASER!)"; corBonnie = "gray";
                }
                
                desenharSprite(assets.bonnie, bonnie.x, bonnie.y, 100, 100, corBonnie, textoBonnie);
                pulsosCone.forEach(pulso => { ctx.save(); ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; ctx.beginPath(); ctx.moveTo(pulso.x, pulso.y); ctx.arc(pulso.x, pulso.y, pulso.alcanceMaximo, pulso.angulo - pulso.abertura / 2, pulso.angulo + pulso.abertura / 2); ctx.closePath(); ctx.fill(); ctx.restore(); });
                
                ondasChoque.forEach(o => { ctx.strokeStyle = "rgba(230, 0, 255, 0.85)"; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI*2); ctx.stroke(); });
                
                ctx.fillStyle = "#222"; ctx.fillRect(300, 40, 400, 15);
                ctx.fillStyle = "purple"; ctx.fillRect(300, 40, (Math.max(0, cliquesRestantes) / CONFIG.vidaMaximaBonnie) * 400, 15);
                ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.fillText(`BONNIE CHOQUES RESTANTES: ${cliquesRestantes} / ${CONFIG.vidaMaximaBonnie}`, 395, 52);
            } else if (itemPerkBonnieNoChao) {
                ctx.fillStyle = "#00aaff"; ctx.fillRect(itemPerkBonnieNoChao.x, itemPerkBonnieNoChao.y, itemPerkBonnieNoChao.w, itemPerkBonnieNoChao.h);
                ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.strokeRect(itemPerkBonnieNoChao.x, itemPerkBonnieNoChao.y, itemPerkBonnieNoChao.w, itemPerkBonnieNoChao.h);
                ctx.fillStyle = "white"; ctx.font = "bold 10px Arial"; ctx.fillText("PERK BONNIE", itemPerkBonnieNoChao.x + 2, itemPerkBonnieNoChao.y + 22);
            }
        }
        
        if (sala === 8 && freddy.vivo) {
            let txtF = "FREDDY (" + Math.ceil(freddy.vida) + " HP)"; if (lanternaAtiva && noConeDeLuz(freddy)) txtF = "FREDDY (FRACO!)";
            desenharSprite(assets.freddy, freddy.x, freddy.y, 100, 100, (lanternaAtiva && noConeDeLuz(freddy)) ? "#8b5a2b" : "#5d3a1a", txtF);
            
            ctx.fillStyle = "#222"; ctx.fillRect(300, 40, 400, 15);
            ctx.fillStyle = "#5d3a1a"; ctx.fillRect(300, 40, (Math.max(0, freddy.vida) / CONFIG.vidaMaximaFreddy) * 400, 15);
            ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.fillText(`FREDDY HP: ${Math.ceil(freddy.vida)} / ${CONFIG.vidaMaximaFreddy}`, 430, 52);
        }
    }

    if (player.timerPerkEscudo > 0) { ctx.strokeStyle = "cyan"; ctx.lineWidth = 5; ctx.strokeRect(player.x - 4, player.y - 4, player.w + 8, player.h + 8); } 
    else if (player.timerPerkVelocidade > 0) { ctx.strokeStyle = "gold"; ctx.lineWidth = 3; ctx.strokeRect(player.x - 2, player.y - 2, player.w + 4, player.h + 4); }
    desenharSprite(assets.player, player.x, player.y, 50, 50, "lime", "PLAYER");

    // HUD PANEL
    ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(0, 920, 1000, 80);
    desenharSprite(assets.moedaHUD, 30, 940, 40, 40, "gold", "$"); ctx.fillStyle = "white"; ctx.font = "bold 24px Arial"; ctx.fillText(player.moedas, 85, 970);
    desenharSprite(assets.lanternaHUD, 200, 940, 40, 40, "white", "L");
    ctx.fillStyle = "#444"; ctx.fillRect(250, 950, 150, 20); ctx.fillStyle = player.battery > 20 ? "lime" : "red"; ctx.fillRect(250, 950, player.battery * 1.5, 20); 
    
    ctx.fillStyle = "cyan"; ctx.font = "12px Arial";
    if (player.timerPerkLanterna > 0) ctx.fillText("Lanterna+: " + Math.ceil(player.timerPerkLanterna/60) + "s", 420, 950); else if (player.hasPerkLanterna) ctx.fillText("Lanterna+ [Mochila]", 420, 950);
    if (player.timerPerkEscudo > 0) ctx.fillText("Escudo: " + Math.ceil(player.timerPerkEscudo/60) + "s", 420, 975); else if (player.hasPerkEscudo) ctx.fillText("Escudo [Mochila]", 420, 975);
    if (player.timerPerkVelocidade > 0) ctx.fillText("Velocidade+: " + Math.ceil(player.timerPerkVelocidade/60) + "s", 550, 950); else if (player.hasPerkVelocidade) ctx.fillText("Velocidade+ [Mochila]", 550, 950);
    
    if (player.temPerkChica) { ctx.fillStyle = "#ff00aa"; ctx.font = "bold 11px Arial"; ctx.fillText("✨ PIZZAS CHICA ATIVAS", 685, 948); }
    if (player.temPerkBonnie) { ctx.fillStyle = "#00aaff"; ctx.font = "bold 11px Arial"; ctx.fillText("🔦 LANTERNA BONNIE (+20%)", 685, 970); }

    ctx.fillStyle = "white"; ctx.font = "bold 24px Arial"; ctx.fillText(progresso.lojaAtiva ? "LOJA" : "SALA: " + progresso.salaAtual + " / 8", 800, 970);
    if (progresso.vitoria) { ctx.fillStyle = "lime"; ctx.font = "bold 50px Arial"; ctx.fillText("VOCÊ ESCAPOU!", 320, 500); }

    requestAnimationFrame(render);
}

// ========================================================
// 9. FUNÇÕES DE SUPORTE
// ========================================================
function desenharSprite(img, x, y, w, h, cor, txt) {
    if (img && img.complete && img.src !== "" && img.width > 0) { ctx.drawImage(img, x, y, w, h); } 
    else { ctx.fillStyle = cor; ctx.fillRect(x, y, w, h); ctx.fillStyle = "black"; ctx.font = "bold 10px Arial"; ctx.fillText(txt, x + 4, y + h / 2); }
}

function linhaInterceptaRetangulo(x1, y1, x2, y2, r) { return rInter(x1, y1, x2, y2, r); }

// ========================================================
// 10. CONTROLES E INPUTS
// ========================================================
window.addEventListener('keydown', e => { teclas[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { teclas[e.key.toLowerCase()] = false; });
canvas.addEventListener('mousemove', e => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; });

window.addEventListener('mousedown', e => {
    if (e.button === 0) { 
        lanternaAtiva = !lanternaAtiva; 

        if (lanternaAtiva && progresso.salaAtual === 3 && chica.vivo) {
            if (noConeDeLuz(chica)) {
                chica.vida -= 1; 
                if (chica.vida <= 0) {
                    chica.vivo = false; estadoSalas.chicaDerrotada = true; 
                    itemPerkChicaNoChao = { x: chica.x + 15, y: chica.y + 15, w: 70, h: 45 };
                    for(let m = 0; m < 5; m++) { moedasNoChao.push({ x: chica.x + Math.random()*60, y: chica.y + Math.random()*60, w: 25, h: 25 }); }
                }
            }
        }
    }
    
    if (progresso.lojaAtiva) {
        itensLoja.forEach(item => {
            if (mouse.x > item.x && mouse.x < item.x + item.w && mouse.y > item.y && mouse.y < item.y + item.h) {
                let jaTemItem = (item.tipo === "lanterna" && player.hasPerkLanterna) || (item.tipo === "velocidade" && player.hasPerkVelocidade) || (item.tipo === "escudo" && player.hasPerkEscudo);
                if (!jaTemItem && player.moedas >= item.preco) {
                    player.moedas -= item.preco;
                    if (item.tipo === "lanterna") player.hasPerkLanterna = true;
                    if (item.tipo === "velocidade") player.hasPerkVelocidade = true;
                    if (item.tipo === "escudo") player.hasPerkEscudo = true;
                }
            }
        });
    }
});

// Inicialização do Loop Principal
render();