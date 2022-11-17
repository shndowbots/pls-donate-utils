const fs = require("fs");
const child = require("child_process");
const axios = require("axios").default;
const current = require("../package.json").version
console.log("Checking for updates")
async function downloadFiles(url, name) {
	await axios.get(url, { responseType: "stream" }).then(async function (response) {
		response.data.pipe(fs.createWriteStream(name));
	});
}
async function findFiles(url) {
	await axios.get(`https://api.github.com/repos/tzechco/pls-donate-utils/contents/${url}`).then(async function (response) {
		for (let x in response.data) {
			if (response.data[x].type == "file") {
				downloadFiles(response.data[x].download_url, response.data[x].path);
			} else if (response.data[x].type == "dir") {
				if (!fs.existsSync(response.data[x].path)) fs.mkdirSync(response.data[x].path);
				await findFiles(response.data[x].path);
			}
		}
	});
}
(async () => {
	await axios.get("https://api.github.com/repos/tzechco/pls-donate-utils/releases/latest").then(async function (response) {
        if (response.data.name !== current) {
            console.log(`Updating...\n${current} -> ${response.data.name}`);
			if (fs.existsSync("node_modules")) fs.rmSync("node_modules", { recursive: true });
            await findFiles("");
            child.execSync("npm i", { stdio: "inherit" });
		}
	});
})();
