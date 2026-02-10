import { useState, useEffect } from 'react';
import { fetchData } from '../../../api/api';

const CategoriesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('/categories');
        setData(result.member);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id} style={{ backgroundColor: item.color }}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
