if (annyang) {
    // Setup the voice command to lookup stock by voice
    const commands = {
      'lookup *stock': (stock) => {
        document.getElementById('stock-input').value = stock.toUpperCase();
        document.getElementById('day-select').value = '30';
        handleStockLookup(stock);
      }
    };
  
    annyang.addCommands(commands);
  }
  