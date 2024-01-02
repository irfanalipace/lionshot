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
      background: '#1976d2',
    },
    // Add more custom types if needed
  ],
  dismissible: true,
  // ripple: false, // This option is not supported in Notyf v3
});

export default notyf;
