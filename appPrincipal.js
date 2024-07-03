const urlDatos = "https://pokeapi.co/api/v2/pokemon?limit=151";
const urlTipos = "https://pokeapi.co/api/v2/type/";

const navegacion = document.getElementById("navegacion");
const botonera = document.getElementById("botonera");
const botoneraTemplate = document.getElementById("botoneraTemplate").content;
const fragment = document.createDocumentFragment();

const cardTemplate = document.getElementById("cardTemplate").content;
const cardsPokemon = document.getElementById("cardsPokemon");

const formulario = document.getElementById("busquedaIndividual");
const tarjetaIndividualTemplate = document.getElementById(
  "tarjetaIndividualTemplate"
).content;

const tarjetaIndividual = document.getElementById("tarjetaIndividual");

const especies = [];
const listaPokemon = [];
const listaUrlPokemon = [];
const listaPokemonTipoA = [];
const listaPokemonTipoB = [];
const botonesActivos = [];

function pintarSpinner() {
  document.getElementById("spinner1").classList.remove("d-none");
  console.log("Activo");
}

function despintarSpinner() {
  document.getElementById("spinner1").classList.add("d-none");
  console.log("Inactivo");
}

const obtenerPokemones = async () => {
  try {
    const resultados = await fetch(urlDatos);
    const datos = await resultados.json();
    //console.log(datos.results[0].name);

    for (result in datos.results) {
      const nuevoPoke = datos.results[result].name;
      const urlPoke = datos.results[result].url;

      listaPokemon.push(nuevoPoke);
      listaUrlPokemon.push(urlPoke);
    }
    obtenerDatosPokemon();
    //console.log(listaPokemon);
    //console.log(listaUrlPokemon);
  } catch (error) {
    console.log(error);
  }
};

obtenerPokemones();

const obtenerDatosPokemon = async () => {
  for (urlP in listaUrlPokemon) {
    try {
      //console.log();
      const resultados = await fetch(listaUrlPokemon[urlP]);
      const datos = await resultados.json();
      //console.log(datos);
      //console.log(datos.id);
      listaPokemonTipoA.push({
        id: datos.id,
        nombre: datos.species.name,
        especie1: datos.types[0].type.name,
        foto: datos.sprites.other.home.front_default,
        peso: datos.weight,
        altura: datos.height,
        sonido: datos.cries.latest,
        //        especia2: datos.types[1].type.name,
      });

      if (!datos.types[1]) {
        //console.log("NE");
        listaPokemonTipoB.push({
          nombre: datos.species.name,
          especie2: "NE",
        });
      } else {
        //console.log(datos.types[1].type.name);
        listaPokemonTipoB.push({
          nombre: datos.species.name,
          especie2: datos.types[1].type.name,
        });
      }

      //console.log(datos.types[0].type.name, datos.types[1].type.name);

      //console.log("Funciona");
    } catch (error) {
      console.log(error);
    }
  }

  for (let i = 0; i < listaPokemonTipoA.length; i++) {
    //console.log(listaPokemonTipoB[i].nombre, listaPokemonTipoB[i].especie2);
    listaPokemonTipoA[i].especie2 = listaPokemonTipoB[i].especie2;
  }

  console.log(listaPokemonTipoA);

  //console.log(listaPokemonTipoB);
};

const obtenerEspecies = async () => {
  try {
    const res = await fetch(urlTipos);
    const post = await res.json();
    post.results.filter((item) => {
      especies.push(item.name);
    });
    //console.log(especies);
  } catch (error) {
    console.log(error);
  }
};
obtenerEspecies();

const pintarBotonesTipo = () => {
  //console.log("Funciona");
  botonera.textContent = "";
  especies.forEach((item) => {
    const clone = botoneraTemplate.cloneNode(true);
    clone.querySelector(".btn-secondary").textContent = item;
    clone.querySelector(".btn-secondary").id = item;

    fragment.appendChild(clone);
  });
  botonera.appendChild(fragment);
};

const pintarTarjeta = (idUser) => {
  tarjetaIndividual.textContent = "";
  const filtro = listaPokemonTipoA.filter((item) => item.id === idUser);
  //console.log(filtro);

  filtro.forEach((item) => {
    const clone = tarjetaIndividualTemplate.cloneNode(true);
    clone.querySelector("img").src = item.foto;
    clone.querySelector("h6").textContent = `ID ${item.id}`;
    clone.querySelector("h4").textContent = item.nombre;
    clone.getElementById("peso").textContent = `${item.peso} kilogramos`;
    clone.getElementById("altura").textContent = `${item.altura / 10} metros`;
    clone.getElementById("sonidoPokemon").src = item.sonido;

    clone.getElementById("e1").textContent = item.especie1;

    if (item.especie2 === "NE") {
      clone.getElementById("e2").classList.add("d-none");
    } else {
      clone.getElementById("e2").classList.remove("d-none");
      clone.getElementById("e2").textContent = item.especie2;
    }

    fragment.appendChild(clone);
  });

  tarjetaIndividual.appendChild(fragment);
};

const pintarPokeTipos = (tipo) => {
  cardsPokemon.textContent = "";

  especies.forEach((item) => {
    if (item === tipo) {
      document.getElementById(item).classList.add("btn-success");
    } else {
      document.getElementById(item).classList.remove("btn-success");
      document.getElementById(item).classList.add("btn-secondary");
    }
  });

  const filtro = listaPokemonTipoA.filter(
    (item) => item.especie1 === tipo || item.especie2 === tipo
  );

  if (filtro.length === 0) {
    document.getElementById("alerta2").classList.remove("d-none");
  } else {
    document.getElementById("alerta2").classList.add("d-none");
  }

  filtro.forEach((item) => {
    const clone = cardTemplate.cloneNode(true);
    clone.querySelector("img").src = item.foto;
    clone.querySelector("h5").textContent = item.nombre;
    clone.querySelector(".text-secondary").textContent = item.id;
    clone.getElementById("especie1").textContent = item.especie1;
    if (item.especie2 !== "NE") {
      clone.getElementById("especie2").textContent = item.especie2;
      clone.getElementById("especie2").classList.remove("d-none");
    } else {
      clone.getElementById("especie2").classList.add("d-none");
    }
    fragment.appendChild(clone);
  });

  cardsPokemon.appendChild(fragment);
};

document.addEventListener("click", (e) => {
  //console.log(e.target.id);
  if (e.target.id === "listaPoke") {
    document.getElementById("listaPoke").classList.add("active");
    document.getElementById("busquedaPoke").classList.remove("active");
    document.getElementById("busqueda").classList.add("d-none");
    tarjetaIndividual.textContent = "";
    pintarBotonesTipo();
  }

  if (e.target.matches(".btn-secondary")) {
    const tipo = e.target.id;

    pintarPokeTipos(tipo);
  }

  if (e.target.id === "busquedaPoke") {
    botonera.textContent = "";
    cardsPokemon.textContent = "";
    document.getElementById("busquedaPoke").classList.add("active");
    document.getElementById("listaPoke").classList.remove("active");
    document.getElementById("busqueda").classList.remove("d-none");
  }
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const objeto = new FormData(formulario);
  const idUser = parseInt(objeto.get("idUser"));
  //console.log(idUser);

  if (idUser > 0 && idUser < 152) {
    document.getElementById("alerta").classList.add("d-none");
    pintarTarjeta(idUser);
  } else {
    document.getElementById("alerta").classList.remove("d-none");
    tarjetaIndividual.textContent = "";
    return;
  }
});
