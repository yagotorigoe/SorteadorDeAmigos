let amigos = [];

function adicionar () {
   let input = document.getElementById("nome-amigo");
   let nome = input.value

   if (nome === "") {
      alert("Por favor, digite um nome!");
      return
   }

   amigos.push(nome);

   input.value = "";
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