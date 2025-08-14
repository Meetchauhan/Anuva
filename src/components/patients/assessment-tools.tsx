import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AssessmentToolsProps {
  patientId?: number;
  concussionId?: number;
}

export function AssessmentTools({ patientId, concussionId }: AssessmentToolsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('scat5');
  
  // In a real implementation, these would be backed by form state
  // and connected to the backend
  
  const handleSubmit = (toolName: string) => {
    if (!patientId || !concussionId) {
      toast({
        title: 'Cannot submit assessment',
        description: 'Missing patient or concussion information',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Assessment submitted',
      description: `${toolName} assessment has been saved to patient record`,
    });
  };
  
  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader>
        <CardTitle>Assessment Tools</CardTitle>
        <CardDescription>
          Standardized neurological assessment instruments for concussion evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scat5" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-neutral-800 mb-6">
            <TabsTrigger value="scat5">SCAT5</TabsTrigger>
            <TabsTrigger value="pcss">PCSS</TabsTrigger>
            <TabsTrigger value="bess">BESS</TabsTrigger>
          </TabsList>
          
          {/* SCAT5 Assessment */}
          <TabsContent value="scat5">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Sport Concussion Assessment Tool 5</h3>
                <p className="text-neutral-400 mb-4">
                  SCAT5 is a standardized tool for evaluating concussions, designed for use by 
                  healthcare professionals.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Symptom Evaluation</h4>
                  <p className="text-sm text-neutral-400">
                    This is automatically populated from the patient's symptom check-in
                  </p>
                  
                  <Separator className="my-4 bg-neutral-800" />
                  
                  <h4 className="font-medium">Cognitive Assessment</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orientation">Orientation (out of 5)</Label>
                      <Input 
                        id="orientation" 
                        type="number" 
                        min="0" 
                        max="5" 
                        className="bg-neutral-800 border-neutral-700" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="immediate-memory">Immediate Memory (out of 15)</Label>
                      <Input 
                        id="immediate-memory" 
                        type="number" 
                        min="0" 
                        max="15" 
                        className="bg-neutral-800 border-neutral-700" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="concentration">Concentration (out of 5)</Label>
                      <Input 
                        id="concentration" 
                        type="number" 
                        min="0" 
                        max="5" 
                        className="bg-neutral-800 border-neutral-700" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Neurological Screening</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cervical" />
                        <Label htmlFor="cervical">Cervical Assessment Normal</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coordination" />
                        <Label htmlFor="coordination">Coordination Normal</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ocular" />
                        <Label htmlFor="ocular">Ocular Movement Normal</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="balance" />
                        <Label htmlFor="balance">Balance Normal</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-neutral-800" />
                  
                  <h4 className="font-medium">Delayed Recall</h4>
                  
                  <div>
                    <Label htmlFor="delayed-recall">Delayed Recall (out of 5)</Label>
                    <Input 
                      id="delayed-recall" 
                      type="number" 
                      min="0" 
                      max="5" 
                      className="bg-neutral-800 border-neutral-700" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSubmit('SCAT5')}>
                  Save SCAT5 Assessment
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* PCSS Assessment */}
          <TabsContent value="pcss">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Post-Concussion Symptom Scale</h3>
                <p className="text-neutral-400 mb-4">
                  The PCSS is a 22-item symptom scale designed for the assessment of concussion symptoms.
                </p>
                <div className="bg-primary-dark/20 p-4 rounded-md text-neutral-200 mb-4">
                  <p>This assessment is automatically completed via the Symptom Log module.</p>
                  <p className="mt-2">Please navigate to the Symptom Log tab to record patient symptoms.</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setActiveTab('scat5')} className="mr-2">
                  Back to SCAT5
                </Button>
                <Button onClick={() => setActiveTab('bess')}>
                  Go to BESS Assessment
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* BESS Assessment */}
          <TabsContent value="bess">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Balance Error Scoring System (BESS)</h3>
                <p className="text-neutral-400 mb-4">
                  The BESS is a clinical test of static balance used to assess individuals with suspected concussions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Firm Surface</h4>
                  
                  <div>
                    <Label htmlFor="double-stance-firm">Double Leg Stance Errors</Label>
                    <Input 
                      id="double-stance-firm" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="single-stance-firm">Single Leg Stance Errors</Label>
                    <Input 
                      id="single-stance-firm" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tandem-stance-firm">Tandem Stance Errors</Label>
                    <Input 
                      id="tandem-stance-firm" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Foam Surface</h4>
                  
                  <div>
                    <Label htmlFor="double-stance-foam">Double Leg Stance Errors</Label>
                    <Input 
                      id="double-stance-foam" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="single-stance-foam">Single Leg Stance Errors</Label>
                    <Input 
                      id="single-stance-foam" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tandem-stance-foam">Tandem Stance Errors</Label>
                    <Input 
                      id="tandem-stance-foam" 
                      type="number" 
                      min="0" 
                      max="10" 
                      className="bg-neutral-800 border-neutral-700" 
                      placeholder="0-10"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-md bg-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-neutral-400">Total BESS Score:</span>
                  <span className="ml-2 text-lg font-bold">0</span>
                  <span className="ml-1 text-sm text-neutral-400">/ 60</span>
                </div>
                <div className="text-sm text-neutral-400">
                  Lower scores indicate better balance performance
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSubmit('BESS')}>
                  Save BESS Assessment
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
