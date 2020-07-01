const api = 'https://pokeapi.co/api/v2';

const inputId = document.getElementById('searchInput')
const buttonSearch = document.getElementById('searchButton')
const imageContainer = document.getElementById('container_image')
const loader = document.getElementById('loader')
const pokemonImage = document.getElementById('image')
const pokemonFirstType = document.getElementById('firstType')
const pokemonSecondType = document.getElementById('secondType')
const pokemonName = document.getElementById('name')
const pokemonDescription = document.getElementById('description')
const pokemonWeight = document.getElementById('weight')
const pokemonHeight = document.getElementById('height')
const pokemonId = document.getElementById('id')

const nextPokemon = document.getElementById('next')
const previouslyPokemon = document.getElementById('previously')

let pokemonNumber = 0
inputId.value = 1
let base = `${api}/pokemon?offset=0&limit=150`
let prevClass

buttonSearch.onclick = () => {
    let idPokemonInput = Math.abs(parseInt(inputId.value))
    if (idPokemonInput > 150){
        inputId.value = 150
        idPokemonInput = 150
    }
    pokemonNumber = (idPokemonInput - 1)
    imageContainer.classList.remove(prevClass)
    showPokemon(base)
}

const getData = async (API) => {
    const response = await fetch(API);
    const json = await response.json();

    return json
};

const getDataPokemons = async({ url }) => {
    const data = await getData(url)
    const pokemonId = data.id
    const pokemonName = data.name
    const pokemonImage = data.sprites.front_default
    const height = (data.height / 10)
    const weight = (data.weight / 10)
    const pokemonSpecies = await getData(`${api}/pokemon-species/${pokemonId}/`)
    const stats = data.stats.map(number => number.base_stat)
    let description = pokemonSpecies.flavor_text_entries[0]
    if (description.language.name !== 'en'){
        description = pokemonSpecies.flavor_text_entries[1]
    }
    let firstType = [ data.types.map(id => id.type.name)][0][0]
    let secondType = [ data.types.map(id => id.type.name)][0][1]
    secondType = checkUndefined(secondType)

    prevClass = firstType

    return{
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
        secondType
    }
}

nextPokemon.onclick = () => {
    pokemonImage.setAttribute('alt', '')
    pokemonNumber += 1
    if (pokemonNumber === 150){
        pokemonNumber = 0
    }
    imageContainer.classList.remove(prevClass)
    pokemonImage.setAttribute('src', '')
    showPokemon(base)
    inputId.value = pokemonNumber + 1
    loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>'
}

previouslyPokemon.onclick = () => {
    loader.innerHTML = '<div class="lds-ripple"><div></div><div></div></div>'
    pokemonImage.setAttribute('alt', '')
    if (pokemonNumber === 0){
        pokemonNumber = 150
    }
    pokemonNumber -= 1
    imageContainer.classList.remove(prevClass)
    image.setAttribute('src', '')
    showPokemon(base)
    inputId.value = pokemonNumber + 1
}

const resetText = ({ flavor_text }) => {
    const sizeText = flavor_text.length
    const firstLetter = flavor_text.substr(0, 1).toUpperCase()
    const nextLetters = flavor_text.substr(1, sizeText).toLowerCase()

    const newText = `${firstLetter}${nextLetters}`
    return newText
}

const checkUndefined = (variable) => {
    if (variable === undefined){
        return ''
    } else{
        return variable
    }
}



const showPokemon = async (data) => {
    const actualBase = await getData(data)
    results = actualBase.results
    pokemon = results[pokemonNumber]
    const dataPokemon = await getDataPokemons(pokemon)
    const textReset = resetText(dataPokemon.description)
    pokemonName.textContent = pokemon.name
    pokemonDescription.textContent = textReset
    loader.textContent = ''
    pokemonImage.setAttribute('alt', dataPokemon.pokemonName)
    pokemonImage.setAttribute('src', dataPokemon.pokemonImage)
    imageContainer.classList.add(dataPokemon.firstType)
    pokemonFirstType.textContent = dataPokemon.firstType
    pokemonSecondType.textContent = dataPokemon.secondType
    pokemonHeight.textContent = dataPokemon.height
    pokemonWeight.textContent = dataPokemon.weight
    pokemonId.textContent = dataPokemon.pokemonId
    document.getElementById('hp').textContent = dataPokemon.stats[0]
}
showPokemon(base)