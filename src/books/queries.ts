export class BookQuerier {
    constructor() {}

    getCatalogueQuery(): string {
        return 'select * from bookish.dbo.BOOKS';
    }

    getBookByIDQuery(bookID: string): string {
        return `
            select * from bookish.dbo.BOOKS
            where ID=${bookID}`;
    }
}
