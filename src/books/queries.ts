export class BookQuerier {
    constructor() {}

    getCatalogueQuery(): string {
        return 'select * from bookish.dbo.BOOKS';
    }

    getBookByIDQuery(bookID: string): string {
        return `
            select *
            from bookish.dbo.BOOKS b, bookish.dbo.AUTHORS a
            where b.id='${bookID}'
              and a.id=(
                select author_id
                from bookish.dbo.books_to_authors
                where b.id=book_id
            )`;
    }

    getBookByTitleQuery(bookTitle: string): string {
        return `
            select *
            from bookish.dbo.BOOKS b, bookish.dbo.AUTHORS a
            where title='${bookTitle}'
                and a.id=(
                    select author_id
                    from bookish.dbo.books_to_authors
                    where b.id=book_id
                )`;
    }
}
