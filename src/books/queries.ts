export class BookQuerier {
    constructor() {}

    getCatalogueQuery(): string {
        return 'select * from bookish.dbo.BOOKS';
    }

    getBookByIDQuery(bookID: string): string {
        return `
            select * from bookish.dbo.BOOKS
            where id=${bookID}`;
    }

    getBookByTitleQuery(bookTitle: string): string {
        return `
            select * from bookish.dbo.BOOKS
            where title='${bookTitle}'`;
    }
}
