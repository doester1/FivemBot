const { Client, Intents, MessageEmbed } = require("discord.js");
const axios = require("axios");
const onlineCommand = require("./onlineCommand");
const banUser = require("./banCommand");
const pingCommand = require("./pingCommand");
const { exec } = require("child_process");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

exec("node app.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// ... reszta kodu ...

// Ustawienia serwera FiveM
const serverIp = "193.34.212.134"; // Zastąp prawdziwym IP serwera
const serverPort = "30126"; // Zastąp prawdziwym portem serwera

// Funkcja do aktualizacji statusu bota
async function updateBotStatus() {
  try {
    const response = await axios.get(
      `http://${serverIp}:${serverPort}/players.json`
    );
    const playerCount = response.data.length;
    client.user.setActivity(`${playerCount} Graczy na Serwerze`, {
      type: "WATCHING",
    });
  } catch (error) {
    console.error("Error updating bot status:", error);
  }
}

// Aktualizuj status bota co minutę
setInterval(updateBotStatus, 60000);

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "/online") {
    onlineCommand(message);
  }
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("/ban")) {
    banUser(message);
  }
});

client.on("messageCreate", (message) => {
  if (message.content.toLowerCase() === "/ping") {
    pingCommand(message);
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === "/changelogs") {
    console.log("Handler for /changelogs is called");
    try {
      console.log("About to call axios.get");
      const response = await axios.get('http://45.156.84.121:25567/changelogs', { timeout: 10000 }); // 10 sekund
      console.log("Response from axios:", response.data);
      const changelogs = response.data;

      const embed = new MessageEmbed()
        .setTitle("Changelogs")
        .setThumbnail(message.guild.iconURL())
        .setColor(0xff0000);

      changelogs.forEach((log) => {
        embed.addField(`${log.type}: ${log.content}`, `DEV: ${log.developer}`);
      });

      if (changelogs.length > 0) {
        const lastUpdate = changelogs[changelogs.length - 1].datetime;
        embed.setFooter(`Last Update: ${lastUpdate}`);
      }

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Axios error:", error);
      message.channel.send("Nie udało się pobrać changelogów." + error.message);
    }
  }
});

client.login(
  "ODg5MTAzMzkxOTExOTg1MTkz.G5rivq.KF2aZs7_RbfPRH_fTUBKYMceEFQbrCCWWoqbvQ"
);
