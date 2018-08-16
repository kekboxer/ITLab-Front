// actions
export const USER_SEARCH = "USER_SEARCH"
export const USER_ASSIGN_EQUIPMENT = "PROFILE_ASSIGN_EQUIPMENT"
export const USER_REMOVE_EQUIPMENT = "PROFILE_REMOVE_EQUIPMENT"


// User //
/////////

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}


export class UserDefault implements User {
  id: string = ""
  firstName: string = ""
  lastName: string = ""
  email: string = ""
}

// State //
//////////

export interface UsersState {
  users: User[]
}