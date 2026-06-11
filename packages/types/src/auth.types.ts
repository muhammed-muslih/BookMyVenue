export type UserRole = "user" | "owner" | "admin";

export interface JWTPayload {
  id: string;
  roles: UserRole[];
  activeRole: UserRole;
}
