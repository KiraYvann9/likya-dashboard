'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { editPartnersFormSchema, type EditPartnerFormSchema } from './editPartnersFormSchema'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUserModal } from "@/stores/useModalStore";
import api from "@/services/axiosConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EditPartnersForm = () =>{
  const { closeModal, modalData } = useUserModal()

  const form = useForm<EditPartnerFormSchema>({
    resolver: zodResolver(editPartnersFormSchema),
    defaultValues: {
      name: modalData?.name || '',
      logo_path: modalData?.logo_path || '',
      establishment_type: modalData?.establishment_type || '',
      identification_number: {
        identification_type: modalData?.identification_number?.identification_type || 'IFU',
        identification_value: modalData?.identification_number?.identification_value || ''
      },
      contact: {
        email: modalData?.contact?.email || '',
        phone_number: modalData?.contact?.phone_number || '',
        website: modalData?.contact?.website || ''
      },
      address: {
        city: modalData?.address?.city || '',
        country: modalData?.address?.country || '',
        street: modalData?.address?.street || '',
        additional_info: modalData?.address?.additional_info || ''
      }
    }
  })

  const queryClient = useQueryClient()

  const updatePartner = async (data: EditPartnerFormSchema) =>{
    const id = modalData?.id || modalData?._id
    const req = await api.put(`/partners/${id}`, data)
    return req.data
  }

  const mutation = useMutation({
    mutationFn: updatePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['partners']})
      toast.success('Partenaire modifié avec succès !')
      form.reset()
      closeModal()
    },
    onError:(err: any) =>{
      toast.error(err?.message || 'Erreur lors de la mise à jour du partenaire')
    }
  })

  const onSubmit = async(data: EditPartnerFormSchema) => {
    mutation.mutate(data)
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name={'identification_number.identification_type'}
          control={form.control}
          render={({ field }) => (
            <FormItem className={'w-full'}>
              <FormLabel>Type d'identification <sup>*</sup></FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={'h-10 border border-custom_color-green rounded-md'}>
                    <SelectValue placeholder={'Sélectionner'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'IFU'}>IFU</SelectItem>
                    <SelectItem value={'RCCM'}>RCCM</SelectItem>
                    <SelectItem value={'Agrément Santé'}>Agrément Santé</SelectItem>
                    <SelectItem value={'Autre'}>Autre</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Nom du partenaire <sup>*</sup></FormLabel>
            <FormControl>
              <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'name'} control={form.control}/>

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              <Input
                type={'file'}
                className={'h-10 border border-custom_color-green rounded-md'}
                accept={'image/*'}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  field.onChange(file ? file.name : '')
                }}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'logo_path'} control={form.control}/>

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Type d'établissement <sup>*</sup></FormLabel>
            <FormControl>
              <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'establishment_type'} control={form.control}/>

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Numéro d'identification <sup>*</sup></FormLabel>
            <FormControl>
              <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'identification_number.identification_value'} control={form.control}/>

        <div className='grid grid-cols-3 gap-3'>
          <FormField render={({field}) => (
            <FormItem className={'w-full'}>
              <FormLabel>Email <sup>*</sup></FormLabel>
              <FormControl>
                <Input {...field} type={'email'} className={'h-10 border border-custom_color-green rounded-md'} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} name={'contact.email'} control={form.control}/>

          <FormField render={({field}) => (
            <FormItem className={'w-full'}>
              <FormLabel>Téléphone <sup>*</sup></FormLabel>
              <FormControl>
                <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} name={'contact.phone_number'} control={form.control}/>

          <FormField render={({field}) => (
            <FormItem className={'w-full'}>
              <FormLabel>Site web</FormLabel>
              <FormControl>
                <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} name={'contact.website'} control={form.control}/>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <FormField render={({field}) => (
            <FormItem className={'w-full'}>
              <FormLabel>Ville <sup>*</sup></FormLabel>
              <FormControl>
                <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} name={'address.city'} control={form.control}/>

          <FormField render={({field}) => (
            <FormItem className={'w-full'}>
              <FormLabel>Pays <sup>*</sup></FormLabel>
              <FormControl>
                <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )} name={'address.country'} control={form.control}/>
        </div>

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Rue <sup>*</sup></FormLabel>
            <FormControl>
              <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'address.street'} control={form.control}/>

        <FormField render={({field}) => (
          <FormItem className={'w-full'}>
            <FormLabel>Informations supplémentaires</FormLabel>
            <FormControl>
              <Input {...field} type={'text'} className={'h-10 border border-custom_color-green rounded-md'} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )} name={'address.additional_info'} control={form.control}/>

        <div className={'flex gap-2 mt-4'}>
          <Button onClick={closeModal} type={'button'}>Fermer</Button>
          <Button type={'submit'} className={'bg-green-500 '} disabled={mutation.isPending}> <Plus/> Mettre à jour </Button>
        </div>
      </form>
    </Form>
  )
}