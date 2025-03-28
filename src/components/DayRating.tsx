
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface DayRatingItem {
  id: string;
  text: string;
  type: 'good' | 'bad';
}

interface DayRatingProps {
  items: DayRatingItem[];
  setItems: (items: DayRatingItem[]) => void;
}

const DayRating = ({ items, setItems }: DayRatingProps) => {
  const [newItem, setNewItem] = React.useState('');
  const [itemType, setItemType] = React.useState<'good' | 'bad'>('good');

  const addItem = () => {
    if (newItem.trim() === '') {
      toast.error('Please enter some text for your item.');
      return;
    }

    const item: DayRatingItem = {
      id: Date.now().toString(),
      text: newItem,
      type: itemType,
    };

    setItems([...items, item]);
    setNewItem('');
    toast.success('Item added successfully!');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info('Item removed.');
  };

  return (
    <Card className="mb-6 border-journal-light-purple shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-journal-purple">Day Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Button 
              variant={itemType === 'good' ? 'default' : 'outline'} 
              className={itemType === 'good' ? 'bg-green-500 hover:bg-green-600' : ''}
              onClick={() => setItemType('good')}
              size="sm"
            >
              <Check className="w-4 h-4 mr-1" /> Good
            </Button>
            <Button 
              variant={itemType === 'bad' ? 'default' : 'outline'} 
              className={itemType === 'bad' ? 'bg-red-500 hover:bg-red-600' : ''}
              onClick={() => setItemType('bad')}
              size="sm"
            >
              <X className="w-4 h-4 mr-1" /> Bad
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder={itemType === 'good' ? "Something good that happened..." : "Something challenging that happened..."}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Button onClick={addItem} className="bg-journal-purple hover:bg-journal-dark-purple">Add</Button>
          </div>
        </div>
        
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map(item => (
              <div 
                key={item.id} 
                className={`flex justify-between items-center p-2 rounded-md ${item.type === 'good' ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <div className="flex items-center">
                  {item.type === 'good' ? (
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 mr-2 text-red-600" />
                  )}
                  <span>{item.text}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DayRating;
