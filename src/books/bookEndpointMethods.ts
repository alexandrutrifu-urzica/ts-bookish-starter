import { Request as TediousRequest } from 'tedious';
import ConnectionPool from 'tedious-connection-pool';
import { Book, BookFieldInterface, BookFieldsType } from './book';
import { Author, AuthorFields } from './author';
import { Request } from 'express';
import { BookQuerier } from './queries';

export function getBook(pool: ConnectionPool, query: string): Promise<Book> {
    return new Promise((resolve, reject) => {
        let book: Book;
        let author: Author;

        pool.acquire(function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }

            const request = new TediousRequest(
                query,
                (err, rowCount: number) => {
                    if (err) {
                        console.log('Error:', err);
                    } else {
                        console.log(rowCount);
                    }

                    connection.release();
                },
            );

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

                const bookFields: BookFieldsType = fieldValues.slice(
                    0,
                    5,
                ) as BookFieldsType;

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

            connection.execSql(request);
        });
    });
}

export function getCatalogue(
    pool: ConnectionPool,
    query: string,
): Promise<Book[]> {
    return new Promise((resolve, reject) => {
        const books: Book[] = [];

        pool.acquire(function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }

            const request = new TediousRequest(
                query,
                (err, rowCount: number) => {
                    if (err) {
                        console.log('Error:', err);
                    } else {
                        console.log(rowCount);
                    }

                    connection.release();
                },
            );

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
    });
}

function getAuthorId(
    pool: ConnectionPool,
    firstName: string,
    lastName: string,
): Promise<number> {
    return new Promise((resolve, reject) => {
        const query = new BookQuerier().getAuthorIDQuery(firstName, lastName);
        let authorID: number;

        pool.acquire(function (err, connection) {
            if (err) {
                console.error(err);
                return;
            }

            const request = new TediousRequest(
                query,
                (err, rowCount: number) => {
                    if (err) {
                        console.log('Error:', err);
                    } else {
                        console.log(rowCount);
                    }

                    connection.release();
                },
            );

            request.on('row', (columns) => {
                authorID = columns[0].value;
            });

            request.on('requestCompleted', () => {
                resolve(authorID); // done, return the books
            });

            request.on('error', (err) => {
                reject(err);
            });

            connection.execSql(request);
        });
    });
}

function acquireConnectionForQuery(pool, resolve, reject, query: string) {
    pool.acquire(function (err, connection) {
        if (err) {
            console.error(err);
            return;
        }

        const request = new TediousRequest(query, (err, rowCount: number) => {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log(rowCount);
            }

            console.log(query);

            connection.release();
        });

        request.on('requestCompleted', () => {
            resolve();
        });

        request.on('error', (err) => {
            reject(err);
        });

        connection.execSql(request);
    });
}

export async function insertAuthor(
    pool: ConnectionPool,
    firstName: string,
    lastName: string,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const query = new BookQuerier().insertAuthorQuery(firstName, lastName);

        acquireConnectionForQuery(pool, resolve, reject, query);
    });
}

async function insertBook(
    pool: ConnectionPool,
    bookFields: BookFieldInterface,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const query = new BookQuerier().insertBookQuery(bookFields);

        acquireConnectionForQuery(pool, resolve, reject, query);
    });
}

async function insertBookAuthorConnection(
    pool: ConnectionPool,
    bookID: number,
    authorID: number,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const query = new BookQuerier().insertBookToAuthorQuery(
            bookID,
            authorID,
        );

        acquireConnectionForQuery(pool, resolve, reject, query);
    });
}

export async function addBook(pool: ConnectionPool, request: Request) {
    const bookFields = request.body;

    console.log(bookFields);

    const bookFieldsObject: BookFieldInterface = {
        title: bookFields.title,
        isbn: bookFields.isbn,
        copiesOwned: bookFields.copiesOwned,
        copiesAvailable: bookFields.copiesAvailable,
    };

    // Try to find existent author ID
    let authorID = await getAuthorId(
        pool,
        bookFields.authorFirstName,
        bookFields.authorLastName,
    );

    console.log('AuthorID:', authorID);

    if (authorID == undefined) {
        // Insert new Author into table and get new ID
        await insertAuthor(
            pool,
            bookFields.authorFirstName,
            bookFields.authorLastName,
        );

        console.log('done');

        authorID = await getAuthorId(
            pool,
            bookFields.authorFirstName,
            bookFields.authorLastName,
        );

        console.log('AuthorID:', authorID);
    }

    await insertBook(pool, bookFieldsObject);

    // Get book ID
    const bookID = await getBook(
        pool,
        new BookQuerier().getBookByTitleQuery(bookFieldsObject.title),
    );

    // console.log(book)

    console.log(bookID);

    // await insertBookAuthorConnection(pool, bookID, authorID);

    return bookID;
}
