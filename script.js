  // URL da API que devolve a lista de países (ex.: [{code:'BRA', name:'Brasil', flag:'https://...'}])
  const API_URL = 'https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams'; // <‑‑ substitua pela sua API real
  let teams = [];
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

  //Função para pegar nome relacionado com o indice informado
  function getNome(indice) {
    if (indice < 0 || indice >= teams.length) {
      console.error(`Índice invalido: ${indice}`);
      return 'TIME INDEFINIDO';
    }
    return teams[indice].nome;
  }

  //Função para pegar o token relacionado com o índice (para usar no POST)
  function getToken(indice) {
    if (indice < 0 || indice >= teams.length) {
      console.error(`Índice invalido: ${indice}`);
      return null;
    }
    return teams[indice].token;
  }


  // Simulação da Copa
  async function runSimulation() {
    const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
        'git-user': 'ntwnz',
    }
});                             
    
    //recebendo resposta inicial da API
    teams = await response.json(); 
    console.log('times recebidos');
    console.table(teams); 
    
    //pegando indices de cada país
    let indices=Array.from({length: teams.length}, (_,i) => i);
    const indices_embaralho = getRandomElements(indices,indices.length)
    
    //setando letras dos grupos
    const grupos = {};
    const letras_grupos = 'ABCDEFGH'.split ('');
    letras_grupos.forEach(letter => {
      grupos[letter] = indices_embaralho.splice(0, 4);   // 4 times por grupo
    });


    const app = document.getElementById('app');
    app.innerHTML='<h2>Grupos da Copa</h2>'

    // Exibe grupos
    letras_grupos.forEach(letter => {
      const div = document.createElement('div');
      div.className = 'grupo';
      div.innerHTML = `<strong>Grupo ${letter}:</strong> ` +
        grupos[letter].map(idx => 
        `<span style="margin-right:8px;">${getNome(idx)}</span>`
      ).join('');
      app.appendChild(div);
    });

    
    
    
    function jogarRodada(teamIndices) {
      const vencedores = [];
      for (let i = 0; i < teamIndices.length; i += 2) {
      const idx1 = teamIndices[i];
      const idx2 = teamIndices[i + 1];
      vencedores.push(Math.random() < 0.5 ? idx1 : idx2); // 50% de chance
      }
      return vencedores;
    }



    
    // Função das Fases
    let indicesAvancando = [];
    letras_grupos.forEach(letter => {
      const [primeiro, segundo] = grupos[letter];
      indicesAvancando.push(primeiro,segundo);
    });

    const fases = ['Oitavas de Finais', 'Quartas de Final', 'Semifinal', 'Final']

    for(const fase of fases){
      indicesAvancando = jogarRodada(indicesAvancando);

      const faseDiv = document.createElement('div');
      faseDiv.className = 'grupo'
      faseDiv.innerHTML = `<strong>${fase}:</strong> ` +
      indicesAvancando.map(idx => 
        `<span style="margin-right:12px;">${getNome(idx)}</span>`
      ).join('');
    app.appendChild(faseDiv);

    await new Promise(r => setTimeout(r, 1500));
  }


  
    // Vencedor

    const finalista1Index = indicesAvancando[0];
    const finalista1Nome = getNome (finalista1Index);
    const finalista1Token = getToken (finalista1Index);

    const finalista2Index = indicesAvancando[1];
    const finalista2Nome = getNome (finalista2Index);
    const finalista2Token = getToken (finalista2Index);


    // 9. Simula o placar da final (gols normais)
    const golsA = Math.floor(Math.random() * 6);   // 0 a 3 gols
    const golsB = Math.floor(Math.random() * 6);

    let golsPenaltyA = 0;
    let golsPenaltyB = 0;
    let vencedorIndex;

    // 10. Decide quem ganhou (ou vai para pênaltis)
    if (golsA > golsB) {
      vencedorIndex = finalista1Index;
      } else if (golsB > golsA) {
      vencedorIndex = finalista2Index;
    } else {

      golsPenaltyA = Math.floor(Math.random() * 5) + 3;  // entre 3 e 7
      golsPenaltyB = Math.floor(Math.random() * 5) + 3;

      vencedorIndex = (golsPenaltyA > golsPenaltyB) ? finalistaA : finalistaB;
    }

    const vencedorNome = getNome(vencedorIndex);
    const vencedorToken = getToken(vencedorIndex);
    
    
    alert(`🏆 CAMPEÃO DA COPA: ${vencedorNome}!\n\nToken: ${vencedorToken}`);
    console.log('🔥 Token do campeão para o POST:', vencedorIndex, vencedorToken);

    const FINAL_URL = 'https://development-internship-api.geopostenergy.com/WorldCup/FinalResult';

    fetch(FINAL_URL, {
      method: 'POST',
      headers: {
          'git-user': 'ntwnz',
          'Content-Type': 'application/json',
        },
      body:  JSON.stringify(
        {
        'equipeA': finalista1Token,
        'equipeB': finalista2Token,
        'golsEquipeA': golsA,
        'golsEquipeB': golsB,
        'golsPenaltyTimeA': golsPenaltyA,
        'golsPenaltyTimeB': golsPenaltyB,
      })

    })

  }
  // Inicia a simulação ao carregar a página
  runSimulation().catch(err => {
    console.error(err);
    alert('Erro ao obter dados dos países. Verifique a API.');
  })