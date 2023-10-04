const axios = require('axios');

async function banUser(message) {
    const args = message.content.split(' ');
    if (args.length < 2) {
        return message.reply('Proszę podać nazwę użytkownika do zbanowania.');
    }

    const username = args[1];
    try {
        await axios.post('http://193.34.212.134:65512/ban', { // Popraw adres URL
            username: username,
            reason: args.slice(2).join(' ') || 'Brak powodu'
        }, {
            headers: {
                'Authorization': 'Bearer YOUR_ACTUAL_TXADMIN_API_TOKEN' // Użyj rzeczywistego tokena API
            }
        });

        message.reply(`Użytkownik ${username} został zbanowany.`);
    } catch (error) {
        console.error('Error banning user:', error.response ? error.response.data : error.message);
        message.reply('Nie udało się zbanować użytkownika.');
    }
}

module.exports = banUser;
