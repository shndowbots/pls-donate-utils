const noblox = require("noblox.js");
const Bottleneck = require("bottleneck");
const fs = require("fs");
const file = JSON.parse(fs.readFileSync("./tokens.json"));
const limiter = new Bottleneck({
	minTime: 2000,
});
(async () => {
	let currentUser = await noblox.setCookie(file[process.argv[2]]);
	let userId = currentUser.UserID;
	let copy = process.argv[3];
	if (isNaN(copy)) {
		copy = await limiter.schedule(() => noblox.getIdFromUsername(copy));
	}
	let outfit = await limiter.schedule(() => noblox.getAvatar(copy));

	//Dumb noblox things throw errors for no reason...
	try {
		await limiter.schedule(() => noblox.setAvatarScales(outfit.scales.height, outfit.scales.width, outfit.scales.head, outfit.scales.depth, outfit.scales.proportion, outfit.scales.bodyType));
	} catch (e) {
		console.log("copied scaling");
	}
	try {
		await limiter.schedule(() => noblox.setPlayerAvatarType(outfit.playerAvatarType));
	} catch (e) {
		console.log("copied type");
	}
	try {
		await limiter.schedule(() => noblox.setAvatarBodyColors(outfit.bodyColors.headColorId, outfit.bodyColors.torsoColorId, outfit.bodyColors.rightArmColorId, outfit.bodyColors.leftArmColorId, outfit.bodyColors.rightLegColorId, outfit.bodyColors.leftLegColorId));
	} catch (e) {
		console.log("copied color");
	}
	await limiter.schedule(() => noblox.setWearingAssets([]));
	for (let x of outfit.assets) {
		try {
			if (!(await limiter.schedule(() => noblox.getOwnership(userId, x.id, "Asset")))) {
				await limiter.schedule(() => noblox.buy(x.id));
			}
			await limiter.schedule(() => noblox.wearAssetId(x.id));
			console.log(`wore ${x.name}`);
		} catch (e) {
			console.log(`failed to wear`);
		}
	}
})();
