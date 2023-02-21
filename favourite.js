const INDEX_URL = "https://user-list.alphacamp.io/api/v1/users/";
const NUM_PER_PAGE = 30;

let users = JSON.parse(localStorage.getItem("favouriteUsers")) || [];
const filteredUsers = [];

console.log(users);

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
            <p class="card-text">${user.name}</p>
        </div>
        <button type="button" class="btn btn-sm btn-outline-info mb-2 more-button" data-toggle="modal" data-target="#user-modal" data-id=${user.id} >More</button>
        <button type="button" class="btn btn-sm btn-outline-info btn-remove-favourite" data-id=${user.id}>x
        </button>
      </div>
    `;
  });

  dataPanel.innerHTML = HTMLContent;
}

function renderUserModal(id) {
  if (!id) return;
  const name = document.querySelector("#user-name");
  const image = document.querySelector("#user-image");
  const info = document.querySelector("#user-info");

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
  } else if (target.matches(".btn-add-favourite")) {
    addToFavourite(Number(id));
  }
});

paginator.addEventListener("click", function onPageClicked(event) {
  renderUserList(getUsersByPage(event.target.dataset.id));
});

renderUserList(users);
renderPaginator(users);
