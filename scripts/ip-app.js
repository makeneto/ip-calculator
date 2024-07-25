// Mensagens de Erro e Impressão dos resultados
document.querySelector('.input-submit').addEventListener('click', () => {
    const ip = document.getElementById('ip').value;
    const prefix = parseInt(document.getElementById('prefix').value);
    const resultDiv = document.getElementById('result');
    const ups = document.getElementById('saltos');
    const mascara = document.getElementById('mascara');
    const table = document.getElementById('tabela');

    // Validação do IP para fazer os cálculos corretamente
    if (!validateIP(ip)) {
        mascara.innerHTML = '<p class="erro">⚠️Endereço IP inválido.</p>';
        document.getElementById('result').innerHTML = '';
        document.getElementById('numSaltos').innerHTML = '';
        document.getElementById('saltos').innerHTML = '';
        document.getElementById('tabela').innerHTML = '';
        document.querySelector('.positivo').innerHTML = '';
        document.querySelector('.negativo').innerHTML = '';
    }
    // Validação do prefixo para fazer os cálculos corretamente
    else if (isNaN(prefix) || prefix < 25 || prefix > 32) {
        mascara.innerHTML = '<p class="erro">Prefixo inválido. Tente colocar um número no intervalo de 25-32 sem caracteres.</p>';
        document.getElementById('result').innerHTML = '';
        document.getElementById('numSaltos').innerHTML = '';
        document.getElementById('saltos').innerHTML = '';
        document.getElementById('tabela').innerHTML = '';
        document.querySelector('.positivo').innerHTML = '';
        document.querySelector('.negativo').innerHTML = '';
    }

    // Processamento
    const subnetMask = getSubnetMask(prefix);
    const totalHosts = Math.pow(2, 32 - prefix);
    const { networkAddress, broadcastAddress, firstHost, lastHost } = calculateAddresses(ip, prefix);
    const tableContent = generateTable(ip, prefix);

    // Impressão dos resultados
    document.getElementById('mascara').innerHTML = 'Máscara de Sub-rede';
    resultDiv.innerHTML = `${subnetMask}`;
    document.getElementById('numSaltos').innerHTML = 'Número de Saltos';
    ups.innerHTML = `${totalHosts}`;
    table.innerHTML = `
            <table>
                    <tr>
                        <th>Rede</th>
                        <th>Host</th>
                        <th>Broadcast</th>
                    </tr>
                    ${tableContent}
                    <tr>
                        <td class="no-border">+</td>
                        <td class="no-border"></td>
                        <td class="no-border">-</td>
                    </tr>
            </table>`;
    document.querySelector('.positivo').innerHTML = '+';
    document.querySelector('.negativo').innerHTML = '-';
})

// Limpar Campos
document.querySelector('.input-reset').addEventListener('click', () => {
    document.getElementById('ip').value = '';
    document.getElementById('prefix').value = '';
    document.getElementById('mascara').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('numSaltos').innerHTML = '';
    document.getElementById('saltos').innerHTML = '';
    document.getElementById('tabela').innerHTML = '';
    document.querySelector('.positivo').innerHTML = '';
    document.querySelector('.negativo').innerHTML = '';
})

// Estado On / Offline
// Of
window.addEventListener("offline", (event) => {
    const estado = document.getElementById('card');
    const calculator = document.querySelector('.wrapper');
    calculator.style.display = 'none';

    console.log("Sem Internet");
    console.log(event);

    estado.style.display = 'block';
})

//On
window.addEventListener("online", (event) => {
    const estado = document.getElementById('card');
    const calculator = document.querySelector('.wrapper');
    calculator.style.display = 'block';

    console.log("Com Internet");
    console.log(event);

    estado.style.display = 'none';
})