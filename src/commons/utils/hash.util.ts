import bcrypt from "bcryptjs"

export default class HashUtil{
  static hashPW(password: string){
    return bcrypt.hash(password, 10);
  }
  static comparePW(password: string, passwordHash: string ){
    return bcrypt.compare(password, passwordHash);
  }
}