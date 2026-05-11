let amigos = [];

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
    atualizarLista(); 
}

function atualizarLista() {
    let lista = document.getElementById("lista-amigos");
    
    lista.innerHTML = ""; 

    for (let i = 0; i < amigos.length; i++) {
        let item = document.createElement("li");
        item.innerHTML = amigos[i];
        lista.appendChild(item);
    }
}

function sortear() {
   if(amigos.length === 0){
      alert("Adionar amigos antes de sortear!");
      return;
   }

   let numeroAleatorio = Math.floor(Math.random() * amigos.length);
   let nomeSorteado = amigos[numeroAleatorio];

   let resultado = document.getElementById("resultado");
   resultado.innerHTML = "Sorteado: " + nomeSorteado;
}

let campoTexto = document.getElementById("nome-amigo");

campoTexto.addEventListener("keypress", function(evento) {
    if (evento.key === "Enter") {
        adicionar();
    }
});

function novoSorteio() {
    amigos = [];
    
    atualizarLista();

    document.getElementById("resultado").innerHTML = "";
    document.getElementById("nome-amigo").focus();
}