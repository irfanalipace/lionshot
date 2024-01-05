import Box from '@mui/material/Box';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartContent = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', padding: '4px' }}>
      <ResponsiveContainer width='90%' height={320}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type='monotone' dataKey='paid' stroke='#82ca9d' />
          <Line type='monotone' dataKey='unpaid' stroke='red' />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartContent;
