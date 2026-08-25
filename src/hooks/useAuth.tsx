/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../types'

export type AuthUser = User & { password: string; status: 'Active' | 'Inactive' }
const usersKey = 'supporthub_users'
const currentUserKey = 'supporthub_current_user'
const demoUsers: AuthUser[] = [
  { name: 'Alex Morgan', email: 'admin@supporthub.com', password: 'Admin@123', role: 'Admin', initials: 'AM', status: 'Active' },
  { name: 'John Doe', email: 'john@supporthub.com', password: 'Developer@123', role: 'Developer', initials: 'JD', status: 'Active' },
  { name: 'Sarah Wilson', email: 'sarah@supporthub.com', password: 'Developer@456', role: 'Developer', initials: 'SW', status: 'Active' },
]
function readUsers(): AuthUser[] { try { const saved = localStorage.getItem(usersKey); if (saved) return JSON.parse(saved) as AuthUser[] } catch { /* use demo users */ } return demoUsers }
function readCurrentUser(): AuthUser | null { try { const saved = localStorage.getItem(currentUserKey); return saved ? JSON.parse(saved) as AuthUser : null } catch { return null } }

type AuthContextValue = { users: AuthUser[]; currentUser: AuthUser | null; isAuthenticated: boolean; isLoading: boolean; login: (email: string, password: string, remember: boolean) => string | null; logout: () => void; createUser: (user: AuthUser) => void; updateUser: (email: string, changes: Partial<AuthUser>) => void; deleteUser: (email: string) => void; resetPassword: (email: string) => string }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) { const [users, setUsers] = useState<AuthUser[]>(readUsers); const [currentUser, setCurrentUser] = useState<AuthUser | null>(readCurrentUser); const isLoading = false; useEffect(() => { localStorage.setItem(usersKey, JSON.stringify(users)) }, [users]); useEffect(() => { if (currentUser) localStorage.setItem(currentUserKey, JSON.stringify(currentUser)); else localStorage.removeItem(currentUserKey) }, [currentUser]); const login = (email: string, password: string, remember: boolean) => { const user = users.find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password); if (!user) return 'The email or password is incorrect.'; if (user.status !== 'Active') return 'This account is inactive. Contact an administrator.'; setCurrentUser(user); if (!remember) sessionStorage.setItem('supporthub_session', '1'); return null }; const logout = () => setCurrentUser(null); const createUser = (user: AuthUser) => setUsers(items => [...items, user]); const updateUser = (email: string, changes: Partial<AuthUser>) => { setUsers(items => items.map(item => item.email === email ? { ...item, ...changes } : item)); setCurrentUser(user => user?.email === email ? { ...user, ...changes } : user) }; const deleteUser = (email: string) => setUsers(items => items.filter(item => item.email !== email)); const resetPassword = (email: string) => { const password = `Demo@${Math.floor(100000 + Math.random() * 900000)}`; updateUser(email, { password }); return password }; return <AuthContext.Provider value={{ users, currentUser, isAuthenticated: Boolean(currentUser), isLoading, login, logout, createUser, updateUser, deleteUser, resetPassword }}>{children}</AuthContext.Provider> }
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }
