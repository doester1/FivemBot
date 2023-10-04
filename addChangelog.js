const axios = require('axios');

// Log, aby sprawdzić, czy skrypt jest uruchamiany
console.log('Uruchamianie skryptu addChangelog.js...');

// Przykładowy changelog, który chcesz dodać
const newChangelog = {
  title: 'Nowa Funkcja',
  content: 'Dodaliśmy nową funkcję XYZ!',
  date: new Date()
};

// URL Twojego serwera Express
const url = 'http://localhost:3000/changelogs';

// Wykonaj żądanie POST do serwera Express
axios.post(url, newChangelog)
  .then(response => {
    console.log('Changelog dodany pomyślnie!', response.data);
  })
  .catch(error => {
    console.error('Błąd podczas dodawania changelogu:', error.message);
    // Dodatkowe logi, jeśli serwer zwrócił odpowiedź
    if (error.response) {
      console.error('Odpowiedź serwera:', error.response.data);
    }
  });
