function getRestoList() {
    const fs = require('fs');
    try {
        // Read the JSON file
        let rawdata = fs.readFileSync('./initialdata.json');
        // Parse the JSON data
        let restos = JSON.parse(rawdata);
        return restos;
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return []; // Return an empty array or handle the error as appropriate
    }
}

module.exports.getRestoList = getRestoList;