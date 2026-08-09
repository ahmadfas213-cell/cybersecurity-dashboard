const clock = document.getElementById("clock");

const securityScore = document.getElementById("securityScore");
const securityStatus = document.getElementById("securityStatus");
const scoreBar = document.getElementById("scoreBar");
const scoreRing = document.getElementById("scoreRing");

const threatCount = document.getElementById("threatCount");
const criticalCount = document.getElementById("criticalCount");
const highCount = document.getElementById("highCount");
const mediumCount = document.getElementById("mediumCount");
const lowCount = document.getElementById("lowCount");

const requestCount = document.getElementById("requestCount");
const blockedCount = document.getElementById("blockedCount");
const connectionCount = document.getElementById("connectionCount");

const inbound = document.getElementById("inbound");
const outbound = document.getElementById("outbound");
const latency = document.getElementById("latency");

const threatList = document.getElementById("threatList");
const logs = document.getElementById("logs");

const simulateThreat = document.getElementById("simulateThreat");
const clearLogs = document.getElementById("clearLogs");

let requests = 12842;
let blocked = 347;
let connections = 28;

let threats = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 8
};

const threatTypes = [
    {
        title: "Suspicious Login Attempt",
        description: "Multiple failed authentication requests",
        severity: "high"
    },
    {
        title: "Unusual API Traffic",
        description: "Request frequency exceeded baseline",
        severity: "medium"
    },
    {
        title: "Port Scan Pattern",
        description: "Multiple connection attempts detected",
        severity: "medium"
    },
    {
        title: "Brute Force Pattern",
        description: "Repeated authentication failures detected",
        severity: "high"
    },
    {
        title: "Abnormal Request",
        description: "Request behavior differs from baseline",
        severity: "medium"
    },
    {
        title: "Suspicious Payload",
        description: "Potentially malicious request pattern",
        severity: "high"
    }
];

const ips = [
    "185.220.101.42",
    "45.142.212.77",
    "172.16.24.18",
    "91.240.118.32",
    "103.84.239.17"
];

function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString(
        "id-ID",
        {
            hour12: false
        }
    );
}

setInterval(updateClock, 1000);
updateClock();

function updateMetrics() {
    requests += Math.floor(Math.random() * 15) + 3;

    if (Math.random() > 0.7) {
        blocked += 1;
    }

    connections =
        Math.max(
            12,
            Math.min(
                50,
                connections + Math.floor(Math.random() * 5) - 2
            )
        );

    requestCount.textContent =
        requests.toLocaleString("id-ID");

    blockedCount.textContent =
        blocked.toLocaleString("id-ID");

    connectionCount.textContent =
        connections;
}

setInterval(updateMetrics, 2500);

function updateTraffic() {
    const inValue =
        (Math.random() * 4 + 2).toFixed(2);

    const outValue =
        (Math.random() * 2.5 + 1).toFixed(2);

    const latencyValue =
        Math.floor(Math.random() * 18) + 18;

    inbound.textContent =
        `${inValue} MB/s`;

    outbound.textContent =
        `${outValue} MB/s`;

    latency.textContent =
        `${latencyValue} ms`;
}

setInterval(updateTraffic, 2000);

function updateScore() {
    const totalThreats =
        threats.critical * 5 +
        threats.high * 3 +
        threats.medium * 1;

    let score =
        Math.max(
            35,
            Math.min(
                100,
                92 - totalThreats
            )
        );

    securityScore.textContent = score;

    scoreBar.style.width =
        `${score}%`;

    scoreRing.style.background =
        `radial-gradient(
            circle at center,
            #090b0c 58%,
            transparent 59%
        ),
        conic-gradient(
            #35d98b 0 ${score}%,
            #17201c ${score}% 100%
        )`;

    if (score >= 80) {
        securityStatus.textContent = "GOOD";
        securityStatus.style.color = "#35d98b";
    } else if (score >= 60) {
        securityStatus.textContent = "WARNING";
        securityStatus.style.color = "#d5a449";
    } else {
        securityStatus.textContent = "CRITICAL";
        securityStatus.style.color = "#f05c5c";
    }
}

function updateThreatStats() {
    criticalCount.textContent =
        threats.critical;

    highCount.textContent =
        threats.high;

    mediumCount.textContent =
        threats.medium;

    lowCount.textContent =
        threats.low;

    const activeThreats =
        threats.critical +
        threats.high +
        threats.medium;

    threatCount.textContent =
        activeThreats;

    const badge =
        document.getElementById("threatBadge");

    if (threats.critical > 0) {
        badge.textContent = "CRITICAL";
        badge.className = "badge";
        badge.style.color = "#f05c5c";
    } else if (threats.high >= 3) {
        badge.textContent = "HIGH";
        badge.className = "badge";
        badge.style.color = "#d5a449";
    } else {
        badge.textContent = "LOW";
        badge.className = "badge low";
        badge.style.color = "";
    }

    updateScore();
}

function randomIP() {
    return ips[
        Math.floor(
            Math.random() * ips.length
        )
    ];
}

function getTime() {
    return new Date().toLocaleTimeString(
        "id-ID",
        {
            hour12: false
        }
    );
}

function addThreat() {
    const data =
        threatTypes[
            Math.floor(
                Math.random() *
                threatTypes.length
            )
        ];

    const ip = randomIP();

    threats[data.severity]++;

    const item =
        document.createElement("div");

    item.className = "threat-item";

    const severityText =
        data.severity.toUpperCase();

    item.innerHTML = `
        <div class="severity ${data.severity}"></div>

        <div class="threat-main">
            <strong>${escapeHTML(data.title)}</strong>
            <span>${escapeHTML(data.description)}</span>
        </div>

        <div class="threat-source">
            <code>${escapeHTML(ip)}</code>
            <small>just now</small>
        </div>

        <span class="severity-label ${data.severity}-text">
            ${severityText}
        </span>
    `;

    threatList.prepend(item);

    if (threatList.children.length > 6) {
        threatList.lastElementChild.remove();
    }

    addLog(
        "ALERT",
        `Threat detected from ${ip}`,
        "danger"
    );

    updateThreatStats();
}

simulateThreat.addEventListener(
    "click",
    addThreat
);

function addLog(type, message, className) {
    const log =
        document.createElement("div");

    log.className = "log";

    log.innerHTML = `
        <span class="log-time">
            ${getTime()}
        </span>

        <span class="log-type ${className}">
            ${type}
        </span>

        <span>
            ${escapeHTML(message)}
        </span>
    `;

    logs.prepend(log);

    if (logs.children.length > 12) {
        logs.lastElementChild.remove();
    }
}

clearLogs.addEventListener(
    "click",
    function () {
        logs.innerHTML = "";

        addLog(
            "INFO",
            "Activity log cleared",
            "success"
        );
    }
);

setInterval(
    function () {
        if (Math.random() > 0.55) {
            addLog(
                "INFO",
                "Firewall rules synchronized",
                "success"
            );
        }
    },
    7000
);

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

updateThreatStats();