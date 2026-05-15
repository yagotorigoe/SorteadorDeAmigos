let amigos = JSON.parse(localStorage.getItem("meusAmigos")) || [];

atualizarLista();

function salvarDados() {
    localStorage.setItem("meusAmigos", JSON.stringify(amigos));
}

function adicionar() {
    let input = document.getElementById("nome-amigo");
    let nome = input.value;

    if (nome === "") {
        alert("Por favor, digite um nome!");
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

    let resultado = document.getElementById("resultado");
    let tempoSorteio = 3000; //

    let roleta = setInterval(() => {
        let numeroAleatorio = Math.floor(Math.random() * amigos.length);
        resultado.innerHTML = "Sorteando: " + amigos[numeroAleatorio];
        resultado.style.color = "#888"; 
    }, 100);

    setTimeout(() => {
        clearInterval(roleta); 
        
        let vencedorFinal = Math.floor(Math.random() * amigos.length);
        let modal = document.getElementById("modal-sorteio");
        let textoVencedor = document.getElementById("texto-vencedor");
        
        textoVencedor.innerHTML = amigos[vencedorFinal];
        modal.className = "modal-visivel";
        
    }, tempoSorteio);
}

function novoSorteio() {
    amigos = [];
    salvarDados();
    atualizarLista();
    document.getElementById("nome-amigo").focus();
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
   