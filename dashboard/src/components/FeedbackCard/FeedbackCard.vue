<template>
  <div
    @click="handleToggle"
    class="flex flex-col px-8 py-6 rounded cursor-pointer bg-brand-gray"
  >
    <div class="flex items-center justify-between w-full mb-8">
      <badge :type="feedback.type" />

      <span class="font-regular text-brand-graydark">
        {{ getDiffTimeBetweenCurrentDate(feedback.createdAt) }}
      </span>
    </div>

    <div class="text-lg font-medium text-gray-800">
      {{ feedback.text }}
    </div>

    <div
      v-if="state.isOpen"
      class="flex mt-8 animate__animated animate__fadeInUp animate__faster"
      :class="{ animate__fadeOutUp: state.isClosing }"
    >
      <div class="flex flex-col gap-4 w-1/2">
        <div class="flex flex-col">
          <span class="font-bold text-gray-400 uppercase select-none">
            Página
          </span>

          <span class="font-medium text-gray-700">{{ feedback.page }}</span>
        </div>

        <div class="flex flex-col">
          <span class="font-bold text-gray-400 uppercase select-none">
            Dispositivo
          </span>

          <span class="font-medium text-gray-700">{{ feedback.device }}</span>
        </div>
      </div>

      <div class="flex flex-col w-1/2">
        <div class="flex flex-col">
          <span class="font-bold text-gray-400 uppercase select-none">
            Usuário
          </span>

          <span class="font-medium text-gray-700">{{
            feedback.fingerprint
          }}</span>
        </div>
      </div>
    </div>

    <div v-if="!state.isOpen" class="flex justify-end mt-8">
      <icon name="chevron-down" :color="brandColor.darkgray" size="24" />
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { getDiffTimeBetweenCurrentDate } from '@/utils/date';
import { wait } from '@/utils/timeout';
import Badge from './CardBadge.vue';
import Icon from '@/components/Icon/IconFactory.vue';
import { brand } from '../../../palette';

export default {
  components: { Badge, Icon },

  props: {
    isOpened: { type: Boolean, default: false },
    feedback: { type: Object, required: true },
  },

  setup(props) {
    const state = reactive({
      isOpen: props.isOpened,
      isClosing: !props.isOpened,
    });

    async function handleToggle() {
      state.isClosing = true;

      await wait(250);
      state.isOpen = !state.isOpen;
      state.isClosing = false;
    }

    return {
      state,
      handleToggle,
      getDiffTimeBetweenCurrentDate,
      brandColor: brand,
    };
  },
};
</script>
