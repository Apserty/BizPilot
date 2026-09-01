document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        const revenue = document.getElementById("totalRevenue");
        const orders = document.getElementById("totalOrders");
        const customers = document.getElementById("totalCustomers");
        const lowStock = document.getElementById("lowStock");
        const health = document.getElementById("healthScore");
        if (revenue) revenue.textContent = "₹" + Number(data.revenue || 0).toLocaleString("en-IN");
        if (orders) orders.textContent = Number(data.orders || 0).toLocaleString("en-IN");
        if (customers) customers.textContent = Number(data.customers || 0).toLocaleString("en-IN");
        if (lowStock) lowStock.textContent = Number(data.low_stock || 0).toLocaleString("en-IN");
        if (health) health.textContent = data.has_data ? data.health_score : "—";

        // Make the revenue chart data-backed when dated monthly data is available.
        const bars = document.querySelectorAll(".chart-bar");
        const labels = document.querySelectorAll(".chart-labels span");
        const monthly = (data.monthly_revenue || []).slice(-6);
        if (monthly.length && bars.length) {
            const max = Math.max(...monthly.map(x => Number(x.revenue) || 0), 1);
            monthly.forEach((item, i) => {
                const bar = bars[bars.length - monthly.length + i];
                if (bar) bar.style.height = Math.max(8, (Number(item.revenue) / max) * 92) + "%";
                const label = labels[labels.length - monthly.length + i];
                if (label) label.textContent = item.month;
            });
        }
    } catch (error) {
        console.error("Dashboard API error", error);
    }
});
