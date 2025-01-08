'use client';

import { Equals, X } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

type FooterProps = {
  readonly totalHours: number;
};

export function Footer({ totalHours }: FooterProps) {
  const [costPerHour, setCostPerHour] = useState<number>(0);

  useEffect(() => {
    const savedCostPerHour = localStorage.getItem('devHoursCalc.costPerHour');
    if (savedCostPerHour) {
      setCostPerHour(Number.parseFloat(savedCostPerHour) || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('devHoursCalc.costPerHour', costPerHour.toString());
  }, [costPerHour]);

  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    setTotalCost(totalHours * costPerHour);
  }, [totalHours, costPerHour]);

  return (
    <div className="flex items-center space-x-4 rounded-lg bg-gray-900 p-4">
      <div className="font-bold">Total Hours: {totalHours}</div>
      <X />
      <label className="font-semibold" htmlFor="costPerHour">
        Cost per Hour:
      </label>
      <Input
        className="w-32"
        id="costPerHour"
        onChange={(elm) => setCostPerHour(Number.parseFloat(elm.target.value) || 0)}
        placeholder="Enter cost"
        type="number"
        value={costPerHour || ''}
      />
      <Equals />
      <div className="text-lg font-bold text-green-600">{totalCost.toFixed(2)}</div>
    </div>
  );
}
