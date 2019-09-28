import TRoleNames from '@/models/TRoleNames'

export default class User {
  public name: string | null
  public role: TRoleNames
  public id: string

  constructor (
    id: string,
    name: string | null = null,
    role: TRoleNames = 'client'
  ) {
    this.name = name
    this.role = role
    this.id = id
  }

  public rename (store: any, caller: User, newName: string) {
    return new Promise((resolve, reject) => {
      const renameType = this.id === caller.id ? 'own' : 'other'
      store.dispatch('server/roles/hasPermission', {
        caller,
        path: `auth/rename/${renameType}`
      }).then((hasPermission: boolean) => {
        if (!hasPermission) {
          console.error(`permission to change ${renameType} username was denied. Caller:`, caller)
          throw new Error()
        }
        this.name = newName
        resolve(this)
      }).catch((e: Error) => {
        reject(e)
      })
    })
  }
}