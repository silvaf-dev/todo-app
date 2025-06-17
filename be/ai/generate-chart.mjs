export const chartWrapper = (chartType, data) => {
    return `Context:
    You are a JSON-only API. Do NOT explain anything. Return ONLY ONE response, and ONLY THE response, without any further text whatsoever.
    Return a JSON with the following structure:
    {
        "labels": [...],
        "data": [...]
    }
    Labels should be human-readable (e.g., formatted timestamps or category names), and data should be the corresponding values (e.g., counts, percentages, values).
    If the chart type is "scatter", return:
    {
        "data": [{ x: ..., y: ... }, ...]
    }
    Example Output for Bar Chart:
    {
        labels: ["10 AM", "11 AM", "12 PM"],
        data: [3, 5, 2]
    }
    Example Output for Scatter Plot:
    {
        "data": [
            { "x": "2025-06-16T10:30:00Z", y: 1 },
            { "x": "2025-06-16T11:00:00Z", y: 0 }
        ]
    }
    Current Input: I want to draw a ${JSON.stringify(chartType)} using the following data: ${JSON.stringify(data)}`.trim();
};