'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Search } from "lucide-react"

interface AppCard {
  id: string
  name: string
  description: string
  githubUrl: string
  category: 'Backend' | 'ML'
}


const initialApps: AppCard[] = [
    {
      "id": "1",
      "name": "RestAPI Server",
      "description": "A high-performance backend server using Flask framework.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/restapi.py",
      "category": "Backend"
    },
    {
      "id": "2",
      "name": "JWT Authentication",
      "description": "JWT-based authentication implementation in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/JWTauth.py",
      "category": "Backend"
    },
    {
      "id": "3",
      "name": "File Upload",
      "description": "File upload functionality for Flask apps.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/file_upload.py",
      "category": "Backend"
    },
    {
      "id": "4",
      "name": "Flask Mail",
      "description": "Email sending capabilities using Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_mail.py",
      "category": "Backend"
    },
    {
      "id": "5",
      "name": "Modular Flask App",
      "description": "A modular structure for Flask applications.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_modular.py",
      "category": "Backend"
    },
    {
      "id": "6",
      "name": "Flask with Redis",
      "description": "Redis integration for caching in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_redis.py",
      "category": "Backend"
    },
    {
      "id": "7",
      "name": "Flask SocketIO",
      "description": "Real-time communication with SocketIO in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_socketIO.py",
      "category": "Backend"
    },
    {
      "id": "8",
      "name": "Pagination in Flask",
      "description": "Pagination support in Flask applications.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_with_pagination.py",
      "category": "Backend"
    },
    {
      "id": "9",
      "name": "SQL Integration in Flask",
      "description": "SQL database integration in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/flask_with_sql.py",
      "category": "Backend"
    },
    {
      "id": "10",
      "name": "JSON Utility",
      "description": "Utility for handling JSON data.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/json.py",
      "category": "Backend"
    },
    {
      "id": "11",
      "name": "Login Functionality",
      "description": "User login and session management in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/login.py",
      "category": "Backend"
    },
    {
      "id": "12",
      "name": "Parameter Handling",
      "description": "Handling parameters and configurations in Flask.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/flask/params.py",
      "category": "Backend"
    },
    {
      "id": "13",
      "name": "Django Framework",
      "description": "Setup for Django backend framework.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django.py",
      "category": "Backend"
    },
    {
      "id": "14",
      "name": "Django Email",
      "description": "Email handling in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_email.py",
      "category": "Backend"
    },
    {
      "id": "15",
      "name": "Django Forms",
      "description": "Form handling in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_forms.py",
      "category": "Backend"
    },
    {
      "id": "16",
      "name": "Django Login",
      "description": "Login functionality in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_login.py",
      "category": "Backend"
    },
    {
      "id": "17",
      "name": "Django ORM",
      "description": "Object-Relational Mapping in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_orm.py",
      "category": "Backend"
    },
    {
      "id": "18",
      "name": "Django Pagination",
      "description": "Pagination functionality in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_pagination.py",
      "category": "Backend"
    },
    {
      "id": "19",
      "name": "Django SQLite",
      "description": "SQLite integration in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/django_sqlite.py",
      "category": "Backend"
    },
    {
      "id": "20",
      "name": "Middleware in Django",
      "description": "Middleware handling in Django applications.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/middle.ware.py",
      "category": "Backend"
    },
    {
      "id": "21",
      "name": "URL Routing in Django",
      "description": "URL routing setup in Django.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/backend/django/url.routing.py",
      "category": "Backend"
    },
    {
      "id": "22",
      "name": "ARIMA",
      "description": "Implementation of ARIMA model for time series analysis.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/ARIMA.py",
      "category": "ML"
    },
    {
      "id": "23",
      "name": "DBSCAN",
      "description": "Density-Based Spatial Clustering of Applications with Noise algorithm.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/DBSCAN.py",
      "category": "ML"
    },
    {
      "id": "24",
      "name": "K-means Clustering",
      "description": "Implementation of K-means clustering algorithm.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/K-means_clustering.py",
      "category": "ML"
    },
    {
      "id": "25",
      "name": "K-nearest Neighbors",
      "description": "K-nearest neighbors algorithm for classification and regression.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/K-nearest_neighbors.py",
      "category": "ML"
    },
    {
      "id": "26",
      "name": "MLP",
      "description": "Multi-Layer Perceptron neural network implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/MLP.py",
      "category": "ML"
    },
    {
      "id": "27",
      "name": "PCA",
      "description": "Principal Component Analysis for dimensionality reduction.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/PCA.py",
      "category": "ML"
    },
    {
      "id": "28",
      "name": "SVM",
      "description": "Support Vector Machine algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/SVM.py",
      "category": "ML"
    },
    {
      "id": "29",
      "name": "XGBoost Classifier",
      "description": "XGBoost algorithm implementation for classification tasks.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/XGBoost_classifier.py",
      "category": "ML"
    },
    {
      "id": "30",
      "name": "AdaBoost",
      "description": "AdaBoost ensemble learning algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/adaboost.py",
      "category": "ML"
    },
    {
      "id": "31",
      "name": "Decision Trees",
      "description": "Decision tree algorithm for classification and regression.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/decision_trees.py",
      "category": "ML"
    },
    {
      "id": "32",
      "name": "Gradient Boosting Classifier",
      "description": "Gradient Boosting algorithm implementation for classification.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/gradient_boosting_classifier.py",
      "category": "ML"
    },
    {
      "id": "33",
      "name": "Hierarchical Clustering",
      "description": "Hierarchical clustering algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/hierarchical_clustering.py",
      "category": "ML"
    },
    {
      "id": "34",
      "name": "Lasso Regression",
      "description": "Lasso Regression algorithm for feature selection and regularization.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/lasso_regression.py",
      "category": "ML"
    },
    {
      "id": "35",
      "name": "LightGBM Classifier",
      "description": "LightGBM algorithm implementation for classification tasks.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/lightGBM_classifier.py",
      "category": "ML"
    },
    {
      "id": "36",
      "name": "Linear Regression",
      "description": "Linear Regression algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/linear_regression.py",
      "category": "ML"
    },
    {
      "id": "37",
      "name": "Logistic Regression",
      "description": "Logistic Regression algorithm for binary classification.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/logistic_regression.py",
      "category": "ML"
    },
    {
      "id": "38",
      "name": "Naive Bayes",
      "description": "Naive Bayes algorithm implementation for classification.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/naive_bayes.py",
      "category": "ML"
    },
    {
      "id": "39",
      "name": "Polynomial Regression",
      "description": "Polynomial Regression algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/polynomial_regression.py",
      "category": "ML"
    },
    {
      "id": "40",
      "name": "Random Forest",
      "description": "Random Forest ensemble learning algorithm implementation.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/random_forest.py",
      "category": "ML"
    },
    {
      "id": "41",
      "name": "Ridge Regression",
      "description": "Ridge Regression algorithm for regularization.",
      "githubUrl": "https://github.com/StarcloudsTM/Brains/blob/main/ml/ridge_regression.py",
      "category": "ML"
    }
  ]

  export default function BrainsPYPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [apps] = useState<AppCard[]>(initialApps)
  
    const categories = ['All', 'Backend', 'ML']
  
    const filteredApps = apps.filter(app =>
      (selectedCategory === 'All' || app.category === selectedCategory) &&
      (app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">BrainsPY: AI/ML/Python Apps</h1>
        
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>{app.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Category: {app.category}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={app.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
  
        {filteredApps.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-xl font-semibold">No apps found matching your search.</p>
          </div>
        )}
      </div>
    )
  }