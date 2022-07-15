fetchNav()
fetchUsers()

// Панель
function fetchNav() {
    let navPrincipal = document.getElementById('navbar-user-principal');
    let infoUserAdminPage = document.getElementById('tbody-user');
    fetch('http://localhost:8080/api/principal')
        .then(response => response.json())
        .then(userPrincipal => {
            navPrincipal.innerHTML = `
        ${userPrincipal.email} with roles: ${userPrincipal.rolesToString}
            `;
            infoUserAdminPage.innerHTML = `
        <tr>
            <td>${userPrincipal.id}</td>
            <td>${userPrincipal.firstname}</td>
            <td>${userPrincipal.lastname}</td>
            <td>${userPrincipal.age}</td>
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
let userList = document.getElementById('user-list');

function renderUsersTable(users) {
    userList.innerHTML = '';
    users.forEach(function (user) {
        userList.innerHTML += `
                <tr>
                  <td>${user.id}</td>
                  <td>${user.firstname}</td>
                  <td>${user.lastname}</td>
                  <td>${user.age}</td>
                  <td>${user.email}</td>
                  <td>${user.rolesToString}</td>
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
let addUserForm = document.getElementById('add-user-form');
addUserForm.addEventListener('submit', function (event) {

    event.preventDefault()

    fetch(`http://localhost:8080/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: `${event.target.firstname.value}`,
            lastname: `${event.target.lastname.value}`,
            age: `${event.target.age.value}`,
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

    event.target.firstname.value = '';
    event.target.lastname.value = '';
    event.target.age.value = '';
    event.target.email.value = '';
    event.target.password.value = '';
})

// Edit - Delete

userList.addEventListener('click', function (event) {

    let editBtnIsPressed = event.target.id === 'edit-user';
    let delBtnIsPressed = event.target.id === 'delete-user';
    let id = event.target.parentElement.dataset.id;
    let modalHeader = document.querySelector('.modal-title');
    modalHeader.innerHTML = '';
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    let modalFooter = document.querySelector('.modal-footer');
    modalFooter.innerHTML = '';
    let modalForm = document.querySelector('.modal-form')


    if (editBtnIsPressed) {

        modalForm.addEventListener('submit', function (e) {

            e.preventDefault()

            fetch(`http://localhost:8080/api/users/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    firstname: `${e.target.upFirstname.value}`,
                    lastname: `${e.target.upLastname.value}`,
                    age: `${e.target.upAge.value}`,
                    email: `${e.target.upEmail.value}`,
                    password: `${e.target.upPassword.value}`,
                    roles: [
                        {
                            name: `${e.target.upRole.value}`
                        }
                    ]
                })
            })
                .then(response => response.json())
                .then(fetchUsers)
                .then($('#someDefaultModal').modal('hide'))

        })

        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                modalHeader.innerHTML = `Edit user`
                modalBody.innerHTML = `
                        <div class="col-sm-7 offset-md-3 text-center">
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upID">ID</label></strong>
                                <input class="form-control" type="text" id="upID" value=${user.id} disabled>
                            </div>
                            
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upFirstname">First Name</label></strong>
                                <input class="form-control" type="text" id="upFirstname" value=${user.firstname}>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upLastname">Last name</label></strong>
                                <input class="form-control" type="text" id="upLastname" value=${user.lastname}>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upAge">Age</label></strong>
                                <input class="form-control" type="number" id="upAge" value=${user.age}>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upEmail">Email address</label></strong>
                                <input class="form-control" type="email" id="upEmail" value=${user.email}>
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upPassword">Password</label> </strong>
                                <input class="form-control" type="password" value="" id="upPassword"
                                       placeholder="">
                            </div>
                            <div class="form-outline mb-4">
                                <strong><label class="form-label" for="upRole">Role</label></strong>
                            </br>
                            <select class="custom-select" size="2" id="upRole" multiple>
                                <option value="ROLE_ADMIN">ADMIN</option>
                                <option value="ROLE_USER" selected="selected">USER</option>
                            </select>
                             </div>
                             </br>
                        </div>
                    `

                modalFooter.innerHTML = `
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <input type="submit" class="btn btn-primary" value="EDIT"/>
                `
            })


    } else if (delBtnIsPressed) {

        modalForm.addEventListener('submit', function (e) {

            e.preventDefault()

            fetch(`http://localhost:8080/api/users/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.ok)
                .then(fetchUsers)
                .then($('#someDefaultModal').modal('hide'))
        })

        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                modalHeader.innerHTML = `Delete user`
                modalBody.innerHTML = `
                <div class="col-sm-7 offset-md-3 text-center">
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delId">ID</label></strong>
                        <input class="form-control" type="text" id="delId" value=${user.id} disabled>
                    </div>
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delFirstname">First Name</label></strong>
                        <input class="form-control" type="text" id="delFirstname" value=${user.firstname} disabled>
                    </div>
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delLastname">Last Name</label></strong>
                        <input class="form-control" type="text" id="delLastname" value=${user.lastname} disabled>
                    </div>
                    <div class="form-outline mb-4">
                        <strong><label class="form-label" for="delAge">Age</label></strong>
                        <input class="form-control" type="text" id="delAge" value=${user.age} disabled>
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
            `
                modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <input type="submit" class="btn btn-danger" value="DELETE"/>
            `
            })
    }
})





