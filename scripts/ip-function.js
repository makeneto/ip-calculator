// Validação de IP
function validateIP(ip) {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
}

// Configuração de Máscara de Sub-rede
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

// Gerador da tabela de Redes, hosts e broadcasts possíveis
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

// Cálculo de endereço IP
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

// Mudar o tema
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Copyright-Year
function year() {
    const currentYear = new Date()
    const year = currentYear.getFullYear()

    const copyright = document.createElement('p')
    copyright.textContent = `© ${year} makeneDev, Inc.`
    copyright.className = 'copyright'
    document.querySelector('#copyright').appendChild(copyright)
}
year() 
