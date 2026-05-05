let numeroSecreto = Math.floor(Math.random() * 100);
console.log(numeroSecreto);

function verificar() {
    let valor = document.getElementById("numero").value;
    
    if (valor == numeroSecreto) {
        document.getElementById("resultado").innerHTML = "Voce acertou";
        document.getElementById("numero").style.setProperty("background-color","green")
    } else {
        document.getElementById("resultado").innerHTML = "Voce errou";
                document.getElementById("numero").style.setProperty("background-color","red")

    }



} 