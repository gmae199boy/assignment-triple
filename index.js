const v4 = require("uuid").v4;
const parse = require("uuid").parse;
const stringify = require("uuid").stringify;
const id = v4();
const arr = [];
for (var i = 0; i < 100; ++i) {
	const id = v4();
	arr.push(id);
}
console.log(arr);
// console.log(id);
// console.log("------------------------------------------------");
// const parsing = parse(id);
// console.log(parsing);
// console.log("------------------------------------------------");
// console.log(Buffer.from(parsing));
// console.log("------------------------------------------------");
// const array = [...Buffer.from(parsing)];
// console.log(array);
// console.log("------------------------------------------------");

// console.log(stringify(array));
