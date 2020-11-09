const gen = require('random-seed');

const rand = gen.create("unique seed");
console.log(rand.random()); // -> 0.6608899281692662
console.log(rand.intBetween(0, 10)); // -> 10
console.log(rand.floatBetween(0, 10)); // -> 0.8044230218003667
