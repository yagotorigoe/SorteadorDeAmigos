let amigos = ["yago", "pedro", "joao", "douglas", "rodolfo"];

function sortear() {
   let numeroAleatorio = Math.floor(Math.random() * amigos.length);

   let nomeSorteado = amigos[numeroAleatorio];

   let resultado = document.getElementById("resultado");
   resultado.innerHTML = "Sorteado: " + nomeSorteado;
}