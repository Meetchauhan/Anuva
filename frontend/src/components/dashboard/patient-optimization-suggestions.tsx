import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Check, Clock, AlertTriangle, Lightbulb, TrendingDown } from 'lucide-react';

export function PatientOptimizationSuggestions() {
  return (
    <Card className="shadow-lg mb-8">
      <CardHeader>
        <CardTitle>Anuva OS Optimization</CardTitle>
        <CardDescription>
          Human factors recommendations to reduce administrative burden
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Simplification Recommendations */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
              Workflow Simplification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">Current Challenges</h4>
                
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Excessive Documentation Time</p>
                    <p className="text-xs text-muted-foreground">Clinicians spend 30+ minutes per patient on documentation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Redundant Data Entry</p>
                    <p className="text-xs text-muted-foreground">Same information entered multiple times across forms</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Complex Navigation</p>
                    <p className="text-xs text-muted-foreground">Clinicians navigate through 8+ screens per patient visit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Low Patient Engagement</p>
                    <p className="text-xs text-muted-foreground">Patient-facing tools are difficult to use independently</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">Recommended Improvements</h4>
                
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">AI-Assisted Documentation</p>
                    <p className="text-xs text-muted-foreground">Auto-generation of notes from structured data reduces documentation time by 70%</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Single Data Entry</p>
                    <p className="text-xs text-muted-foreground">Enter information once and populate across all relevant forms</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Role-Based Dashboards</p>
                    <p className="text-xs text-muted-foreground">Unified single-screen interfaces customized by user role</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Patient Self-Reporting</p>
                    <p className="text-xs text-muted-foreground">Intuitive mobile interfaces for patients to report symptoms between visits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Experience Optimizations */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">User Experience Optimizations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg">
                <h4 className="font-medium text-primary">For Clinicians</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Voice-to-text symptom capture during patient interviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Visual comparison of patient progress across visits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>One-click ordering of tests based on symptoms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Smart templates for common injury patterns</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg">
                <h4 className="font-medium text-primary">For Patients</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Simplified symptom tracking with visual scales</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Personalized recovery progress dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Appointment reminders with preparation instructions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Educational content based on specific symptoms</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg">
                <h4 className="font-medium text-primary">For Administrators</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Automated billing based on clinical documentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Workflow analytics to identify bottlenecks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Staff utilization insights and optimization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Custom report builder with one-click exports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Administrative Burden Reduction */}
          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Administrative Burden Reduction</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Current Process</h4>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-red-200 dark:border-red-800">
                    <span className="text-sm">Documentation</span>
                    <span className="text-sm font-medium">28 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-red-200 dark:border-red-800">
                    <span className="text-sm">Data Analysis</span>
                    <span className="text-sm font-medium">15 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-red-200 dark:border-red-800">
                    <span className="text-sm">Patient Education</span>
                    <span className="text-sm font-medium">10 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">53 min/patient</span>
                  </div>
                </div>
                
                <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Optimized Process</h4>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-sm">Documentation</span>
                    <span className="text-sm font-medium">8 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-sm">Data Analysis</span>
                    <span className="text-sm font-medium">3 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-green-200 dark:border-green-800">
                    <span className="text-sm">Patient Education</span>
                    <span className="text-sm font-medium">5 min/patient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">16 min/patient</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">Administrative Time Savings</h4>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">70% Reduction</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on average clinical workflow analysis across 120 patient visits
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}