document.addEventListener("DOMContentLoaded", async function () {
    let data = null;
    try {
        const response = await fetch("/api/analysis");
        const serverData = await response.json();
        if (serverData && serverData.total_revenue !== undefined) {
            data = serverData;
            localStorage.setItem("bizpilotAnalysis", JSON.stringify(serverData));
        } else {
            const stored = localStorage.getItem("bizpilotAnalysis");
            data = stored ? JSON.parse(stored) : null;
        }
    } catch (e) {
        const stored = localStorage.getItem("bizpilotAnalysis");
        data = stored ? JSON.parse(stored) : null;
        console.error(e);
    }

    if (!data) {
        const container = document.getElementById("insightsContainer");
        if (container) container.innerHTML = '<div class="ai-insight"><h3>No business data yet</h3><p>Upload a CSV to generate data-backed AI insights.</p></div>';
        return;
    }

    const revenue = document.getElementById("insightRevenue");
    if (revenue) revenue.textContent = "₹" + Number(data.total_revenue || 0).toLocaleString("en-IN");
    const container = document.getElementById("insightsContainer");
    if (!container) return;
    container.innerHTML = "";
    (data.insights || []).forEach(function (insight) {
        const card = document.createElement("div");
        card.className = "ai-insight";
        card.innerHTML = `<div class="ai-insight-header"><div class="ai-insight-icon"><i class="bi bi-lightbulb"></i></div><span class="badge-custom badge-warning">${insight.priority}</span></div><h3>${insight.title}</h3><p>${insight.description}</p><div class="recommendation"><strong>AI Recommendation</strong><span>${insight.recommendation}</span></div>`;
        container.appendChild(card);
    });
});
