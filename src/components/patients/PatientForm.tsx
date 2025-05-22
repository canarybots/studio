'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Paciente } from '@/types';
import { createPatient } from '@/services/api';

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  edad: z.coerce.number().min(0, {
    message: 'La edad no puede ser negativa.',
  }),
  // Add more fields as needed
});

interface PatientFormProps {
  patient?: Paciente; // Optional patient object for editing
  onSave: () => void; // Callback function to call after successful save
}

export function PatientForm({ patient, onSave }: PatientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: patient || {
      nombre: '',
      edad: 0,
      // Set default values for other fields
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const patientData = { ...patient, ...values };
      await createPatient(patientData);
      onSave(); // Call the callback to refresh the list or close the form
    } catch (error) {
      console.error('Error saving patient:', error);
      // Handle error, e.g., show a toast message
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='Nombre del paciente' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='edad'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Edad del paciente' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more form fields here */}
        <Button type='submit'>Guardar</Button>
      </form>
    </Form>
  );
}