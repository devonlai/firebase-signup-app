// src/lib/actions.ts
'use server';

import { suggestChartTypes, SuggestChartTypesOutput } from '@/ai/flows/suggest-chart-types';

export async function getChartSuggestions(
  dataDescription: string
): Promise<SuggestChartTypesOutput> {
  if (!dataDescription) {
    throw new Error('Data description cannot be empty.');
  }

  try {
    const result = await suggestChartTypes({ dataDescription });
    return result;
  } catch (error) {
    console.error('Error getting chart suggestions:', error);
    throw new Error('Failed to get AI suggestions. Please try again.');
  }
}
