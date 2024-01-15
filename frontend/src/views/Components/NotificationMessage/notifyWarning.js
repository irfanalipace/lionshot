import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Create an instance of Notyf
const notifyWarning = new Notyf({
  position: {
    x: 'right', // 'left', 'center', or 'right'
    y: 'top',    // 'top' or 'bottom'
  },
  duration: 5000,
  types: [
    {
      type: 'success',
      background: '#d32f2f',
    },
  
  ],
  dismissible: true,

//   ripple:false
  
});

export default notifyWarning;
