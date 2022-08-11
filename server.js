const http = require("http");
const host = 'localhost';
const port = 8000;
const fs = require ('fs');
const files= [];

const requestListener = (req, res) => {
    
    if (req.url === '/get'&& req.method === 'GET') {
                res.writeHead(200);
            
                try{
                    const files = fs.readdirSync('./Folder', 'utf8')
                    
                    res.end(`${files}`);
                    } catch (e) {
                        res.writeHead(500);
                   }            
                        
        } else if (req.url ==='/delete'&& req.method === 'DELETE'){
            res.writeHead(200);
            res.end('success');
        } else if (req.url === '/post'&& req.method ==='POST') {
            res.writeHead(200);
            res.end('success');
        } else if (req.url === '/redirect' && req.method === 'GET') {
            res.writeHead(301);
            res.end('Location:/redirected');
        };
        
        res.writeHead(405);
        res.end("Method is not allowed");            
    
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});