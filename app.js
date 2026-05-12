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
        resultado.innerHTML = "Sorteado: " + amigos[vencedorFinal];
        resultado.style.color = "#ff6b6b";
    }, tempoSorteio);
}

function novoSorteio() {
    amigos = [];
    salvarDados();
    atualizarLista();
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("nome-amigo").focus();
}

let campoTexto = document.getElementById("nome-amigo");
campoTexto.addEventListener("keypress", function(evento) {
    if (evento.key === "Enter") {
        adicionar();
    }
});