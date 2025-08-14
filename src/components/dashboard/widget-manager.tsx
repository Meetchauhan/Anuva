import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Layout, Eye, EyeOff, GripVertical } from 'lucide-react';

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  category: 'patient' | 'analytics' | 'scheduling' | 'clinical';
  size: 'small' | 'medium' | 'large';
  isVisible: boolean;
  order: number;
  requiredRole?: string[];
}

interface WidgetManagerProps {
  widgets: DashboardWidget[];
  onUpdateWidgets: (widgets: DashboardWidget[]) => void;
}

export function WidgetManager({ widgets, onUpdateWidgets }: WidgetManagerProps) {
  const [localWidgets, setLocalWidgets] = useState(widgets);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Widgets' },
    { value: 'patient', label: 'Patient Management' },
    { value: 'analytics', label: 'Analytics & Reports' },
    { value: 'scheduling', label: 'Scheduling' },
    { value: 'clinical', label: 'Clinical Tools' },
  ];

  const filteredWidgets = localWidgets.filter(
    widget => selectedCategory === 'all' || widget.category === selectedCategory
  );

  const handleToggleWidget = (widgetId: string) => {
    const updatedWidgets = localWidgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    );
    setLocalWidgets(updatedWidgets);
  };

  const handleSaveChanges = () => {
    onUpdateWidgets(localWidgets);
  };

  const handleReorderWidget = (widgetId: string, direction: 'up' | 'down') => {
    const currentIndex = localWidgets.findIndex(w => w.id === widgetId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === localWidgets.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedWidgets = [...localWidgets];
    [updatedWidgets[currentIndex], updatedWidgets[newIndex]] = 
    [updatedWidgets[newIndex], updatedWidgets[currentIndex]];

    // Update order values
    updatedWidgets.forEach((widget, index) => {
      widget.order = index;
    });

    setLocalWidgets(updatedWidgets);
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-green-100 text-green-700';
      case 'large': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Dashboard Widget Manager
          </DialogTitle>
          <DialogDescription>
            Customize your dashboard by enabling/disabling widgets and changing their order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Widget List */}
          <div className="space-y-3">
            {filteredWidgets.map((widget, index) => (
              <Card key={widget.id} className={`${widget.isVisible ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Reorder Controls */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorderWidget(widget.id, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorderWidget(widget.id, 'down')}
                          disabled={index === filteredWidgets.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Widget Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{widget.title}</h4>
                          <Badge className={getSizeColor(widget.size)} variant="secondary">
                            {widget.size}
                          </Badge>
                          <Badge variant="outline">
                            {widget.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{widget.description}</p>
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {widget.isVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={widget.isVisible}
                          onCheckedChange={() => handleToggleWidget(widget.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">Dashboard Summary</h4>
                  <p className="text-sm text-blue-600">
                    {localWidgets.filter(w => w.isVisible).length} of {localWidgets.length} widgets enabled
                  </p>
                </div>
                <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}