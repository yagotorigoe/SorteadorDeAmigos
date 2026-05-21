let amigos = JSON.parse(localStorage.getItem("meusAmigos")) || [];
let historico = JSON.parse(localStorage.getItem("meusCampeoes")) || [];

let somTambores = new Audio("https://www.myinstants.com/media/sounds/drum-roll.mp3");
let somVitoria = new Audio("https://www.myinstants.com/media/sounds/kids_cheering.mp3");

somTambores.volume = 0.095;
somVitoria.volume = 0.1;

atualizarLista();
atualizarHistorico();

function salvarDados() {
    localStorage.setItem("meusAmigos", JSON.stringify(amigos));
}

function adicionar() {
    let input = document.getElementById("nome-amigo");
    let nome = input.value.trim();

    if (nome.length === 0) {
        alert("Por favor, digite um nome válido!");
        input.value = "";
        return;
    }

    let nomeMaiusculo = nome.toUpperCase();
    let listaMaiuscula = amigos.map(amigo => amigo.toUpperCase());

    if (listaMaiuscula.includes(nomeMaiusculo)) {
        alert("Este nome já foi adicionado!");
        return; 
    }

    amigos.push(nome);
    input.value = ""; 
    
    salvarDados();
    atualizarLista(); 
}

function atualizarLista() {
    let lista = document.getElementById("lista-amigos");
    lista.innerHTML = ""; 

    for (let i = 0; i < amigos.length; i++) {
        let item = document.createElement("li");

        item.innerHTML = `
            ${amigos[i]} 
            <button class="btn-remover" onclick="removerAmigo(${i})">X</button>
        `;
        
        lista.appendChild(item); 
    }
}

function removerAmigo(index) {
    amigos.splice(index, 1);
    salvarDados();
    atualizarLista();
}

function sortear() {
    if (amigos.length === 0) {
        alert("Adicione amigos antes de sortear!");
        return;
    }

    somTambores.play();

    document.getElementById("titulo-modal").innerHTML = '<i class="fas fa-trophy"></i> O Vencedor é <i class="fas fa-trophy"></i>';

    let modal = document.getElementById("modal-sorteio");
    modal.className = "modal-visivel";
    let textoVencedor = document.getElementById("texto-vencedor");

    let roleta = setInterval(() => {
        let nomeAleatorio = amigos[Math.floor(Math.random() * amigos.length)];
        textoVencedor.innerHTML = nomeAleatorio;
    }, 100);

    setTimeout(() => {
        clearInterval(roleta); 

        let numeroSorteado = Math.floor(Math.random() * amigos.length);
        let vencedor = amigos[numeroSorteado];

        textoVencedor.innerHTML = vencedor;

        historico.push(vencedor);
        localStorage.setItem("meusCampeoes", JSON.stringify(historico));
        atualizarHistorico();

        somVitoria.play();
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });

    }, 2500);
}

function novoSorteio() {
    amigos = [];
    salvarDados();
    atualizarLista();
    document.getElementById("nome-amigo").focus();
}

function atualizarHistorico() {
    let listaHTML = document.getElementById("lista-historico");
    listaHTML.innerHTML = "";

    historico.map(campeao => {
        let item = document.createElement("li");
        item.innerText = campeao;
        listaHTML.appendChild(item);
    });
}

function limparHistorico() {
    historico = [];
    localStorage.removeItem("meusCampeoes");
    atualizarHistorico();
}

let campoTexto = document.getElementById("nome-amigo");
campoTexto.addEventListener("keypress", function(evento) {
    if (evento.key === "Enter") {
        adicionar();
    }
});

function fecharModal() {
    let modal = document.getElementById("modal-sorteio");
    modal.className = "modal-oculta";
}

function compartilharWhatsApp() {
    let vencedor = document.getElementById("texto-vencedor").innerHTML;
    let mensagem = `🎉 O grande vencedor do sorteio foi: *${vencedor}*! 🏆`;
    let linkZap = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

    window.open(linkZap, '_blank');
}

function alternarTema() {
    document.body.classList.toggle("tema-escuro");

    let botao = document.getElementById("btn-tema")

    if (document.body.classList.contains("tema-escuro")) {
        botao.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        botao.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
}
   
async function gerarNomes() {
    try {
        let botao = document.getElementById("btn-gerar");
        botao.innerHTML = "Buscando nomes na internet...";

        let resposta = await fetch("https://randomuser.me/api/?nat=br&results=5&inc=name");

        let dados = await resposta.json();

        let pessoas = dados.results;
        
        for(let i = 0; i < pessoas.length; i++) {
            let nomeGerado = pessoas[i].name.first; 
            
            if (!amigos.includes(nomeGerado)) {
                amigos.push(nomeGerado);
            }
        }

        salvarDados();
        atualizarLista();
        
        botao.innerHTML = "+ Gerar Nomes Aleatórios";

    } catch (erro) {
        alert("Opa! O servidor tropeçou. Verifique sua internet e tente de novo.");
        document.getElementById("btn-gerar").innerHTML = "+ Gerar Nomes Aleatórios";
    }
}

function sortearAmigoSecreto() {
    if (amigos.length < 3) {
        alert("Você precisa de pelo menos 3 amigos para realizar um Amigo Secreto!");
        return;
    }

    let amigosEmbaralhados = [...amigos];

    for (let i = amigosEmbaralhados.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [amigosEmbaralhados[i], amigosEmbaralhados[j]] = [amigosEmbaralhados[j], amigosEmbaralhados[i]];
    }

    document.getElementById("titulo-modal").innerHTML = '🎁 Pares do Amigo Secreto 🎁';

    let resultadoHTML = "<div class='lista-amigo-secreto'>";
    
    for (let i = 0; i < amigosEmbaralhados.length; i++) {
        let amigoAtual = amigosEmbaralhados[i];
        let proximoAmigo = amigosEmbaralhados[(i + 1) % amigosEmbaralhados.length]; 
        
        resultadoHTML += `<p><strong>${amigoAtual}</strong> ➔ tirou <strong>${proximoAmigo}</strong></p>`;
    }
    resultadoHTML += "</div>";

    let textoVencedor = document.getElementById('texto-vencedor');
    textoVencedor.innerHTML = resultadoHTML;
    
    let modal = document.getElementById('modal-sorteio');
    modal.className = 'modal-visivel';
}

// --- SISTEMA DE NAVEGAÇÃO E ABAS ---
function mudarAba(aba) {
    document.querySelectorAll('.menu-superior button').forEach(btn => btn.classList.remove('ativo'));
    document.getElementById('nav-' + aba).classList.add('ativo');

    if (aba === 'home') {
        document.getElementById('tela-home').classList.remove('oculta');
        document.getElementById('tela-app').classList.add('oculta');
    } else {
        document.getElementById('tela-home').classList.add('oculta');
        document.getElementById('tela-app').classList.remove('oculta');

        document.querySelectorAll('.conteudo-aba').forEach(div => div.classList.add('oculta'));
        
        document.getElementById('aba-' + aba).classList.remove('oculta');

        let titulos = {
            'sorteador': 'Sorteador de Nomes',
            'amigo-secreto': 'Amigo Secreto',
            'equipes': 'Gerador de Equipes'
        };
        document.getElementById('titulo-ferramenta').innerText = titulos[aba];
    }
}