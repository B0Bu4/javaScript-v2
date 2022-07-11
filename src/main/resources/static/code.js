fetchNav()
fetchUsers()

// Панель
function fetchNav() {
    const navPrincipal = document.getElementById('navbar-user-principal');
    const infoUserAdminPage = document.getElementById('tbody-user');
    fetch('http://localhost:8080/api/principal')
        .then(response => response.json())
        .then(userPrincipal => {
            navPrincipal.innerHTML = `
        ${userPrincipal.email} with roles: ${userPrincipal.rolesToString}
            `;
            infoUserAdminPage.innerHTML = `
        <tr>
            <td>${userPrincipal.id}</td>
            <td>${userPrincipal.email}</td>
            <td>${userPrincipal.rolesToString}</td>
        </tr>
            `;
        })
}

//Запрос на отображение таблицы
function fetchUsers() {
    fetch(' http://localhost:8080/api/users')
        .then(response => response.json())
        .then(renderUsersTable)
}

//Функция отображения таблицы
const userList = document.getElementById('user-list');

function renderUsersTable(users) {
    userList.innerHTML = '';
    users.forEach(function (user) {
        userList.innerHTML += `
                <tr>
                  <td id="contentUserID">${user.id}</td>
                  <td id="contentUserEmail">${user.email}</td>
                  <td id="contentUserRoles">${user.rolesToString}</td>
                  <td  data-id =${user.id}>
                    <button type="button" data-userid=${user.id} data-action="edit-user" class="btn btn-info" 
                    id="edit-user" data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                  </td>
                  <td  data-id =${user.id}>
                    <button type="button" data-userid="${user.id}" data-action="delete-user" class="btn btn-danger" 
                    id="delete-user" data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                  </td>
                </tr>
        `
    })
}

//Добавление юзера (при отправки формы, необходимо переправить на вкладку с таблицей-юзеров, пока не понял как)
const addUserForm = document.getElementById('add-user-form');
addUserForm.addEventListener('submit', function (event) {

    event.preventDefault()

    fetch(`http://localhost:8080/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: `${event.target.email.value}`,
            password: `${event.target.password.value}`,
            roles: [
                {
                    name: `${event.target.rolesAdd.value}`
                }
            ]
        })
    })
        .then(response => response.json())
        .then(fetchUsers)

    event.target.email.value = '';
    event.target.password.value = '';
})

// Edit - Delete
userList.addEventListener('click', function (event) {
    let editBtnIsPressed = event.target.id === 'edit-user';
    let delBtnIsPressed = event.target.id === 'delete-user';
    let id = event.target.parentElement.dataset.id;
    console.log(event.target.parentElement.dataset.id)
    console.log(event.target.id)
    let modalHeader = document.querySelector('.modal-title');
    modalHeader.innerHTML = '';
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    let modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';
    let modalForm = document.querySelector('.modal-form')

    if (editBtnIsPressed) {

        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                modalHeader.innerHTML = `Edit user`
                modalBody.innerHTML = `
                    <div class="row justify-content-center">
                        <div class="col-sm-5 aria-controls">
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="addID">ID</label></strong>
                                <input class="form-control" type="text" id="addID" value=${user.id} disabled>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="addEmail">Email address</label></strong>
                                <input class="form-control" type="email" name="addEmail" id="addEmail" value=${user.email}>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="addPassword">Password</label> </strong>
                                <input class="form-control" name="addPassword" type="password" value="" id="addPassword"
                                       placeholder="">
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="addRole">Role</label></strong>
                            </br>
                            <select class="custom-select" size="2" name="addRole" id="addRole" multiple>
                                <option value="ROLE_ADMIN">ADMIN</option>
                                <option value="ROLE_USER" selected="selected">USER</option>
                            </select>
                             </div>
                             </br>
                        </div>
                    </div>
                    `

                modalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <input type="submit" class="btn btn-primary" value="EDIT"/>
                `
            })

        modalForm.addEventListener('submit', function (e) {
            fetch(`http://localhost:8080/api/users/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    email: `${e.target.addEmail.value}`,
                    password: `${e.target.addPassword.value}`,
                    roles: [
                        {
                            name: `${e.target.addRole.value}`
                        }
                    ]
                })
            })
                .then(response => response.json())
                .then(renderUsersTable)
        })

    } else if (delBtnIsPressed) {
        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                modalHeader.innerHTML = `Delete user`
                modalBody.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-sm-5 aria-controls">
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delId">ID</label></strong>
                        <input class="form-control" type="text" id="delId" value=${user.id} disabled>
                    </div>
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delEmail">Email address</label></strong>
                        <input class="form-control" type="text" id="delEmail" value=${user.email} disabled>
                    </div>
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delRole">Role</label></strong>
                    </br>
                    <select class="custom-select" size="2" name="delRole" id="delRole" multiple disabled>
                        <option value="ROLE_ADMIN">ADMIN</option>
                        <option value="ROLE_USER">USER</option>
                    </select>
                    </div>
                    </br>
                </div>
            </div>
            `
                modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <input type="submit" class="btn btn-danger" value="DELETE"/>
            `
            })

        modalForm.addEventListener('submit', function (e) {

            fetch(`http://localhost:8080/api/users/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.ok)
                .then(fetchUsers)

        })
    }
})





