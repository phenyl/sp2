import { Restorable } from "@sp2/format";

@Restorable<Person>()
export class Person {
  name: Name;
  birthday: Date;
  constructor(params: { name: PlainName; birthday: Date | string }) {
    this.name = new Name(params.name);
    this.birthday = new Date(params.birthday);
  }
}

@Restorable<Name>()
export class Name {
  first: string;
  last: string;
  constructor(params: PlainName) {
    this.first = params.first;
    this.last = params.last;
  }
}

type PlainName = { first: string; last: string };

export class NonRestorablePerson {
  name: Name;
  birthday: Date;
  constructor(name: PlainName, birthday: Date | string) {
    this.name = new Name(name);
    this.birthday = new Date(birthday);
  }
}
