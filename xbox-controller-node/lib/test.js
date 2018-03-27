var xbox = require('./xbox-controller')
let buttonTable = ['a', 'b', 'x', 'y', 'lb', 'rb', 'up', 'down', 'left', 'right', 'start', 'back', 'leftstickpress', 'rightstickpress']

// xbox.on('anyStickMove', function (data) {
//   // joypadStatus.sticks[data.ref].x = data.position.x !== undefined ? data.position.x : joypadStatus.sticks[data.ref].x;
//   // joypadStatus.sticks[data.ref].y = data.position.y !== undefined ? data.position.y : joypadStatus.sticks[data.ref].y;
//   console.log(data);
// });

var leftStick = { x: 0, y: 0 };
var rightStick = { x: 0, y: 0 };

var leftTrigger = { x: 0 };
var rightTrigger = { x: 0 };

xbox.on('leftstickMove', data => {

  if(leftStick.x == data.x && leftStick.y == data.y) {
    return;
  }

  leftStick = data;
  console.log('leftstickMove', leftStick);
});

xbox.on('rightstickMove', data => {
  if (rightStick.x == data.x && rightStick.y == data.y) {
    return;
  }

  rightStick = data;
  console.log('rightstickMove', rightStick);
});

xbox.on('lefttriggerMove', data => {
  if (leftTrigger.x == data.x) {
    return;
  }

  leftTrigger = data;
  console.log('lefttriggerMove', leftTrigger);
});

xbox.on('righttriggerMove', data => {
  if (rightTrigger.x == data.x) {
    return;
  }

  rightTrigger = data;
  console.log('righttriggerMove', rightTrigger);
});

buttonTable.forEach(function (button) {
  xbox.on(button, function () {
    //joypadStatus.buttons[button].status = 1
    console.log(button)
  });
  xbox.on(button + ':release', function () {
    //joypadStatus.buttons[button].status = 0
    console.log(button + ':release');
  });
  // xbox.on(button + ':none', function () {
  //   //joypadStatus.buttons[button].status = 0
  //   console.log(button + ':none');
  // });
})
