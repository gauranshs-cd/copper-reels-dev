import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { copperReelsGemini } from '@/lib/gemini';
import { toast } from 'sonner';

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testGemini = async () => {
    setLoading(true);
    try {
      console.log('Testing Gemini API...');
      const response = await copperReelsGemini.generateFoundation({
        umbrella: 'Teaching JavaScript programming to beginners'
      });
      console.log('Gemini response:', response);
      setResult(response);
      toast.success('Gemini API is working!');
    } catch (error) {
      console.error('Gemini error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gemini API Test Page</h1>
        
        <Card className="p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Test Gemini Integration</h2>
          <Button 
            onClick={testGemini} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Gemini API'}
          </Button>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}