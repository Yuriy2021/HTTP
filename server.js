const http = require("http");
const host = 'localhost';
const port = 8000;
const fs = require ('fs');
const files= [];

const requestListener = (req, res) => {
    
    if (req.url === '/get') {
        if (req.method === 'GET') {
            res.writeHead(200);
            
                fs.readdirSync('./Folder').forEach(file => {
                    
                    files.push(file);
                });
            res.end(`${files}`);
            
        };
        res.writeHead(405);
        res.end("Method is not allowed");
        
    }
    res.writeHead(500);
    res.end('Internal server error.');
    
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});