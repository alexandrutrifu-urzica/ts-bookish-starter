import { BookFieldInterface } from './book';

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

    getAuthorIDQuery(firstName: string, lastName: string) {
        return `
            select id
            from bookish.dbo.AUTHORS
            where first_name='${firstName}'
                and last_name='${lastName}'`;
    }

    insertAuthorQuery(firstName: string, lastName: string) {
        return `
            insert into bookish.dbo.authors(first_name, last_name)
            values('${firstName}', '${lastName}')`;
    }

    insertBookQuery(bookFields: BookFieldInterface) {
        return `
            insert into bookish.dbo.books(title, isbn, copies_owned, copies_available)
            values(
                   '${bookFields.title}',
                   ${bookFields.isbn},
                   ${bookFields.copiesOwned},
                   ${bookFields.copiesAvailable},)`;
    }

    insertBookToAuthorQuery(bookID: number, authorID: number) {
        return `
            insert into bookish.dbo.books_to_authors(book_id, author_id)
            values(${bookID}, ${authorID})`;
    }
}
