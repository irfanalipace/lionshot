// const ORANGE = '#FFA500	';
// const GREEN = '#008000';
// const RED = '#FF0000';
// const BLUE = '#0000FF';
// const YELLLOWGREEN = '#8B0000';
// const PURPLE = '#800080';
// const GREY = '#333333';

import notyf from '../../views/Components/NotificationMessage/notyfInstance';

export function snakeCaseToPrettyText(snakeCase) {
  if (snakeCase && typeof snakeCase === 'string') {
    // Split the snake_case string into an array of words
    let words = snakeCase.split('_');

    // Convert each word to lowercase and capitalize the first letter
    let prettyWords = words?.map(function (word) {
      return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
    });

    // Join the words with spaces and return the result
    return prettyWords?.join(' ');
  }
  return '';
}

export const downloadFile = fileUrl => {
  const filename = fileUrl?.substring(fileUrl?.lastIndexOf('/') + 1);
  fetch(fileUrl, { mode: 'no-cors' })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      notyf.success('File Downloaded Successfully');
    })
    .catch(error => {
      console.error('Error downloading file:', error);
      notyf.error('Something went wrong');
    });
};

export const formatDate = dateString => {
  if (dateString) {
    // const options = {
    //   day: '2-digit',
    //   month: 'short',
    //   year: 'numeric'
    // };
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // const formattedDate = date.toLocaleDateString('fr-FR', options);
    // return date.replace(/^(.)/, match => match).replace(/\./g, '');
    return date.toLocaleDateString('en-US', options);
  }
};

export const formatDateAndTime = timestamp => {
  // const timestamp = '2023-10-30T14:46:25.000000Z'
  if (timestamp && typeof timestamp === 'string') {
    const isUTC = timestamp.endsWith('Z');
    const timestampParts = timestamp.replace('T', ' ').split(' ');
    const datePart = timestampParts[0];
    const timePart = timestampParts[1];

    const date = new Date(isUTC ? timestamp : datePart);
    // const options = {
    //   year: 'numeric',
    //   month: 'short',
    //   day: '2-digit'
    // };
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const formattedDate = date.toLocaleDateString(undefined, options);

    if (isUTC) {
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      return `${formattedDate} ${formattedTime}`;
    } else {
      const time = new Date(`1970-01-01T${timePart}`);

      const formattedTime = time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      return `${formattedDate} ${formattedTime}`;
    }
  }
  return '';
};

export const prettifyError = error => {
  try {
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
  } catch (error) {
    return '';
  }
};

export function handleErrors(errorData) {
  if (errorData) {
    if (typeof errorData !== 'object' && !Array.isArray(errorData)) {
      // toastr.error(errorData);
    } else {
      const errorMessages = Object.values(errorData).flatMap(errors => errors);
      errorMessages.forEach(errorMessage => {
        notyf.error(errorMessage);
      });
    }
  }
}

export function avatarName(user) {
  try {
    const splitUser = (user ?? '').split(' ');
    return (splitUser[0] ?? '').charAt(0) + (splitUser[1] ?? '').charAt(0);
  } catch (error) {
    return '';
  }
}

export function formatDateToDDMMYYYY(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp);
    if (timestamp?.toString()?.endsWith('Z')) {
      // Assume UTC timestamp (ends with 'Z')
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${month}/${day}/${year}`;
    } else {
      // Assume non-UTC timestamp
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  }
}


export function convertDateToLongFormat(inputDate) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(inputDate);
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    return '';
  }
}

export function addWorkingDaysToDate(daysToAdd, startDate) {
  try {
    let currentDate;
    if (startDate) currentDate = new Date(startDate);
    else currentDate = new Date();
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1);

      // Skip weekends (Saturday and Sunday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        addedDays++;
      }
    }
    return formatDateToYYYYMMDD(currentDate);
  } catch (error) {
    return '';
  }
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
  if (typeof inputString === 'string') {
    const match = inputString.match(/#\/(.*)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }
  return '';
}

export function StatusColor(statusType, theme) {
  let color = theme?.palette.primary.main;
  switch (statusType) {
    case 'pending':
      color = theme?.palette.warning.main;
      break;
    case 'pending_approval':
      color = theme?.palette.warning.main;
      break;
    case 'expired':
      color = theme?.palette.error.dark;
      break;
    case 'approved':
      color = theme?.palette.success.main;
      break;
    case 'paid':
      color = theme.palette.success.dark;
      break;
    case 'unpaid':
      color = theme?.palette.error.dark;
      break;
    case 'void':
      color = theme?.palette.error.dark;
      break;
    case 'active':
      color = theme?.palette.success.main;
      break;
    case 'draft':
      color = theme?.palette.grey[600];
      break;
    case 'accepted':
      color = theme?.palette.success.main;
      break;
    case 'sent':
      color = theme?.palette.primary.main;
      break;
    case 'customer_viewed':
      color = theme?.palette.secondary.main;
      break;
    case 'invoiced':
      color = theme?.palette.success.dark;
      break;
    case 'declined':
      color = theme?.palette.error.dark;
      break;
    case 'closed':
      color = theme?.palette.error.main;
      break;
    case 'billed':
      color = theme?.palette.success.main;
      break;
    case 'open':
      color = theme?.palette.primary.dark;
      break;
    case 'opened':
      color = theme?.palette.success.dark;
      break;
    case 'issued':
      color = theme?.palette.success.dark;
      break;
    case 'partially_paid':
      color = theme?.palette.warning.main;
      break;
    default:
      color = theme?.palette.grey[800];
  }

  return color;
}

export function prettifyErrorfromObjectToArray(errors) {
  try {
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
  } catch (error) {
    return [];
  }
}

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const createFileMessage = acceptedFileTypes => {
  let fileTypesString = arrayToCommaSeparatedStringWithAnd(acceptedFileTypes);
  return `Only ${fileTypesString} files are allowed`;
};

function arrayToCommaSeparatedStringWithAnd(arr) {
  if (arr.length === 0) {
    return '';
  } else if (arr.length === 1) {
    return arr[0];
  } else {
    const lastItem = arr.pop();
    const commaSeparatedItems = arr.join(', ');
    return `${commaSeparatedItems} and ${lastItem}`;
  }
}

export function filterFiles(files, allowedTypes, maxSize = 5) {
  const maxSizeInBytes = maxSize * 1024 * 1024;
  const validFiles = [];
  const errors = [];
  Array.from(files).forEach(file => {
    if (file?.size > maxSizeInBytes) {
      errors.push(
        `${file.name} exceeds the maximum allowed file size of ${maxSize}MB.`
      );
    } else if (!allowedTypes.includes(file?.type)) {
      errors.push(`${file?.name} has an invalid file type.`);
    } else {
      validFiles.push(file);
    }
  });

  return {
    validFiles: validFiles,
    errors: errors
  };
}

export function generateEncryptedID(id) {
  return 'ZW5jcn_' + btoa(id) + '_ZGU%3D';
}

export function decryptId(id) {
  let split = id?.split('_');
  if (split) {
    try {
      let code = atob(split[1]);
      return code;
    } catch (error) {
      return '';
    }
  }
  return '';
}

export function deleteItemById(arr, idToDelete) {
  const updatedArray = arr.filter(item => item.id !== idToDelete);
  return updatedArray;
}

export function deleteItemByIndex(arr, indexToDelete) {
  if (indexToDelete < 0 || indexToDelete >= arr.length) {
    // Check if the index is valid
    console.error('Invalid index');
    return arr; // Return the original array if the index is invalid
  }

  const updatedArray = [...arr]; // Create a copy of the original array
  updatedArray.splice(indexToDelete, 1); // Use splice to remove the item at the specified index
  return updatedArray;
}

export function goBack(navigate) {
  window.history?.state?.idx === 0 ? navigate() : window.history.back();
}

export function calculateSubtotal(invoice_items) {
  const subtotal = invoice_items?.reduce(
    (accumulator, currentValue) =>
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
export function validatePhoneNumber(phoneNumber) {
  if (/^(\+)?\d{1,14}$/.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}
// Do not remove this regex this is used in other Components
export const phoneRegExp = /^(\+)?\d{1,14}$/;
// This regex will accept 15 numbers including + sign and '+' is optional and characters are not allowed in this
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toFixed(num, decimalPlaces = 2) {
  if (num !== null && num !== undefined && !isNaN(num)) {
    return Number(num).toFixed(decimalPlaces);
  } else {
    return 0.0;
  }
}

export function generateBase64ImageSrc(src) {
  return 'data:image/png;base64,' + src;
}
