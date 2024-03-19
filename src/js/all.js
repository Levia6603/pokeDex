const pokeTypeForm = {
  normal: "一般",
  fighting: "格鬥",
  flying: "飛行",
  poison: "毒",
  rock: "岩石",
  bug: "蟲",
  ghost: "幽靈",
  steel: "鋼",
  fire: "火",
  water: "水",
  grass: "草",
  electric: "電",
  psychic: "超能",
  ice: "冰",
  dragon: "龍",
  dark: "惡",
  fairy: "妖精",
  ground: "地面",
};
const pokeStatForm = {
  hp: "HP",
  attack: "攻擊",
  defense: "防禦",
  "special-attack": "特攻",
  "special-defense": "特防",
  speed: "速度",
};
const generation = [
  [0, 151],
  [151, 100],
  [251, 135],
  [386, 107],
  [493, 156],
  [649, 72],
  [721, 88],
  [809, 96],
  [905, 120],
];

const pokeGeneration = document.querySelector(".poke-generation");
const pokeSelect = document.querySelector(".pokeNum");
const pokeImg = document.querySelector(".poke-img");
const pokeName = document.querySelector(".poke-name");
const pokeStats = document.querySelector(".poke-stats");
const abilities = document.querySelector(".ability");
const pokeTypes = document.querySelector(".poke-types");
const abilitiesText = document.querySelector(".ability-text");

let pokeBaseUrl = "https://pokeapi.co/api/v2/pokemon";

function getPokeList(generation) {
  axios
    .get(`${pokeBaseUrl}?offset=${generation[0]}&limit=${generation[1]}`)
    .then((res) => {
      let pokeList = "";
      res.data.results.forEach((obj, i) => {
        pokeList += `<option value="${i + generation[0] + 1}">${
          obj.name
        }</option>`;
      });
      pokeSelect.innerHTML = pokeList;
    });
}
pokeGeneration.addEventListener("change", () => {
  getPokeList(generation[Number(pokeGeneration.value) - 1]);
});

pokeSelect.addEventListener("change", () => {
  axios.get(`${pokeBaseUrl}/${pokeSelect.value}`).then((res) => {
    pokeImg.innerHTML = `<img src="${res.data.sprites.front_default}" alt="">`;
    let statusList = "";
    res.data.stats.forEach((obj) => {
      statusList += `<li><p>${
        pokeStatForm[obj.stat.name]
      }</p><span style="width:${obj.base_stat}px">${obj.base_stat}</span></li>`;
    });
    let typesList = "";
    res.data.types.forEach((obj) => {
      typesList += `<li class="${obj.type.name}">${
        pokeTypeForm[obj.type.name]
      }</li>`;
    });
    let promiseList = res.data.abilities.map((obj) =>
      axios.get(obj.ability.url)
    );
    let linkList = res.data.abilities.map((obj) => obj.ability.url);
    let hiddenAbilityList = res.data.abilities.map((obj) => obj.is_hidden);
    async function getChAbilities() {
      let chData = await Promise.all(promiseList).then((data) => {
        let chAbilityList = data.map((obj) =>
          obj.data.names
            .filter((el) => el.language.name == "zh-Hant")
            .map((el) => el.name)
        );
        return chAbilityList;
      });
      let btnList = "";
      chData.forEach((el, i) => {
        if (hiddenAbilityList[i]) {
          btnList += `<li><button class="hidden" data-link="${linkList[i]}">${el}</button></li>`;
        } else {
          btnList += `<li><button data-link="${linkList[i]}">${el}</button></li>`;
        }
      });
      abilities.innerHTML = btnList;
    }
    getChAbilities();
    pokeStats.innerHTML = statusList;
    pokeTypes.innerHTML = typesList;
  });
  axios.get(`${pokeBaseUrl}-species/${pokeSelect.value}`).then((res) => {
    let chName = res.data.names.filter((obj) => obj.language.name == "zh-Hant");
    pokeName.textContent = chName[0].name;
  });
});
abilities.addEventListener("click", (e) => {
  if (e.target.getAttribute("data-link")) {
    axios.get(e.target.getAttribute("data-link")).then((res) => {
      let chData = res.data.flavor_text_entries.filter(
        (obj) => obj.language.name == "zh-Hant"
      );
      abilitiesText.textContent = chData[0].flavor_text;
    });
  }
});
// let url1 = axios.get(`${pokeBaseUrl}/259`);
// let url2 = axios.get(`${pokeBaseUrl}/240`);
// Promise.all([url1, url2]).then((data) => {
//   console.log(data.map((obj) => obj.data));
// });
