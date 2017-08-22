'use strict'

function bindButtons() {
  document.getElementById('get-breeds').addEventListener('click', showBreeds)
  document.getElementById('get-random-dog').addEventListener('click', showRandomPicture)
}

function showBreeds () {
  showResult('Loading..')

  sendRequest({
    url: 'https://dog.ceo/api/breeds/list/all'
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
    url: 'https://dog.ceo/api/breeds/image/random'
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

function sendRequest (options, cb) {
  var url = options.url
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(null, JSON.parse(xhr.responseText))
    } else if (xhr.readyState === 4) {
      cb(new Error('something was wrong in the request.. status:' + xhr.status), null)
    }
  }

  xhr.open('GET', url, true)
  xhr.send()
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
