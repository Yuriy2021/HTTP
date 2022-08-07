const http = require("http");
const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {
    if (req.url === '/get') {
        if (req.method === 'GET') {
            res.writeHead(200);
            res.end("Success");
        };
        res.writeHead(405);
        res.end("Method is not allowed");
        
    }
    res.writeHead(404);
    res.end('not found');
    
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});