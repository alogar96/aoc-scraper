const axios = require("axios");
const cheerio = require("cheerio");

// Parse text and extract time from it
function parseTime(str) {
    let strArray = str.split(" ");
    return strArray[strArray.length-1];
}

// Scrape leaderboard and return time data
async function scrapeLeaderboard(url, day) {
    let t = {day: day, part1: "", part2: ""}
    try {
        const { data } = await axios.get(url);
        const d = cheerio.load(data);
        const items = d("main div .leaderboard-time");

        let p1 = items[199];
        t.part1 = parseTime(d(p1).text());
    
        let p2 = items[99];
        t.part2 = parseTime(d(p2).text());

    } 
    catch (err) {
        t.part1 = "no data";
        t.part2 = "no data";
    
    }

    return t;
}

// Get times for all days
async function getTimes(year) {
    let times = []
    for (let d = 1; d <= 25; d++) {
        let url = "https://adventofcode.com/"+year+"/leaderboard/day/"+d;  
        times.push(scrapeLeaderboard(url, d));
    }

    return Promise.all(times);
}


// Main program (arg1 = year, arg2 = partId)
// example call: node main.js 2023 2 
let year = 2023;
let part = "part1";

if (process.argv[2] != undefined)
    year = process.argv[2];

if (process.argv[3] != undefined)
    part = "part" + process.argv[3];

getTimes(year).then((times) => {
    times.sort((e1, e2) => {
        return new Date("1970-01-01T" + e1[part]) - new Date("1970-01-01T" + e2[part]);
    });
    times.forEach(time => {
        console.log("Day " + time.day + ": " + time[part])
    });
})