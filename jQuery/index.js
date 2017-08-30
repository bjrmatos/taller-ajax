'use strict'

function load () {
  bindButtons()
  checkIfUserIsAuthenticated()
}

function bindButtons() {
  document.getElementById('get-breeds').addEventListener('click', showBreeds)
  document.getElementById('get-random-dog').addEventListener('click', showRandomPicture)
  document.getElementById('get-my-pets').addEventListener('click', getPets)
  document.getElementById('save-pet').addEventListener('click', savePet)
}

function checkIfUserIsAuthenticated () {
  var user = localStorage.getItem('authentication')
  updateUserArea(user ? JSON.parse(user) : null)
}

function updateUserArea(user) {
  var userAreaNode = document.getElementById('user-area')

  if (user) {
    userAreaNode.innerHTML = '<strong>Hi, welcome ' +
    user.username + '</strong>&nbsp;' +
    '<button id="get-user-info">Get user info</button>&nbsp;' +
    '<button id="logout" type="button">Logout</button>'

    document.getElementById('get-user-info')
    .addEventListener('click', getUserInfo)
    document.getElementById('logout')
    .addEventListener('click', logoutUser)
  } else {
    userAreaNode.innerHTML = '<form id="login-user-form">' +
    '<label>Username: <input name="username" type="text" /></label>&nbsp;' +
    '<label>Password: <input name="password" type="password" /></label>&nbsp;' +
    '<button id="login" type="button">Login</button></form>'

    document.getElementById('login').addEventListener('click', loginUser)
  }
}

function getToken () {
  var user = localStorage.getItem('authentication')

  if (user) {
    return JSON.parse(user).token
  }

  return null
}

function loginUser() {
  var loginForm = document.getElementById('login-user-form')
  var usernameEl = loginForm.querySelector('[name=username]')
  var passwordEl = loginForm.querySelector('[name=password]')

  sendRequest({
    method: 'POST',
    url: 'http://localhost:9000/login',
    data: {
      username: usernameEl.value,
      password: passwordEl.value
    }
  }, function (err, response) {
    if (err) {
      return showResult(err.message)
    }

    // saving the session
    localStorage.setItem('authentication', JSON.stringify(response))

    updateUserArea(response)
  })
}

function logoutUser () {
  localStorage.removeItem('authentication')

  updateUserArea(null)
}

function getUserInfo () {
  sendRequest({
    method: 'GET',
    url: 'http://localhost:9000/me',
    token: getToken()
  }, function (err, response) {
    if (err) {
      return showResult(err.message)
    }

    showResult(JSON.stringify(response))
  })
}

function showBreeds () {
  showResult('Loading..')

  sendRequest({
    url: 'https://dog.ceo/api/breeds/list/all',
    method: 'GET'
  }, function (err, response) {
    if (err) {
      return showResult(err.message)
    }

    showResult(JSON.stringify(response))
  })
}

function showRandomPicture () {
  showResult('Loading..')

  sendRequest({
    url: 'https://dog.ceo/api/breeds/image/random',
    method: 'GET'
  }, function (err, response) {
    if (err) {
      return showResult(err.message)
    }

    var pictureWrapper = document.createElement('div')
    var responseEl = document.createElement('span')
    var pictureEl = document.createElement('img')
    responseEl.innerText = JSON.stringify(response)
    pictureEl.src = response.message
    pictureEl.style.display = 'block'

    pictureWrapper.appendChild(responseEl)
    pictureWrapper.appendChild(pictureEl)

    showResult(pictureWrapper)
  })
}

function getPets () {
  showResult('Loading..')

  sendRequest({
    url: 'http://localhost:9000/pets',
    method: 'GET'
  }, function (err, response) {
    if (err) {
      return showResult(err.message)
    }

    showResult(JSON.stringify(response))
  })
}

function savePet () {
  var savePetForm = document.getElementById('save-pet-form')
  var nameEl = savePetForm.querySelector('[name=name]')
  var breedEl = savePetForm.querySelector('[name=breed]')
  var ageEl = savePetForm.querySelector('[name=age]')

  showResult('Loading..')

  sendRequest({
    url: 'http://localhost:9000/pets',
    method: 'POST',
    data: {
      name: nameEl.value,
      breed: breedEl.value,
      age: ageEl.value
    }
  }, function (err, response) {
    nameEl.value = ''
    breedEl.value = ''
    ageEl.value = ''

    if (err) {
      return showResult(err.message)
    }

    showResult(JSON.stringify(response))
  })
}

function sendRequest (options, cb) {
  var url = options.url
  var method = options.method
  var data = options.data
  var token = options.token

  var reqOptions = {
    method: method,
    dataType: 'json',
    success: function (data) {
      cb(null, data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      cb(new Error(
        'something was wrong in the request.. status:' +
        jqXHR.status +
        '.. [' + errorThrown + ']'
      ))
    }
  }

  if (token) {
    reqOptions.headers = {
      'Authorization': 'Bearer ' + token
    }
  }

  if (method !== 'GET') {
    reqOptions.contentType = 'application/json'
    reqOptions.data = JSON.stringify(data)
  }

  $.ajax(url, reqOptions)
}

function showResult (content) {
  clearResult()

  if (typeof content === 'string') {
    document.getElementById('result').innerText = content
  } else {
    document.getElementById('result').appendChild(content)
  }
}

function clearResult () {
  document.getElementById('result').innerHTML = ''
}

load()
