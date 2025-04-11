"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Plus, PenLine, Trash2, FileDown, UserPlus, AlertTriangle } from "lucide-react"

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  last_login: string
  created_at: string
  organization: string
}

type AccessRequest = {
  id: string
  email: string
  first_name: string
  last_name: string
  organization: string
  message: string
  status: string
  created_at: string
}

export default function UserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([])
  
  // User dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "user",
    organization: "",
    password: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  
  useEffect(() => {
    fetchUsers()
    fetchAccessRequests()
  }, [])
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(query) ||
        (user.first_name && user.first_name.toLowerCase().includes(query)) ||
        (user.last_name && user.last_name.toLowerCase().includes(query)) ||
        (user.organization && user.organization.toLowerCase().includes(query))
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])
  
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchAccessRequests = async () => {
    try {
      const response = await fetch('/api/admin/access-requests')
      if (!response.ok) throw new Error('Failed to fetch access requests')
      const data = await response.json()
      setAccessRequests(data)
    } catch (error) {
      console.error('Error fetching access requests:', error)
    }
  }
  
  const handleCreateUser = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      
      if (!response.ok) throw new Error('Failed to create user')
      
      // Reset form and close dialog
      setNewUser({
        email: "",
        firstName: "",
        lastName: "",
        role: "user",
        organization: "",
        password: ""
      })
      
      setIsUserDialogOpen(false)
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleUpdateUser = async () => {
    if (!selectedUser) return
    
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          role: newUser.role,
          organization: newUser.organization,
          is_active: true
        })
      })
      
      if (!response.ok) throw new Error('Failed to update user')
      
      setIsUserDialogOpen(false)
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete user')
      
      setIsDeleteDialogOpen(false)
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleApproveRequest = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/access-requests/${id}/approve`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to approve request')
      
      fetchAccessRequests() // Refresh requests
      fetchUsers() // Refresh user list
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    }
  }
  
  const handleRejectRequest = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/access-requests/${id}/reject`, {
        method: 'POST'
      })
      
      if (!response.ok) throw new Error('Failed to reject request')
      
      fetchAccessRequests() // Refresh requests
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    }
  }
  
  const openNewUserDialog = () => {
    setSelectedUser(null)
    setNewUser({
      email: "",
      firstName: "",
      lastName: "",
      role: "user",
      organization: "",
      password: ""
    })
    setIsUserDialogOpen(true)
  }
  
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user)
    setNewUser({
      email: user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role,
      organization: user.organization || '',
      password: ''
    })
    setIsUserDialogOpen(true)
  }
  
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </Button>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="access-requests">Access Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={openNewUserDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
          
          <Card className="bg-slate-800 border-slate-700 text-white">
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table className="text-white">
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Role</TableHead>
                    <TableHead className="text-slate-300">Organization</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Created</TableHead>
                    <TableHead className="text-slate-300">Last Login</TableHead>
                    <TableHead className="text-slate-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell className="font-medium">
                          <div>
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-slate-400 text-sm">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-900 text-purple-200' 
                                : 'bg-blue-900 text-blue-200'
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{user.organization || '-'}</TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.is_active 
                                ? 'bg-green-900 text-green-200' 
                                : 'bg-red-900 text-red-200'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0" 
                              onClick={() => openEditUserDialog(user)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300" 
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="access-requests" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <Table className="text-white">
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Organization</TableHead>
                  <TableHead className="text-slate-300">Message</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No pending access requests
                    </TableCell>
                  </TableRow>
                ) : (
                  accessRequests.map((request) => (
                    <TableRow key={request.id} className="border-slate-700">
                      <TableCell className="font-medium">
                        <div>
                          {request.first_name} {request.last_name}
                        </div>
                        <div className="text-slate-400 text-sm">{request.email}</div>
                      </TableCell>
                      <TableCell>{request.organization || '-'}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {request.message || 'No message provided'}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-900 border-green-700 text-green-200 hover:bg-green-800" 
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-900 border-red-700 text-red-200 hover:bg-red-800" 
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Dialog (Create/Edit) */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedUser 
                ? 'Update user details.'
                : 'Fill in the information to create a new user.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input 
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input 
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input 
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="organization" className="text-sm font-medium">
                Organization
              </label>
              <Input 
                id="organization"
                value={newUser.organization}
                onChange={(e) => setNewUser({...newUser, organization: e.target.value})}
                className="bg-slate-900 border-slate-700"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="rounded bg-slate-900 border border-slate-700 py-2 px-3"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {!selectedUser && (
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input 
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUserDialogOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={selectedUser ? handleUpdateUser : handleCreateUser}
              disabled={isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedUser ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                selectedUser ? 'Update User' : 'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action will permanently delete the user{' '}
              <span className="font-semibold text-white">
                {selectedUser?.email}
              </span>
              {' '}and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-slate-700 text-slate-300"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteUser}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
