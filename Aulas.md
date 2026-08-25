O HTML é o esqueleto do site. Usar HTML Semântico significa usar a tag certa para a função certa, em vez de fazer o site inteiro usando só <div>.

<header>: O cabeçalho da página ou de uma seção. Onde costuma ficar a logo e o menu.

<nav>: Define a área de navegação (os links do menu principal).

<main>: O conteúdo principal e exclusivo daquela página. Só deve existir um por página.

<section>: Agrupa conteúdos que têm o mesmo assunto (ex: seção "Sobre", seção "Contatos").

<article>: Um bloco de conteúdo autônomo, que faria sentido sozinho (ex: um post de blog, um cartão de produto).

<footer>>: O rodapé da página (direitos autorais, links secundários).

2. CSS: Organização e Layout
O CSS cuida da aparência. Para montar um site bonito sem virar uma bagunça, usam-se três pilares:

Reset de CSS (* { margin: 0; padding: 0; box-sizing: border-box; }): Tira as margens padrão que os navegadores colocam sozinhos, para você ter controle total do tamanho dos elementos.

Flexbox (display: flex): Perfeito para alinhar coisas em uma dimensão (uma linha ou uma coluna). Exemplo: alinhar os itens do menu lado a lado e centralizados.

CSS Grid (display: grid): Perfeito para layouts em duas dimensões (linhas e colunas ao mesmo tempo). Exemplo: criar a grade onde ficam os cards dos produtos no site.

3. JavaScript: Básico e Intermediário
O JavaScript dá vida e interatividade ao site.

Variáveis e Escopo
const: Cria uma variável cujo valor não pode mudar. Use como padrão.

let: Cria uma variável que pode ter o valor alterado depois.

Escopo: Ambas só existem dentro do bloco { } onde foram criadas.

Funções
Função Tradicional: function somar(a, b) { return a + b; }

Arrow Function: Sintaxe moderna e mais curta: const somar = (a, b) => a + b;

Métodos de Array (MUITO cobrados)
Em vez de usar loops for manuais, usam-se métodos prontos:

.map(): Pega uma lista e transforma cada item dela, gerando uma lista nova do mesmo tamanho.

.filter(): Pega uma lista e filtra apenas os itens que passam em uma condição.

.reduce(): Pega uma lista inteira e reduz a um único valor (ex: somar o total de um carrinho de compras).

4. Manipulação de Canvas HTML5
O <canvas> é uma "tela em branco" no HTML onde você desenha formas geométricas, gráficos ou jogos via código JavaScript.

Pegar o contexto: No JS, você seleciona o elemento e pega o contexto 2D com canvas.getContext('2d').

Desenhar formas:

fillRect(x, y, largura, altura): Desenha um retângulo preenchido.

arc(x, y, raio, anguloInicial, anguloFinal): Desenha círculos.

strokeRect(...): Desenha apenas a borda.

5. Servidor Node.js + MongoDB Nativo (Sem Mongoose)
Aqui está a sacada do backend sem frameworks pesados:

Por que "Sem Mongoose"?
O Mongoose é uma biblioteca (ODM) que cria modelos e validações rígidas. Trabalhar sem ele significa usar o driver oficial do MongoDB (mongodb) diretamente. Você ganha mais controle e performance, lidando com os documentos BSON/JSON puros.

Como funciona o Servidor Nativo:
Servidor HTTP com Node (http.createServer): O próprio Node.js já vem com um módulo de rede. Ele escuta as requisições que chegam na porta (ex: http://localhost:3000).

Conexão com Banco (MongoClient): Você cria uma conexão com a URL do MongoDB (mongodb://localhost:27017) e seleciona a coleção desejada (db.collection('usuarios')).

Rotas na mão: Como não se usa Express, você lê o método (req.method como GET ou POST) e a URL (req.url) no braço:

Se for GET /usuarios: Faz um colecao.find().toArray() no banco e devolve o resultado.

Se for POST /usuarios: Escuta os pedaços de dados que chegam na requisição (req.on('data')), junta tudo em um JSON e usa colecao.insertOne() para salvar no banco.