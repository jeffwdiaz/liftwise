import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EquipmentSelectorProps {
  onSelect: (equipment: string) => void;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ onSelect }) => {
  const options = [
    "Dumbbells",
    "No Equipment"
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">What equipment do you have?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full h-16 text-lg"
            onClick={() => onSelect(option)}
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default EquipmentSelector; 