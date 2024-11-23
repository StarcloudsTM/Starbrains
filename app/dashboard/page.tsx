'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, FileText } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface DashboardData {
  datasetCount: number
  projectCount: number
  datasetGrowth: { date: string; count: number }[]
  projectGrowth: { date: string; count: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isUserLoaded || !user) return

      try {
        setIsLoading(true)
        setError(null)

        const [datasetsResponse, projectsResponse] = await Promise.all([
          fetch('/api/datasets'),
          fetch('/api/projects')
        ])

        if (!datasetsResponse.ok || !projectsResponse.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const datasetsData = await datasetsResponse.json()
        const projectsData = await projectsResponse.json()

        // Simulate growth data (replace with actual data in production)
        const datasetGrowth = [
          { date: '2023-01', count: 5 },
          { date: '2023-02', count: 10 },
          { date: '2023-03', count: 15 },
          { date: '2023-04', count: 20 },
          { date: '2023-05', count: datasetsData.length },
        ]

        const projectGrowth = [
          { date: '2023-01', count: 2 },
          { date: '2023-02', count: 5 },
          { date: '2023-03', count: 8 },
          { date: '2023-04', count: 12 },
          { date: '2023-05', count: projectsData.length },
        ]

        setDashboardData({
          datasetCount: datasetsData.length,
          projectCount: projectsData.length,
          datasetGrowth,
          projectGrowth,
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [isUserLoaded, user])

  if (!isUserLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const pieData = [
    { name: 'Datasets', value: dashboardData?.datasetCount || 0 },
    { name: 'Projects', value: dashboardData?.projectCount || 0 },
  ]

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.datasetCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.projectCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Growth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dashboardData?.datasetGrowth.map((d, i) => ({
                  ...d,
                  projectCount: dashboardData.projectGrowth[i].count,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Datasets" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="projectCount" name="Projects" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Distribution of Datasets and Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
      </div>
    </div>
  )
}
