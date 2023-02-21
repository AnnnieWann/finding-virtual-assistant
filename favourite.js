const INDEX_URL = "https://user-list.alphacamp.io/api/v1/users/";
let users = [];

const dataPanel = document.querySelector(".data-panel");

axios
  .get(INDEX_URL)
  .then(function (response) {
    users = response.data.results;
    let firstHalfUsers = users.slice(0, 100);
    let secondHalfUsers = users.slice(101, 200);
    renderUserList(firstHalfUsers);
  })
  .catch(function (error) {
    console.log(error);
  });

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
        <button type="button" class="btn btn-sm btn-outline-info add-to-favourite">
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

dataPanel.addEventListener("click", function onMoreButtonClicked(event) {
  if (event.target.classList.contains("more-button")) {
    renderUserModal(event.target.dataset.id - 1);
  }
});
