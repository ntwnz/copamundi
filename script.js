  const API_URL = 'https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams'; // <‑‑ substitua pela sua API real

  let teams = [];
  
  // Função para escolher elementos do array e formar os grupos aleatoriamente
  function getRandomElements(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }

  //Função para pegar nome relacionado com o indice
  function getNome(indice) {
    if (indice < 0 || indice >= teams.length) {
      console.error(`Índice invalido: ${indice}`);
      return 'TIME INDEFINIDO';
    }
    return teams[indice]?.nome || 'Nome não encontrado';
  }

  //Função para pegar o token relacionado com o índice
  function getToken(indice) {
    if (indice === undefined || indice === null || indice < 0 || indice >= teams.length) {
      console.error(`Índice invalido: ${indice}`);
      return null;
    }
    return teams[indice]?.token || null;
  }


  //Toda a Simulação

  async function runSimulation() {

    //Pegando times da API
    const response = await fetch(API_URL, {
    method: 'GET',
    headers: { 'git-user': 'ntwnz' }
  });
  
  //Recebe os times no vetor teams e avisa no console
  teams = await response.json();
  console.log('times recebidos');
  console.table(teams);
  console.log(`✅ Total de seleções carregadas: ${teams.length}`);

  //cria um vetor de indices para melhor relacionar os times com nome e tokens
  let indices = Array.from({length: teams.length}, (_, i) => i)
  const indices_embaralho = getRandomElements(indices, indices.length);

  const grupos = {};
  const letras_grupos = 'ABCDEFGH'.split('');
  letras_grupos.forEach(letter => {
    grupos[letter] = indices_embaralho.splice(0, 4);
  });

  const app = document.getElementById('app');
  app.innerHTML = '<h2>Grupos da Copa</h2>';

 
 // Simulação de fase de grupos
  let classificados = [];

  for (const letter of letras_grupos) {
    const timesDoGrupo = grupos[letter] || [];

    if (timesDoGrupo.length !== 4) {
      console.error(`Grupo ${letter} não tem 4 times!`);
      continue;
    }

    //Cria uma tabela com os dados de cada time na fase de grupo
    let tabela = timesDoGrupo.map(idx => ({
      indice: idx,
      nome: getNome(idx),
      pontos: 0,
      golsFeitos: 0,
      golsSofridos: 0,
      saldo: 0
    }));

    console.log(`Grupo ${letter} - índices:`, timesDoGrupo);

    const divGrupo = document.createElement('div');
    divGrupo.className = 'grupo card';
    let htmlGrupo = `<strong>Grupo ${letter}</strong><br>Times: ${timesDoGrupo.map(idx => getNome(idx)).join(', ')}<br><br>`;

    // 3 rodadas
    for (let rodada = 1; rodada <= 3; rodada++) {
      htmlGrupo += `<strong>Rodada ${rodada}:</strong><br>`;
    
      let jogosRodada = [];
      if (rodada === 1) {
        jogosRodada = [[0, 1], [2, 3]];
      } else if (rodada === 2) {
        jogosRodada = [[0, 2], [1, 3]];
      } else {
        jogosRodada = [[0, 3], [1, 2]];
      }
      
      for (const [i,j] of jogosRodada) {
        const time1= tabela[i];
        const time2= tabela[j];

        const gols1 = Math.floor(Math.random()*7); //gera de 0 a 6 gols
        const gols2 = Math.floor(Math.random()*7);
      
        htmlGrupo += `${time1.nome} ${gols1} x ${gols2} ${time2.nome}<br>`;

        //receber os valores gerados nas variaveis
        time1.golsFeitos += gols1;
        time1.golsSofridos += gols2;
        time2.golsFeitos += gols2;
        time2.golsSofridos += gols1;

        if (gols1 > gols2) {
          time1.pontos += 3;
        } else if (gols2 > gols1) {
          time2.pontos += 3;
        } else {
          time1.pontos += 1
          time2.pontos += 1
        }
      }
      htmlGrupo += `<br>`;
    }

    //Conta de saldo de gols
    tabela.forEach(t => t.saldo = t.golsFeitos - t.golsSofridos);

    //Ordenar por pontos e desempatando por saldo
    tabela.sort((a,b) =>{
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      if (b.saldo !== a.saldo) return b.saldo - a.saldo;
      return Math.random() - 0.5; //sorteio se não puder desempatar
    });

    // Exibe classificação
    htmlGrupo += `<strong>Classificação Final Grupo ${letter}:</strong><br>`;
    tabela.forEach((t, pos) => {
      htmlGrupo += `${pos + 1}º ${t.nome} - ${t.pontos} pts (SG: ${t.saldo})<br>`;
    });
    
    divGrupo.innerHTML = htmlGrupo;
    app.appendChild(divGrupo);

    // Avançam os 2 primeiros
    classificados.push(tabela[0].indice, tabela[1].indice);
  }


  // ELIMINATÓRIAS

    function jogarRodada(teamIndices) {
    const vencedores = [];

    for (let i = 0; i < teamIndices.length; i += 2) {
      const idx1 = teamIndices[i];
      const idx2 = teamIndices[i + 1];

      // Proteção contra erro de quantidade ímpar de times
      if (idx2 === undefined) {
        vencedores.push(idx1);   // o último time avança automaticamente
        break;
      }

      let nome_e1 = getNome(idx1);
      let nome_e2 = getNome(idx2);

      let gols_e1 = Math.floor(Math.random() * 4);
      let gols_e2 = Math.floor(Math.random() * 4);
      let res_jogo = `${nome_e1} ${gols_e1} X ${gols_e2} ${nome_e2}`;
      let vencedor;

      if (gols_e1 > gols_e2) { //Se e1>e2, ele vence
        vencedor=idx1;
      } else if (gols_e2 > gols_e1){ //Se e2>e1, ele vence
        vencedor=idx2;
      } else{ //Se e1=e2, faz penaltis recebe em variáveis novas
        let p1,p2;
        do {
        p1 = Math.floor(Math.random() * 5) + 3;
        p2 = Math.floor(Math.random() * 5) + 3;
        if ((p1+p2)>5 && (p1-p2)>1) {//corrigidas as diferenças altas acima de 5 penaltis
          p1=p2+1;
        } else if ((p1+p2)>5 && (p2-p1)>1){
          p2=p1+1
        }
        } while (p1===p2);

        vencedor = p1 > p2 ? idx1 : idx2;
        res_jogo += ` <span style="color: #d97706;">(Pên: ${p1}x${p2})</span>`;
      }
      vencedores.push({ vencedor: vencedor, info: res_jogo});
    }
    return vencedores;
  }
  

  let indicesAvancando = [...classificados]; 
  const fases = ['Oitavas de Final', 'Quartas de Final', 'Semifinal'];

  for (const fase of fases) {
    const resultadosDaRodada = jogarRodada(indicesAvancando);
  
    const faseDiv = document.createElement('div');
    faseDiv.className = 'grupo card eliminatoria';
    faseDiv.innerHTML = `<strong>${fase}:</strong><br>`;
  
    // Exibe cada jogo daquela fase
    resultadosDaRodada.forEach(res => {
    faseDiv.innerHTML += `<div>${res.info}</div>`;
    });

    app.appendChild(faseDiv);

    indicesAvancando = resultadosDaRodada.map(res=> res.vencedor)
    await new Promise(r => setTimeout(r, 1500));
  }

  
  
  // APENAS A FINAL

  const finalistaA = indicesAvancando[0];
  const finalistaB = indicesAvancando[1];

  if (finalistaA === undefined || finalistaB === undefined) {
    console.error("Finalistas indefinidos!", indicesAvancando);
    alert("Erro ao gerar a final.");
    return;
  }

  const nomeA = getNome(finalistaA);
  const nomeB = getNome(finalistaB);
  const tokenA = getToken(finalistaA);
  const tokenB = getToken(finalistaB);

  // Simula placar da final
  if (Math.random() < 0.5) {//dei mais chance de penalti para ser mais legal
    var golsA = Math.random () < 0.5 ? 0 : 3;
    var golsB = golsA;
  } else{
    var golsA = Math.floor(Math.random() * 5);
    var golsB = Math.floor(Math.random() * 5);
  }
  let golsPenaltyA = 0;
  let golsPenaltyB = 0;
  let tevePenalti = false;
  let vencedorIndex;

  if (golsA > golsB) {
    vencedorIndex = finalistaA;
  } else if (golsB > golsA) {
    vencedorIndex = finalistaB;
  } else {
    // se for igual vai pro penalti
    tevePenalti = true;
    golsPenaltyA = Math.floor(Math.random() * 5) + 3;   // 3 a 7
    golsPenaltyB = Math.floor(Math.random() * 5) + 3;
    if ((golsPenaltyA+golsPenaltyB)>5 && (golsPenaltyA-golsPenaltyB)>1) {//corrigidas as diferenças altas acima de 5 penaltis
          golsPenaltyA=golsPenaltyB+1;
        } else if ((golsPenaltyA+golsPenaltyB)>5 && (golsPenaltyB-golsPenaltyA)>1){
          golsPenaltyB=golsPenaltyA+1
        }
    // Enquanto for igual, sorteia de novo
    while (golsPenaltyA === golsPenaltyB) {
      golsPenaltyA = Math.floor(Math.random() * 5) + 3;
      golsPenaltyB = Math.floor(Math.random() * 5) + 3;
    }
    vencedorIndex = golsPenaltyA > golsPenaltyB ? finalistaA : finalistaB;
  }

  const vencedorNome = getNome(vencedorIndex);
  const vencedorToken = getToken(vencedorIndex);

  
  // FINAL NO HTML
  const finalDiv = document.createElement('div');
  finalDiv.className = 'grupo';
  finalDiv.style.border = '3px solid gold';
  finalDiv.style.backgroundColor = '#fffbeb';
  finalDiv.style.padding = '18px';
  finalDiv.style.margin = '25px 0';
  finalDiv.style.borderRadius = '10px';
  finalDiv.style.fontSize = '17px';

  let htmlFinal = `<strong>🏆 FINAL:</strong><br><br>`;
  htmlFinal += `${nomeA} <strong>${golsA}</strong> × <strong>${golsB}</strong> ${nomeB}<br>`;

  // PENALTI NO HTML
  if (tevePenalti) {
    htmlFinal += `<br><strong style="color: #d97706;">PÊNALTIS:</strong> ${nomeA} ${golsPenaltyA} × ${golsPenaltyB} ${nomeB}<br>`;
  }

  htmlFinal += `<br><strong style="color: green; font-size: 20px;">CAMPEÃO: ${vencedorNome} 🏆</strong>`;

  finalDiv.innerHTML = htmlFinal;
  app.appendChild(finalDiv);

  // ALERT DE PENALTI
  const penaltyText = tevePenalti 
    ? `\n\nPÊNALTIS: ${nomeA} ${golsPenaltyA} × ${golsPenaltyB} ${nomeB}` 
    : '';

  
  
  //TESTE DO POST
  const FINAL_URL = 'https://development-internship-api.geopostenergy.com/WorldCup/FinalResult';
  const body = {
    equipeA: tokenA,
    equipeB: tokenB,
    golsEquipeA: golsA,
    golsEquipeB: golsB,
    golsPenaltyTimeA: golsPenaltyA,
    golsPenaltyTimeB: golsPenaltyB
  };

  console.log('POST Final:', body);
  }


  // A simulação agora é iniciada pelo botão "Iniciar Simulação"

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const resultsSection = document.getElementById('results');
  startBtn.addEventListener('click', () => {
    resultsSection.style.display = 'block';
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    runSimulation().catch(err => {
      console.error(err);
      alert('Erro ao iniciar simulação, vrf API');
    });
  });
});
  