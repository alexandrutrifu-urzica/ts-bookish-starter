import { Router, Request, Response } from 'express';
import { Request as TediousRequest } from 'tedious';

import { connection } from '../app';
import { getCatalogue, getBook } from '../books/bookEndpointMethods';
import { BookQuerier } from '../books/queries';

class BookController {
    router: Router;
    querier: BookQuerier;

    constructor() {
        this.router = Router();
        this.router.get('/id/:bookID', this.getBookByField.bind(this));
        this.router.get('/title/:bookTitle', this.getBookByField.bind(this));
        this.router.get('/catalogue', this.getLibraryCatalogue.bind(this));

        this.router.post('/', this.createBook.bind(this));

        // Instantiate querier
        this.querier = new BookQuerier();
    }

    getBookByField(req: Request, res: Response) {
        const params = req.params;

        if (params.bookID) {
            this.getBookByID(params.bookID, res).then(() => {});
            return;
        }

        if (params.bookTitle) {
            this.getBookByTitle(params.bookTitle, res).then(() => {});
            return;
        }
    }

    async getBookByTitle(bookTitle: string, res: Response) {
        const query = this.querier.getBookByTitleQuery(bookTitle);

        const request = new TediousRequest(query, (err, rowCount: number) => {
            if (err) {
                res.send(`Error: ${err}`);
            } else {
                console.log(rowCount);
            }
        });

        const book = await getBook(connection, request);

        res.send(book.getJsonObject());
    }

    async getBookByID(bookID: string, res: Response) {
        const query = this.querier.getBookByIDQuery(bookID);

        const request = new TediousRequest(query, (err, rowCount: number) => {
            if (err) {
                res.send(`Error: ${err}`);
            } else {
                console.log(rowCount);
            }
        });

        const book = await getBook(connection, request);

        res.send(book.getJsonObject());
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
