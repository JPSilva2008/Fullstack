var canvas = document.getElementById('meucan'); 
var ctx = canvas.getContext('2d');

// 1. AJUSTE DE CORES DOS CANTOS SUPERIORES
// Canto Esquerdo Superior (Azul na imagem)
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, 50, 50);

// Canto Direito Superior (Vermelho na imagem)
ctx.fillStyle = 'red';
ctx.fillRect(250, 0, 50, 50);

// 2. FORMAS LATERAIS (Ciano/Dodgerblue)
ctx.fillStyle = 'cyan';
// Esquerda
ctx.fillRect(0, 110, 30, 40); // Parte de cima
ctx.fillRect(0, 150, 30, 40); // Parte de baixo
// Direita
ctx.fillRect(270, 130, 30, 40);

// 3. QUADRADO CENTRAL (Vermelho)
ctx.fillStyle = 'red';
ctx.fillRect(110, 150, 40, 40);

// 4. "L" INVERTIDO NOS CANTOS INFERIORES
// Amarelo (Esquerda)
ctx.fillStyle = 'yellow';
ctx.beginPath();
ctx.moveTo(0, 250);
ctx.lineTo(20, 250);
ctx.lineTo(20, 280);
ctx.lineTo(50, 280);
ctx.lineTo(50, 300);
ctx.lineTo(0, 300);
ctx.fill();

// Preto (Direita)
ctx.fillStyle = 'black';
ctx.beginPath();
ctx.moveTo(300, 250);
ctx.lineTo(280, 250);
ctx.lineTo(280, 280);
ctx.lineTo(250, 280);
ctx.lineTo(250, 300);
ctx.lineTo(300, 300);
ctx.fill();

// 5. LINHAS ESTRUTURAIS
ctx.lineWidth = 1;
ctx.strokeStyle = 'blue'; // Linha Azul (diagonal esquerda)
ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(150, 150); ctx.stroke();

ctx.strokeStyle = 'red';  // Linha Vermelha (diagonal direita)
ctx.beginPath(); ctx.moveTo(250, 50); ctx.lineTo(150, 150); ctx.stroke();

ctx.strokeStyle = 'green'; // Linha Verde Horizontal
ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(300, 150); ctx.stroke();

ctx.strokeStyle = 'grey';  // Linha Cinza Vertical
ctx.beginPath(); ctx.moveTo(150, 150); ctx.lineTo(150, 300); ctx.stroke();

// 6. CÍRCULOS E SEMICÍRCULOS
ctx.strokeStyle = 'green';

// Semicírculos superiores (o "arco-íris" verde)
ctx.beginPath(); ctx.arc(150, 150, 40, Math.PI, 0); ctx.stroke();
ctx.beginPath(); ctx.arc(150, 150, 60, Math.PI, 0); ctx.stroke();

// Pequeno círculo ciano no topo do arco
ctx.fillStyle = 'cyan';
ctx.beginPath(); ctx.arc(150, 115, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

// Círculos Amarelos (olhos na parte inferior)
ctx.fillStyle = 'yellow';
ctx.beginPath(); ctx.arc(70, 220, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
ctx.beginPath(); ctx.arc(230, 220, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

// Semicírculos verdes inferiores
ctx.beginPath(); ctx.arc(150, 300, 80, Math.PI, 1.5 * Math.PI); ctx.stroke(); // Esquerda
ctx.beginPath(); ctx.arc(150, 300, 60, Math.PI, 1.5 * Math.PI); ctx.stroke(); // Esquerda menor
ctx.beginPath(); ctx.arc(150, 300, 40, 0, 0.5 * Math.PI, true); ctx.stroke(); // Direita (ajuste manual)

// 7. GRANDE SEMICÍRCULO CIANO (Base)
ctx.fillStyle = 'cyan';
ctx.beginPath();
ctx.arc(150, 300, 40, Math.PI, 0);
ctx.fill();
ctx.stroke();

// 8. TEXTO
ctx.fillStyle = 'black';
ctx.font = "20px Arial";
ctx.textAlign = "center";
ctx.fillText("Canvas", 150, 60);