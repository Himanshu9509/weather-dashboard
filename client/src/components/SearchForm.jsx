import { useState } from 'react';
function SearchForm({ onSearch }) {
  const [city, setCity] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!city.trim()) return;
    onSearch(city);
    setCity('');
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        className="search-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchForm;