import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const useSafetyScores = () => {
  const [safetyScores, setSafetyScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSafetyScores = async () => {
      try {
        const scoresRef = collection(db, 'safetyScores');
        const querySnapshot = await getDocs(query(scoresRef));
        
        const scores = [];
        querySnapshot.forEach((doc) => {
          scores.push({ ...doc.data(), areaId: doc.id });
        });
        
        setSafetyScores(scores);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching safety scores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyScores();
  }, []);

  return { safetyScores, loading, error };
}; 