const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
let villagerList = [];
const link = "https://animalcrossing.fandom.com/wiki/Villager_list_(New_Horizons)";

// write all villager names to a json file - more villager data may be added in the future
request(link, (err, res, body) => {
	if (err) {
		return message.channel.send(`There was an error getting info on ${villagerName}!`);
	}
	const $ = cheerio.load(body);

	$('b').each(function (i, elem) {
		villagerList[i] = $(this).text();
	});

	villagerList.shift(); // remove nonvillager name
	
	fs.writeFile("villagers.json", JSON.stringify(villagerList), function(err) {
	    if (err) {
	        console.log(err);
	    }
	});
});