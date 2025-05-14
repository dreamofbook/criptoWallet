import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Tooltip,
	Filler,
	CategoryScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	Tooltip,
	Filler,
	CategoryScale
);

const CurrencyGraph = () => {
	const [chartData, setChartData] = useState(null);
	const [error, setError] = useState(null);
	const intervalRef = useRef(null);

	const fetchData = async () => {
		try {
			const res = await fetch(
				'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=10m&limit=288'
			);

			if (!res.ok) throw new Error(`HTTP ${res.status}`);

			const data = await res.json();

			const points = data.map(kline => ({
				x: new Date(kline[0]),
				y: parseFloat(kline[4])
			}));

			setChartData({
				datasets: [{
					label: 'ETH/USDT (24ч)',
					data: points,
					fill: true,
					borderColor: '#ea5d3e',
					borderWidth: 3,
					backgroundColor: 'rgba(51,111,243,0.29)',
					tension: 0.2,
					pointRadius: 0
				}]
			});

			setError(null);
		} catch (err) {
			console.error('Ошибка графика:', err);
			setError(err.message);
		}
	};

	useEffect(() => {
		fetchData();
		intervalRef.current = setInterval(fetchData, 300_000);
		return () => clearInterval(intervalRef.current);
	}, []);

	if (error) return <p style={{ fontSize: '12px', color: 'red' }}>⚠️ График недоступен</p>;
	if (!chartData) return <p style={{ fontSize: '12px' }}>Загрузка графика...</p>;

	return (
		<div className={'canvasCard-wallpaper'}>
			<Line
				data={chartData}
				options={{
					responsive: true,
					plugins: {
						legend: { display: false },
						tooltip: { enabled: true }
					},
					scales: {
						x: {
							type: 'time',
							time: { unit: 'hour' },
							ticks: { maxTicksLimit: 96 }
						},
						y: {
							display: true,
							title: { display: true, text: 'Цена, USDT' },
							ticks: {
								callback: value => `$${value}`
							}
						}
					}
				}}
				height={500}
				width={500}
			/>
		</div>
	);
};

export default CurrencyGraph;
