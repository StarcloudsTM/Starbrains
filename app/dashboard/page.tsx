import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardHome() {
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Starbrains</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">BrainsPY</CardTitle>
                      </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Python Code Snippet</div>
            <p className="text-xs text-muted-foreground">100+ Python Backend + Data Science Codes </p>
            <a href="/dashboard/brains"><Button>Get Started</Button></a>
          </CardContent>
          
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
                      </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50+ Machine Learing Models</div>
            <p className="text-xs text-muted-foreground">Publish Your ML/AI Project Here</p>
            <a href="/dashboard/projects/"><Button>Get Started</Button></a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">MLHUB</CardTitle>
                      </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Datasets</div>
            <p className="text-xs text-muted-foreground">Upload, Publish, Collaborate Start Your Machine Learing Project Here</p>
          <a href="/dashboard/datasets/"><Button>Get Started</Button></a>
          </CardContent>
        </Card>
      </div>
      
    </>
  )
}
