import { faker } from "@faker-js/faker";

const books = () => {
  let books = [];
  for (let i = 0; i <= 30; i++) {
   let book = {
     id: faker.number.int({ min: 1, max: 30 }),
     title: faker.book.title(),
     description: faker.lorem.sentences(),
     author_id: faker.number.int({ min: 1, max: 10 }),
     publishDate: faker.date.anytime(),
     price: faker.finance.amount(),
     genre: faker.book.genre()
   }
    books.push(book);
  }
  return books;
}

export {books}