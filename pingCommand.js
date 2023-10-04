const { MessageEmbed } = require('discord.js');

module.exports = async function(message) {
    const pingEmbed = new MessageEmbed()
        .setTitle('Ping')
        .setDescription('Sprawdzanie...');

    const sentMessage = await message.channel.send({ embeds: [pingEmbed] });
    const latency = sentMessage.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(message.client.ws.ping);

    let color;
    let alertMessage;

    if (latency < 150) {
        color = 0x44fc03; // Zielony
        alertMessage = 'Wszystko działa płynnie!';
    } else if (latency < 300) {
        color = 0xffcc00; // Żółty
        alertMessage = 'Lekkie opóźnienie.';
    } else {
        color = 0xff0000; // Czerwony
        alertMessage = 'Duże opóźnienie!';
    }

    pingEmbed
        .setColor(color)
        .setDescription(alertMessage)
        .addField('Opóźnienie bota:', `${latency}ms`, true)
        .addField('Opóźnienie API:', `${apiLatency}ms`, true);

    sentMessage.edit({ embeds: [pingEmbed] });
}
