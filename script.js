const container = document.getElementById('container');
const body = document.querySelector('body');
const h1 = document.createElement('h1');
h1.textContent = 'Pokedex';
body.prepend(h1);

function Types(pokedex) {
  const groupedByType = pokedex.reduce((result, pokemon) => {
    pokemon.type.forEach(type => {
      if (!result[type]) {
        result[type] = []
      }
      result[type].push(pokemon)
    })
    return result
  }, {})
  return groupedByType
}

console.log(Types(pokedex))

const keys = Object.keys(Types(pokedex))
const uniqueTypes = keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

const menu = document.createElement('div');
menu.classList.add('menu');

// Create menu items
Array.from(uniqueTypes).forEach(type => {
  const menuItem = document.createElement('a')
  menuItem.style.textDecoration = 'none'
  menuItem.href = '#'
  menuItem.textContent = type
  menuItem.classList.add('menu-item')
  menu.appendChild(menuItem)
})

h1.insertAdjacentElement('afterend', menu);

// create message element
const message = document.createElement('p');
message.setAttribute('id','message');
h1.appendChild(message);
const statsMessage = document.createElement('p');
statsMessage.setAttribute('id','statsMessage');
h1.appendChild(statsMessage);


function createBlock(pokedex) {
  for (const part of pokedex) {
    const block = document.createElement('div')
    block.classList.add('block');

    const namep = document.createElement('div');
    namep.className = 'namep'
    let names = part.name;
    if (Array.isArray(names)) {
      names = names.map(name => name.toLowerCase()).sort();
    }
    namep.textContent = names

    const sprite = document.createElement('img');
    sprite.src = part.sprite;
    sprite.addEventListener('click', function() {
      window.location.href = part.url; // Direct to the corresponding website
    });

    const label = document.createElement('div');
    label.classList.add('label');
    label.textContent = `HP: ${part.base.HP}, Attack: ${part.base.Attack}, Defense: ${part.base.Defense}, Sp. Attack: ${part.base['Sp. Attack']}, Sp. Defense: ${part.base['Sp. Defense']}, Speed: ${part.base.Speed}`;

    block.appendChild(namep);
    block.appendChild(sprite);
    block.appendChild(label);

    container.appendChild(block);
  }
}
function totalStats(groupedByType, selectedType) {
  const pokemons = groupedByType[selectedType];

  let totalHP = 0;
  let totalAttack = 0;
 

  pokemons.forEach(pokemon => {
    totalHP += pokemon.base.HP;
    totalAttack += pokemon.base.Attack;
    // Add other stats as needed.
  });

  return {
    count: pokemons.length,
    totalHP: totalHP,
    totalAttack: totalAttack
    // Add other stats as needed.
  };
}
function selecttype(pokedex) {
  const menuItems = menu.children;

  for (const menuItem of menuItems) {
    menuItem.addEventListener('click', function(event) {
      event.preventDefault(); // prevent the default behavior of the link

      // filter pokedex data by selected type
      const selectedType = menuItem.textContent.trim();
      const filteredData = pokedex.filter(function(pokemon) {
        return pokemon.type.includes(selectedType);
      });

      // remove existing blocks from container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      if (filteredData.length > 0) {
        createBlock(filteredData);
        const types = Types(pokedex);
        const stats = totalStats(types, selectedType);

        message.textContent = ` Type: ${selectedType}(${stats.count})`;
        statsMessage.textContent = `Total HP: ${stats.totalHP} | Total Attack: ${stats.totalAttack}`;
      }
    });
  }
}


document.addEventListener('DOMContentLoaded', function() {
  selecttype(pokedex);
});
