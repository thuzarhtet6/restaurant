async function getData(url) {
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}

const g_id = (id) => document.getElementById(id);
const data = await getData("https://dummyjson.com/recipes?limit=50");

loadMenuDetails(getMenu(retrieveID()));

function retrieveID() {
  let url = window.location.href; // getting current url
  if (url.includes("#")) { // ensuring the url contains #
    return +url.split("#")[1]; // getting id from url
  }
  return null;
}

function getMenu(id) {
  let menu = data.recipes.find(item => item.id === +id);
  return menu ? menu : null;
}

function loadMenuDetails(data) {
  const root = g_id("image_container");
  if (data) {
    root.innerHTML = template_menu_details(data.name, data.image, data.ingredients,
      data.instructions, data.prepTimeMinutes, data.cookTimeMinutes, data.servings, data.tags);
  }
}

function template_tags(tags) {
  let data = "";
  for (const tag of tags) {
    data += `<span>${tag}</span>`;
  }
  return data;
}

function template_instructions(instructions) {
  let data = "";
  for (const instruction of instructions) {
    data += `<li>${instruction}</li>`;
  }
  return data;
}

function template_menu_details(name, url, ingredients, instructions, prepTimeMinutes, cookTimeMinutes, servings, tags) {
  return `
    <div id="european">
    <div id="food_details_container">
          <div id="food_details_img">
            <img src="${url}" />
          </div>
          <div id="food_details_contents">
            <h1>${name}</h1>
            <h3 class="food_details_sub_titles">Ingredients</h3>
            <p class="ingredients">
              - ${ingredients.join(",")}.
            </p>
            <h3 class="food_details_sub_titles">Prepare Time</h3>
            <p class="ingredients">- ${prepTimeMinutes} minutes</p>
            <h3 class="food_details_sub_titles">Cooking Time</h3>
            <p class="ingredients">- ${cookTimeMinutes} minutes</p>
            <h3 class="food_details_sub_titles">Servings</h3>
            <p class="ingredients">- ${servings} people</p>
            <h3 class="food_details_sub_titles">Instructions</h3>
            <div class="ingredients">
              <ul>
                ${template_instructions(instructions)}
              </ul>
            </div>

            <div id="tags">
              ${template_tags(tags)}
            </div>

            <div id="home">
              <a id="goBackBtn">Previous Menu</a>
              <a href="index.html">Home Page</a>
            </div>
          </div>
        </div>
        </div>
    `;
}



// for you may also like section
/* 
for the suggest menus, we'll select 3 menus base on same cuisin name 
- if the same cuisin name menus are lesser than 3, we will pick the rest from all reciepes 
by generating random menus
*/

const suggestBoxLength = 3;

// getting 3 menus base on same cuisine
function getSameCuisine() {
  const result = [];
  const getCuisineGroup = data.recipes.filter(index => index.cuisine === getMenu(retrieveID()).cuisine && index.id !== getMenu(retrieveID()).id);
  if(getCuisineGroup.length !== 0){
    for (let cuisineMenus of getCuisineGroup) {
      if (result.length === suggestBoxLength) break; // we only pick 3 menus and need to stop putting when the slot is full
      result.push(cuisineMenus);
    }
  }
  return result;
}

function getSuggestMenus() {
  let cuisine = getSameCuisine(); // get same cuisine first
  if (cuisine.length < suggestBoxLength) { // if same cuisine menus lesser than 3 
    cuisine = generateRandomMenus();
  }
  return cuisine;
}

function generateRandomMenus() {
  const result = getSameCuisine();
  const menus = data.recipes.filter(index => index.id !== getMenu(retrieveID()).id && index.cuisine !== getMenu(retrieveID()).cuisine);

  while (result.length < suggestBoxLength && menus.length > 0) {
    const randomIndex = generateRandom(0, menus.length - 1);
    const randomMenu = menus[randomIndex];

    if (!result.some(index => index.id === randomMenu.id)) {
      result.push(randomMenu);
    }

    // Remove the selected menu from the array to avoid duplicates
    menus.splice(randomIndex, 1);
  }

  return result;
}

function generateRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function loadSideMenus(){
  const sideMenus = getSuggestMenus();
  g_id("slide_container_detail").innerHTML = "";
  for(const sideMenu of sideMenus){
    g_id("slide_container_detail").innerHTML += template_Menus(sideMenu.id,sideMenu.image,sideMenu.name);
  }
  
}
function template_Menus(id, url,name) {
  return `<div class="image_box1">
  <a href="details.html#${id}">
  <img
    src="${url}"
    alt="Avatar"
    class="image"
  />
  <div class="overlay_inner"></div>
  <div class="overlay">
      <h2>${name}</h2>  
  </div>
  </a>
  </div>`;
}
g_id("goBackBtn").addEventListener('click',() => history.back());
loadSideMenus();

window.addEventListener('hashchange', function() {
  // Reload data and menus when the URL hash changes
  loadMenuDetails(getMenu(retrieveID()));
  loadSideMenus();
  g_id("goBackBtn").addEventListener('click',() => history.back());
});

