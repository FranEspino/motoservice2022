import express,{Application} from 'express';
import cors from 'cors';
import path from "path";
import login from '../routes/login';
import driver from '../routes/driver';
import passenger from '../routes/passenger';
import request from '../routes/request';
import travel from '../routes/travel';
import token from '../routes/token';
import user from '../routes/user';
import history from '../routes/history';

const myParser = require("body-parser");

class Server {
    /*private app:Express.Application;*/
    private app: Application;
    private port: string;
    private apiPaths = {
        login: "/api",
        driver: "/api",
        passenger: "/api",
        request: "/api",
        travel: "/api",
        token: "/api",
        user: "/api",
        history: "/api"

    };
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '2050';
        this.middleware();
        this.routes();
    }
    middleware() {
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(express.static("public"));
        this.app.use(myParser.json({limit: '200mb'}));
        this.app.use(myParser.urlencoded({limit: '200mb', extended: true}));
    }

    routes() {
        this.app.use(this.apiPaths.login, login);
        this.app.use(this.apiPaths.driver, driver);
        this.app.use(this.apiPaths.passenger, passenger);
        this.app.use(this.apiPaths.request, request);
        this.app.use(this.apiPaths.travel, travel);
        this.app.use(this.apiPaths.token, token);
        this.app.use(this.apiPaths.user, user);
        this.app.use(this.apiPaths.history, history);

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('\x1b[32m%s\x1b[0m', '✓ The server Codi Api is runing in port: '+this.port);
        })
    }
}
export default Server;