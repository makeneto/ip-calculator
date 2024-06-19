function calculateSubnetMask() {
    const ip = document.getElementById('ip').value;
    const prefix = parseInt(document.getElementById('prefix').value);
    const resultDiv = document.getElementById('result');
    const ups = document.getElementById('saltos');
    const table = document.getElementById('tabela');

    if (!validateIP(ip) || isNaN(prefix) || prefix < 0 || prefix > 32) {
        resultDiv.innerHTML = 'Por favor, insira um endereço IP e prefixo válidos.';
        return;
    }

    const subnetMask = getSubnetMask(prefix);
    const totalHosts = Math.pow(2, 32 - prefix);
    const { networkAddress, broadcastAddress, firstHost, lastHost } = calculateAddresses(ip, prefix);
    const tableContent = generateTable(ip, prefix);

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
}

function clearFields() {
    document.getElementById('ip').value = '';
    document.getElementById('prefix').value = '';
    document.getElementById('mascara').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('numSaltos').innerHTML = '';
    document.getElementById('saltos').innerHTML = '';
    document.getElementById('tabela').innerHTML = '';
    document.querySelector('.positivo').innerHTML = '';
    document.querySelector('.negativo').innerHTML = '';
}

function validateIP(ip) {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
}

function getSubnetMask(prefix) {
    let mask = '';
    for (let i = 0; i < 4; i++) {
        const byte = (prefix > 8) ? 255 : 256 - Math.pow(2, 8 - prefix);
        mask += byte;
        if (i < 3) mask += '.';
        prefix -= 8;
        if (prefix < 0) prefix = 0;
    }
    return mask;
}

function generateTable(ip, prefix) {
    let tableContent = '';
    const numSubnets = 4;
    const subnetSize = Math.pow(2, 32 - prefix);
    const ipInt = ipToInt(ip.split('.').map(Number));

    for (let i = 0; i < numSubnets; i++) {
        const subnetInt = ipInt + (i * subnetSize);
        const { networkAddress, broadcastAddress, firstHost, lastHostOctet } = calculateAddresses(subnetInt, prefix);
        tableContent += `
            <tr>
                <td>${networkAddress}</td>
                <td>${firstHost} &rarr; ${lastHostOctet}</td>
                <td>${broadcastAddress}</td>
            </tr>
        `;
    }
    return tableContent;
}

function calculateAddresses(ipInt, prefix) {
    const mask = getSubnetMaskAsInt(prefix);
    const networkInt = ipInt & mask;
    const broadcastInt = networkInt | ~mask;

    const firstHostInt = networkInt + 1;
    const lastHostInt = broadcastInt - 1;

    return {
        networkAddress: intToIp(networkInt),
        broadcastAddress: intToIp(broadcastInt),
        firstHost: intToIp(firstHostInt),
        lastHostOctet: intToIp(lastHostInt).split('.').pop()
    };
}

function ipToInt(ipParts) {
    return ((ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]) >>> 0;
}

function intToIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

function getSubnetMaskAsInt(prefix) {
    return (-1 << (32 - prefix)) >>> 0;
}
