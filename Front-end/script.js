var infoFood = {};
var infoFillings = [];

async function getFood(idFood) {
  const response = await fetch("http://localhost:8080/food/" + idFood);
  const data = await response.json();

  infoFood = data.food[0];
  infoFillings = data.fillings;

  document.querySelector("#price").innerHTML = infoFood.price.toFixed(2);

  renderFillings(infoFillings);
  calcularPrecoTotal();
}

function renderFillings(fillings) {
  const fillingsDiv = document.querySelector(".fillings");
  fillingsDiv.innerHTML = "";

  for (let filling of fillings) {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="checkbox" class="recheio" data-preco="${filling.price}" id="filling-${filling.name}" />
      <label for="filling-${filling.name}">${filling.name} (R$ ${filling.price.toFixed(2)})</label>
    `;
    fillingsDiv.appendChild(div);
  }

  fillingsDiv.addEventListener("change", calcularPrecoTotal);
}

function calcularPrecoTotal() {
  const basePrice = parseFloat(infoFood.price) || 0;
  const checkboxes = document.querySelectorAll(".fillings input[type=checkbox]:checked");

  let precoRecheios = 0;
  let nomesRecheios = [];

  checkboxes.forEach((checkbox) => {
    const preco = parseFloat(checkbox.dataset.preco) || 0;
    precoRecheios += preco;

    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) nomesRecheios.push(label.textContent);
  });

  const precoTotal = basePrice + precoRecheios;

  document.querySelector("#price").innerHTML = precoTotal.toFixed(2);
  document.querySelector("#selected-fillings").innerHTML =
    nomesRecheios.length > 0 ? nomesRecheios.join(", ") : "Nenhum recheio selecionado";
}

async function pagar() {
  const cpf = document.querySelector("#cpf").value.trim();

  if (!cpf) {
    alert("Por favor, insira um CPF válido.");
    return;
  }

  const idFood = infoFood.id;
  const nomeComida = infoFood.name;

  const recheiosSelecionados = [];
  const checkboxes = document.querySelectorAll(".fillings input[type=checkbox]:checked");
  checkboxes.forEach((checkbox) => {
    const label = document.querySelector(`label[for="${checkbox.id}"]`);
    if (label) recheiosSelecionados.push(label.textContent.split(" (")[0]); // pega só o nome
  });

  const descricao =
    `${nomeComida} com ` + (recheiosSelecionados.length > 0 ? recheiosSelecionados.join(", ") : "sem recheios");

  const precoTotal = parseFloat(document.querySelector("#price").textContent);

  const payInfo = {
    id_foods: idFood,
    cpf: cpf,
    pay_date: new Date().toISOString(),
    description: descricao,
    price: precoTotal,
  };

  try {
    const response = await fetch("http://localhost:8080/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payInfo),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Pagamento realizado com sucesso!");
      document.querySelector("#cpf").value = "";
      document.querySelectorAll(".fillings input[type=checkbox]").forEach((chk) => (chk.checked = false));
      calcularPrecoTotal();
    } else {
      alert("Erro ao realizar pagamento: " + (data.error || "Erro desconhecido"));
    }
  } catch (error) {
    alert("Erro na comunicação com o servidor: " + error.message);
  }
}


// Troca entre tapioca e cuzcuz
document.querySelectorAll("input[name=food]").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    getFood(e.target.id === "tapioca" ? 1 : 2);
  });
});

// Clique no botão pagar
document.querySelector("#comprar-btn").addEventListener("click", pagar);

const modal = document.getElementById("historico-modal");
const spanClose = document.querySelector(".modal .close");
const historicoBtn = document.getElementById("historico-btn");

historicoBtn.addEventListener("click", async () => {
  const cpf = document.querySelector("#cpf").value.trim();

  if (!cpf) {
    alert("Digite o CPF para ver o histórico.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/history/${cpf}`);
    const historico = await response.json();

    const lista = document.getElementById("historico-list");
    lista.innerHTML = "";

    if (historico.length === 0) {
      lista.innerHTML = "<li>Nenhuma compra encontrada.</li>";
    } else {
      historico.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `🧾 ${item.description} - R$ ${parseFloat(item.price).toFixed(2)} em ${new Date(item.pay_date).toLocaleString()}`;
        lista.appendChild(li);
      });
    }

    modal.style.display = "block";
  } catch (error) {
    alert("Erro ao buscar histórico: " + error.message);
  }
});

spanClose.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

