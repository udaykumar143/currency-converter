import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const convertCurrency = async () => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${sourceCurrency}`
      );
      const rates = response.data.rates;
      const exchangeRate = rates[targetCurrency];
      if (!exchangeRate) {
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
      {convertedAmount && (
        <p className="result">
          {amount} {sourceCurrency} equals {convertedAmount.toFixed(2)}{" "}
          {targetCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
