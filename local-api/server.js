'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressJwt = require('express-jwt');
var app = express();

var SESSION_SECRET = 'xxxxx'

var users = {
  'bjrmatos': {
    username: 'bjrmatos',
    name: 'Boris',
    lastname: 'Matos',
    nationality: 'Peruvian',
    password: '1234'
  }
}

var petRecords = []

var validateJwt = expressJwt({ secret: SESSION_SECRET });

app.use(bodyParser.json())
app.use(cors())

app.post('/pets', function (req, res) {
  var payload = req.body

  if (payload.name == null || payload.name === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Field "name" is required'
    })
  }

  if (payload.breed == null || payload.breed === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Field "breed" is required'
    })
  }

  if (payload.age == null || payload.age === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Field "age" is required'
    })
  }

  petRecords.push({
    name: payload.name,
    breed: payload.breed,
    age: payload.age
  })

  res.status(200).json({
    status: 'success',
    message: 'The pet ' + payload.name + ' was saved, have fun with your new pet!'
  })
})

// jsonp response
app.get('/pets', function (req, res) {
  res.status(200).jsonp(petRecords)
})

app.post('/login', function (req, res) {
  var username = req.body.username
  var password = req.body.password

  if (!users[username]) {
    return res.status(400).json({
      message: 'User does not exist or password is invalid'
    })
  }

  if (users[username].password !== password) {
    return res.status(400).json({
      message: 'User does not exist or password is invalid'
    })
  }

  var token = jwt.sign({
    username: username
  }, SESSION_SECRET);

  res.status(200).json({
    username: username,
    token: token
  })
})

app.get('/me', validateJwt, function (req, res) {
  var user = Object.assign({}, users[req.user.username])

  delete user.password

  res.status(200).json(user)
})

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      message: 'Not authenticated'
    });
  } else {
    res.status(500).json({
      message: 'Unexpected error in server, error not handled.. [' + err.message + ']'
    })
  }
})

var server = app.listen(9000, function () {
  console.log('SERVER LISTENING AT:', this.address().port)
})

server.on('error', function (err) {
  console.error('Error while trying to start the server:', err.message)
})
