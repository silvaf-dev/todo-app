import { useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

export default function ChartPage() {
    const canvasRef = useRef(null);
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [chart, setChart] = useState(null);
    const [loading, setLoading] = useState(false);

    const drawChart = (chartType, formatted) => {
        const ctx = canvasRef.current.getContext('2d');
        if (chart) chart.destroy();
        if (!formatted || (chartType !== 'scatter' && (!formatted.labels || !formatted.data))) {
            return console.log('Invalid formatted data');
        }

        const typeMap = {
            "bar chart": "bar",
            "line chart": "line",
            "scatter plot": "scatter",
            "pie chart": "pie"
        };

        const chartjsType = typeMap[chartType];
        if (!chartjsType) return console.log('Unsupported chart type:', chartType);

        const config = {
            type: chartjsType,
            data: {
                labels: chartjsType === 'scatter' ? undefined : formatted.labels,
                datasets: [{
                    label: 'Todos',
                    data: formatted.data,
                    backgroundColor: chartjsType === 'pie' || chartjsType === 'bar'
                        ? (formatted.labels || []).map((_, i) =>
                            `hsl(${(i * 360) / (formatted.labels.length || 1)}, 70%, 60%)`
                        )
                        : 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    parsing: chartjsType === 'scatter' ? false : undefined
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: chartjsType === 'pie' }
                },
                scales: chartjsType === 'scatter'
                    ? {
                        x: { type: 'time', time: { unit: 'minute' }, title: { display: true, text: 'Created At' } },
                        y: { beginAtZero: true, title: { display: true, text: 'Status (0 = Incomplete, 1 = Complete)' } }
                    }
                    : chartjsType === 'pie'
                        ? {}
                        : {
                            y: { beginAtZero: true, title: { display: true, text: 'Value' } },
                            x: { title: { display: true, text: 'Label' } }
                        }
            }
        };

        const chartObj = new Chart(ctx, config);
        setChart(chartObj);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const llmRes = await fetch('http://localhost:3001/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            const { query, chartType } = await llmRes.json();

            console.log("LLM response: " + JSON.stringify({ query: query, chartType: chartType }));

            const sqlRes = await fetch('http://localhost:3001/sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const data = await sqlRes.json();

            console.log("SQL response: " + JSON.stringify({ chartType: chartType, data: data }));

            const formatRes = await fetch('http://localhost:3001/format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chartType, data })
            });

            const { labels, data: formattedData } = await formatRes.json();
            const formatted = chartType === 'scatter plot'
                ? { data: formattedData }
                : { labels, data: formattedData };

            drawChart(chartType, formatted);

            setResponse();
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
            fontFamily: 'sans-serif'
        }}>
            <h2 style={{ marginBottom: '20px' }}>Ask about Todos</h2>

            <div style={{
                display: 'flex',
                gap: '10px',
                width: '100%',
                maxWidth: '600px',
                marginBottom: '20px'
            }}>
                <input
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        outline: 'none',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="e.g., How many todos were created today?"
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: '10px 16px',
                        fontSize: '16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'Loading...' : 'Generate'}
                </button>
            </div>

            {response && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p><strong>Query:</strong> <code>{response.query}</code></p>
                    <p><strong>Chart Type:</strong> {response.chartType}</p>
                </div>
            )}

            <div style={{ width: '100%', maxWidth: '400px', marginTop: '30px' }}>
                <canvas
                    ref={canvasRef}
                    style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '2 / 1' // optional, or control with chart height config
                    }}
                />
            </div>
        </div>
    );
}
