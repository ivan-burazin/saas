import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

interface Workspace {
  id: string;
  name: string;
  status: string;
}

interface ApiKey {
  name: string;
  key: string;
}

function App() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const apiBaseUrl = 'https://api-a0534c9b-df6d-40f5-8657-792993bc24ec.try-eu.daytona.app'
  
  // Set initial auth token
  useEffect(() => {
    setAuthToken('ZTVlYTkzYzMtZGVmMi00OGJlLThjYzItOThiNDE5MmM2YWZj')
  }, [])

  // Handle API key input
  const handleAuthKeySubmit = async (key: string) => {
    setAuthToken(key)
    setError(null)
    
    // Validate the API key by attempting to fetch workspaces
    try {
      const response = await fetch(`${apiBaseUrl}/workspace`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        }
      })
      if (!response.ok) {
        throw new Error('Invalid API key')
      }
    } catch (error) {
      console.error('Error validating API key:', error)
      setError('Invalid API key. Please check your credentials.')
      setAuthToken('')
    }
  }

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!authToken) return
      try {
        const response = await fetch(`${apiBaseUrl}/workspace/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch workspaces: ${response.statusText}`)
        }
        const data = await response.json()
        setWorkspaces(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching workspaces:', error)
        setError('Failed to fetch workspaces. Please check your API key.')
        setWorkspaces([])
      }
    }
    fetchWorkspaces()
  }, [apiBaseUrl, authToken])

  // Fetch API keys
  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!authToken) return
      try {
        const response = await fetch(`${apiBaseUrl}/apikey/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch API keys: ${response.statusText}`)
        }
        const data = await response.json()
        setApiKeys(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching API keys:', error)
        setError('Failed to fetch API keys. Please check your API key.')
        setApiKeys([])
      }
    }
    fetchApiKeys()
  }, [apiBaseUrl, authToken])

  // Delete workspace
  const deleteWorkspace = async (id: string) => {
    if (!authToken) return
    try {
      const response = await fetch(`${apiBaseUrl}/workspace/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setWorkspaces(workspaces.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting workspace:', error)
    }
  }

  // Generate API key
  const generateApiKey = async () => {
    if (!newKeyName || !authToken) return
    try {
      const response = await fetch(`${apiBaseUrl}/apikey/${newKeyName}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setApiKeys([...apiKeys, { name: newKeyName, key: data.key }])
      setNewKeyName('')
    } catch (error) {
      console.error('Error generating API key:', error)
    }
  }

  // Delete API key
  const deleteApiKey = async (name: string) => {
    if (!authToken) return
    try {
      const response = await fetch(`${apiBaseUrl}/apikey/${name}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      setApiKeys(apiKeys.filter(k => k.name !== name))
    } catch (error) {
      console.error('Error deleting API key:', error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Daytona Dashboard</h1>
      
      {!authToken ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter API Key</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter your API key"
              type="password"
              onChange={(e) => handleAuthKeySubmit(e.target.value)}
            />
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="workspaces">
        <TabsList className="mb-4">
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell>{workspace.id}</TableCell>
                    <TableCell>{workspace.name}</TableCell>
                    <TableCell>{workspace.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteWorkspace(workspace.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="apikeys">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Enter API key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
            <Button onClick={generateApiKey}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Key
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.name}>
                    <TableCell>{apiKey.name}</TableCell>
                    <TableCell>{apiKey.key}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteApiKey(apiKey.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      )}
    </div>
  )
}

export default App
