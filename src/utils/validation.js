export const REGEX = {
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_16: /^[a-zA-Z0-9]{16}$/,
  DIGITS_ONLY: /^\d+$/,
  MOBILE_10: /^\d{10}$/,
};

export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = password => {
  return password && password.length >= 6;
};

export const validateName = name => {
  return name && name.trim().length > 0;
};

export const validatePhone = phone => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

export const validateUrl = url => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// export const validateServiceNumber = (value) => {
//   const serviceNumberRegex = /^[A-Za-z0-9]{16}$/;
//   return serviceNumberRegex.test(value);
// };

export const validateServiceNumber = value => {
  return REGEX.ALPHANUMERIC_16.test(value);
};

export const validateServiceNumberFlexible = (value, min = 1, max = 25) => {
  const regex = new RegExp(`^[a-zA-Z0-9]{${min},${max}}$`);
  return regex.test(value);
};

export const validateZipCode = zipCode => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

export const validateCreditCard = cardNumber => {
  const cardRegex = /^\d{16}$/;
  return cardRegex.test(cardNumber);
};

export const validateExpiryDate = expiryDate => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = Number.parseInt(year, 10);
  const expiryMonth = Number.parseInt(month, 10);

  if (expiryYear < currentYear) {
    return false;
  }

  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return false;
  }

  return true;
};

export const validateCVV = cvv => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

export const validateVehicleNumber = vehicleNumber => {
  const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$/;
  return vehicleRegex.test(vehicleNumber);
};

export const validateEngineNumber = engineNumber => {
  return /^[a-zA-Z0-9]{7,17}$/.test(engineNumber);
};

export const validateChassisNumber = chassisNumber => {
  return /^[a-zA-Z0-9]{17}$/.test(chassisNumber);
};

export const validateMobile = mobile => {
  return REGEX.MOBILE_10.test(mobile);
};

export const validateAmount = (amount, min = 10) => {
  if (!amount) return false;

  const amountRegex = /^\d+(\.\d{1,2})?$/; // allows 10, 10.5, 10.25
  const numericValue = parseFloat(amount);

  return amountRegex.test(amount) && numericValue >= min;
};
