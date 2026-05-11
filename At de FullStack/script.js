/// script.js

let sorteado = Math.floor(Math.random() * 101);

function jogar(){

    let usuario = Number(document.getElementById("numero").value);

    let texto = document.getElementById("resultado");

    if(usuario == sorteado){

        texto.innerHTML = "Acertou! Número sorteado: " + sorteado;

        document.getElementById("caixa").style.setProperty("background-color","lightgreen");
    }

    else if(usuario > sorteado){

        texto.innerHTML = "Errou! O número é menor.";

        document.getElementById("caixa").style.setProperty("background-color","red");
    }

    else{

        texto.innerHTML = "Errou! O número é maior.";

        document.getElementById("caixa").style.setProperty("background-color","red");
    }

}