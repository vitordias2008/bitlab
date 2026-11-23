
var jogador = {
    xp: 0,
    palavrasCertas: 0,
    melhorCruzadinha: 0,
    cruzadinhasConcluidas: 0,
    partidasTermo: 0,
    vitoriasTermo: 0,
    derrotasTermo: 0,
    conferencias: 0,
    historicoConferencias: []
};

var listaPalavras = [
    { numero: 1, palavra: 'REGISTRADORES', pista: 'Pequenos espaços internos do processador que guardam valores por pouco tempo.', linha: 0, coluna: 6, direcao: 'V' },
    { numero: 2, palavra: 'MEMORIADEMASSA', pista: 'Armazenamento duradouro de arquivos, comum em SSDs e discos rígidos.', linha: 1, coluna: 4, direcao: 'V' },
    { numero: 3, palavra: 'CACHE', pista: 'Memória muito rápida que reduz a espera por informações usadas com frequência.', linha: 2, coluna: 0, direcao: 'H' },
    { numero: 4, palavra: 'QUADCORE', pista: 'Modelo de processador que possui quatro núcleos de execução.', linha: 2, coluna: 10, direcao: 'H' },
    { numero: 5, palavra: 'ULA', pista: 'Parte do processador que realiza contas e comparações lógicas.', linha: 2, coluna: 11, direcao: 'V' },
    { numero: 6, palavra: 'CPU', pista: 'Principal componente responsável por executar as instruções dos programas.', linha: 2, coluna: 14, direcao: 'V' },
    { numero: 7, palavra: 'EEPROM', pista: 'Memória não volátil que pode ser apagada e regravada eletricamente em pequenas partes.', linha: 2, coluna: 17, direcao: 'V' },
    { numero: 8, palavra: 'DMA', pista: 'Método para transferir dados entre dispositivos e memória sem sobrecarregar o processador.', linha: 4, coluna: 9, direcao: 'H' },
    { numero: 9, palavra: 'UC', pista: 'Parte do processador que organiza a sequência de execução das instruções.', linha: 5, coluna: 8, direcao: 'V' },
    { numero: 10, palavra: 'DATABUS', pista: 'Conjunto de caminhos elétricos que transporta valores entre componentes.', linha: 5, coluna: 15, direcao: 'V' },
    { numero: 11, palavra: 'MICROCONTROLADOR', pista: 'Chip que reúne processamento, memória e periféricos para controlar aparelhos.', linha: 6, coluna: 3, direcao: 'H' },
    { numero: 12, palavra: 'DUALCORE', pista: 'Tipo de processador que trabalha com dois núcleos.', linha: 8, coluna: 6, direcao: 'H' },
    { numero: 13, palavra: 'FLASH', pista: 'Memória não volátil cujo conteúdo pode ser apagado e gravado em blocos.', linha: 8, coluna: 18, direcao: 'V' },
    { numero: 14, palavra: 'ROM', pista: 'Memória não volátil normalmente usada para guardar instruções fixas do sistema.', linha: 10, coluna: 6, direcao: 'H' },
    { numero: 15, palavra: 'ADDRESSBUS', pista: 'Caminho pelo qual são indicadas posições de memória a serem acessadas.', linha: 11, coluna: 9, direcao: 'H' },
    { numero: 16, palavra: 'RAM', pista: 'Memória temporária que perde os dados quando a energia é desligada.', linha: 11, coluna: 12, direcao: 'V' }
];

var totalLinhas = 15;
var totalColunas = 19;
var grade = [];
var numeros = [];
var respostas = [];
var pontuadas = [];
var completa = false;
var resultados = [];
var acertosAtuais = 0;

var palavrasTermo = ['CACHE', 'FLASH', 'MOUSE', 'PLACA', 'FONTE', 'DISCO', 'DADOS', 'CABOS', 'PORTA', 'VIDEO'];
var sorteada = '';
var tentativas = [];
var fimTermo = false;
var textoTermo = 'Você tem 6 tentativas.';
var grafico = null;

function carregarDados() {
    var salvo = sessionStorage.getItem('bitlab_jogador');
    if (salvo != null) jogador = JSON.parse(salvo);
}

function salvarDados() {
    sessionStorage.setItem('bitlab_jogador', JSON.stringify(jogador));
}

function salvarPartida() {
    var partida = {
        respostas: respostas,
        palavrasPontuadas: pontuadas,
        cruzadinhaPontuada: completa,
        resultados: resultados,
        ultimoAcertos: acertosAtuais,
        respostaTermo: sorteada,
        historicoTermo: tentativas,
        terminouTermo: fimTermo,
        mensagemTermo: textoTermo
    };
    sessionStorage.setItem('bitlab_partida', JSON.stringify(partida));
}

function montarGrade() {
    for (var linha = 0; linha < totalLinhas; linha++) {
        grade[linha] = [];
        numeros[linha] = [];
        for (var coluna = 0; coluna < totalColunas; coluna++) {
            grade[linha][coluna] = '';
            numeros[linha][coluna] = '';
        }
    }

    for (var i = 0; i < listaPalavras.length; i++) {
        var palavra = listaPalavras[i];
        numeros[palavra.linha][palavra.coluna] = palavra.numero;

        for (var j = 0; j < palavra.palavra.length; j++) {
            var linha = palavra.linha;
            var coluna = palavra.coluna;
            if (palavra.direcao == 'H') coluna += j;
            else linha += j;
            grade[linha][coluna] = palavra.palavra[j];
        }
    }
}

function limparCruzadinha() {
    respostas = [];
    pontuadas = [];
    completa = false;
    resultados = [];
    acertosAtuais = 0;

    for (var linha = 0; linha < totalLinhas; linha++) {
        respostas[linha] = [];
        for (var coluna = 0; coluna < totalColunas; coluna++) {
            respostas[linha][coluna] = '';
        }
    }
}

function abrirJogo() {
    montarGrade();
    var salvo = sessionStorage.getItem('bitlab_partida');

    if (salvo == null) limparCruzadinha();
    else {
        var partida = JSON.parse(salvo);
        respostas = partida.respostas;
        pontuadas = partida.palavrasPontuadas;
        completa = partida.cruzadinhaPontuada;
        resultados = partida.resultados;
        acertosAtuais = partida.ultimoAcertos;
        sorteada = partida.respostaTermo;
        tentativas = partida.historicoTermo;
        fimTermo = partida.terminouTermo;
        textoTermo = partida.mensagemTermo;

        if (respostas.length != totalLinhas) limparCruzadinha();
    }

    mostrarTabuleiro();
    mostrarPistas();
    mostrarPalavras();

    if (acertosAtuais == -1) contador.innerHTML = 'Respostas alteradas. Confira novamente.';
    else contador.innerHTML = 'Acertos: ' + acertosAtuais + ' de 16 palavras';

    if (sorteada == '') iniciarTermo();
    else mostrarTermo();
}

function iniciar() {
    limparCruzadinha();
    mostrarTabuleiro();
    mostrarPistas();
    contador.innerHTML = 'Acertos: 0 de 16 palavras';
    aviso.innerHTML = 'Preencha as casas e clique em Conferir respostas.';
    salvarPartida();
}

function mostrarTabuleiro() {
    var mensagem = '<table class="tabuleiro">';

    for (var linha = 0; linha < totalLinhas; linha++) {
        mensagem += '<tr>';

        for (var coluna = 0; coluna < totalColunas; coluna++) {
            if (grade[linha][coluna] == '') mensagem += '<td class="vazia"></td>';
            else {
                mensagem += '<td class="casa">';

                if (numeros[linha][coluna] != '') {
                    mensagem += '<span class="numero">' + numeros[linha][coluna] + '</span>';
                }

                mensagem += '<input class="letra" maxlength="1" value="' + respostas[linha][coluna] + '"';
                mensagem += ' aria-label="Linha ' + (linha + 1) + ', coluna ' + (coluna + 1) + '"';
                mensagem += ' oninput="digitar(this,' + linha + ',' + coluna + ')"></td>';
            }
        }
        mensagem += '</tr>';
    }

    tabuleiro.innerHTML = mensagem + '</table>';
}

function mostrarPistas() {
    var horizontaisTexto = '';
    var verticaisTexto = '';

    for (var i = 0; i < listaPalavras.length; i++) {
        var palavra = listaPalavras[i];
        var mensagem = '<p class="pista"><b>' + palavra.numero + '.</b> ' + palavra.pista;

        if (resultados[i] != undefined) mensagem += ' <span class="resultado">' + resultados[i] + '</span>';
        mensagem += '</p>';

        if (palavra.direcao == 'H') horizontaisTexto += mensagem;
        else verticaisTexto += mensagem;
    }

    horizontais.innerHTML = horizontaisTexto;
    verticais.innerHTML = verticaisTexto;
}

function digitar(campo, linha, coluna) {
    var letra = campo.value.toUpperCase();
    if (letra < 'A' || letra > 'Z') letra = '';

    campo.value = letra;
    respostas[linha][coluna] = letra;
    resultados = [];
    acertosAtuais = -1;

    mostrarPistas();
    contador.innerHTML = 'Respostas alteradas. Confira novamente.';
    aviso.innerHTML = 'Clique em Conferir respostas para verificar.';
    salvarPartida();
}

function sortearCasa() {
    var vazias = [];

    for (var linha = 0; linha < totalLinhas; linha++) {
        for (var coluna = 0; coluna < totalColunas; coluna++) {
            if (grade[linha][coluna] != '' && respostas[linha][coluna] == '') {
                vazias.push({ linha: linha, coluna: coluna });
            }
        }
    }

    if (vazias.length == 0) {
        aviso.innerHTML = 'Não há casas vazias para sortear.';
        return;
    }

    var numero = Math.floor(Math.random() * vazias.length);
    var casa = vazias[numero];

    respostas[casa.linha][casa.coluna] = grade[casa.linha][casa.coluna];
    resultados = [];
    acertosAtuais = -1;

    mostrarTabuleiro();
    mostrarPistas();
    contador.innerHTML = 'Respostas alteradas. Confira novamente.';
    aviso.innerHTML = 'Uma casa vazia foi sorteada e preenchida.';
    salvarPartida();
}

function conferir() {
    var acertos = 0;
    var novas = 0;
    var pontos = 0;

    for (var i = 0; i < listaPalavras.length; i++) {
        var palavra = listaPalavras[i];
        var certa = true;
        var incompleta = false;

        for (var j = 0; j < palavra.palavra.length; j++) {
            var linha = palavra.linha;
            var coluna = palavra.coluna;

            if (palavra.direcao == 'H') coluna += j;
            else linha += j;

            var letra = respostas[linha][coluna];
            if (letra == '') incompleta = true;
            if (letra != palavra.palavra[j]) certa = false;
        }

        if (certa) {
            acertos++;
            resultados[i] = '✓ Certa';

            if (pontuadas[i] != true) {
                pontuadas[i] = true;
                jogador.palavrasCertas++;
                novas++;
                pontos += 10;
            }
        } else if (incompleta) resultados[i] = '• Incompleta';
        else resultados[i] = '✗ Errada';
    }

    if (acertos > jogador.melhorCruzadinha) jogador.melhorCruzadinha = acertos;

    if (acertos == listaPalavras.length && completa == false) {
        completa = true;
        jogador.cruzadinhasConcluidas++;
        pontos += 40;
    }

    jogador.xp += pontos;
    jogador.conferencias++;
    jogador.historicoConferencias.push(acertos);

    if (jogador.historicoConferencias.length > 8) jogador.historicoConferencias.shift();

    acertosAtuais = acertos;
    mostrarPistas();
    contador.innerHTML = 'Acertos: ' + acertos + ' de ' + listaPalavras.length + ' palavras';

    if (acertos == listaPalavras.length) aviso.innerHTML = 'Cruzadinha completa! +' + pontos + ' XP.';
    else if (novas > 0) aviso.innerHTML = 'Você acertou ' + novas + ' nova(s) palavra(s). +' + pontos + ' XP.';
    else aviso.innerHTML = 'Continue tentando. Nenhum XP novo nesta conferência.';

    salvarDados();
    salvarPartida();
}

function iniciarTermo() {
    sorteada = palavrasTermo[Math.floor(Math.random() * palavrasTermo.length)];
    tentativas = [];
    fimTermo = false;
    textoTermo = 'Tentativas: 0 de 6.';
    mostrarTermo();
    salvarPartida();
}

function mostrarTermo() {
    var mensagem = '<table class="grade-termo">';

    for (var linha = 0; linha < 6; linha++) {
        mensagem += '<tr>';

        for (var coluna = 0; coluna < 5; coluna++) {
            var letra = '';
            var cor = '';

            if (tentativas[linha] != undefined) {
                letra = tentativas[linha].palavra[coluna];
                cor = tentativas[linha].cores[coluna];
            }

            mensagem += '<td class="quadrado-termo ' + cor + '">' + letra + '</td>';
        }
        mensagem += '</tr>';
    }

    termo.innerHTML = mensagem + '</table>';
    ipt_termo.value = '';
    ipt_termo.disabled = fimTermo;
    aviso_termo.innerHTML = textoTermo;
}

function tentarTermo() {
    if (fimTermo) return;

    var palavra = ipt_termo.value.toUpperCase().trim();

    if (palavra.length != 5) {
        aviso_termo.innerHTML = 'Digite exatamente 5 letras.';
        return;
    }

    for (var i = 0; i < 5; i++) {
        if (palavra[i] < 'A' || palavra[i] > 'Z') {
            aviso_termo.innerHTML = 'Use somente letras de A a Z.';
            return;
        }
    }

    var cores = [];
    var letras = sorteada.split('');

    for (var i = 0; i < 5; i++) {
        cores[i] = 'cinza';

        if (palavra[i] == sorteada[i]) {
            cores[i] = 'verde';
            letras[i] = '';
        }
    }

    for (var i = 0; i < 5; i++) {
        if (cores[i] != 'verde') {
            for (var j = 0; j < 5; j++) {
                if (palavra[i] == letras[j]) {
                    cores[i] = 'amarelo';
                    letras[j] = '';
                    break;
                }
            }
        }
    }

    tentativas.push({ palavra: palavra, cores: cores });

    if (palavra == sorteada || tentativas.length == 6) {
        fimTermo = true;
        jogador.partidasTermo++;

        if (palavra == sorteada) {
            jogador.vitoriasTermo++;
            jogador.xp += 50;
            textoTermo = 'Você acertou em ' + tentativas.length + ' tentativa(s)! +50 XP.';
        } else {
            jogador.derrotasTermo++;
            jogador.xp += 10;
            textoTermo = 'Fim! A palavra era ' + sorteada + '. +10 XP.';
        }
        salvarDados();
    } else textoTermo = 'Tentativas: ' + tentativas.length + ' de 6.';

    mostrarTermo();
    salvarPartida();
}

function mostrarPalavras() {
    var mensagem = '';

    for (var i = 0; i < listaPalavras.length; i++) {
        mensagem += '<span class="palavra-disponivel">' + listaPalavras[i].palavra + '</span>';
    }
    palavras.innerHTML = mensagem;

    mensagem = '';
    for (var i = 0; i < palavrasTermo.length; i++) {
        mensagem += '<span class="palavra-disponivel">' + palavrasTermo[i] + '</span>';
    }
    palavras_termo.innerHTML = mensagem;
}

function atualizarEstatisticas() {
    var nivel = Math.floor(jogador.xp / 100) + 1;
    var xpNivel = jogador.xp % 100;
    var niveis = ['Iniciante', 'Aprendiz', 'Técnico', 'Especialista', 'Mestre do Hardware'];
    var nome = 'Mestre do Hardware';

    if (nivel < 5) nome = niveis[nivel - 1];

    stat_nivel.innerHTML = 'Nível ' + nivel + ' · ' + nome;
    stat_xp.innerHTML = jogador.xp + ' XP';
    stat_falta_xp.innerHTML = 'Faltam ' + (100 - xpNivel) + ' XP para o nível ' + (nivel + 1);
    barra_xp.style.width = xpNivel + '%';
    stat_palavras_certas.innerHTML = jogador.palavrasCertas;
    stat_melhor_cruzadinha.innerHTML = jogador.melhorCruzadinha + '/16';
    stat_vitorias_termo.innerHTML = jogador.vitoriasTermo;
    stat_partidas_termo.innerHTML = jogador.partidasTermo + ' partidas concluídas';

    var taxa = 0;
    if (jogador.partidasTermo > 0) taxa = Math.round(jogador.vitoriasTermo * 100 / jogador.partidasTermo);
    stat_taxa_termo.innerHTML = taxa + '%';

    var meta = '';
    var atual = 0;
    var total = 0;

    if (jogador.melhorCruzadinha < 8) {
        meta = 'Acerte 8 palavras na mesma rodada';
        atual = jogador.melhorCruzadinha;
        total = 8;
    } else if (jogador.melhorCruzadinha < 16) {
        meta = 'Complete as 16 palavras da cruzadinha';
        atual = jogador.melhorCruzadinha;
        total = 16;
    } else if (jogador.vitoriasTermo < 3) {
        meta = 'Vença 3 partidas do Termo';
        atual = jogador.vitoriasTermo;
        total = 3;
    } else {
        meta = 'Alcance o nível ' + (nivel + 1);
        atual = xpNivel;
        total = 100;
    }

    stat_meta.innerHTML = meta;
    stat_meta_contador.innerHTML = atual + ' de ' + total;
    barra_meta.style.width = (atual * 100 / total) + '%';

    stat_resumo.innerHTML = 'Cruzadinhas completas: ' + jogador.cruzadinhasConcluidas + '<br>' +
        'Partidas do Termo: ' + jogador.partidasTermo + '<br>' +
        'Vitórias: ' + jogador.vitoriasTermo + ' · Derrotas: ' + jogador.derrotasTermo;
}

function mostrarGrafico() {
    if (typeof Chart == 'undefined') {
        aviso_grafico.innerHTML = 'Conecte-se à internet para carregar o gráfico.';
        return;
    }

    var nomes = [];
    var acertos = [];
    var inicio = jogador.conferencias - jogador.historicoConferencias.length;

    for (var i = 0; i < jogador.historicoConferencias.length; i++) {
        nomes.push('Conf. ' + (inicio + i + 1));
        acertos.push(jogador.historicoConferencias[i]);
    }

    if (acertos.length == 0) aviso_grafico.innerHTML = 'Clique em Conferir respostas para registrar um resultado.';
    else aviso_grafico.innerHTML = 'Últimas 8 conferências da cruzadinha.';

    if (grafico != null) grafico.destroy();

    grafico = new Chart(grafico_progresso, {
        type: 'line',
        data: {
            labels: nomes,
            datasets: [{ label: 'Palavras certas', data: acertos, borderColor: '#285c45', backgroundColor: '#d5e8dc', tension: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 16, ticks: { stepSize: 4 } } },
            plugins: { legend: { display: false } }
        }
    });
}

function zerarEstatisticas() {
    if (confirm('Apagar seu nível, XP e resultados salvos?')) {
        sessionStorage.removeItem('bitlab_jogador');
        sessionStorage.removeItem('bitlab_partida');

        jogador = {
            xp: 0,
            palavrasCertas: 0,
            melhorCruzadinha: 0,
            cruzadinhasConcluidas: 0,
            partidasTermo: 0,
            vitoriasTermo: 0,
            derrotasTermo: 0,
            conferencias: 0,
            historicoConferencias: []
        };

        salvarDados();
        atualizarEstatisticas();
        mostrarGrafico();
    }
}

carregarDados();

if (typeof tabuleiro != 'undefined') abrirJogo();

if (typeof stat_nivel != 'undefined') {
    atualizarEstatisticas();
    mostrarGrafico();
}
