function getUserList() {
    const fs = require('fs');
    try {
        // Read the JSON file
        let rawdata = fs.readFileSync('./UserData.json');
        // Parse the JSON data
        let users = JSON.parse(rawdata);
        return users;
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return []; // Return an empty array or handle the error as appropriate
    }
}

module.exports.getUserList = getUserList;