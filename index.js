//CONSTS
const API_URL = 'https://dummyjson.com/recipes';

//DOM element
const recipeLists = document.querySelector('.recipe-lists');
const leftArrowBtn = document.querySelector('.left-arrow');
const rightArrowBtn = document.querySelector('.right-arrow');
console.log(leftArrowBtn, rightArrowBtn);

//SOURCE OF TRUTH
const globalState = {
  recipes: [],
  search: {
    page: 1,
    totalPage: 5,
  },
};

//DISABLE PAGINATION BUTTONS ON CONDITION
function updateArrowButtons() {
  // Disable left arrow on first page
  leftArrowBtn.disabled = globalState.search.page === 1;

  // Disable right arrow on last page
  rightArrowBtn.disabled =
    globalState.search.page === globalState.search.totalPage;

  // Optional: Add visual styling for disabled state
  if (leftArrowBtn.disabled) {
    leftArrowBtn.classList.add('disabled');
    leftArrowBtn.style.opacity = '0.5';
    leftArrowBtn.style.cursor = 'not-allowed';
  } else {
    leftArrowBtn.classList.remove('disabled');
    leftArrowBtn.style.opacity = '1';
    leftArrowBtn.style.cursor = 'pointer';
  }

  if (rightArrowBtn.disabled) {
    rightArrowBtn.classList.add('disabled');
    rightArrowBtn.style.opacity = '0.5';
    rightArrowBtn.style.cursor = 'not-allowed';
  } else {
    rightArrowBtn.classList.remove('disabled');
    rightArrowBtn.style.opacity = '1';
    rightArrowBtn.style.cursor = 'pointer';
  }
}

//A FUNCTION TO TRIGGER UI RE-RENDER ONCE STATE IS UPDATED
const updateDOM = () => {
  recipeLists.innerHTML = '';
  updateArrowButtons();
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

const paginationFunc = (page) => {
  const limit = 12;
  const skip = (page - 1) * 12;

  const API_URL_PAGE = `${API_URL}?limit=${limit}&skip=${skip}`;
  return API_URL_PAGE;
};

const fetchData = async () => {
  try {
    const response = await axios(paginationFunc(globalState.search.page));
    const recipes = response.data.recipes;
    console.log(recipes[0]);
    globalState.recipes = [...recipes];
    updateDOM();
  } catch (error) {
    console.log('there is an error', error);
  }
};

fetchData();

//A FUNCTION TO TRANSITION TO THE NEXT PAGE
const nextPage = () => {
  globalState.search.page++;
  fetchData();
};

const prevPage = () => {
  if (globalState.search.page > 1) {
    globalState.search.page--;
    fetchData();
  }
};
