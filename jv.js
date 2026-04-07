let canvas = document.getElementById("tela");
let ctx = canvas.getContext("2d");


ctx.fillStyle = "blue";
ctx.fillRect(0, 0, 60, 60);

ctx.fillStyle = "red";
ctx.fillRect(340, 0, 60, 60);


ctx.beginPath();
ctx.moveTo(200, 200);
ctx.lineTo(60, 60);
ctx.strokeStyle = "blue";
ctx.stroke();

ctx.beginPath();
ctx.moveTo(200, 200);
ctx.lineTo(340, 60);
ctx.strokeStyle = "red";
ctx.stroke();


ctx.beginPath();
ctx.moveTo(0, 200);
ctx.lineTo(400, 200);
ctx.strokeStyle = "green";
ctx.stroke();


ctx.beginPath();
ctx.moveTo(200, 200);
ctx.lineTo(200, 500);
ctx.strokeStyle = "green";
ctx.stroke();


ctx.beginPath();
ctx.arc(200, 200, 80, Math.PI, 0);
ctx.strokeStyle = "green";
ctx.stroke();

ctx.beginPath();
ctx.arc(200, 150, 20, 0, Math.PI * 2);
ctx.fillStyle = "cyan";
ctx.fill();


ctx.fillStyle = "red";
ctx.fillRect(180, 200, 40, 40);


ctx.fillStyle = "cyan";
ctx.fillRect(0, 200, 40, 80);
ctx.fillRect(360, 200, 40, 40);


ctx.beginPath();
ctx.arc(100, 300, 20, 0, Math.PI * 2);
ctx.fillStyle = "yellow";
ctx.fill();

ctx.beginPath();
ctx.arc(300, 300, 20, 0, Math.PI * 2);
ctx.fill();


ctx.beginPath();
ctx.arc(200, 400, 80, Math.PI, 0);
ctx.fillStyle = "cyan";
ctx.fill();


ctx.fillStyle = "yellow";
ctx.fillRect(0, 350, 80, 80);
ctx.clearRect(40, 350, 40, 40);

ctx.fillStyle = "black";
ctx.fillRect(320, 350, 80, 80);
ctx.clearRect(320, 350, 40, 40);