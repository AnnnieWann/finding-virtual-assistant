const INDEX_URL = "https://user-list.alphacamp.io/api/v1/users/";
const NUM_PER_PAGE = 30;

let users = JSON.parse(localStorage.getItem("favouriteUsers")) || [];
const filteredUsers = [];

const dataPanel = document.querySelector(".data-panel");
const paginator = document.querySelector(".pagination");

function getUsersByPage(page) {
  let startIndex = (page - 1) * NUM_PER_PAGE;

  return users.slice(startIndex, startIndex + NUM_PER_PAGE);
}

function renderUserList(list) {
  let HTMLContent = "";

  list.forEach((user) => {
    HTMLContent += `
      <div class="card col-sm-2 m-3" style="width: 18rem;">
        <img class="card-img-top" src="${user.avatar}">
        <div class="card-body">
          <p class="card-text">${user.name} ${user.surname}</p>
          <button type="button" class="btn btn-sm btn-outline-light more-button mx-2" data-toggle="modal" data-target="#user-modal" data-id=${user.id} >More</button>
          <button type="button" class="btn btn-sm btn-outline-light btn-remove-favourite" data-id=${user.id}>x
          </button>
        </div>
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

function removeFromFavourite(id) {
  const userIndex = users.findIndex((user) => user.id === id);
  users.splice(userIndex, 1);
  localStorage.setItem("favouriteUsers", JSON.stringify(users));
  renderUserList(users);
}

function renderPaginator(list) {
  const data = filteredUsers.length > 0 ? filteredUsers : users;
  let numOfPage = Math.ceil(data.length / NUM_PER_PAGE);
  let HTMLContent = "";
  for (let page = 1; page <= numOfPage; page++) {
    HTMLContent += `
      <li class="page-item"><a class="page-link" href="#" data-id=${page}>${page}</a></li>
    `;
  }

  paginator.innerHTML = HTMLContent;
}

dataPanel.addEventListener("click", function onMoreButtonClicked(event) {
  const target = event.target;
  const id = target.dataset.id;

  if (target.classList.contains("more-button")) {
    renderUserModal(id - 1);
  } else if (target.matches(".btn-remove-favourite")) {
    removeFromFavourite(Number(id));
  }
});

paginator.addEventListener("click", function onPageClicked(event) {
  renderUserList(getUsersByPage(Number(event.target.dataset.id)));
});

renderUserList(users);
renderPaginator(users);
