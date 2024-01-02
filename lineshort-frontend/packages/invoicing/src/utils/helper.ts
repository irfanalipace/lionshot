import { toastr } from 'react-redux-toastr';

export function snakeCaseToPrettyText(snakeCase) {
  // Split the snake_case string into an array of words
  if (!snakeCase) return '--';
  var words = snakeCase.split('_');

  // Convert each word to lowercase and capitalize the first letter
  var prettyWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the words with spaces and return the result
  return prettyWords.join(' ');
}

export const downloadFile = fileUrl => {
  const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

  fetch(fileUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(error => {
      console.error('Error downloading file:', error);
    });
};

export function convertDateToLongFormat(inputDate: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  if (!inputDate) return '';
  const date: Date = new Date(inputDate);
  return date.toLocaleDateString(undefined, options);
}

export const formatDate = (dateString: string): string => {
  // const options: Intl.DateTimeFormatOptions = {
  // 	day: '2-digit',
  // 	month: 'short',
  // 	year: 'numeric',
  // };

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };

  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, options);
};

export function shortenFileName(fileName: string, maxLength: number): string {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  const extension = fileName.split('.').pop() || ''; // Get the file extension (if any)
  const fileNameWithoutExtension = fileName.replace(`.${extension}`, ''); // Remove the extension
  const shortFileName = fileNameWithoutExtension.substring(
    0,
    maxLength - extension.length - 1
  ); // Subtract 1 for the dot separator

  return `${shortFileName}...${extension}`;
}

export function generateEncryptedID(id) {
  return 'ZW5jcn_' + btoa(id) + '_ZGU%3D';
}

export function decryptId(id) {
  const split = id?.split('_');
  if (split) {
    const code = atob(split[1]);
    return code;
  }
  return '';
}

export const prettifyError = error => {
  let prettifiedError = '';

  for (const key in error) {
    if (Array.isArray(error[key])) {
      const formattedErrors = error[key].map(message => `${message}<br>`);

      prettifiedError += `<strong>${
        key.charAt(0).toUpperCase() + key.slice(1)
      }:</strong> ${formattedErrors.join('')}`;
    } else {
      prettifiedError += `<strong>${key}:</strong> ${error[key]}<br>`;
    }
  }

  return prettifiedError;
};

export function handleErrors(errorData) {
  // console.log('errorData' , errorData )
  if (errorData) {
    if (typeof errorData !== 'object' && !Array.isArray(errorData)) {
      toastr.error(errorData);
    } else {
      const errorMessages = Object.values(errorData).flatMap(errors => errors);
      errorMessages.forEach(errorMessage => {
        toastr.error(errorMessage);
      });
    }
  }
}

export function avatarName(user) {
  const splitUser = (user ?? '').split(' ');
  return (splitUser[0] ?? '').charAt(0) + (splitUser[1] ?? '').charAt(0);
}

export function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addWorkingDaysToDate(daysToAdd) {
  const currentDate = new Date();
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);

    // Skip weekends (Saturday and Sunday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      addedDays++;
    }
  }

  return formatDateToYYYYMMDD(currentDate);
}

export function addDaysToDate(argument) {
  if (containsOnlyNumbers(argument)) {
    return addWorkingDaysToDate(argument);
  } else if (typeof argument === 'string') {
    switch (argument) {
      case 'EOM':
        return getEndOfMonth();
      case 'EONM':
        return getEndOfNextMonth();
      case 'CUSTOM':
        return formatDateToYYYYMMDD(new Date());
      default:
        return 'Invalid argument';
    }
  } else {
    return 'Invalid argument';
  }
}

function getEndOfMonth() {
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  return formatDateToYYYYMMDD(lastDayOfMonth);
}

function getEndOfNextMonth() {
  const currentDate = new Date();
  const lastDayOfNextMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );
  return formatDateToYYYYMMDD(lastDayOfNextMonth);
}

export function containsOnlyNumbers(input) {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(input.toString());
}

export function extractNumberFromHash(inputString) {
  const match = inputString.match(/#\/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1]);
  }
  return null;
}

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function EstimateStatusColor(inputString) {
  let color = 'black';
  switch (inputString) {
    case 'pending_approval':
      color = '#ed6c02';
      break;
    case 'expired':
      color = '#00000099';
      break;
    case 'approved':
      color = '#2E7D32';
      break;
    case 'accepted':
      color = '#2E7D32';
      break;
    case 'pending':
      color = '#ED6C02';
      break;
    case 'void':
      color = '#9c27b0';
      break;
    case 'active':
      color = '#4caf50';
      break;
    case 'draft':
      color = '#757575';
      break;
    case 'sent':
      color = '#2196F3';
      break;
    case 'customer_viewed':
      color = '#ba68c8';
      break;
    case 'invoiced':
      color = '#2E7D32';
      break;
    case 'declined':
      color = '#D32F2F';
      break;
    case 'partially_paid':
      color = '#2196F3';
      break;
    case 'reject':
      color = '#D32F2F';
      break;
    case 'unpaid':
      color = '#f44336';
      break;
    case 'paid':
      color = '#4caf50';
      break;
    default:
      color = 'black';
  }
  return color;
}

export function prettifyErrorfromObjectToArray(errors) {
  const prettified = {};

  for (const key in errors) {
    const parts = key.split('.');
    let current = prettified;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        current[part] = errors[key];
      } else {
        if (!current[part]) {
          if (parts[i + 1].match(/^\d+$/)) {
            current[part] = [];
          } else {
            current[part] = {};
          }
        }
        current = current[part];
      }
    }
  }

  return prettified;
}

export function calculateSubtotal(invoice_items) {
  const subtotal = invoice_items?.reduce(
    (accumulator: number, currentValue: any) =>
      currentValue?.rate
        ? accumulator + currentValue?.quantity * currentValue?.rate || 0
        : accumulator,
    0
  );
  return subtotal;
}

export function isGreaterThanZero(value) {
  return value > 0 && value !== '';
}
