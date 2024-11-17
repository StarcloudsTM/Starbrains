'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Edit, Trash, Plus, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Dataset {
  _id: string
  name: string
  description: string
  url: string
  userId: string
  createdAt: string
  updatedAt: string
}

export default function DatasetsPage() {
  const { user, isLoaded } = useUser()
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { toast } = useToast()

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null)
  const [datasetName, setDatasetName] = useState('')
  const [datasetDescription, setDatasetDescription] = useState('')
  const [datasetFile, setDatasetFile] = useState<File | null>(null)

  const fetchDatasets = useCallback(async () => {
    try {
      const response = await fetch('/api/datasets')
      if (!response.ok) {
        throw new Error('Failed to fetch datasets')
      }
      const data = await response.json()
      setDatasets(data)
    } catch (error) {
      setError('An error occurred while fetching datasets.')
      toast({
        title: "Error",
        description: "Failed to fetch datasets. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDatasets()
  }, [fetchDatasets])

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!datasetFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append('name', datasetName)
    formData.append('description', datasetDescription)
    formData.append('file', datasetFile)

    try {
      const response = await fetch('/api/datasets', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to publish dataset')
      }

      const newDataset = await response.json()
      setDatasets([newDataset, ...datasets])
      toast({
        title: "Success",
        description: "Dataset published successfully!",
      })
      setIsPublishDialogOpen(false)
      resetForm()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: `Failed to publish dataset: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDataset) return

    try {
      const response = await fetch(`/api/datasets/${editingDataset._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: datasetName,
          description: datasetDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update dataset')
      }

      const updatedDataset = await response.json()
      setDatasets(datasets.map(d => d._id === updatedDataset._id ? updatedDataset : d))
      toast({
        title: "Success",
        description: "Dataset updated successfully!",
      })
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: `Failed to update dataset: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dataset?')) return

    try {
      const response = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete dataset')
      }

      setDatasets(datasets.filter(d => d._id !== id))
      toast({
        title: "Success",
        description: "Dataset deleted successfully!",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error",
        description: `Failed to delete dataset: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setDatasetName('')
    setDatasetDescription('')
    setDatasetFile(null)
    setEditingDataset(null)
  }

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Datasets</h1>
        {user && (
          <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Publish New Dataset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Publish New Dataset</DialogTitle>
                <DialogDescription>
                  Add details about your dataset to publish it on Starbrains.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePublish}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                      File
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setDatasetFile(e.target.files?.[0] || null)}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Publish Dataset</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">Loading datasets...</div>
      ) : datasets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-xl font-semibold mb-4">No datasets available</p>
            {user && (
              <Button onClick={() => setIsPublishDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Publish Your First Dataset
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <Card key={dataset._id}>
              <CardHeader>
                <CardTitle>{dataset.name}</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Published on: {new Date(dataset.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(dataset.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download Dataset
                  </a>
                </Button>
                {user && user.id === dataset.userId && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingDataset(dataset)
                        setDatasetName(dataset.name)
                        setDatasetDescription(dataset.description)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(dataset._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Dataset</DialogTitle>
            <DialogDescription>
              Update your dataset details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={datasetDescription}
                  onChange={(e) => setDatasetDescription(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Dataset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
