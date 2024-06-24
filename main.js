function calculateSubnetMask() {
    const ip = document.getElementById('ip').value;
    const prefix = parseInt(document.getElementById('prefix').value);
    const resultDiv = document.getElementById('result');
    const ups = document.getElementById('saltos');
    const mascara = document.getElementById('mascara');
    const table = document.getElementById('tabela');

    if (!validateIP(ip)) {
        mascara.innerHTML = '<p class="erro">⚠️Endereço IP inválido.</p>';
        document.getElementById('result').innerHTML = '';
        document.getElementById('numSaltos').innerHTML = '';
        document.getElementById('saltos').innerHTML = '';
        document.getElementById('tabela').innerHTML = '';
        document.querySelector('.positivo').innerHTML = '';
        document.querySelector('.negativo').innerHTML = '';
    }
    else if (isNaN(prefix) || prefix < 25 || prefix > 32) {
        mascara.innerHTML = '<p class="erro">Prefixo inválido. Tente colocar um número no intervalo de 25-32 sem caracteres.</p>';
        document.getElementById('result').innerHTML = '';
        document.getElementById('numSaltos').innerHTML = '';
        document.getElementById('saltos').innerHTML = '';
        document.getElementById('tabela').innerHTML = '';
        document.querySelector('.positivo').innerHTML = '';
        document.querySelector('.negativo').innerHTML = '';
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

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

window.addEventListener("offline", (event) => {
    const estado = document.getElementById('status');
    const card = document.querySelector('.wrapper');
    card.style.display = 'none';
    const paragrafo = document.querySelector('#status p');
    const statusText = document.getElementById('text');
    
    console.log("Sem Internet");
    statusText.innerHTML = 'Você está sem internet❌📶';    
    console.log(event);

    estado.style.overflow = 'auto';
    estado.style.width = '400px';
    estado.style.padding = '2rem 2.5rem';
    estado.style.border = 'none';
    estado.style.outline = 'none';
    estado.style.borderRadius = '0.25rem';
    estado.style.color = 'var(--color-black)';
    estado.style.background ='var(--color-white)';
    estado.style.boxShadow = '0px 0px 20px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    estado.style.transition = 'background-color 0.3s', color = '0.3s';
    estado.style.position = 'absolute';
    estado.style.top = '50%';
    estado.style.left = '50%';
    estado.style.transform = 'translate(-50%, -50%)';

    paragrafo.style.textAlign = 'center';
    paragrafo.style.fontSize = '20px';
})
