// client/src/utils/temperature.js

/**
 * Converts a temperature from Celsius to Fahrenheit.
 * @param {number} celsius - The temperature in Celsius.
 * @returns {number} The temperature in Fahrenheit.
 */
export const convertToFahrenheit = (celsius) => {
  if (typeof celsius !== 'number') return NaN;
  return celsius * 9 / 5 + 32;
};

/**
 * A helper function to format temperature for display.
 * It handles conversion and rounding.
 * @param {number} celsiusTemp - The base temperature in Celsius.
 * @param {string} unit - The target unit ('metric' or 'imperial').
 * @returns {number} The rounded temperature ready for display.
 */
export const formatTemperature = (celsiusTemp, unit) => {
  const temp = unit === 'imperial' ? convertToFahrenheit(celsiusTemp) : celsiusTemp;
  return Math.round(temp);
};