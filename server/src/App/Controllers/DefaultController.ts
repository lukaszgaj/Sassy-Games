import express from 'express';
import {controller, httpGet, interfaces, response} from 'inversify-express-utils';

@controller('/')
export class DefaultController implements interfaces.Controller {
    @httpGet('/')
    index(@response() res: express.Response) {
        res.status(200).json({message: 'IT WORKS :)'});
    }
}
