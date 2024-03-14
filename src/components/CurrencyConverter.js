import React, { useState, useEffect } from "react";
import axios from "axios"; //Axios is a popular JavaScript library used for making HTTP requests from browsers or Node.js applications. It is widely used in web development for its simplicity, ease of use, and robust feature set.
import "./CurrencyConverter.css"; // Importing CSS file for styling

const CurrencyConverter = () => {
  // State variables
  const [amount, setAmount] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [currencyList, setCurrencyList] = useState([]);

  // Fetching currency list from the API
  //In React, the useEffect hook is used to perform side effects in functional components. Side effects could include data fetching, subscriptions, or manually changing the DOM in React components. Here's why you might use useEffect specifically for data fetching: Fetching Data Once When Component Mounts,Handling Asynchronous Operations
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const currencies = Object.keys(response.data.rates);
        setCurrencyList(currencies);
      } catch (error) {
        setError("Error fetching currency list. Please try again later.");
      }
    };

    fetchCurrencies();
  }, []);

  // Function to handle currency conversion
  //This code defines an asynchronous function called convertCurrency that fetches exchange rate data from an external API and calculates the converted amount based on the provided source currency, target currency, and amount
  // try { ... } catch (error) { ... }: This is a try-catch block used for error handling. Within the try block, the code attempts to execute the asynchronous operation of fetching exchange rate data. If an error occurs during this operation, it will be caught by the catch block for error handling.
  const convertCurrency = async () => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`
      );
      const rates = response.data.rates;
      const exchangeRate = rates[targetCurrency];
      if (!exchangeRate) {
        // setError(null);: If the operation is successful, any previous error state is cleared by setting setError to null.
        setError("Invalid currency code or network issue.");
        return;
      }
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted);
      setError(null);
    } catch (error) {
      setError("Error fetching data from the server. Please try again later.");
    }
  };

  // Function to swap source and target currencies
  const handleSwapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  // Function to clear all input fields and conversion result
  const handleClear = () => {
    setAmount("");
    setSourceCurrency("");
    setTargetCurrency("");
    setConvertedAmount(null);
    setError(null);
  };

  // Render component
  return (
    //Amount input division
    <div className="currency-converter">
      <h2>Currency Converter</h2>
      {error && <p className="error">{error}</p>}
      <div className="input-group">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Source Currency:</label>
        <select
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
        >
          <option value="">Select source currency</option>
          {currencyList.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label>Target Currency:</label>
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          <option value="">Select target currency</option>
          {currencyList.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <button className="btn convert-btn" onClick={convertCurrency}>
        Convert
      </button>
      <button className="btn swap-btn" onClick={handleSwapCurrencies}>
        Swap Currencies
      </button>
      <button className="btn clear-btn" onClick={handleClear}>
        Clear
      </button>
      {/* toFixed used 4 decimal place */}
      {convertedAmount && (
        <p className="result">
          {amount} {sourceCurrency} equals {convertedAmount.toFixed(4)}{" "}
          {targetCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
