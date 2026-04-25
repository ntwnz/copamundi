# #copamundi ⚽

Um simulador de torneios de futebol que processa os grupos da api e simula fase de grupos e o chaveamento eliminatório (mata-mata) de uma Copa do Mundo.

## 🧠 O Algoritmo

### 1. Processamento da Fase de Grupos
O algoritmo itera sobre os arrays de cada grupo, simulando os confrontos e atualizando o estado de cada seleção em tempo real:
* **Cálculo de Pontuação**: Atribuição automática de 3 pontos por vitória e 1 por empate.
* **Critérios de Desempate**:prioriza Pontos, seguido de Saldo de Gols.

### 2. Automação do Chaveamento
Após a conclusão da fase de grupos, o sistema identifica os dois primeiros colocados de cada grupo e gera automaticamente os confrontos das oitavas de final.

### 3. Lógica Eliminatória
Diferente da fase de grupos, o algoritmo de mata-mata ignora empates e realiza penaltis, exigindo um vencedor para a progressão até a grande final.

## 🚀 Como Executar

Para rodar o projeto localmente, basta acessar o github pages
<br>
<a href='https://ntwnz.github.io/copamundi/'>link</a>
