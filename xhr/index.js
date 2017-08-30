'use strict'

function bindButtons() {
  document.getElementById('get-breeds').addEventListener('click', showBreeds)
  document.getElementById('get-random-dog').addEventListener('click', showRandomPicture)
  document.getElementById('get-my-pets').addEventListener('click', getPets)
  document.getElementById('save-pet').addEventListener('click', savePet)
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
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(null, JSON.parse(xhr.responseText))
    } else if (xhr.readyState === 4) {
      cb(new Error('something was wrong in the request.. status:' + xhr.status), null)
    }
  }

  xhr.open(method, url, true)

  if (method !== 'GET') {
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  } else {
    xhr.send()
  }
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

bindButtons()
