import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function PlotlyChart({ data, layout, config, style, className }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const defaultLayout = {
      autosize: true,
      margin: { t: 25, r: 20, l: 45, b: 35 },
      font: { family: 'Inter, system-ui, sans-serif', size: 11, color: '#64748b' },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      ...layout,
    };

    const defaultConfig = {
      responsive: true,
      displayModeBar: false,
      ...config,
    };

    Plotly.react(chartRef.current, data, defaultLayout, defaultConfig);

    const handleResize = () => {
      if (chartRef.current) {
        Plotly.Plots.resize(chartRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, layout, config]);

  return (
    <div 
      ref={chartRef} 
      style={{ width: '100%', height: '100%', minHeight: '260px', ...style }} 
      className={className} 
    />
  );
}

