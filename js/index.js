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

loadReciepes(data);

function loadReciepes(data) {
    let root = g_id('european');
    root.innerHTML = "";
    root.innerHTML = template_European();
    if (data) {
        data = data?.recipes;
        for (const property of data) {
            root.innerHTML += template_Menus(property.id,property.image,property.name);
        }
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




