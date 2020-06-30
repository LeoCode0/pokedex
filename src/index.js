const api = 'https://pokeapi.co/api/v2';

const central = document.getElementById('central')

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

const pokemonCard = async (dataPokemon) => {
    const textReset = resetText(dataPokemon.description)

    let template = `
    <div class="pokemonCard__details">
        <h1 class="pokemonCard__details--title">
        ${dataPokemon.pokemonName} 
        </h1>
        <span class="pokemonCard__details--pokemonId">
            ID: ${dataPokemon.pokemonId}
        </span>
        <img src=${dataPokemon.pokemonImage} alt=${dataPokemon.pokemonName} class="pokemonCard__details--image"/>
        <div class="pokemonCard__details--types">
            <span class="type ${dataPokemon.firstType}">
                ${dataPokemon.firstType}
            </span>
            <span class="type ${dataPokemon.secondType}">
                ${dataPokemon.secondType}
            </span>
        </div>
    </div>
    <div class="pokemonCard__skills">
        <h1 class="pokemonCard__skills--title">
            Pokemon Information
        </h1>
        <p class="pokemonCard__skills--description">
            ${textReset}
        </p>
        <span class="pokemonCard__skills--height">
            ${dataPokemon.height} Meters
        </span>
        <span class="pokemonCard__skills--weight">
            ${dataPokemon.weight} Kilograms
        </span>
    </div>
    `
    return template
}

const checkUndefined = (variable) => {
    if (variable === undefined){
        return ''
    } else{
        return variable
    }
}


const getData = async (API) => {
    const response = await fetch(API);
    const json = await response.json();

    return json
};

const printPokemon = async () => {
    let base = await getData(`${api}/pokemon`)
    let results = await base.results
    let nextPage = await base.next
    for(let index = 0; index <= 150; index++){
        if (index %20 === 0){
            for(let i = 0; i <= 19; i++){
                const container = document.createElement('div') 
                container.className = 'pokemonCard'
                let dataPokemon =  await getDataPokemons(results[i])
                container.innerHTML = await pokemonCard(dataPokemon) 
                container.classList.add(dataPokemon.firstType)
                central.appendChild(container)
                if (results[i].name === 'mewtwo'){
                    index = 150
                    break;
                }
                if (i === 19){
                    base = await getData(nextPage),
                    results = await base.results,
                    nextPage = await base.next
                }
            }
        }
    }
}



// const test = async () => {
//     let base = await getData(api)
//     let results = await base.results
//     let nextPage = await base.next
//     let r = await getData(nextPage)
//     let counter = 0

//     console.log(results.map(x => {
//         counter += 1
//         if (counter === 20 ){
//             console.log('Test')
//             return x.name
//         } else{
//             return x.name
//         }
//     }))
// }

// test()

printPokemon()
