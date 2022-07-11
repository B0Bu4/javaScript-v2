$(async function () {
    navbarAndInfoView()
    mainTableWithUsers()
    addNewUserForm()
    addNewUser()
    getDefaultModal()
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    findAllUsers: async () => await fetch('api/users'),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    showOneUser: async (id) => await fetch(`api/users/${id}`),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    }),
    updateUser: async (user) => await fetch('api/users', {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    })
}

async function navbarAndInfoView() {
    // const navPrincipal = document.getElementById('navbar-user-principal');
    // const infoUserAdminPage = document.getElementById('info-user-admin-page');
    //
    // await fetch('http://localhost:8080/api/principal')
    //     .then(response => response.json())
    //     .then(userPrincipal => {
    //         navPrincipal.innerHTML = `
    //     ${userPrincipal.email} with roles: ${userPrincipal.rolesToString}
    //         `;
    //         infoUserAdminPage.innerHTML = `
    //     <tr>
    //         <td>${userPrincipal.id}</td>
    //         <td>${userPrincipal.email}</td>
    //         <td>${userPrincipal.rolesToString}</td>
    //     </tr>
    //         `;
    //     })
}


async function mainTableWithUsers() {
    const usersList = document.getElementById('user-list')
    let result = ''

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => users.forEach(user => {
            result += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                        data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                        data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            `
        }))
    usersList.innerHTML = result

    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show')
    })
}

// Array with all roles in database
const roleJson = []

fetch('api/users-roles')
    .then(res => res.json())
    .then(roles => roles.forEach(role => roleJson.push(role)))

// Event on Click Save New User
async function addNewUser() {
    $('#addNewUserButton').click(async (e) => {
        let addUserForm = $('#add-user-form')
        let email = addUserForm.find('#emailNewUser').val().trim();
        let password = addUserForm.find('#passwordNewUser').val().trim();
        let rolesArray = addUserForm.find('#newRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id === rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
             mainTableWithUsers()
        }
    })
}


// Add New User Form
async function addNewUserForm() {
    let form = $(`#addUserForm`)

    fetch('/api/users-roles').then(function (response) {
        form.find('#newRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                form.find('#newRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');

        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {

        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function deleteUser(modal, id) {
    let thisUser = await userFetchService.showOneUser(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-danger" id="deleteButton" data-dismiss="modal" data-backdrop="false">Delete</button>`

    modal.find('.modal-title').html('Delete user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)


    user.then(user => {
        let bodyForm = `<form id="deleteUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="deleteRoles" size="2" readonly>`

        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/users-roles').then(function (response) {
        modalForm.find('#deleteRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#deleteRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $(`#deleteButton`).on('click', async () => {
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            mainTableWithUsers()
            modal.modal('hide');
        }
    })
}

async function editUser(modal, id) {
    let thisUser = await userFetchService.showOneUser(id)
    let user = thisUser.json()
    let modalForm = $(`#someDefaultModal`)

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-primary" id="editButton" data-dismiss="modal" data-backdrop="false">Edit</button>`

    modal.find('.modal-title').html('Edit user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)

    user.then(user => {
        let bodyForm = `<form id="editUser">
                            <div class="col-md-7 offset-md-3 text-center">
                                <div class="form-group">
                                    <span class="font-weight-bold">ID</span>
                                    <input type="text" value="${user.id}" name="id" id="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Email</span>
                                    <input type="email" value="${user.email}" name="email" id="email" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Password</span>
                                    <input type="password" value="${user.password}" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group">
                                    <span class="font-weight-bold">Role</span>
                                    <select multiple class="form-control" id="updateRoles" size="2">`
        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/users-roles').then(function (response) {
        modalForm.find('#updateRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#updateRoles')
                    .append($('<option>').val(role.id).text(role.name));
            })
        })
    })

    $("#editButton").on('click', async () => {
        let id = modal.find('#id').val()
        let email = modal.find('#email').val()
        let password = modal.find('#password').val()
        let rolesArray = modal.find('#updateRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id == rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
            id: id,
            email: email,
            password: password,
            roles: roles
        }

        const response = await userFetchService.updateUser(data)
        if (response.ok) {
            mainTableWithUsers()
            modal.model('hide')
        }
    })


}


