import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { isUnauthorizedError } from "../../lib/authUtils";
import SimpleQuestionnaire from "../../components/forms/simple-questionnaire";
import type { IntakeForm } from "../../../../backend/shared/schema";

export default function TodoList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedForm, setSelectedForm] = useState<IntakeForm | null>(null);

  const { data: intakeForms = [], isLoading } = useQuery<IntakeForm[]>({
    queryKey: ["/api/intake-forms"],
  });

  const completeMutation = useMutation({
    mutationFn: async (formId: number) => {
      await apiRequest("PATCH", `/api/intake-forms/${formId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/intake-forms"] });
      toast({
        title: "Form Completed",
        description: "Your intake form has been marked as complete.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to complete form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string, status: string) => {
    if (status === "completed") return "bg-green-50 border-green-200";
    
    switch (priority) {
      case "urgent":
        return "bg-orange-50 border-orange-200";
      case "high":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadge = (form: IntakeForm) => {
    if (form.status === "completed") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    }

    const isOverdue = form.dueDate && new Date(form.dueDate) < new Date();
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          Overdue
        </Badge>
      );
    }

    if (form.priority === "urgent") {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Urgent
        </Badge>
      );
    }

    const daysLeft = form.dueDate 
      ? Math.ceil((new Date(form.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;

    if (daysLeft !== null && daysLeft <= 3) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          {daysLeft === 0 ? 'Due today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Pending
      </Badge>
    );
  };

  const pendingForms = intakeForms.filter(form => form.status !== "completed");
  const completedForms = intakeForms.filter(form => form.status === "completed");

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">TO-DO: Assessment & Care Forms</h3>
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            {pendingForms.length} Pending
          </Badge>
        </div>

        <div className="space-y-4">
          {pendingForms.length === 0 && completedForms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No forms available</p>
              <p className="text-sm">Your intake forms will appear here when available.</p>
            </div>
          ) : pendingForms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-green-700">All forms completed!</p>
              <p className="text-sm">Great job staying on top of your healthcare.</p>
            </div>
          ) : (
            pendingForms.map((form) => (
              <div
                key={form.id}
                className={`flex items-center p-4 border rounded-lg ${getPriorityColor(form.priority, form.status)}`}
              >
                <div className="flex-shrink-0 mr-4">
                  {getPriorityIcon(form.priority)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{form.title}</h4>
                  <p className="text-sm text-gray-600">{form.description}</p>
                  {form.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(form.dueDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(form)}
                  <Button
                    onClick={() => setSelectedForm(form)}
                    className="hover:bg-[#1F5A42]/90 text-white bg-[#1F5A42]"
                  >
                    Start Form
                  </Button>
                </div>
              </div>
            ))
          )}

          {/* Completed forms */}
          {completedForms.map((form) => (
            <div
              key={form.id}
              className="flex items-center p-4 border border-green-200 bg-green-50 rounded-lg opacity-75"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 mr-4 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{form.title}</h4>
                <p className="text-sm text-gray-600">{form.description}</p>
                {form.completedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Completed on {new Date(form.completedAt).toLocaleDateString('en-US')}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Questionnaire Modal */}
      {selectedForm && (
        <SimpleQuestionnaire
          form={selectedForm}
          onClose={() => setSelectedForm(null)}
        />
      )}
    </Card>
  );
}
