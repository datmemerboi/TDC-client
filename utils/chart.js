import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useRef } from 'react';

import config from '../config.json';

export function BarGraph(props) {
  ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

  const { labels, datasets, width, height } = props;
  const canvasRef = useRef(null);
  const chartRef = useRef();

  let options = { indexAxis: 'x', responsive: false };
  let data = {
    labels,
    datasets: datasets.map((dset, i) => ({ data: dset, backgroundColor: config.COLOR_THEMES[i] }))
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'bar',
      data,
      options
    });

    return () => {
      chartRef.current.destroy();
      chartRef.current = null;
    };
  });

  return <canvas ref={canvasRef} role="img" width={width || 550} height={height || 250}></canvas>;
}
