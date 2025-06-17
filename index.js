//CONSTS
const API_URL = 'https://dummyjson.com/recipes';

//DOM element
const recipeLists = document.querySelector('.recipe-lists');
console.log(recipeLists);

//SOURCE OF TRUTH
const globalState = {
  recipes: [],
};

//A FUNCTION TO TRIGGER UI RE-RENDER ONCE STATE IS UPDATED
const updateDOM = () => {
  recipeLists.innerHTML = '';
  globalState.recipes.map((recipe) => {
    recipeLists.insertAdjacentHTML(
      'beforeend',
      `<li 
        class="recipe-list" 
        style="background-image: url('${recipe.image}')"
        onclick="window.location.href='recipe-detail.html?id=${recipe.id}'"
        >
        
          <div class=recipe-info>
              <h3>${recipe.name}</h3>
              <div class="recipe-tags">
                <span>${recipe.cuisine}</span>
                <span>${recipe.difficulty}</span>
              </div>
          </div>
        
        
      </li>
      
      `
    );
  });
};

const fetchData = async () => {
  try {
    const response = await axios(API_URL);
    const recipes = response.data.recipes;
    console.log(recipes[0]);
    globalState.recipes = [...recipes];
    updateDOM();
  } catch (error) {
    console.log('there is an error', error);
  }
};

fetchData();
