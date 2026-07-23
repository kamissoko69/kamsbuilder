document.getElementById("generateBtn").addEventListener("click", async () => {
  const idea = document.getElementById("idea").value;
  
  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea })
  });
  
  const result = await response.json();
  if (result.success) {
    document.getElementById("progress").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("downloadBtn").classList.remove("hidden");
    }, 5000);
  }
});
