const api = 'https://pokeapi.co/api/v2';

const imageContainer = document.getElementById('container_image')
const pokemonImage = document.getElementById('image')
const pokemonFirstType = document.getElementById('firstType')
const pokemonSecondType = document.getElementById('secondType')
const pokemonName = document.getElementById('name')
const pokemonDescription = document.getElementById('description')
const pokemonWeight = document.getElementById('weight')
const pokemonHeight = document.getElementById('height')
const pokemonId = document.getElementById('id')

let pokemonNumber = 0
let base = `${api}/pokemon?offset=0&limit=150`

let prevClass

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
    const description = pokemonSpecies.flavor_text_entries[0].flavor_text
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
        description,
        firstType,
        secondType
    }
}

const resetText = (text) => {
    const sizeText = text.length
    const firstLetter = text.substr(0, 1).toUpperCase()
    const nextLetters = text.substr(1, sizeText).toLowerCase()

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


const nextPokemon = () => {
    pokemonNumber += 1
    if (pokemonNumber === 150){
        pokemonNumber = 0
    }
    imageContainer.classList.remove(prevClass)
    pokemonImage.setAttribute('src', '')
    test(base)
}


const previouslyPokemon = () => {
    if (pokemonNumber === 0){
        pokemonNumber = 150
    }
    pokemonNumber -= 1
    imageContainer.classList.remove(prevClass)
    image.setAttribute('src', '')
    test(base)
}


const test = async (data) => {
    const actualBase = await getData(data)
    results = actualBase.results
    pokemon = results[pokemonNumber]
    const dataPokemon = await getDataPokemons(pokemon)
    const textReset = resetText(dataPokemon.description)
    pokemonName.innerHTML = pokemon.name
    pokemonDescription.innerHTML = textReset
    pokemonImage.setAttribute('src', dataPokemon.pokemonImage)
    imageContainer.classList.add(dataPokemon.firstType)
    pokemonFirstType.innerHTML = dataPokemon.firstType
    pokemonSecondType.innerHTML = dataPokemon.secondType
    pokemonHeight.innerHTML = dataPokemon.height
    pokemonWeight.innerHTML = dataPokemon.weight
    pokemonId.innerHTML = dataPokemon.pokemonId

}
test(base)