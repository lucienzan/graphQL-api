import { faker } from '@faker-js/faker';

let authorList = [];
const authors = () => {
  for (let i = 0; i < 10; i++) {
    authorList.push({
      id: faker.number.int({min:1, max:10}),
      firstName: faker.person.firstName("male"),
      lastName: faker.person.lastName("male"),
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.person.bio(),
      address: faker.location.streetAddress(true)
    });
  }
  return authorList;
}
const setAuthors = (newAuthors) => {
  authorList = newAuthors;
};

export { authors, setAuthors };