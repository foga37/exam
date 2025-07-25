import React from 'react';
import { useNavigate } from 'react-router-dom';
import OmdbSearch from '../components/OmdbSearch.jsx';

function OmdbSearchPage() {
  const navigate = useNavigate();

  const handleSelect = (movie) => {

    navigate('/add', { state: { prefill: movie } });
  };

  return (
    <div>
      <OmdbSearch onSelect={handleSelect} />
    </div>
  );
}

export default OmdbSearchPage;
