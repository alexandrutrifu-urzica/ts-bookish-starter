import { Connection, Request } from 'tedious';
import { Book } from './book';

export function getBookByID(
    connection: Connection,
    request: Request,
): Promise<Book> {
    return new Promise((resolve, reject) => {
        let book: Book;

        request.on('row', (columns) => {
            type BookFields = [number, string, number, number, number];

            const fieldValues: BookFields = columns.map(
                (column) => column.value,
            ) as BookFields;

            book = new Book(...fieldValues);
        });

        request.on('requestCompleted', () => {
            resolve(book); // done, return the book
        });

        request.on('error', (err) => {
            reject(err);
        });

        connection.execSql(request); // start the request
    });
}

export function getCatalogue(
    connection: Connection,
    request: Request,
): Promise<Book[]> {
    return new Promise((resolve, reject) => {
        const books: Book[] = [];

        request.on('row', (columns) => {
            type BookFields = [number, string, number, number, number];

            const fieldValues: BookFields = columns.map(
                (column) => column.value,
            ) as BookFields;

            books.push(new Book(...fieldValues));
        });

        request.on('requestCompleted', () => {
            resolve(books); // done, return the books
        });

        request.on('error', (err) => {
            reject(err);
        });

        connection.execSql(request); // start the request
    });
}
