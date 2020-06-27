const api = 'https://pokeapi.co/api/v2';

const central = document.getElementById('central')

const pokemonCard = async ({ url }) => {
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
    let template = `
    <div class="pokemonCard__details">
        <h1 class="pokemonCard__details--title">
        ${pokemonName} 
        </h1>
        <span class="pokemonCard__details--pokemonId">
            ID: ${pokemonId}
        </span>
        <img src=${pokemonImage} alt=${pokemonName} class="pokemonCard__details--image"/>
        <div class="pokemonCard__details--types">
            <span class="${firstType}">
                ${firstType}
            </span>
            <span class="${secondType}">
                ${secondType}
            </span>
        </div>
    </div>
    <div class="pokemonCard__skills">
        <h1 class="pokemonCard__skills--title">
            Pokemon Information
        </h1>
        <p class="pokemonCard__skills--description">
            ${description.toLocaleLowerCase('en-US')}
        </p>
        <span class="pokemonCard__skills--height">
            ${height} Meters
        </span>
        <span class="pokemonCard__skills--weight">
            ${weight} Kilograms
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
    for(let index = 0; index <= 10; index++){
        if (index %20 === 0){
            for(let i = 0; i <= 19; i++){
                const container = document.createElement('div')
                container.className = 'pokemonCard'
                container.innerHTML = await pokemonCard(results[i]) 
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



// const main =  async () => {
//     const data = await getData(api);
//     const pokemonURL = data.results;
//     console.log(pokemonURL.map(x => x.url));
//     // const getPokemon = await getData(pokemonURL);
//     // const test = getPokemon.types;
//     // console.log(test.map(x => x.type.name));
// }

// main()