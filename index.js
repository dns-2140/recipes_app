//CONSTS
const API_URL = 'https://dummyjson.com/recipes';
const API_URL_TAGS = 'https://dummyjson.com/recipes/tags';

//DOM element
const recipeLists = document.querySelector('.recipe-lists');
const tagLists = document.querySelector('.tag-lists');
const leftArrowBtn = document.querySelector('.left-arrow');
const rightArrowBtn = document.querySelector('.right-arrow');
console.log(leftArrowBtn, rightArrowBtn);

//SOURCE OF TRUTH
const globalState = {
  tags: [],
  recipes: [],
  search: {
    filter: 'all',
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
    globalState.search.page === globalState.search.totalPage ||
    globalState.search.page !== 'all';

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

const updateFilter = (tag) => {
  globalState.search.filter = tag;
  fetchData();
};

//A FUNCTION TO TRIGGER UI RE-RENDER ONCE STATE IS UPDATED
const updateDOM = () => {
  recipeLists.innerHTML = '';
  updateArrowButtons();
  globalState.recipes.forEach((recipe) => {
    recipeLists.insertAdjacentHTML(
      'beforeend',
      `<li 
        class="recipe-list" 
        style="background-image: url('${recipe.image}')"
        title="${recipe.name}"
        tabindex="0" 
        role="button"
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
    document
      .querySelector('.recipe-list')
      .addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          window.location.href = `recipe-detail.html?id=${recipe.id}`;
        }
      });
  });

  tagLists.innerHTML = `<li 
  class="tag-list ${globalState.search.filter === 'all' ? 'active' : ''}" 
  onclick="updateFilter('all')"
   
  >
  all recipes
  </li>`;

  globalState.tags.forEach((tag) => {
    tagLists.insertAdjacentHTML(
      'beforeend',
      `<li class="tag-list ${
        globalState.search.filter === tag ? 'active' : ''
      }" onclick="updateFilter('${tag}')">${tag}</li>`
    );
  });
};

const paginationFunc = (page) => {
  const limit = 12;
  const skip = (page - 1) * 12;
  const { filter } = globalState.search;

  if (filter === 'all') {
    const API_URL_PAGE = `${API_URL}?limit=${limit}&skip=${skip}`;
    return API_URL_PAGE;
  } else {
    const API_URL_PAGE = `${API_URL}/tag/${filter}?$limit`;
    return API_URL_PAGE;
  }
};

const fetchData = async () => {
  try {
    const response = await axios(paginationFunc(globalState.search.page));
    console.log(response.data);
    const recipes = response.data.recipes;
    console.log(recipes[0]);
    globalState.recipes = [...recipes];
    updateDOM();
  } catch (error) {
    console.log('there is an error', error);
  }
};

const fetchTagData = async () => {
  try {
    const tags = (await axios(API_URL_TAGS)).data;
    console.log(tags);
    const tagArr = [];
    for (let i = 0; tagArr.length <= 8; i++) {
      tagArr.push(tags[Math.floor(Math.random() * tags.length)]);
    }
    globalState.tags = [...tagArr];
  } catch (error) {
    console.log('there is an error', error);
  }
};

fetchTagData();
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
