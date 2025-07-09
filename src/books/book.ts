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
}
