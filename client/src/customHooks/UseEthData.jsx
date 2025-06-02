import { useEffect, useState } from 'react';

const useEthData = (base, quote, refreshInterval = 60000) => {
	const [chart, setChart] = useState([]);
	const [price, setPrice] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			const res = await fetch(`http://localhost:3001/api/eth-full?base=${base}&quote=${quote}`);

			if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
			const data = await res.json();

			setChart(data.chart || []);
			setPrice(data.lastPrice || null);
			setError(null);
		} catch (err) {
			setError(err.message || 'Ошибка запроса');
			setChart([]);
			setPrice(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, refreshInterval);
		return () => clearInterval(interval);
	}, [base, quote, refreshInterval]);

	return {
		chart,
		price,
		loading,
		error
	};
};

export default useEthData;
