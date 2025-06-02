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
