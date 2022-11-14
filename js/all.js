const child = require("child_process");
const fs = require("fs");
const file = JSON.parse(fs.readFileSync("./tokens.json"));
let arg = "";
if (process.argv[3]) {
	arg = process.argv[3];
}
for (let x in file) {
	console.clear();
	console.log(x);
	try {
		child.execSync(`node ./js/${process.argv[2]}.js ${x} ${arg}`, { stdio: "inherit" });
	} catch (e) {}
}
