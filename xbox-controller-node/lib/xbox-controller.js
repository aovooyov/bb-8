var HID = require('node-hid'),
  util = require('util'),
  events = require('events'),
  chalk = require('chalk'),
  config = require('./config'),
  Stick = require('./stick'),
  os = require('os').platform(),
  buttons;

function XboxController(opts){
  this.HIDController = null;
  this.HIDProduct = (opts && opts.product) || 'controller';
  this.HIDConfig = (opts && opts.config) || {};
  this.lastButtonPressed = null;

  var getController = function() {

    if(os == 'linux'){
      var LinuxConnector = require('./linux-connector');

      this.HIDController = new LinuxConnector({
        controller: this
      });
    }else{
      HID.devices().forEach(function(d){
        var product = (typeof d === 'object' && d.product) || '';
        console.log(this.HIDProduct);

        if(product.toLowerCase().indexOf(this.HIDProduct.toLowerCase()) !== -1){
          
          console.log('device', d);
          this.HIDController = new HID.HID(d.path);
          console.log(chalk.green('[XBOX] '), 'Xbox controller connected');
        }
      }.bind(this));
      
      if(!this.HIDController){
        console.log(chalk.red('[XBOX] '), 'Xbox controller not found');
      }else{
        this.leftStick = new Stick({
          controller: this
        });
        this.rightStick = new Stick({
          reference: 'rightStick',
          controller: this
        });
        this.leftTrigger = new Stick({
          reference: 'leftTrigger',
          controller: this
        });
        this.rightTrigger = new Stick({
          reference: 'rightTrigger',
          controller: this
        });

        interpretControllerData();
      }
    }
  }.bind(this);

  var interpretControllerData = function() {
    this.HIDController.on('data', function (data) {
      
      console.log('data', data);
      this.controlButton = data[14];
      this.directionalButton = data[13];
      // if(data.number == 0 || data.number == 1) this.leftStick.fireStickEvents(data);
      // if(data.number == 2) this.leftTrigger.fireStickEvents(data);
      // if(data.number == 3 || data.number == 4) this.rightStick.fireStickEvents(data);
      // if(data.number == 5) this.rightTrigger.fireStickEvents(data);
      // if(data.number == 6 || data.number == 7) this.cross.fireStickEvents(data);

      this.leftStick.fireStickEvents(data);
      this.rightStick.fireStickEvents(data);
      this.leftTrigger.fireStickEvents(data);
      this.rightTrigger.fireStickEvents(data);

      _fireButtonEvents(this.directionalButton, this.controlButton);
    }.bind(this));
  }.bind(this);

  var _fireButtonEvents = function(directionalButton, controlButton) {
    emitButton(directionalButton, 'DIRECTIONAL');
    emitButton(controlButton);
  }.bind(this);

  var emitButton = function(data, typeButton) {
    var buttonRange;

    if(!buttons){
      buttons = require('../controllerConfiguration/buttons.json');
    }

    if(typeButton == 'DIRECTIONAL'){
      buttonRange = buttons.directionalButtons;
    }else {
      buttonRange = buttons.controlButtons;
    }

    if (this.lastButtonPressed && (buttonRange[this.lastButtonPressed] && data != buttonRange[this.lastButtonPressed])) {
      this.emit(this.lastButtonPressed + ':release');

      this.lastButtonPressed = null;
    }

    for(var btn in buttonRange){

      if(data == buttonRange[btn]){
        this.lastButtonPressed = btn;

        this.emit(btn);
      }else{
        this.emit(btn + ':none');
      }
    }
  }.bind(this);

  getController();
}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.configure = function () {
  if(this.HIDController){

    if (os == 'linux') {
      console.log(chalk.cyan.bold('Relax dude you\'re using linux you don\'t need configure nothing XD'));
    }else {
      config.start(this);
    }
  }
};

XboxController.prototype.CreateController = function (HIDInfo) {
  if(!this.HIDController){
    if(!HIDInfo || !HIDInfo.product){
      console.log(chalk.yellow('Warn:'), '"HIDInfo.product" not found. Assuming pattern "controller"');
    }

    if(!HIDInfo || !HIDInfo.config){
      console.log(chalk.yellow('Warn:'), '"HIDInfo.config" not found. Assuming patterns "{controlBtnsBlock : 10, directionalBtnsBlock: 11}"');
    }

    return new XboxController(HIDInfo);
  }else{
    console.log(chalk.yellow("Warn:"), "Xbox controller is already connected");
  }
};

XboxController.prototype.listHIDDevices = function () {
  console.log(HID.devices());
};

module.exports = new XboxController();
