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

load_side_options("cuisine_box", "cuisine", template_side_options, "cuisine", getSideData);
load_side_options("difficulty_box", "difficulty", template_side_options, "difficulty", getSideData);
load_side_options("food_type_box", "mealType", template_side_options, "foodType", getMealType);

function getSideData(data, keyword) {
    let result = [];
    for (const prop of data.recipes) {
        if (!result.includes(prop[keyword])) {
            result.push(prop[keyword]);
        }
    }
    return result;
}

// need to be nested looping because mealtype of array 
function getMealType(data) {
    let result = [];
    for (const prop of data.recipes) {
        for (const meal of prop.mealType) {
            if (!result.includes(meal)) {
                result.push(meal);
            }
        }
    }
    return result;
}


// use callback functions for the reusability ( getDataFunction)
function load_side_options(rootID, sideName, template, checkboxName, getDataFunction) {
    let root = g_id(rootID);
    root.innerHTML = "";
    let sideData = getDataFunction(data, sideName);
    for (const prop of sideData) {
        root.innerHTML += template(prop, checkboxName);
    }
}

function template_side_options(type, name) {
    return `
    <label class="checkbox_container"
                >${type}
                <input type="checkbox" value="${type}" name="${name}" />
                <span class="checkmark"></span>
              </label>
    `;
}

function handleEvent() {
    const cuisines = document.getElementsByName("cuisine");
    const difficulties = document.getElementsByName("difficulty");
    const foodTypes = document.getElementsByName("foodType");
    const cuisineCheckedValues = getCheckedValues(cuisines);
    const difficultyCheckedValues = getCheckedValues(difficulties);
    const foodTypesCheckedValues = getCheckedValues(foodTypes);
    
    //if user not selecting any checkboxes
    let finalValues = data.recipes;
    
    //if user select any of cuisine checkboxes
    if (cuisineCheckedValues.length > 0) {
        finalValues = finalValues.filter(index => cuisineCheckedValues.includes(index.cuisine));
    }

    //if user select any of difficulty checkboxes
    if (difficultyCheckedValues.length > 0) {
        finalValues = finalValues.filter(index => difficultyCheckedValues.includes(index.difficulty));
    }

    //if user select any of foodtype checkboxes
    // need to compare array to array because foodTypes is array and checkboxes are also array
    if (foodTypesCheckedValues.length > 0) {
        finalValues = finalValues.filter(index =>
            foodTypesCheckedValues.some(foodType => index.mealType.includes(foodType))
        );
    }
    
    loadReciepes(finalValues);
}

// getting checked values of checkboxes 
function getCheckedValues(checkboxes) {
    return Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
}

function setEventListener(name, fn) {
    let checkboxes = document.getElementsByName(name);
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => fn()));
}

setEventListener('cuisine', handleEvent);
setEventListener('difficulty', handleEvent);
setEventListener('foodType', handleEvent);


function loadReciepes(data) {
    let root = g_id('european');
    root.innerHTML = "";
    root.innerHTML = template_European();
    for (const property of data) {
        root.innerHTML += template_Menus(property.id,property.image,property.name);
    }
}

function template_European() {
    return `<div id="european_title_wrapper">
    <h2 id="european_title">MENUS</h2>
      </div>`;
}

function template_Menus(id, url,name) {
    return `<div class="image_box">
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