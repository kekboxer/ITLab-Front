import { IUser } from '@/modules/users';

export const getNounDeclension = (value: number, forms: string[]): string => {
  let n = Math.abs(value) % 100;

  if (n >= 5 && n <= 20) {
    return forms[2] || '';
  }

  n %= 10;
  if (n === 1) {
    return forms[0];
  }

  if (n >= 2 && n <= 4) {
    return forms[1];
  }
  return forms[2];
};

export const getUserFullName = (user: IUser): string => {
  return `${user.firstName} ${user.lastName}`;
};
