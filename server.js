const http = require("http");
const host = 'localhost';
const port = 8000;
const fs = require ('fs');
const files= [];

function parseCookies (request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

const requestListener = (req, res) => {
    const user = {
        id:123,
        username:'testuser',
        password:'qwerty'
    };
    const authenticated = parseCookies(req);
    console.log(authenticated.authorized);
    
    if (req.url === '/get'&& req.method === 'GET') {
                res.writeHead(200);
            
                fs.readdirSync('./Folder').forEach(file => {
                    
                    files.push(file);
                });
            res.end(`${files}`);
            
        } else if (req.url ==='/delete'&& req.method === 'DELETE'){
            if( user.id.toString() === authenticated.userId && authenticated.authorized){
                let deleteFile = '';

                req.on('data', chunk => {
                    bufer = chunk.toString();
                    const searchParams = new URLSearchParams(bufer);
                    deleteFile = `./files/${searchParams.get('filename')}`;
                    if (fs.existsSync(deleteFile)) {
                        fs.unlink(deleteFile, (err) => {
                            if (err) {
                                res.writeHead(500);
                                res.end('Did not unlink file' + err);
                                console.log(err);
                            }
                            
                            console.log('deleted');
                            res.end('success delete');
                        })
                    }
                    else {
                        res.writeHead(500);
                        res.end('No such file' + deleteFile);
                        console.log('No such file' + deleteFile);
                    }
                });
            }
            res.writeHead(405);
            res.end('HTTP method is not allowed');
        } else if (req.url === '/post'&& req.method ==='POST') {
             if( user.id.toString() === authenticated.userId && authenticated.authorized){
            let bufer = '';
            let filename = '';
            let content = '';
            req.on('data', chunk => {
                bufer = chunk.toString();
                const searchParams = new URLSearchParams(bufer);
                filename = searchParams.get('filename');
                content = searchParams.get('content');
                console.log(filename);
                if(filename) {
                    fs.writeFile( `./files/${filename}`, content, (err) => {
                        if (err) {
                            res.writeHead(404);
                            console.log(err);
                            res.end('File write error' + err);  
                            
                        }
                        else {
                            console.log("File written successfully\n");
                            console.log("The written has the following contents:");
                            console.log(fs.readFileSync(`./files/${filename}`, "utf8"));
                            res.end(`Файл ./files/${filename} записан`);  
                        } 
                    });
                }
                else {                           
                    res.writeHead(400);
                    res.end('Не указано имя фала');
                };
            })
            };
            res.writeHead(400);           
            
        } else if (req.url === '/redirect' && req.method === 'GET') {
            res.setHeader('Location','/redirected');
            res.writeHead(301);
            res.end("Server is available on HTTP//localhost/redirected");
        }else if (req.url === '/auth'&& req.method === 'POST') {
            let bufer = '';
            req.on('data',chunk => {
                bufer = chunk.toString();
                const searchParams = new URLSearchParams(bufer)
                if (searchParams.has('username')&& searchParams.get('username') === user.username){                    
                    if (searchParams.has('password') && searchParams.get('password') === user.password){
                                              
                        res.writeHead(200, {
                            'Content-Type': 'text/plain',
                            'Set-Cookie': [`userId=${user.id};MAX_AGE=172800;path=/;`,`authorized=true;MAX_AGE=172800;path=/;`]
                        });
                        res.end('авторизация успешна прошла');
                    } 
                } else {
                    res.writeHead(400);
                    res.end('Неверный логин или пароль');
                };  
              
            
            } )
        } 
        else {
        res.writeHead(405);
        res.end("Method is not allowed");}
            
    
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});