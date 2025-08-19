import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Download,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import type { VideoScriptRow } from '@/lib/gemini';

interface VideoScriptTableProps {
  initialData?: VideoScriptRow[];
  onSave?: (data: VideoScriptRow[]) => void;
  onGenerate?: () => Promise<VideoScriptRow[]>;
  topic?: string;
}

export function VideoScriptTable({ 
  initialData = [], 
  onSave,
  onGenerate,
  topic = "Your Video Topic"
}: VideoScriptTableProps) {
  const [rows, setRows] = useState<VideoScriptRow[]>(initialData);
  const [editingCell, setEditingCell] = useState<{row: number, field: keyof VideoScriptRow} | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData.length > 0) {
      setRows(initialData);
    }
  }, [initialData]);

  const handleEdit = (rowIndex: number, field: keyof VideoScriptRow) => {
    setEditingCell({ row: rowIndex, field });
    setTempValue(rows[rowIndex][field] as string);
  };

  const handleSave = (rowIndex: number, field: keyof VideoScriptRow) => {
    const newRows = [...rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [field]: tempValue
    };
    setRows(newRows);
    setEditingCell(null);
    setTempValue('');
    
    if (onSave) {
      onSave(newRows);
    }
    
    toast.success('Cell updated');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setTempValue('');
  };

  const addRow = () => {
    const newRow: VideoScriptRow = {
      id: `row-${Date.now()}`,
      brick: 'NEW BRICK',
      time: '0:00-0:00',
      scriptBeats: 'Enter script content...',
      avatarDialogue: 'What the viewer is thinking...',
      psychologicalTrigger: 'Trigger type...'
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    toast.success('Row deleted');
  };

  const handleGenerate = async () => {
    if (!onGenerate) return;
    
    setIsGenerating(true);
    try {
      const generatedRows = await onGenerate();
      setRows(generatedRows);
      toast.success('Script generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAsCSV = () => {
    const headers = ['Brick', 'Time', 'Script Beats', 'Avatar Dialogue', 'Psychological Trigger'];
    const csvContent = [
      headers.join(','),
      ...rows.map(row => [
        `"${row.brick}"`,
        `"${row.time}"`,
        `"${row.scriptBeats.replace(/"/g, '""')}"`,
        `"${row.avatarDialogue.replace(/"/g, '""')}"`,
        `"${row.psychologicalTrigger}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${topic.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Script exported as CSV');
  };

  const renderCell = (row: VideoScriptRow, rowIndex: number, field: keyof VideoScriptRow) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.field === field;
    const value = row[field] as string;

    if (isEditing) {
      return (
        <div className="flex items-start space-x-2">
          {field === 'scriptBeats' || field === 'avatarDialogue' ? (
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="min-h-[100px] text-sm"
              autoFocus
            />
          ) : (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="text-sm"
              autoFocus
            />
          )}
          <div className="flex flex-col space-y-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => handleSave(rowIndex, field)}
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="group cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
        onClick={() => handleEdit(rowIndex, field)}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm whitespace-pre-wrap">{value}</p>
          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
        </div>
      </div>
    );
  };

  const getBrickColor = (brick: string) => {
    if (brick.includes('INTRO')) return 'bg-blue-500';
    if (brick.includes('PROBLEM')) return 'bg-red-500';
    if (brick.includes('MIDDLE')) return 'bg-purple-500';
    if (brick.includes('APPLICATION')) return 'bg-green-500';
    if (brick.includes('END')) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Video Script Structure</h2>
          <p className="text-muted-foreground mt-1">
            Topic: <span className="font-semibold">{topic}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          {onGenerate && (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate Script'}
            </Button>
          )}
          <Button onClick={addRow} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
          <Button onClick={exportAsCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {onSave && (
            <Button onClick={() => onSave(rows)}>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[140px] font-bold">BRICK</TableHead>
              <TableHead className="w-[100px] font-bold">TIME</TableHead>
              <TableHead className="font-bold">SCRIPT BEATS</TableHead>
              <TableHead className="font-bold">AVATAR'S INTERNAL DIALOGUE</TableHead>
              <TableHead className="w-[200px] font-bold">PSYCHOLOGICAL TRIGGER</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b hover:bg-muted/20 transition-colors"
              >
                <TableCell className="align-top">
                  <div className="space-y-2">
                    <Badge 
                      className={`${getBrickColor(row.brick)} text-white`}
                      variant="secondary"
                    >
                      {renderCell(row, index, 'brick')}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {renderCell(row, index, 'time')}
                </TableCell>
                <TableCell className="align-top max-w-md">
                  {renderCell(row, index, 'scriptBeats')}
                </TableCell>
                <TableCell className="align-top max-w-sm">
                  <div className="italic text-muted-foreground">
                    {renderCell(row, index, 'avatarDialogue')}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <Badge variant="outline" className="whitespace-normal">
                    {renderCell(row, index, 'psychologicalTrigger')}
                  </Badge>
                </TableCell>
                <TableCell className="align-top">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteRow(index)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No script content yet</p>
          <Button onClick={onGenerate ? handleGenerate : addRow}>
            {onGenerate ? 'Generate Script' : 'Add First Row'}
          </Button>
        </div>
      )}
    </Card>
  );
}