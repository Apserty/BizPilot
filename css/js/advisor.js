document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("questionInput");
    const sendButton = document.getElementById("sendButton");
    const chatBody = document.getElementById("chatBody");

    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = "message " + (sender === "user" ? "user" : "ai");
        const content = document.createElement("div");
        content.className = "message-content";
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = text;
        const time = document.createElement("div");
        time.className = "message-time";
        time.textContent = "Just now";
        content.appendChild(bubble); content.appendChild(time); message.appendChild(content); chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendMessage() {
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, "user"); input.value = "";
        try {
            const response = await fetch("/api/advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
            const contentType = response.headers.get("content-type") || "";
            const result = contentType.includes("application/json")
                ? await response.json()
                : { error: await response.text() };
            if (!response.ok) throw new Error(result.error || "Advisor request failed");
            addMessage(result.answer, "ai");
        } catch (error) {
            addMessage("I could not reach the business analysis service. Please upload data and check that the Flask server is running.", "ai");
            console.error(error);
        }
    }

    if (sendButton) sendButton.addEventListener("click", sendMessage);
    if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
    document.querySelectorAll(".question-btn").forEach(button => button.addEventListener("click", () => { input.value = button.textContent.trim(); sendMessage(); }));
});
