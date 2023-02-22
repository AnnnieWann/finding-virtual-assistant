const INDEX_URL = "https://user-list.alphacamp.io/api/v1/users/";
const NUM_PER_PAGE = 30;

let users = [];
const filteredUsers = [];

const dataPanel = document.querySelector(".data-panel");
const submitButton = document.querySelector(".submit-button");
const inputField = document.querySelector(".input-field");
const paginator = document.querySelector(".pagination");

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * NUM_PER_PAGE;

  return data.slice(startIndex, startIndex + NUM_PER_PAGE);
}

function renderUserList(list) {
  let HTMLContent = "";

  list.forEach((user) => {
    HTMLContent += `
      <div class="card col-sm-2 m-3" style="width: 18rem;">
        <img class="card-img-top" src="${user.avatar}">
        <div class="card-body">
            <p class="card-text">${user.name}</p>
        </div>
        <button type="button" class="btn btn-sm btn-outline-light mb-2 more-button" data-toggle="modal" data-target="#user-modal" data-id=${user.id} >More</button>
        <button type="button" class="btn btn-sm btn-outline-light btn-add-favourite" data-id=${user.id}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>
        </button>
      </div>
    `;
  });

  dataPanel.innerHTML = HTMLContent;
}

function renderUserModal(id) {
  const name = document.querySelector("#user-name");
  const image = document.querySelector("#user-image");
  const info = document.querySelector("#user-info");

  axios
    .get(INDEX_URL)
    .then(function (response) {
      users = response.data.results;

      name.textContent = "";
      image.src = "";
      info.textContent = "";

      name.innerText = users[id].name;
      image.src = users[id].avatar;
      info.innerHTML = `                 
      <p>Email: ${users[id].email}</p>
      <p>Gender: ${users[id].gender}</p>
      <p>Age: ${users[id].age}</p>
      <p>Region: ${users[id].region}</p>
    `;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function searchUser(input) {
  for (let i = 0; i < users.length; i++) {
    let name = users[i].name.toLowerCase();
    if (name.includes(input)) {
      filteredUsers.push(users[i]);
    }
  }

  if (filteredUsers.length === 0) {
    return alert(`No match users from your keywords ${input}`);
  }

  return filteredUsers;
}

function renderPaginator(list) {
  let numOfPage = Math.ceil(list.length / NUM_PER_PAGE);
  let HTMLContent = "";
  for (let page = 1; page <= numOfPage; page++) {
    HTMLContent += `
      <li class="page-item"><a class="page-link" href="#" data-id=${page}>${page}</a></li>
    `;
  }

  paginator.innerHTML = HTMLContent;
}

function addToFavourite(id) {
  const favouriteList =
    JSON.parse(localStorage.getItem("favouriteUsers")) || [];
  const user = users.find((user) => user.id === id);

  if (favouriteList.some((user) => user.id === id)) {
    return alert("The user is already in favourite list");
  }
  favouriteList.push(user);
  localStorage.setItem("favouriteUsers", JSON.stringify(favouriteList));
}

submitButton.addEventListener("click", function onSubmitClicked(event) {
  event.preventDefault();

  const input = inputField.value.trim().toLowerCase();
  searchUser(input);
  renderUserList(getUsersByPage(1));
  renderPaginator(filteredUsers);
});

dataPanel.addEventListener("click", function onMoreButtonClicked(event) {
  const target = event.target;
  const id = target.dataset.id;

  if (target.classList.contains("more-button")) {
    renderUserModal(id - 1);
  } else if (target.matches(".btn-add-favourite")) {
    addToFavourite(Number(id));
  }
});

paginator.addEventListener("click", function onPageClicked(event) {
  renderUserList(getUsersByPage(event.target.dataset.id));
});

axios
  .get(INDEX_URL)
  .then(function (response) {
    users = response.data.results;
    renderUserList(getUsersByPage(1));
    renderPaginator(users);
  })
  .catch(function (error) {
    console.log(error);
  });
