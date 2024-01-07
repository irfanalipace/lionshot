const resp = {
    data: {
      data: [
        // Your sample data goes here
        {  invoice: 'A12DE2' },
        {  invoice: 'N12DE2'},
        {  invoice: 'C14DE2' },
        {  invoice: 'N12DHN'},
        // Add more sample data as needed
      ]
    }
  };
   
  export function CorApi() {
    return new Promise((resolve, reject) => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        resolve(resp);
        // You can also simulate an error condition if needed
        // reject(new Error('Simulated API error'));
      }, 1000); // Simulating a 1-second delay
    });
  }