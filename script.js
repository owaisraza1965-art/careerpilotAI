document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const statusLabel = document.getElementById("chatStatus");
  const backendUrl = window.location.protocol === "file:"
    ? "http://127.0.0.1:3000/chat"
    : "/chat";

  const appendMessage = (text, role) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const setSubmitting = (isSubmitting) => {
    chatInput.disabled = isSubmitting;
    chatForm.querySelector("button").disabled = isSubmitting;
    statusLabel.textContent = isSubmitting ? "Sending..." : "Ready to chat";
  };

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    appendMessage(message, "user");
    chatInput.value = "";
    setSubmitting(true);

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorText = data?.error || "Chat request failed.";
        appendMessage(`Error: ${errorText}`, "error");
        return;
      }

      const reply = data?.reply || data?.response || "No response from AI.";
      appendMessage(reply, "ai");
    } catch (error) {
      console.error("Chat request failed:", error);
      const message = error?.message || "Unable to reach backend.";
      appendMessage(`Error: ${message}`, "error");
    } finally {
      setSubmitting(false);
    }
  });

  setSubmitting(false);
});
