import { Author } from './author';

export class Book {
    id: number;
    title: string;
    isbn: number;
    copiesOwned: number;
    copiesAvailable: number;
    private _author: Author;

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

    getJsonObject() {
        return {
            id: this.id,
            title: this.title,
            isbn: this.isbn,
            copiesOwned: this.copiesOwned,
            copiesAvailable: this.copiesAvailable,
            authorFirstName: this._author.firstName,
            authorLastName: this._author.lastName,
        };
    }

    set author(value: Author) {
        this._author = value;
    }
}

export type BookFields = [number, string, number, number, number];
