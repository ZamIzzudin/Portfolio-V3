/** Global app-wide types live here. Module-specific types should sit next to their module. */

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface NavLink {
  to: string
  label: string
}
