// Lista de palavras (todas com 4 a 6 letras)
const palavras = [
  "GATO", "BOLA", "FADA", "NAVE",
  "LIVRO", "MUNDO", "NINJA", "PIXEL", "MAGIA",
  "ESPADA", "ESCUDO", "PORTAL",
];

const maxTentativas = 6;

let palavraSecreta = "";
let tentativaAtual = 0;
let jogoAcabou = false;

const tabuleiro = document.getElementById("tabuleiro");
const formulario = document.getElementById("formulario");
const campoChute = document.getElementById("chute");
const info = document.getElementById("info");
const mensagem = document.getElementById("mensagem");
const botaoJogarNovamente = document.getElementById("jogar-novamente");

function novoJogo() {
  // Sorteia uma palavra da lista
  palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];
  tentativaAtual = 0;
  jogoAcabou = false;

  atualizarInfo();
  mensagem.textContent = "";
  mensagem.className = "";
  botaoJogarNovamente.hidden = true;
  campoChute.disabled = false;
  campoChute.value = "";
  campoChute.maxLength = palavraSecreta.length;
  campoChute.focus();

  // Monta o tabuleiro: 6 linhas, com uma casa para cada letra
  tabuleiro.innerHTML = "";
  for (let i = 0; i < maxTentativas; i++) {
    const linha = document.createElement("div");
    linha.className = "linha";

    for (let j = 0; j < palavraSecreta.length; j++) {
      const casa = document.createElement("div");
      casa.className = "casa";
      linha.appendChild(casa);
    }

    tabuleiro.appendChild(linha);
  }
}

function atualizarInfo() {
  info.textContent = `A palavra tem ${palavraSecreta.length} letras - Tentativa ${tentativaAtual + 1} de ${maxTentativas}`;
}

// Compara o chute com a palavra secreta e devolve a cor de cada letra
function verificar(chute, palavra) {
  const resultado = [];
  const letrasQueSobraram = palavra.split("");

  // 1º: marca as letras que estão na posição correta
  for (let i = 0; i < chute.length; i++) {
    if (chute[i] === palavra[i]) {
      resultado[i] = "certa";
      letrasQueSobraram[i] = null;
    }
  }

  // 2º: as outras letras existem em outra posição ou não existem
  for (let i = 0; i < chute.length; i++) {
    if (resultado[i]) continue;

    const posicao = letrasQueSobraram.indexOf(chute[i]);
    if (posicao !== -1) {
      resultado[i] = "lugar-errado";
      letrasQueSobraram[posicao] = null; // essa letra não pode ser contada de novo
    } else {
      resultado[i] = "nao-existe";
    }
  }

  return resultado;
}

function terminarJogo(texto, tipo) {
  jogoAcabou = true;
  info.textContent = "Fim de jogo!";
  mensagem.textContent = texto;
  mensagem.className = tipo;
  campoChute.disabled = true;
  botaoJogarNovamente.hidden = false;
  botaoJogarNovamente.focus();
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); // não recarrega a página
  if (jogoAcabou) return;

  const chute = campoChute.value.trim().toUpperCase();

  if (chute.length !== palavraSecreta.length) {
    mensagem.textContent = `A palavra precisa ter ${palavraSecreta.length} letras!`;
    return;
  }

  if (!/^[A-Z]+$/.test(chute)) {
    mensagem.textContent = "Use apenas letras, sem acento.";
    return;
  }

  // Mostra o chute no tabuleiro com as cores
  const resultado = verificar(chute, palavraSecreta);
  const casas = tabuleiro.children[tentativaAtual].children;
  for (let i = 0; i < chute.length; i++) {
    casas[i].textContent = chute[i];
    casas[i].classList.add(resultado[i]);
  }

  tentativaAtual++;
  campoChute.value = "";
  mensagem.textContent = "";

  if (chute === palavraSecreta) {
    terminarJogo(`Parabéns! Você acertou em ${tentativaAtual} tentativa(s)! 🎉`, "vitoria");
  } else if (tentativaAtual === maxTentativas) {
    terminarJogo(`Você perdeu! A palavra era ${palavraSecreta}.`, "derrota");
  } else {
    atualizarInfo();
  }
});

botaoJogarNovamente.addEventListener("click", novoJogo);

novoJogo();
