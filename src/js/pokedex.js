const api = "https://pokeapi.co/api/v2";

const inputId = document.getElementById("searchInput");
const buttonSearch = document.getElementById("searchButton");
const imageContainer = document.getElementById("container_image");
const loader = document.getElementById("loader");
const pokemonImage = document.getElementById("image");
const pokemonFirstType = document.getElementById("firstType");
const pokemonSecondType = document.getElementById("secondType");
const pokemonHp = document.getElementById("hp");
const pokemonAttack = document.getElementById("attack");
const pokemonDefense = document.getElementById("defense");
const pokemonSpecial_Attack = document.getElementById("special-attack");
const pokemonSpecial_Defense = document.getElementById("special-defense");
const pokemonSpeed = document.getElementById("speed");
const pokemonName = document.getElementById("name");
const pokemonDescription = document.getElementById("description");
const pokemonWeight = document.getElementById("weight");
const pokemonHeight = document.getElementById("height");
const pokemonId = document.getElementById("id");

const nextPokemon = document.getElementById("next");
const previouslyPokemon = document.getElementById("previously");

let pokemonNumber = 0;
inputId.value = 1;
let base = `${api}/pokemon?offset=0&limit=150`;
let prevClass = {
    bgPokemon: '',
    firstTypePokemon: '',
    secondTypePokemon: ''
};

buttonSearch.onclick = () => {
  let idPokemonInput = Math.abs(parseInt(inputId.value));
  if (idPokemonInput > 150) {
    inputId.value = 150;
    idPokemonInput = 150;
  }
  pokemonNumber = idPokemonInput - 1;
  resetDefaultValues();
  showPokemon(base);
};

const getData = async (API) => {
  const response = await fetch(API);
  const json = await response.json();

  return json;
};

const getDataPokemons = async ({ url }) => {
  const data = await getData(url);
  const pokemonId = data.id;
  const pokemonName = data.name;
  const pokemonImage = data.sprites.front_default;
  const height = data.height / 10;
  const weight = data.weight / 10;
  const pokemonSpecies = await getData(`${api}/pokemon-species/${pokemonId}/`);
  const stats = data.stats.map((number) => number.base_stat);
  let description = pokemonSpecies.flavor_text_entries[0];
  if (description.language.name !== "en") {
    description = pokemonSpecies.flavor_text_entries[1];
  }
  let firstType = [data.types.map((id) => id.type.name)][0][0];
  let secondType = [data.types.map((id) => id.type.name)][0][1];
  secondType = checkUndefined(secondType);

  prevClass.bgPokemon = firstType;
  prevClass.firstTypePokemon = firstType;
  prevClass.secondTypePokemon = secondType;

  return {
    data,
    pokemonId,
    pokemonName,
    pokemonImage,
    height,
    weight,
    pokemonSpecies,
    stats,
    description,
    firstType,
    secondType,
  };
};

nextPokemon.onclick = () => {
  pokemonNumber += 1;
  if (pokemonNumber === 150) {
    pokemonNumber = 0;
  }
  resetDefaultValues();
  showPokemon(base);
};

previouslyPokemon.onclick = () => {
  if (pokemonNumber === 0) {
    pokemonNumber = 150;
  }
  pokemonNumber -= 1;
  resetDefaultValues();
  showPokemon(base);
};

const resetText = ({ flavor_text }) => {
  const sizeText = flavor_text.length;
  const firstLetter = flavor_text.substr(0, 1).toUpperCase();
  const nextLetters = flavor_text.substr(1, sizeText).toLowerCase();

  const newText = `${firstLetter}${nextLetters}`;
  return newText;
};

const resetDefaultValues = () => {
  loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>';
  pokemonImage.setAttribute("alt", "");
  pokemonImage.setAttribute("src", "");
  imageContainer.classList.remove(prevClass.bgPokemon);
  pokemonFirstType.classList.remove(prevClass.firstTypePokemon);
  if (prevClass.secondTypePokemon !== ''){
    pokemonSecondType.classList.remove(prevClass.secondTypePokemon);
  }
  inputId.value = pokemonNumber + 1;
}

const checkUndefined = (variable) => {
  if (variable === undefined) {
    return '';
  } else {
    return variable;
  }
};

const showPokemon = async (data) => {
  const actualBase = await getData(data);
  results = actualBase.results;
  pokemon = results[pokemonNumber];
  const dataPokemon = await getDataPokemons(pokemon);
  const textReset = resetText(dataPokemon.description);
  pokemonName.textContent = pokemon.name;
  pokemonDescription.textContent = textReset;
  loader.textContent = "";
  pokemonImage.setAttribute("alt", dataPokemon.pokemonName);
  pokemonImage.setAttribute("src", dataPokemon.pokemonImage);
  imageContainer.classList.add(dataPokemon.firstType);
  pokemonFirstType.textContent = dataPokemon.firstType;
  pokemonFirstType.classList.add(dataPokemon.firstType);
  pokemonSecondType.textContent = dataPokemon.secondType;
  if (dataPokemon.secondType !== ''){
    pokemonSecondType.classList.add(dataPokemon.secondType);
  }
  pokemonHeight.textContent = dataPokemon.height;
  pokemonWeight.textContent = dataPokemon.weight;
  pokemonId.textContent = dataPokemon.pokemonId;
  pokemonHp.textContent = dataPokemon.stats[0];
  pokemonAttack.textContent = dataPokemon.stats[1];
  pokemonDefense.textContent = dataPokemon.stats[2];
  pokemonSpecial_Defense.textContent = dataPokemon.stats[3];
  pokemonSpecial_Attack.textContent = dataPokemon.stats[4];
  pokemonSpeed.textContent = dataPokemon.stats[5];
};
showPokemon(base);
