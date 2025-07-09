import { Connection, Request } from 'tedious';

export class Book {
    id: number;
    title: string;
    isbn: number;
    copiesOwned: number;
    copiesAvailable: number;

    constructor(
        id: number,
        title: string,
        isbn: number,
        copiesOwned: number,
        copiesAvailable: number,
    ) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.copiesOwned = copiesOwned;
        this.copiesAvailable = copiesAvailable;
    }

    static getBooks(connection: Connection, request: Request): Promise<Book[]> {
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
}
