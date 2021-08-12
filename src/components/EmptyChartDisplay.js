import React from 'react'
import {
    LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';

function DownloadCenter(props){



return( 
    <div id='Chart'>
        <div id='Pasek'></div>
        <ResponsiveContainer width='100%' height={600}>
            <LineChart
                margin={{
                    top: 30, right: 30, left: 20, bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        </ResponsiveContainer>
            Całkowita wygenerowana moc: - [kWh]
    </div>
)}

export default DownloadCenter