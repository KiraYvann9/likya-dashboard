import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createUserFormSchema, updateUserFormSchema, type CreateUserFormSchema, type UpdateUserFormSchema } from './createUserFormSchema';
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Plus } from "lucide-react";
import { useUserModal } from "@/stores/useModalStore";
import api from "@/services/axiosConfig";
import { AxiosError } from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './form.css';

// Type pour l'utilisateur créé
interface CreatedUser {
  id: string;
  username: string;
  [key: string]: any;
}

// Type pour les rôles
interface Role {
  _id: string;
  name: string;
}

// Type pour les erreurs API
interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const CreateUserForm = () => {
  const closeModal = useUserModal(state => state.closeModal);
  const [showPWD, setShowPWD] = useState<boolean>(false);
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const queryClient = useQueryClient();

  // Formulaire de création d'utilisateur
  const createUserForm = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Formulaire de mise à jour des informations
  const updateUserInfoForm = useForm<UpdateUserFormSchema>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      user_id: '',
      lastname: '',
      firstname: '',
      //   contact: {
      //     phonenumber_one: ''
      //   },
      email: '',
      //   role: '',
      //   address: {
      //     region: ''
      //   },
      //   date_of_birth: '',
    },
  });

  // Récupération des rôles
  const getRoles = async (): Promise<Role[]> => {
    const response = await api.get('/roles');
    return response.data?.items || [];
  };

  const { data: roles, isLoading: roleIsLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // Création d'utilisateur
  const createUser = async (data: CreateUserFormSchema) => {
    const response = await api.post('/users', data);
    return response.data;
  };

  const mutation = useMutation({
    mutationKey: ['register'],
    mutationFn: createUser,
    onSuccess: (data: CreatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Utilisateur créé avec succès !');

      const emailValue = createUserForm.getValues('username');
      setCreatedUser(data);
      updateUserInfoForm.reset({
        user_id: data.id, // Défini lors du reset
        lastname: '',
        firstname: '',
        email: emailValue,
      });


      createUserForm.reset();
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      console.error('Erreur lors de la création:', err);

      if (err.response?.status === 400) {
        toast.error('Cet e-mail existe déjà. Veuillez en utiliser un autre.');
        return;
      }

      if (err.response?.status === 409) {
        toast.error('Conflit: cet utilisateur existe déjà.');
        return;
      }

      const errorMessage = err.response?.data?.message
        || err.response?.data?.error
        || err.message
        || 'Une erreur est survenue lors de la création';

      toast.error(errorMessage);
    }
  });

  const updateUserInfo = async (data: UpdateUserFormSchema) => {
    if (!createdUser?.id) {
      throw new Error('ID utilisateur manquant');
    }
    updateUserInfoForm.setValue('user_id', createdUser?.id);

    const response = await api.post('/profiles', data);
    return response.data;
  };

  const completeUserProfileMutation = useMutation({
    mutationKey: ['update-user-info'],
    mutationFn: updateUserInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Informations utilisateur mises à jour avec succès !');

      updateUserInfoForm.reset();
      setCreatedUser(null);
      closeModal();
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      console.error('Erreur lors de la mise à jour:', err);

      const errorMessage = err.response?.data?.message
        || err.response?.data?.error
        || err.message
        || 'Une erreur est survenue lors de la mise à jour';

      toast.error(errorMessage);
    }
  });

  const onSubmit = async (data: CreateUserFormSchema) => {
    mutation.mutate(data);
  };

  const onUpdateUserInfoSubmit = async (data: UpdateUserFormSchema) => {
    completeUserProfileMutation.mutate(data);
  };

  const handleBack = () => {
    setCreatedUser(null);
    updateUserInfoForm.reset();
  };

  const handleClose = () => {
    if (createdUser) {
      // Si un utilisateur a été créé mais pas complété, avertir
      const confirm = window.confirm(
        'Un utilisateur a été créé mais ses informations ne sont pas complètes. Voulez-vous vraiment fermer ?'
      );
      if (!confirm) return;
    }

    createUserForm.reset();
    updateUserInfoForm.reset();
    setCreatedUser(null);
    closeModal();
  };

  return (
    <>
      {/* {createdUser === null ? ( */}

      <Form {...createUserForm}>
        <form onSubmit={createUserForm.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset className="border border-gray-300 p-4 rounded-md w-full" disabled={mutation.isPending || createdUser !== null}>
            <legend className="text-lg font-medium px-2">Informations de connexion</legend>
            <FormField
              render={({ field }) => (
                <FormItem className="input-group">
                  <FormLabel>E-mail <sup>*</sup></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="border h-14 text-2xl"
                      placeholder="exemple@email.com"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="username"
              control={createUserForm.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem className="input-group">
                  <FormLabel>Mot de passe <sup>*</sup></FormLabel>
                  <FormControl>
                    <div className="w-full relative">
                      <Input
                        type={showPWD ? "text" : "password"}
                        {...field}
                        className="border h-14 text-2xl pr-10"
                        placeholder="*******"
                        disabled={mutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPWD(!showPWD)}
                        className="absolute top-1/2 -translate-y-1/2 right-3"
                        tabIndex={-1}
                      >
                        {showPWD ? (
                          <Eye size={18} className="text-muted-foreground cursor-pointer" />
                        ) : (
                          <EyeClosed size={18} className="text-muted-foreground cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="password"
              control={createUserForm.control}
            />

            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              <Button
                onClick={handleClose}
                type="button"
                variant="outline"
                disabled={mutation.isPending}
              >
                Fermer
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>Création...</>
                ) : (
                  <><Plus className="mr-2" size={18} /> Créer</>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
      {/* ) : ( */}

      <Form {...updateUserInfoForm}>
        <form onSubmit={updateUserInfoForm.handleSubmit(onUpdateUserInfoSubmit)} className="space-y-4 mt-6">
          <fieldset className="border border-gray-300 p-4 rounded-md w-full" disabled={mutation.isPending || completeUserProfileMutation.isPending || !createdUser}>
            <legend className="text-lg font-medium px-2">Compléter le profil de l'utilisateur</legend>

            <FormField
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel>Nom <sup>*</sup></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="border h-14 text-2xl w-full"
                      placeholder="Nom"
                      disabled={completeUserProfileMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="lastname"
              control={updateUserInfoForm.control}
            />

            <FormField
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel>Prénoms <sup>*</sup></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="border h-14 text-2xl"
                      placeholder="Prénoms"
                      disabled={completeUserProfileMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="firstname"
              control={updateUserInfoForm.control}
            />

            {/* <FormField
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormLabel>N° Téléphone <sup>*</sup></FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Entrez le numéro de téléphone"
                      {...field} 
                      className="border h-14 text-2xl"
                      international 
                      defaultCountry="CI"
                      disabled={completeUserProfileMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="contact.phonenumber_one"
              control={updateUserInfoForm.control}
            /> */}

            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              <Button
                onClick={handleBack}
                type="button"
                variant="outline"
                disabled={completeUserProfileMutation.isPending}
              >
                Retour
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600"
                disabled={completeUserProfileMutation.isPending}
              >
                {completeUserProfileMutation.isPending ? (
                  <>Mise à jour...</>
                ) : (
                  <><Plus className="mr-2" size={18} /> Compléter</>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
      {/* )} */}
    </>
  );
};