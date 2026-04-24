  // URL da API que devolve a lista de países (ex.: [{code:'BRA', name:'Brasil', flag:'https://...'}])
  const API_URL = 'https://example.com/api/paises'; // <‑‑ substitua pela sua API real

  // Função utilitária para escolher N elementos aleatoriamente de um array
  function getRandomElements(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  // Simulação da Copa
  async function runSimulation() {
    const response = await fetch(API_URL);
    const allCountries = await response.json(); // espera [{code, name, flag}]
    const groups = {};

    // Cria grupos A‑H (8 grupos, 4 países cada)
    const shuffled = getRandomElements(allCountries, allCountries.length);
    const groupLetters = 'ABCDEFGH'.split('');
    groupLetters.forEach(letter => {
      groups[letter] = shuffled.splice(0, 4);
    });

    const app = document.getElementById('app');
    app.innerHTML = '<h2>Grupos</h2>';

    // Exibe grupos
    groupLetters.forEach(letter => {
      const div = document.createElement('div');
      div.className = 'group';
      div.innerHTML = `<strong>Grupo ${letter}:</strong> ` +
        groups[letter].map(c => `<img src="${c.flag}" alt="${c.name}" class="flag">`).join('');
      app.appendChild(div);
    });

    // Função que avança as fases
    function playRound(teams) {
      const winners = [];
      for (let i = 0; i < teams.length; i += 2) {
        winners.push(teams[Math.floor(Math.random() * 2) + i]);
      }
      return winners;
    }

    // Monta lista de equipes que avançam a partir dos grupos (primeiro e segundo de cada grupo)
    let advancing = [];
    groupLetters.forEach(letter => {
      const [first, second] = groups[letter];
      advancing.push(first, second);
    });

    const phases = ['Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Final'];
    for (const phase of phases) {
      advancing = playRound(advancing);
      const phaseDiv = document.createElement('div');
      phaseDiv.className = 'group';
      phaseDiv.innerHTML = `<strong>${phase}:</strong> ` +
        advancing.map(c => `<img src="${c.flag}" alt="${c.name}" class="flag">`).join('');
      app.appendChild(phaseDiv);
      await new Promise(r => setTimeout(r, 1500)); // pausa curta para visualização
    }

    // Vencedor
    const champion = advancing[0];
    alert(`🏆 Campeão da Copa: ${champion.name}!`);
  }

  // Inicia a simulação ao carregar a página
  runSimulation().catch(err => {
    console.error(err);
    alert('Erro ao obter dados dos países. Verifique a API.');
  });