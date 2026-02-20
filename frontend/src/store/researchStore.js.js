// src/config.js
// In production, set VITE_API_URL to your Render backend URL
// e.g. https://research-pipeline-backend.onrender.com

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const WS_URL  = API_URL.replace('https://', 'wss://').replace('http://', 'ws://')

export { API_URL, WS_URL }
