var copy = require('copy');

copy('noble/bindings.js', 'node_modules/noble/lib/mac', { flatten: true }, (err, files) => {
    console.log(err, files);
});

copy('noble/highsierra.js', 'node_modules/noble/lib/mac', { flatten: true }, (err, files) => {
    console.log(err, files);
});