'use server';
/**
 * @fileOverview An AI agent that suggests the nearest police station when a Red Alert is triggered due to unauthorized door opening.
 *
 * - findNearestPoliceStation - A function that handles the process of finding the nearest police station.
 * - NearestPoliceStationInput - The input type for the findNearestPoliceStation function.
 * - NearestPoliceStationOutput - The return type for the findNearestPoliceStation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NearestPoliceStationInputSchema = z.object({
  truckLocation: z
    .string()
    .describe(
      'The current GPS location of the truck as a string in latitude,longitude format.'
    ),
  unauthorizedDoorOpening: z
    .boolean()
    .describe('Indicates whether an unauthorized door opening has occurred.'),
});
export type NearestPoliceStationInput = z.infer<typeof NearestPoliceStationInputSchema>;

const NearestPoliceStationOutputSchema = z.object({
  policeStationSuggestion: z
    .string()
    .describe(
      'The suggested nearest police station with name and address based on the truck location. If unauthorizedDoorOpening is false, return a message indicating no alert was triggered.'
    ),
});
export type NearestPoliceStationOutput = z.infer<typeof NearestPoliceStationOutputSchema>;

export async function findNearestPoliceStation(
  input: NearestPoliceStationInput
): Promise<NearestPoliceStationOutput> {
  return findNearestPoliceStationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nearestPoliceStationPrompt',
  input: {schema: NearestPoliceStationInputSchema},
  output: {schema: NearestPoliceStationOutputSchema},
  prompt: `You are an AI assistant designed to help truck drivers in emergency situations.

  Given the current truck location and whether an unauthorized door opening has occurred, suggest the nearest police station.
  If no unauthorized door opening has occurred, indicate that no alert was triggered.

  Current Truck Location: {{{truckLocation}}}
  Unauthorized Door Opening: {{#if unauthorizedDoorOpening}}Yes{{else}}No{{/if}}

  {% raw %}{{#if unauthorizedDoorOpening}}{% endraw %}
  Suggest the nearest police station with its name and address.  Use the current truck location to find the nearest police station.
  {% raw %}{{else}}{% endraw %}
  No alert was triggered; no police station suggestion is needed.
  {% raw %}{{/if}}{% endraw %}
  `,
});

const findNearestPoliceStationFlow = ai.defineFlow(
  {
    name: 'findNearestPoliceStationFlow',
    inputSchema: NearestPoliceStationInputSchema,
    outputSchema: NearestPoliceStationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
