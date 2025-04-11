"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2, FileDown, FileUp, Database, Trash2, Play, List, AlertTriangle, Table as TableIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type TableInfo = {
  name: string;
  rowCount: number;
  sizeInMb: number;
}

export default function DatabaseManagementPage() {
  const router = useRouter();
  
  // General states
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [sqlQuery, setSqlQuery] = useState("");
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeletingTable, setIsDeletingTable] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
  const [deletionConfirmText, setDeletionConfirmText] = useState("");
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // On component mount, fetch tables
  useState(() => {
    fetchTables();
  });

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/database/tables');
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run query');
      }
      
      setQueryResult(data);
    } catch (error) {
      console.error('Error running query:', error);
      alert(`Query error: ${error instanceof Error ? error.message : String(error)}`);
      setQueryResult({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDatabase = async () => {
    try {
      // Create a download link to the API endpoint
      const downloadUrl = '/api/admin/database/export';
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `database_export_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting database:', error);
      alert('Failed to export database');
    }
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete || deletionConfirmText !== tableToDelete) {
      return;
    }
    
    setIsDeletingTable(true);
    try {
      const response = await fetch(`/api/admin/database/tables/${tableToDelete}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete table');
      }
      
      // Reset states and refresh tables
      setTableToDelete(null);
      setDeletionConfirmText("");
      setIsDeleteDialogOpen(false);
      fetchTables();
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Failed to delete table');
    } finally {
      setIsDeletingTable(false);
    }
  };

  const handleImportDatabase = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('sqlFile', selectedFile);
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/database/import', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import database');
      }
      
      alert('Database import successful!');
      setIsUploadDialogOpen(false);
      fetchTables(); // Refresh tables
      setSelectedFile(null);
    } catch (error) {
      console.error('Error importing database:', error);
      alert(`Import error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteTableDialog = (tableName: string) => {
    setTableToDelete(tableName);
    setDeletionConfirmText("");
    setIsDeleteDialogOpen(true);
  };

  // UI for displaying query results
  const renderQueryResults = () => {
    if (!queryResult) return null;
    
    if (queryResult.error) {
      return (
        <div className="bg-red-950 text-red-200 p-4 rounded-md mt-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Query Error</h3>
          </div>
          <pre className="text-sm overflow-auto">{queryResult.error}</pre>
        </div>
      );
    }
    
    if (queryResult.rows && queryResult.rows.length > 0) {
      const columns = Object.keys(queryResult.rows[0]);
      
      return (
        <Card className="mt-4 bg-slate-800 border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">Results: {queryResult.rows.length} rows</h3>
            </div>
          </div>
          <div className="overflow-auto">
            <Table className="text-white">
              <TableHeader>
                <TableRow className="border-slate-700">
                  {columns.map((column) => (
                    <TableHead key={column} className="text-slate-300">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryResult.rows.map((row: any, rowIdx: number) => (
                  <TableRow key={rowIdx} className="border-slate-700">
                    {columns.map((column) => (
                      <TableCell key={`${rowIdx}-${column}`}>
                        {row[column] !== null && row[column] !== undefined
                          ? String(row[column])
                          : <span className="text-slate-500">NULL</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      );
    }
    
    if (queryResult.rowCount !== undefined) {
      return (
        <div className="bg-green-950 text-green-200 p-4 rounded-md mt-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <p>Query executed successfully. {queryResult.rowCount} rows affected.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-slate-800 p-4 rounded-md mt-4">
        <p className="text-slate-300">No results to display.</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Database Management</h1>
        <Button variant="outline" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-800 border-slate-700 text-white flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Database Export</h2>
            <FileDown className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-slate-400 mb-4 flex-grow">
            Export your entire database or specific tables as SQL scripts for backup purposes.
          </p>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleExportDatabase}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export Database
          </Button>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700 text-white flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Database Import</h2>
            <FileUp className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-slate-400 mb-4 flex-grow">
            Import SQL scripts to restore your database or migrate data from another system.
          </p>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Import SQL
          </Button>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700 text-white flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Database Actions</h2>
            <Database className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-slate-400 mb-4 flex-grow">
            Perform administrative tasks on your database, including cleanup and optimization.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="border-purple-700 text-purple-300 hover:bg-purple-950"
              onClick={fetchTables}
            >
              <TableIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="border-red-700 text-red-300 hover:bg-red-950"
              disabled={true} // Disable full database deletion for safety
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear DB
            </Button>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="query">SQL Query</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700 text-white p-0">
            <div className="p-4 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Database Tables</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-slate-300 border-slate-600"
                  onClick={fetchTables}
                >
                  <List className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-60">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table className="text-white">
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Table Name</TableHead>
                    <TableHead className="text-slate-300">Row Count</TableHead>
                    <TableHead className="text-slate-300">Size</TableHead>
                    <TableHead className="text-slate-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        No tables found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tables.map((table) => (
                      <TableRow key={table.name} className="border-slate-700">
                        <TableCell className="font-medium">{table.name}</TableCell>
                        <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                        <TableCell>{table.sizeInMb.toFixed(2)} MB</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                              onClick={() => openDeleteTableDialog(table.name)}
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
        
        <TabsContent value="query" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700 text-white p-4">
            <h3 className="font-semibold mb-4">Execute SQL Query</h3>
            <div className="space-y-4">
              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM users LIMIT 10;"
                className="bg-slate-900 border-slate-700 h-40 font-mono"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleRunQuery}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Run Query
                </Button>
              </div>
            </div>
            
            {renderQueryResults()}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Table Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action will permanently delete the table <span className="font-semibold text-white">{tableToDelete}</span> and cannot be undone.
              <div className="mt-4">
                <p className="mb-2">To confirm, type the table name:</p>
                <Input
                  value={deletionConfirmText}
                  onChange={(e) => setDeletionConfirmText(e.target.value)}
                  className="bg-slate-900 border-slate-700"
                  placeholder={tableToDelete || ""}
                />
              </div>
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
              onClick={handleDeleteTable}
              disabled={isDeletingTable || deletionConfirmText !== tableToDelete}
            >
              {isDeletingTable ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Table'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Upload SQL Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Import SQL</DialogTitle>
            <DialogDescription className="text-slate-400">
              Upload a SQL file to import into the database. This action can be destructive if the SQL contains DROP or DELETE statements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sqlFile" className="text-sm font-medium">
                SQL File
              </label>
              <Input
                id="sqlFile"
                type="file"
                accept=".sql"
                className="bg-slate-900 border-slate-700"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <p className="text-xs text-slate-400 mt-1">
                Only .sql files are accepted. Max size: 10MB
              </p>
            </div>
            
            <div className="bg-yellow-950 text-yellow-200 p-3 rounded-md text-sm mt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p>Warning: Importing SQL can modify or delete existing data. Make sure you have a backup before proceeding.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!selectedFile || isLoading}
              onClick={handleImportDatabase}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
