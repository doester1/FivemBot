const { MessageEmbed } = require('discord.js');
const Gamedig = require('gamedig');

async function onlineCommand(message) {
  try {
    const state = await Gamedig.query({
      type: 'fivem',
      host: '193.34.212.134', // Podmień na IP swojego serwera
      port: 30126, // Podmień na port swojego serwera
      socketTimeout: 10000 // 10 sekund timeout
    });

    const embed = new MessageEmbed()
      .setTitle('Online Players')
      .setDescription(`Currently, there are ${state.players.length} players online.`)
      .setColor('#0099ff');

    if (state.players.length > 0) {
      embed.addField('Player Names', state.players.map(player => player.name).join(', '));
    }

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error querying FiveM server:', error);
    message.channel.send('Could not retrieve online players.');
  }
}

module.exports = onlineCommand;
