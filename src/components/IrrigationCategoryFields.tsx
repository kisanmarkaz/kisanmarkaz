import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IrrigationCategoryFieldsProps {
  categorySlug: string;
  values: Record<string, any>;
  onChange: (fieldName: string, value: any) => void;
}

const IrrigationCategoryFields: React.FC<IrrigationCategoryFieldsProps> = ({
  categorySlug,
  values,
  onChange
}) => {
  // Common fields for both categories
  const renderAreaField = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Land Area (Acres)<span className="text-red-500 ml-1">*</span>
      </label>
      <Input
        type="number"
        value={values.area || ''}
        onChange={(e) => onChange('area', e.target.value)}
        required
        min="0"
        step="0.01"
        placeholder="Enter land area in acres"
      />
    </div>
  );

  // Rain-fed specific fields
  const renderRainFedFields = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Water Source<span className="text-red-500 ml-1">*</span>
      </label>
      <Select
        value={values.water_source || ''}
        onValueChange={(value) => onChange('water_source', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select water source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Natural rainfall">Natural rainfall</SelectItem>
          <SelectItem value="Tube well">Tube well</SelectItem>
          <SelectItem value="Water reservoir">Water reservoir</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Canal specific fields
  const renderCanalFields = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Canal Type<span className="text-red-500 ml-1">*</span>
      </label>
      <Select
        value={values.canal_type || ''}
        onValueChange={(value) => onChange('canal_type', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select canal type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Main canal">Main canal</SelectItem>
          <SelectItem value="Branch canal">Branch canal</SelectItem>
          <SelectItem value="Distributary">Distributary</SelectItem>
          <SelectItem value="Minor">Minor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderAreaField()}
      {categorySlug === 'rain-fed' && renderRainFedFields()}
      {categorySlug === 'canal' && renderCanalFields()}
    </div>
  );
};

export default IrrigationCategoryFields; 