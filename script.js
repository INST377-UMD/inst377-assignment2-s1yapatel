function startVoice() {
    if (annyang) {
      const commands = {
        "hello": () => alert("Hello World!"),
        "change the color to *color": (color) => document.body.style.background = color,
        "navigate to *page": (page) => {
          const path = page.toLowerCase();
          if (path.includes("stock")) location.href = "stocks.html";
          else if (path.includes("dog")) location.href = "dogs.html";
          else if (path.includes("home")) location.href = "index.html";
        }
      };
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  function stopVoice() {
    if (annyang) annyang.abort();
  }
  
  window.onload = startVoice;

  