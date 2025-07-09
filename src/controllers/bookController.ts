import { Router, Request, Response } from 'express';
import { Request as TediousRequest } from 'tedious';

import { connection } from '../app';
import { getCatalogue, getBookByID } from '../books/bookEndpointMethods';
import { BookQuerier } from '../books/queries';

class BookController {
    router: Router;
    querier: BookQuerier;

    constructor() {
        this.router = Router();
        this.router.get('/id/:bookID', this.getBookByID.bind(this));
        this.router.get('/catalogue', this.getLibraryCatalogue.bind(this));

        this.router.post('/', this.createBook.bind(this));

        // Instantiate querier
        this.querier = new BookQuerier();
    }

    async getBookByID(req: Request, res: Response) {
        const bookID = req.params.bookID;
        const query = this.querier.getBookByIDQuery(bookID);

        const request = new TediousRequest(query, (err, rowCount: number) => {
            if (err) {
                res.send(`Error: ${err}`);
            } else {
                console.log(rowCount);
            }
        });

        res.send(await getBookByID(connection, request));
    }

    async getLibraryCatalogue(req: Request, res: Response) {
        const query = this.querier.getCatalogueQuery();
        const request = new TediousRequest(query, (err, rowCount: number) => {
            if (err) {
                res.send(`Error: ${err}`);
            } else {
                console.log(rowCount);
            }
        });

        res.send(await getCatalogue(connection, request));
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}

export default new BookController().router;
