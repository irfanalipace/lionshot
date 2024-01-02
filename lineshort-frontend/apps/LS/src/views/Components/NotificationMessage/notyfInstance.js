import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Create an instance of Notyf
const notyf = new Notyf({
  position: {
    x: 'right', // 'left', 'center', or 'right'
    y: 'top',    // 'top' or 'bottom'
  },
  duration: 5000,
  types: [
    {
      type: 'success',
      background: '#198754',
    },
  
  ],
  dismissible: true,

//   ripple:false
  
});

export default notyf;
