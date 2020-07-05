const api = "https://pokeapi.co/api/v2";

const inputId = document.getElementById("searchInput");
const buttonSearch = document.getElementById("searchButton");
const imageContainer = document.getElementById("container_image");
const loader = document.getElementById("loader");
const pokemonImage = document.getElementById("image");
const pokemonFirstType = document.getElementById("firstType");
const pokemonSecondType = document.getElementById("secondType");
const pokemonFirstAbility = document.getElementById('firstAbility');
const firstAbilityDescription = document.getElementById('firstAbilityDescription')
const pokemonSecondAbility = document.getElementById('secondAbility');
const secondAbilityDescription = document.getElementById('secondAbilityDescription')
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
  bgPokemon: "",
  firstTypePokemon: "",
  secondTypePokemon: "",
};

buttonSearch.onclick = () => {
  let idPokemonInput = Math.abs(parseInt(inputId.value));
  switch (true) {
    case inputId.value === "":
      document.getElementById('warning').innerHTML = 'Please write an id in the input'
      break;
    case idPokemonInput === 0:
      inputId.value = 1;
      idPokemonInput = 1;
      showPokemonById(idPokemonInput);
      break;
    case idPokemonInput > 150:
      inputId.value = 150;
      idPokemonInput = 150;
      showPokemonById(idPokemonInput);
      break;
    case idPokemonInput === parseInt(pokemonId.textContent):
      document.getElementById('warning').innerHTML = 'Please write a different id'
      break;
    default:
      showPokemonById(idPokemonInput);
      break;
  }
};

const showPokemonById = (id) => {
  pokemonNumber = id - 1;
  resetDefaultValues();
  showPokemon(base);
};

const getData = async (API) => {
  const response = await fetch(API);
  const json = await response.json();

  return json;
};

const checkLanguage = (data) => {
  let entryNumber = 0
  if (data[entryNumber].language.name !== 'en'){
    entryNumber += 1
    return data[entryNumber]
  } else{
    return data[entryNumber]
  }
}

const showEffectEntry = async ({ url }) => {
  const data = await getData(url)
  const dataLanguageEN = checkLanguage(data.effect_entries)
  return dataLanguageEN.short_effect
}

const getDataPokemons = async ({ url }) => {
  const data = await getData(url);
  const pokemonAbilities = data.abilities
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
    pokemonAbilities,
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
  document.getElementById('warning').innerHTML = ''
  loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>';
  pokemonImage.setAttribute("alt", "");
  pokemonImage.setAttribute("src", "");
  pokemonFirstType.textContent = "";
  pokemonSecondAbility.style.display = 'inline-block'
  pokemonFirstAbility.textContent = '-'
  firstAbilityDescription.textContent = '-'
  secondAbilityDescription.textContent = '-'
  pokemonSecondAbility.textContent = '-'
  pokemonHp.textContent = "-";
  pokemonAttack.textContent = "-";
  pokemonDefense.textContent = "-";
  pokemonSpecial_Attack.textContent = "-";
  pokemonSpecial_Defense.textContent = "-";
  pokemonSpeed.textContent = "-";
  pokemonName.textContent = "-";
  pokemonId.textContent = "-";
  pokemonDescription.textContent = "-";
  pokemonWeight.textContent = "-";
  pokemonHeight.textContent = "-";
  imageContainer.classList.remove(prevClass.bgPokemon);
  pokemonFirstType.classList.remove(prevClass.firstTypePokemon);
  if (prevClass.secondTypePokemon !== "") {
    pokemonSecondType.classList.remove(prevClass.secondTypePokemon);
    pokemonSecondType.textContent = "";
  }
  inputId.value = pokemonNumber + 1;
};

const checkUndefined = (variable) => {
  if (variable === undefined) {
    return "";
  } else {
    return variable;
  }
};

const showStatsValue = (listStats, data) => {
  listStats.map((x, key) => {
    x.textContent = data[key];
    x.style.width = `${x.textContent}%`;
  });
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
  pokemonSecondType.classList.remove("type");
  if (dataPokemon.secondType !== "") {
    pokemonSecondType.classList.add("type");
    pokemonSecondType.classList.add(dataPokemon.secondType);
  }
  pokemonFirstAbility.textContent = dataPokemon.pokemonAbilities[0].ability.name
  firstAbilityDescription.textContent = await showEffectEntry(dataPokemon.pokemonAbilities[0].ability)
  if (checkUndefined(dataPokemon.pokemonAbilities[1]) === ''){
    pokemonSecondAbility.style.display = 'none'
  } else{
    pokemonSecondAbility.textContent = dataPokemon.pokemonAbilities[1].ability.name
    secondAbilityDescription.textContent = await showEffectEntry(dataPokemon.pokemonAbilities[1].ability)
  }
  pokemonHeight.textContent = dataPokemon.height;
  pokemonWeight.textContent = dataPokemon.weight;
  pokemonId.textContent = dataPokemon.pokemonId;
  const stats = [
    pokemonHp,
    pokemonAttack,
    pokemonDefense,
    pokemonSpecial_Defense,
    pokemonSpecial_Attack,
    pokemonSpeed,
  ];
  showStatsValue(stats, dataPokemon.stats);
};
showPokemon(base);
