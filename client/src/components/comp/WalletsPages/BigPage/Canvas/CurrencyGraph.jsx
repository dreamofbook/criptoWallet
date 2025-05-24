// import React, { useEffect, useState, useRef } from 'react';
// import { Line } from 'react-chartjs-2';
// import './canvas.css'
// import {
// 	Chart as ChartJS,
// 	LineElement,
// 	PointElement,
// 	LinearScale,
// 	TimeScale,
// 	Tooltip,
// 	Filler,
// 	CategoryScale
// } from 'chart.js';
// import 'chartjs-adapter-date-fns';
//
// ChartJS.register(
// 	LineElement,
// 	PointElement,
// 	LinearScale,
// 	TimeScale,
// 	Tooltip,
// 	Filler,
// 	CategoryScale
// );
//
// const CurrencyGraph = ({currency, chartData}) => {
// 	const [chartData, setChartData] = useState(null);
// 	const [error, setError] = useState(null);
// 	const intervalRef = useRef(null);
//
// 	const fetchData = async () => {
// 		try {
// 			const res = await fetch('http://localhost:3001/api/eth-chart');
//
// 			if (!res.ok) throw new Error(`HTTP ${res.status}`);
//
// 			const data = await res.json();
//
// 			const points = data.map(kline => ({
// 				x: new Date(kline[0]),
// 				y: parseFloat(kline[4])
// 			}));
//
// 			setChartData({
// 				datasets: [{
// 					label: 'ETH/USDT (24ч)',
// 					data: points,
// 					fill: true,
// 					borderColor: '#ea5d3e',
// 					borderWidth: 3,
// 					backgroundColor: 'rgba(51,111,243,0.29)',
// 					tension: 0.2,
// 					pointRadius: 1
// 				}]
// 			});
//
// 			setError(null);
// 		} catch (err) {
// 			console.error('Ошибка графика:', err);
// 			setError(err.message);
// 		}
// 	};
//
// 	useEffect(() => {
// 		fetchData();
// 		intervalRef.current = setInterval(fetchData, 300_000);
// 		return () => clearInterval(intervalRef.current);
// 	}, []);
//
// 	if (error) return <p style={{ fontSize: '12px', color: 'red' }}>⚠️ График недоступен</p>;
// 	if (!chartData) return <p style={{ fontSize: '12px' }}>Загрузка графика...</p>;
//
// 	return (
// 		<div className={'canvasCard-wallpaper'}>
// 			<Line
// 				data={chartData}
// 				options={{
// 					responsive: true,
// 					interaction: {
// 						mode: 'index',
// 						intersect: false
// 					},
// 					plugins: {
// 						legend: { display: false },
// 						tooltip: {
// 							animation: {
// 								duration: 10,
// 								easing: 'linear'
// 							},
// 							enabled: true,
// 							mode: 'index',
// 							intersect: false,
// 							backgroundColor: '#1e1e1e',
// 							titleFont: { size: 13, weight: 'bold' },
// 							bodyFont: { size: 12 },
// 							padding: 10,
// 							displayColors: false,
// 							cornerRadius: 6,
// 							callbacks: {
// 								title: (items) => {
// 									const date = new Date(items[0].parsed.x);
// 									return date.toLocaleString('ru-RU', {
// 										hour: '2-digit',
// 										minute: '2-digit',
// 										day: '2-digit',
// 										month: 'short'
// 									});
// 								},
// 								label: (context) => `Цена: $${context.parsed.y.toFixed(2)}`
// 							}
// 						}
// 					},
// 					animations: {
// 						tooltip: {
// 							duration: 100,
// 							easing: 'easeOutCubic'
// 						}
// 					},
// 					scales: {
// 						x: {
// 							type: 'time',
// 							time: { unit: 'hour' },
// 							ticks: { maxTicksLimit: 24 }
// 						},
// 						y: {
// 							display: true,
// 							title: { display: false }
// 						}
// 					}
// 				}}
// 				height={500}
// 				width={400}
// 			/>
// 		</div>
// 	);
// };
//
// export default CurrencyGraph;

import React from 'react';
import { Line } from 'react-chartjs-2';
import './canvas.css';

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

const CurrencyGraph = ({ chartData }) => {
	if (!chartData || chartData.length === 0) {
		return <p style={{ fontSize: '12px' }}>Нет данных для графика</p>;
	}

	const data = {
		datasets: [{
			label: 'ETH/USDT (2ч)',
			data: chartData.map(p => ({
				x: new Date(p.x),
				y: p.y
			})),
			fill: true,
			borderColor: '#ea5d3e',
			borderWidth: 3,
			backgroundColor: 'rgba(51,111,243,0.29)',
			tension: 0.2,
			pointRadius: 0.5
		}]
	};

	return (
		<div className="canvasCard-wallpaper">
			<Line
				data={data}
				options={{
					responsive: true,
					interaction: {
						mode: 'index',
						intersect: false
					},
					plugins: {
						legend: { display: false },
						tooltip: {
							animation: {
								duration: 10,
								easing: 'linear'
							},
							enabled: true,
							mode: 'index',
							intersect: false,
							backgroundColor: '#1e1e1e',
							titleFont: { size: 13, weight: 'bold' },
							bodyFont: { size: 12 },
							padding: 10,
							displayColors: false,
							cornerRadius: 6,
							callbacks: {
								title: (items) => {
									const date = new Date(items[0].parsed.x);
									return date.toLocaleString('ru-RU', {
										hour: '2-digit',
										minute: '2-digit',
										day: '2-digit',
										month: 'short'
									});
								},
								label: (context) => `Цена: $${context.parsed.y.toFixed(2)}`
							}
						}
					},
					animations: {
						tooltip: {
							duration: 100,
							easing: 'easeOutCubic'
						}
					},
					scales: {
						x: {
							type: 'time',
							time: { unit: 'minute' },
							ticks: { maxTicksLimit: 24 }
						},
						y: {
							display: true,
							title: { display: false }
						}
					}
				}}
				height={500}
				width={400}
			/>
		</div>
	);
};

export default CurrencyGraph;
