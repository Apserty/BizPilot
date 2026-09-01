document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("csvFile");
    const uploadArea = document.getElementById("uploadArea");
    const fileInfo = document.getElementById("fileInfo");
    const fileName = document.getElementById("fileName");
    const fileSize = document.getElementById("fileSize");
    const uploadButton = document.getElementById("uploadButton");
    const progress = document.getElementById("uploadProgress");
    const progressBar = document.getElementById("progressBar");

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function handleFile(file) {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert("Please select a CSV file.");
            fileInput.value = "";
            return;
        }
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.classList.add("show");
        uploadButton.disabled = false;
    }

    if (uploadArea && fileInput) uploadArea.addEventListener("click", () => fileInput.click());
    if (fileInput) fileInput.addEventListener("change", function () { handleFile(this.files[0]); });

    if (uploadButton) {
        uploadButton.addEventListener("click", async function () {
            const file = fileInput.files[0];
            if (!file) return alert("Please select a CSV file.");
            const formData = new FormData();
            formData.append("file", file);
            progress.classList.add("show");
            progressBar.style.width = "25%";
            uploadButton.disabled = true;
            try {
                const response = await fetch("/api/upload", { method: "POST", body: formData });
                progressBar.style.width = "75%";
                const contentType = response.headers.get("content-type") || "";
                const result = contentType.includes("application/json")
                    ? await response.json()
                    : { error: await response.text() };
                if (!response.ok) throw new Error(result.error || "Upload failed");
                progressBar.style.width = "100%";
                localStorage.setItem("bizpilotAnalysis", JSON.stringify(result.data));
                setTimeout(() => { window.location.href = "insights.html"; }, 350);
            } catch (error) {
                console.error(error);
                alert("Error: " + error.message);
                uploadButton.disabled = false;
                progress.classList.remove("show");
            }
        });
    }
});
