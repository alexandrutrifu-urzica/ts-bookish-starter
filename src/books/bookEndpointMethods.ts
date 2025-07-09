import { Connection, Request } from 'tedious';
import { Book, BookFields } from './book';
import { Author, AuthorFields } from './author';

export function getBook(
    connection: Connection,
    request: Request,
): Promise<Book> {
    return new Promise((resolve, reject) => {
        let book: Book;
        let author: Author;

        request.on('row', (columns) => {
            type QueryFields = [
                number,
                string,
                number,
                number,
                number,
                number,
                string,
                string,
            ];

            const fieldValues: QueryFields = columns.map(
                (column) => column.value,
            ) as QueryFields;

            const bookFields: BookFields = fieldValues.slice(
                0,
                5,
            ) as BookFields;

            const authorFields: AuthorFields = fieldValues.slice(
                5,
            ) as AuthorFields;

            book = new Book(...bookFields);
            author = new Author(...authorFields);
            book.author = author;
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
