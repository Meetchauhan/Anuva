import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SymptomSlider } from '@/components/ui/symptom-slider';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SymptomCheckin, Symptom } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';

interface SymptomFormProps {
  patientId: number;
  concussionId?: number;
  existingCheckins: SymptomCheckin[];
}

export function SymptomForm({ patientId, concussionId, existingCheckins }: SymptomFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get the latest check-in if available
  const latestCheckin = existingCheckins.length > 0
    ? existingCheckins.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())[0]
    : null;
  
  // Initial symptoms setup
  const defaultSymptoms: Symptom[] = [
    // Cognitive symptoms
    { category: 'cognitive', name: 'Difficulty concentrating', value: 0 },
    { category: 'cognitive', name: 'Difficulty remembering', value: 0 },
    { category: 'cognitive', name: 'Feeling slowed down', value: 0 },
    { category: 'cognitive', name: 'Feeling in a fog', value: 0 },
    
    // Physical symptoms
    { category: 'physical', name: 'Headache', value: 0 },
    { category: 'physical', name: 'Sensitivity to light', value: 0 },
    { category: 'physical', name: 'Sensitivity to noise', value: 0 },
    { category: 'physical', name: 'Dizziness', value: 0 },
    { category: 'physical', name: 'Nausea', value: 0 },
    { category: 'physical', name: 'Balance problems', value: 0 },
    { category: 'physical', name: 'Fatigue', value: 0 },
    
    // Emotional symptoms
    { category: 'emotional', name: 'Irritability', value: 0 },
    { category: 'emotional', name: 'Sadness', value: 0 },
    { category: 'emotional', name: 'Nervousness', value: 0 },
    { category: 'emotional', name: 'Feeling more emotional', value: 0 }
  ];
  
  // State for form
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    // Use latest check-in values if available, otherwise use defaults
    if (latestCheckin) {
      // Create a mapping of symptom names to values from latest check-in
      const latestSymptomMap = new Map(
        latestCheckin.symptoms.map(s => [s.name, s.value])
      );
      
      // Update default symptoms with values from latest check-in
      return defaultSymptoms.map(s => ({
        ...s,
        value: latestSymptomMap.has(s.name) ? latestSymptomMap.get(s.name)! : 0
      }));
    }
    
    return defaultSymptoms;
  });
  
  const [notes, setNotes] = useState<string>('');
  
  // Calculate total PCSS score
  const pcssTotal = symptoms.reduce((sum, symptom) => sum + symptom.value, 0);
  
  // Mutation for submitting symptoms
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!concussionId) {
        throw new Error('No concussion available');
      }
      
      return apiRequest('POST', '/api/symptom-checkins', {
        patientId,
        concussionId,
        pcssTotal,
        symptoms,
        notes
      });
    },
    onSuccess: () => {
      toast({
        title: 'Symptoms logged successfully',
        description: 'Your symptom check-in has been recorded',
      });
      
      // Reset form
      setNotes('');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}/symptom-checkins`] });
      queryClient.invalidateQueries({ queryKey: [`/api/concussions/${concussionId}/symptom-checkins`] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients/with-risk'] });
    },
    onError: (error) => {
      toast({
        title: 'Error logging symptoms',
        description: error.message || 'There was a problem submitting your symptoms',
        variant: 'destructive',
      });
    }
  });
  
  // Handle symptom value change
  const handleSymptomChange = (name: string, value: number) => {
    setSymptoms(prev => 
      prev.map(s => s.name === name ? { ...s, value } : s)
    );
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concussionId) {
      toast({
        title: 'No active concussion',
        description: 'Cannot log symptoms without an active concussion event',
        variant: 'destructive',
      });
      return;
    }
    
    submitMutation.mutate();
  };
  
  // Group symptoms by category
  const cognitiveSymptoms = symptoms.filter(s => s.category === 'cognitive');
  const physicalSymptoms = symptoms.filter(s => s.category === 'physical');
  const emotionalSymptoms = symptoms.filter(s => s.category === 'emotional');
  
  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Symptom Check-in</span>
          <span className="text-base font-normal">
            {latestCheckin ? (
              <span className="text-neutral-400">
                Last check-in: {formatDate(latestCheckin.checkInDate)}
              </span>
            ) : (
              <span className="text-neutral-400">No previous check-ins</span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="text-lg font-semibold mb-2 flex items-center justify-between">
              <span>Current Symptoms</span>
              <span className="text-base">
                PCSS Total: <span className={`font-bold ${
                  pcssTotal > 60 ? 'text-status-red' :
                  pcssTotal > 30 ? 'text-status-yellow' :
                  pcssTotal > 0 ? 'text-status-green' : 'text-neutral-400'
                }`}>{pcssTotal}</span>
              </span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Rate each symptom on a scale from 0 (none) to 6 (severe).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cognitive Symptoms */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-neutral-400 font-semibold">Cognitive Symptoms</h3>
                {cognitiveSymptoms.map((symptom) => (
                  <SymptomSlider
                    key={symptom.name}
                    name={symptom.name}
                    value={symptom.value}
                    onChange={(value) => handleSymptomChange(symptom.name, value)}
                  />
                ))}
                
                <Separator className="my-6 bg-neutral-800" />
                
                <h3 className="text-sm uppercase text-neutral-400 font-semibold">Emotional Symptoms</h3>
                {emotionalSymptoms.map((symptom) => (
                  <SymptomSlider
                    key={symptom.name}
                    name={symptom.name}
                    value={symptom.value}
                    onChange={(value) => handleSymptomChange(symptom.name, value)}
                  />
                ))}
              </div>
              
              {/* Physical Symptoms */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase text-neutral-400 font-semibold">Physical Symptoms</h3>
                {physicalSymptoms.map((symptom) => (
                  <SymptomSlider
                    key={symptom.name}
                    name={symptom.name}
                    value={symptom.value}
                    onChange={(value) => handleSymptomChange(symptom.name, value)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Additional Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Enter any additional observations or notes about your symptoms..."
              className="bg-neutral-800 border-neutral-700 resize-none"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitMutation.isPending || !concussionId}
              className="min-w-32"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Log Symptoms'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
