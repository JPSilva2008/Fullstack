let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d')

ctx.beginPath();
ctx.lineWidth = 5;
ctx.fillStyle = '#FCFF2D';
ctx.arc(290, 100, 50, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#86471A';
ctx.moveTo(150,200);
ctx.lineTo(150,300);
ctx.lineTo(240,300);
ctx.lineTo(240,200);
ctx.lineTo(150,200);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#624423';
ctx.moveTo(185,300);
ctx.lineTo(205,300);
ctx.lineTo(205,250);
ctx.lineTo(185,250);
ctx.lineTo(185,245);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#808080';
ctx.moveTo(0,300);
ctx.lineTo(400,300);
ctx.lineTo(400,400);
ctx.lineTo(0,400);
ctx.lineTo(0,300);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#47BDFD';
ctx.moveTo(155,220);
ctx.lineTo(185,220);
ctx.lineTo(185,250);
ctx.lineTo(155,250);
ctx.lineTo(155,220);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#47BDFD';
ctx.moveTo(205,220);
ctx.lineTo(235,220);
ctx.lineTo(235,250);
ctx.lineTo(205,250);
ctx.lineTo(205,220);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#F5694D';
ctx.moveTo(150,200);
ctx.lineTo(240,200);
ctx.lineTo(195,160);
ctx.lineTo(150,200);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#86471A';
ctx.moveTo(320,310);
ctx.lineTo(340,310);
ctx.lineTo(340,360);
ctx.lineTo(320,360);
ctx.lineTo(320,310);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 5;
ctx.fillStyle = '#318A26';
ctx.arc(330, 300, 25, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#86471A';
ctx.moveTo(45,300);
ctx.lineTo(65,300);
ctx.lineTo(65,250);
ctx.lineTo(45,250);
ctx.lineTo(45,245);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 5;
ctx.fillStyle = '#318A26';
ctx.arc(55, 240, 25, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#458EFC';
ctx.arc(0,300,45,1.5*Math.PI,2.5*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#458EFC';
ctx.moveTo(45,300);
ctx.lineTo(45,400);
ctx.lineTo(0,400);
ctx.lineTo(0,300);
ctx.lineTo(45,300);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#458EFC';
ctx.arc(140,400,41.6,1*Math.PI,2*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = '#458EFC';
ctx.moveTo(45,359);
ctx.lineTo(150,359);
ctx.lineTo(150,400);
ctx.lineTo(45,400);
ctx.lineTo(45,359);
ctx.fill();
ctx.closePath();