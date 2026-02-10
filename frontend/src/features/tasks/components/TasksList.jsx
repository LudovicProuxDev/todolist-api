import { useState, useEffect } from 'react';
import { fetchData } from '../../../api/api';

const TasksList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('/tasks');
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
      <h1>Tasks</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.description} - <strong>Date:</strong> {item.createdAt}</li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
