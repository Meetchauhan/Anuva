import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Check, CircleAlert, Settings, Sparkles, Clipboard, Upload } from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import type { SoapNote, ClinicalAlert, SuggestedOrder } from "../../types";
import type { cn, getSeverityColor } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface AIDocumentationProps {
  soapNote?: SoapNote;
  loading?: boolean;
  error?: string;
}

export function AIDocumentation({ soapNote, loading, error }: AIDocumentationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState<SuggestedOrder[]>(
    soapNote?.suggestedOrders || []
  );
  
  const handleApproveNote = async () => {
    if (!soapNote) return;
    
    try {
      await apiRequest("PATCH", `/api/soap-notes/${soapNote.id}`, {
        status: "signed",
        updatedAt: new Date()
      });
      
      toast({
        title: "SOAP Note approved",
        description: "Documentation has been signed and saved to patient record.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: [`/api/soap-notes/${soapNote.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${soapNote.patientId}/soap-notes`] });
      
    } catch (error) {
      toast({
        title: "Error approving note",
        description: "There was a problem signing the documentation.",
        variant: "destructive",
      });
    }
  };
  
  const toggleOrder = async (index: number) => {
    if (!soapNote) return;
    
    const updatedOrders = [...orders];
    updatedOrders[index] = {
      ...updatedOrders[index],
      completed: !updatedOrders[index].completed
    };
    
    setOrders(updatedOrders);
    
    try {
      await apiRequest("PATCH", `/api/soap-notes/${soapNote.id}`, {
        suggestedOrders: updatedOrders
      });
      
    } catch (error) {
      // Revert on error
      setOrders(soapNote.suggestedOrders || []);
      
      toast({
        title: "Error updating orders",
        description: "There was a problem updating the suggested orders.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            <CardTitle className="text-lg font-semibold">Documentation Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-status-yellow bg-status-yellow bg-opacity-10 rounded-full px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-status-yellow mr-1" />
              Local Mode
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <div className="p-4 bg-neutral-800/50 text-xs text-neutral-400 font-medium border-b border-neutral-800">
          AI integration is currently disabled. Loading documentation from local data.
        </div>
        <CardContent>
          <div className="p-8 text-center text-neutral-400">
            Loading documentation...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            <CardTitle className="text-lg font-semibold">Documentation Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-status-red bg-status-red bg-opacity-10 rounded-full px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-status-red mr-1" />
              Error
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <div className="p-4 bg-neutral-800/50 text-xs text-neutral-400 font-medium border-b border-neutral-800">
          AI integration is currently disabled. Local data access encountered an error.
        </div>
        <CardContent>
          <div className="p-8 text-center text-status-red">
            Error loading documentation: {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!soapNote) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            <CardTitle className="text-lg font-semibold">Documentation Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-xs text-neutral-400 bg-neutral-400 bg-opacity-10 rounded-full px-2 py-1">
              <span className="w-2 h-2 rounded-full bg-neutral-400 mr-1" />
              Inactive
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <div className="p-4 bg-neutral-800/50 text-xs text-neutral-400 font-medium border-b border-neutral-800">
          AI integration is currently disabled. No documentation is available for this patient.
        </div>
        <CardContent>
          <div className="p-8 text-center text-neutral-400">
            No documentation available for this patient
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
        <div className="flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-primary" />
          <CardTitle className="text-lg font-semibold">Documentation Assistant</CardTitle>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-status-yellow bg-status-yellow bg-opacity-10 rounded-full px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-status-yellow mr-1" />
            Local Mode
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <div className="p-4 bg-neutral-800/50 text-xs text-neutral-400 font-medium border-b border-neutral-800">
        AI integration is currently disabled. Documentation features are working with local data only.
      </div>
      
      <CardContent className="p-4">
        <div className="bg-neutral-800 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Generated SOAP Note</h4>
          <div className="space-y-3 text-sm">
            <div>
              <h5 className="text-neutral-400 uppercase text-xs font-bold mb-1">SUBJECTIVE</h5>
              <p className="whitespace-pre-line">{soapNote.subjective}</p>
            </div>
            
            <div>
              <h5 className="text-neutral-400 uppercase text-xs font-bold mb-1">OBJECTIVE</h5>
              <p className="whitespace-pre-line">{soapNote.objective}</p>
            </div>
            
            <div>
              <h5 className="text-neutral-400 uppercase text-xs font-bold mb-1">ASSESSMENT</h5>
              <p className="whitespace-pre-line">{soapNote.assessment}</p>
            </div>
            
            <div>
              <h5 className="text-neutral-400 uppercase text-xs font-bold mb-1">PLAN</h5>
              <div className="whitespace-pre-line">{soapNote.plan}</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div className="text-xs text-neutral-400">
              {soapNote.aiGenerated 
                ? "Generated from encounter data and audio transcript"
                : "Manually entered documentation"}
            </div>
            <div className="flex space-x-3">
              <Button variant="link" className="text-primary p-0 h-auto">
                <Clipboard className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto"
                onClick={handleApproveNote}
              >
                <Check className="w-4 h-4 mr-1" />
                Approve & Sign
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-800 p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <CircleAlert className="w-5 h-5 mr-1" />
              Clinical Alerts
            </h4>
            <ul className="space-y-2 text-sm">
              {soapNote.clinicalAlerts?.map((alert: ClinicalAlert, index) => (
                <li key={index} className={cn("flex items-center", getSeverityColor(alert.severity))}>
                  <CircleAlert className="w-4 h-4 mr-2" />
                  {alert.message}
                </li>
              ))}
              {(!soapNote.clinicalAlerts || soapNote.clinicalAlerts.length === 0) && (
                <li className="text-neutral-400">No clinical alerts</li>
              )}
            </ul>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <Clipboard className="w-5 h-5 mr-1" />
              Suggested Orders
            </h4>
            <ul className="space-y-2 text-sm">
              {orders.map((order, index) => (
                <li key={index} className="flex items-center">
                  <Checkbox 
                    id={`order-${index}`}
                    checked={order.completed}
                    onCheckedChange={() => toggleOrder(index)}
                    className="mr-2 h-4 w-4"
                  />
                  <label 
                    htmlFor={`order-${index}`}
                    className={order.completed ? "line-through text-neutral-400" : ""}
                  >
                    {order.name}
                  </label>
                </li>
              ))}
              {(!orders || orders.length === 0) && (
                <li className="text-neutral-400">No suggested orders</li>
              )}
            </ul>
          </div>
          
          <div className="bg-neutral-800 p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-1" />
              Follow-up Planning
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-neutral-400">Next appointment</p>
                <p className="font-medium">Friday, May 19, 2023 at 2:00 PM</p>
              </div>
              <div>
                <p className="text-neutral-400">Refer to</p>
                <div className="flex items-center mt-1">
                  <select className="bg-neutral-700 border-0 rounded text-sm py-1 px-2 w-full">
                    <option>Select specialist</option>
                    <option>Neuropsychology</option>
                    <option>Vestibular Therapy</option>
                    <option>Sports Medicine</option>
                  </select>
                  <Button className="bg-primary ml-2 p-1 h-auto">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Calendar(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}
