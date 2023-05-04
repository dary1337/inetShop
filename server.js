import express from 'express';
import router from './server/API/main.js'
import cors from 'cors';
import errorHandle from './server/errorHandle/errorHandling.js'
import "dotenv/config.js";


import path from 'path';
import {fileURLToPath} from 'url';

const staticFolder = path.dirname(fileURLToPath(import.meta.url)).replaceAll('\\', '/');



const server = express();

server.use(express.json());
server.use(cors());
server.use('/api', router);
// always last
server.use(errorHandle);

server.listen(process.env.PORT, () => console.log('Server started on port: ' + process.env.PORT));



const client = express();

client.use(express.static(staticFolder + '/public'));
client.get('*', (req, res) => res.sendFile(staticFolder + '/public/index.html'));
client.listen(process.env.PORT_CLIENT);

