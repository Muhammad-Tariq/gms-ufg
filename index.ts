import express, { Application, Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000; // Use env port or default to 5000
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ufg",
  password: process.env.DB_PASSWORD || "0000",
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

const getBoundaryData = async (tableName: string): Promise<any[]> => {
  const query = `
    SELECT
      ST_AsGeoJSON(geom) as geojson,
      name,
      gid
    FROM ${tableName};
  `;
  const result: QueryResult = await pool.query(query);
  return result.rows.map((row: any) => ({
    type: "Feature",
    properties: { name: row.name, id: row.gid },
    geometry: JSON.parse(row.geojson),
  }));
};

app.get('/api/boundaries/:boundaryType', async (req: Request, res: Response) => {
  const { boundaryType } = req.params;
  let tableName: string;

  switch (boundaryType) {
    case 'national':
      tableName = 'national_boundary';
      break;
    case 'provincial':
      tableName = 'provincial_boundary';
      break;
    case 'district':
      tableName = 'district_boundary';
      break;
    case 'tehsil':
      tableName = 'tehsil_boundary';
      break;
    default:
      return res.status(400).json({ error: 'Invalid boundary type' });
  }

  try {
    const data = await getBoundaryData(tableName);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data from database.' });
  }
});

app.get('/path/to/UFG_Locations.csv', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../components/UFG_Locations.csv'));
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});