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
    let campoInput = document.getElementById('nome-amigo');
    let texto = campoInput.value.trim();

    if (texto === '') {
        alert('Por favor, digite um nome válido.');
        return;
    }

    texto = texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    let listaDeNomes = texto.split(',');

    for (let i = 0; i < listaDeNomes.length; i++) {
        let nomeLimpo = listaDeNomes[i].trim();
        
        if (nomeLimpo !== '') {
            // Bloqueia nomes clonados
            if (amigos.includes(nomeLimpo)) {
                alert(`O nome "${nomeLimpo}" já está na lista e foi ignorado.`);
            } else {
                amigos.push(nomeLimpo);
            }
        }
    }

    campoInput.value = '';
    
    atualizarLista(); 
    atualizarContador(); 
}

function atualizarContador() {
    let contador = document.getElementById('contador-amigos');
    if (!contador) return;

    if (amigos.length === 0) {
        contador.innerText = "Nenhum participante na lista";
    } else if (amigos.length === 1) {
        contador.innerText = "1 participante na lista";
    } else {
        contador.innerText = `${amigos.length} participantes na lista`;
    }
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
    atualizarContador();
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
    atualizarContador();
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

document.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        let campoNomes = document.getElementById("nome-amigo");
        
        if (campoNomes === document.activeElement) {
            adicionar();
        }
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
        atualizarContador();
        
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

let textoCompartilharEquipes = "";

function gerarEquipes() {
    let qtdEquipesInput = document.getElementById('qtd-equipes').value;
    let qtdEquipes = parseInt(qtdEquipesInput);

    // 1. Regras de Segurança (Validações)
    if (amigos.length < 2) {
        alert("Adicione pelo menos 2 pessoas na lista para formar equipes.");
        return;
    }
    if (isNaN(qtdEquipes) || qtdEquipes < 2) {
        alert("Por favor, digite um número válido de equipes (mínimo 2).");
        return;
    }
    if (qtdEquipes > amigos.length) {
        alert("Erro: Você não pode ter mais equipes do que pessoas!");
        return;
    }

    // 2. A Fotocópia e o Embaralhamento (Algoritmo Fisher-Yates)
    let amigosMisturados = [...amigos];
    for (let i = amigosMisturados.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [amigosMisturados[i], amigosMisturados[j]] = [amigosMisturados[j], amigosMisturados[i]];
    }

    // 3. Criando as "Caixas" das equipes vazias
    let equipes = [];
    for (let i = 0; i < qtdEquipes; i++) {
        equipes.push([]);
    }

    // 4. Distribuindo as pessoas
    for (let i = 0; i < amigosMisturados.length; i++) {
        let numeroDaEquipe = i % qtdEquipes; 
        equipes[numeroDaEquipe].push(amigosMisturados[i]);
    }

    textoCompartilharEquipes = "🛡️ *EQUIPES SORTEADAS!* 🛡️\n\n";

    // 5. Desenhando o resultado na tela (HTML dinâmico)
    let resultadoHTML = "";
    for (let i = 0; i < equipes.length; i++) {
        // Alimenta o texto do WhatsApp
        textoCompartilharEquipes += `*Equipe ${i + 1}:*\n`;

        resultadoHTML += `<div class="cartao-equipe" style="background-color: white; color: #333; padding: 15px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); width: 100%;">`;
        resultadoHTML += `<h3 style="margin-top: 0; color: #e84393; border-bottom: 2px solid #eee; padding-bottom: 10px;">🛡️ Equipe ${i + 1}</h3>`;
        
        resultadoHTML += `<ul style="list-style: none; padding: 0; margin: 0; width: 100%;">`;
        for (let j = 0; j < equipes[i].length; j++) {
            resultadoHTML += `<li style="padding: 5px 0; margin: 0; box-shadow: none; border-radius: 0; background: transparent;">👤 ${equipes[i][j]}</li>`;
            
            // Adiciona o integrante no texto do WhatsApp
            textoCompartilharEquipes += `👤 ${equipes[i][j]}\n`;
        }
        resultadoHTML += `</ul></div>`;
        
        // Pula uma linha no texto do WhatsApp entre uma equipe e outra
        textoCompartilharEquipes += "\n";
    }

    // Adiciona o botão de compartilhar lindo e verdinho no final de todos os cartões
    resultadoHTML += `
        <button onclick="compartilharEquipesWhatsApp()" class="btn-whatsapp" style="width: 300px; margin: 20px auto 0 auto;">
            <i class="fab fa-whatsapp"></i> Compartilhar no Zap
        </button>
    `;

    // 6. Injetando tudo na nossa bandeja
    document.getElementById('resultado-equipes').innerHTML = resultadoHTML;
}

// NOVA FUNÇÃO: Dispara o link do WhatsApp
function compartilharEquipesWhatsApp() {
    if (!textoCompartilharEquipes) return;
    
    // encodeURIComponent serve para converter espaços e emojis em um link que o navegador entenda
    let url = "https://api.whatsapp.com/send?text=" + encodeURIComponent(textoCompartilharEquipes);
    window.open(url, "_blank");
}