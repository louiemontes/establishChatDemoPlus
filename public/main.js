var sceneEl;

AFRAME.registerComponent('school-playground', {
  init: function () {
    console.log('initializing aframe');
    // Solution for Creating Entities.
    sceneEl = document.querySelector('a-scene');
    console.log('heres our scene', sceneEl);

  }
});

$(function() {
  setTimeout(function() {
    console.log('registering')
  }, 5000)

  // var animationTypes = ['scale', 'rotation', 'position'];
  var animationTypes = ['rotation', 'position'];

  function addBox2(text) {
    console.log('HELLOW IM ADDDING A BOX 2', text);
    var boxEl = document.createElement(text);
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    boxEl.setAttribute('material', {color: '#EF2D5E'});
    boxEl.setAttribute('position', {x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10});
    boxEl.setAttribute('scale', {x: Math.random() / 2, y: Math.random() / 2, z: Math.random() / 2});
    boxEl.setAttribute('color', `rgb(${r},${g},${b})`);
    sceneEl.appendChild(boxEl);
//          var anim = document.createElement('a-animation');
//           anim.setAttribute('attribute', animationTypes[Math.floor(Math.random() * 3)]) ;
//           anim.setAttribute('to', '5 5 5');
//           anim.setAttribute('repeat', 'indefinite');
//          anim.setAttribute('dur', '5000');
//     boxEl.appendChild(anim);
//     var anim2 = document.createElement('a-animation');
//           anim2.setAttribute('attribute', 'color') ;
//           anim2.setAttribute('to', 'white');
//           anim2.setAttribute('repeat', 'indefinite');
//          anim2.setAttribute('dur', '5000');
//         boxEl.appendChild(anim2);
  }

  function addBox() {
    console.log('HELLOW IM ADDDING A BOX 1');
    var boxEl = document.createElement(['a-box','a-cylinder'][Math.floor(Math.random() * 2)]);
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var r2 = Math.floor(Math.random() * 255);
    var g2 = Math.floor(Math.random() * 255);
    var b2 = Math.floor(Math.random() * 255);

    boxEl.setAttribute('material', {color: '#EF2D5E'});
    boxEl.setAttribute('position', {x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10});
    boxEl.setAttribute('scale', {x: Math.random() / 2, y: Math.random() / 2, z: Math.random() / 2});
    boxEl.setAttribute('color', `rgb(${r},${g},${b})`);

    sceneEl.appendChild(boxEl);

    var anim = document.createElement('a-animation');
    anim.setAttribute('attribute', animationTypes[Math.floor(Math.random() * 3)]) ;
    anim.setAttribute('to', '5 5 50');
    anim.setAttribute('repeat', 'indefinite');
    anim.setAttribute('dur', '5000');
    boxEl.appendChild(anim);
    var anim2 = document.createElement('a-animation');
    anim2.setAttribute('attribute', 'color') ;
    anim2.setAttribute('from',`rgb(${r},${g},${b})`);
    anim2.setAttribute('to', `rgb(${r2},${g2},${b2})`);
    anim2.setAttribute('repeat', 'indefinite');
    anim2.setAttribute('dur', '5000');
    boxEl.appendChild(anim2);
  }

  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    if(data.message.indexOf('a-') == 0){
      addBox2(data.message);
    }
    else{
      addBox();
    }
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });
});
