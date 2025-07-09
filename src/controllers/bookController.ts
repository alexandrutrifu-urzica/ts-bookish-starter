import { Router, Request, Response } from 'express';
import { Request as TediousRequest } from 'tedious';

import { connection } from '../app';
import { Book } from '../book';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/catalogue', this.getLibraryCatalogue.bind(this));

        this.router.post('/', this.createBook.bind(this));
    }

    async getLibraryCatalogue(req: Request, res: Response) {
        const request = new TediousRequest(
            'select * from bookish.dbo.BOOKS',
            (err, rowCount: number) => {
                if (err) {
                    console.log('Error:', err);
                } else {
                    console.log(rowCount);
                }
            },
        );

        res.send(await Book.getBooks(connection, request));
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
