<template>
  <div id="modal-login">
    <div class="flex justify-between">
      <h1 class="text-4xl font-black text-gray-800">Entre na sua conta</h1>

      <button class="text-4xl text-gray-600 focus:outline-none" @click="close">
        &times;
      </button>
    </div>

    <div class="mt-16">
      <form @submit.prevent="handleSubmit">
        <label class="block">
          <span class="text-lg font-medium text-gray-800">E-mail</span>

          <input
            id="login-email-field"
            type="email"
            class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 border-transparent rounded"
            :class="{
              'border-transparent': !state.email.errorMessage,
              'border-brand-danger': !!state.email.errorMessage,
            }"
            placeholder="jane.doe@email.com"
            v-model="state.email.value"
          />

          <span
            id="login-email-error"
            v-if="!!state.email.errorMessage"
            class="block font-medium text-brand-danger mt-1"
          >
            {{ state.email.errorMessage }}
          </span>
        </label>

        <label class="block mt-10">
          <span class="text-lg font-medium text-gray-800">Senha</span>

          <input
            id="login-password-field"
            type="password"
            class="block w-full px-4 py-3 mt-1 text-lg bg-gray-100 border-2 rounded"
            :class="{
              'border-transparent': !state.password.errorMessage,
              'border-brand-danger': !!state.password.errorMessage,
            }"
            placeholder="******"
            v-model="state.password.value"
          />

          <span
            id="login-password-error"
            v-if="!!state.password.errorMessage"
            class="block font-medium text-brand-danger mt-1"
          >
            {{ state.password.errorMessage }}
          </span>
        </label>

        <button
          id="login-submit-button"
          type="submit"
          class="px-8 py-3 mt-10 text-2xl font-bold text-white rounded-full bg-brand-main focus:outline-none transition-all duration-150 hover:bg-brand-main/90"
          :class="{ 'opacity-50': state.isLoading }"
          :disabled="state.isLoading"
        >
          <icon v-if="state.isLoading" name="loading" class="animate-spin" />
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useField } from 'vee-validate';
import { useToast } from 'vue-toastification';
import useModal from '@/hooks/useModal';
import Icon from '../Icon/IconFactory.vue';
import {
  validateEmptyAndLength3,
  validateEmptyAndEmail,
} from '../../utils/validators';
import services from '../../services';

export default {
  components: { Icon },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const modal = useModal();

    const { value: emailValue, errorMessage: emailErrorMessage } = useField(
      'email',
      validateEmptyAndEmail
    );

    const { value: passwordValue, errorMessage: passwordErrorMessage } =
      useField('password', validateEmptyAndLength3);

    const state = reactive({
      hasError: false,
      isLoading: false,
      email: {
        value: emailValue,
        errorMessage: emailErrorMessage,
      },
      password: {
        value: passwordValue,
        errorMessage: passwordErrorMessage,
      },
    });

    async function handleSubmit() {
      try {
        toast.clear();
        state.isLoading = true;
        const { data, errors } = await services.auth.login({
          email: state.email.value,
          password: state.password.value,
        });

        if (!errors) {
          window.localStorage.setItem('token', data.token);
          router.push({ name: 'Feedbacks' });
          state.isLoading = false;
          modal.close();
          return;
        }

        if (errors.status === 404) {
          toast.error('E-mail não encontrado');
        }
        if (errors.status === 401) {
          toast.error('E-mail e/ou senha inválidos');
        }
        if (errors.status === 400) {
          toast.error('Ocorreu um erro ao fazer o login');
        }

        state.isLoading = false;
      } catch (error) {
        state.isLoading = false;
        state.hasError = !!error;
        toast.error('Ocorreu um erro ao fazer o login');
      }
    }

    return {
      state,
      close: modal.close,
      handleSubmit,
    };
  },
};
</script>
