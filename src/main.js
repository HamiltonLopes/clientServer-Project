import { createServer } from 'http';
import { readFile } from 'fs';
import { resolve } from 'path';

const server = createServer((request, response) => {
    switch (request.url) {

        case '/status': {
            response.writeHead(200, {
                'Content-Type': 'application/json',
            });
            response.write(JSON.stringify({
                status: 'Okay',
            }));
            response.end();
            break;
        }

        case '/' || '/sign-in':{
            const filePath = resolve(__dirname, './pages/login/sign-in.html');
            readFile(filePath, (error, file) =>{
                if(error){
                    response.writeHead(500, 'Canot process HTML file.');
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file);
                response.end();
            });
            break;
        }

        case '/authenticate':{
            let data = '';
            request.on('data', (chunk) =>{
                data+=chunk;
            });
            request.on('end',()=>{

                response.writeHead(301, {
                    Location:'/home',
                });

                response.end(data);
            } );
            break;
        }

        case '/home':{
            const path = resolve(__dirname, './pages/home/home.html');
            readFile(path, (error, file) =>{
                if(error){
                    response.writeHead(500, 'Canot process HTML file.');
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file);
                response.end();
            });
            break;
        }

        default: {
            response.writeHead(404, 'Service not found');
            response.end();
            break;
        }
    }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

server.listen(PORT, HOSTNAME, () => {
    console.log(`server is listening at http://${HOSTNAME}:${PORT}`)
});