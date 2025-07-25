import React, { useState, useEffect } from 'react';

function MoviePoster({ poster, alt }) {
  const fallback = '/missing-poster.jpg';
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    if (poster && poster !== 'N/A') {
      setImgSrc(poster);
    } else {
      setImgSrc(fallback);
    }
  }, [poster]);

  const handleError = () => {
    if (imgSrc !== fallback) {
      console.warn('Помилки 404 по постерах з OMDb — це нормальна ситуація, бо картинки можуть бути видалені на стороні серверу. Тому показую свій постер "Постер відсутній", показуємо запасний.');
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Постер фільму'}
      width={300}
      height={450}
      className="img-thumbnail"
      style={{ objectFit: 'cover' }}
      onError={handleError}
    />
  );
}

export default MoviePoster;
